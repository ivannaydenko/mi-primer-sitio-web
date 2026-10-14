require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'aerolinealowcost';
const PORT = process.env.PORT || 3000;

let pool;

async function initDbPool() {
  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // create helper table for tarjetas si no existe
  const createTarjetas = `
    CREATE TABLE IF NOT EXISTS tarjetas (
      IdTarjeta INT AUTO_INCREMENT PRIMARY KEY,
      IdPasajero INT NOT NULL,
      Titular VARCHAR(200) NOT NULL,
      Last4 CHAR(4) NOT NULL,
      FOREIGN KEY (IdPasajero) REFERENCES pasajeros(IdPasajero) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await pool.query(createTarjetas);
}

initDbPool().catch(err => {
  console.error('Error inicializando conexión a la base de datos:', err.message);
  process.exit(1);
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: DB_NAME, host: DB_HOST });
});

// Listar vuelos (opcional filtros: origen, destino, fecha)
app.get('/api/vuelos', async (req, res) => {
  try {
    const { origen, destino, fecha } = req.query;
    let sql = 'SELECT IdVuelo, Matricula, Origen, Destino, FechaHoraSalida, FechaHoraLlegada FROM vuelos';
    const params = [];
    const where = [];

    if (origen) { where.push('Origen = ?'); params.push(origen.toUpperCase()); }
    if (destino) { where.push('Destino = ?'); params.push(destino.toUpperCase()); }
    if (fecha) { where.push('DATE(FechaHoraSalida) = ?'); params.push(fecha); }

    if (where.length) sql += ' WHERE ' + where.join(' AND ');

    sql += ' ORDER BY FechaHoraSalida ASC LIMIT 200';

    const [rows] = await pool.query(sql, params);
    res.json(rows.map(r => ({
      id: r.IdVuelo,
      matricula: r.Matricula,
      origen: r.Origen,
      destino: r.Destino,
      fechaSalida: r.FechaHoraSalida,
      fechaLlegada: r.FechaHoraLlegada
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar vuelos' });
  }
});

// Login / find passenger by nombre or email. If not exists, create minimal record (demo)
app.post('/api/login', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre && !email) return res.status(400).json({ error: 'Se requiere nombre o email' });

    const [rows] = await pool.query(
      'SELECT * FROM pasajeros WHERE Nombre = ? OR Email = ? LIMIT 1',
      [nombre || '', email || '']
    );

    if (rows.length) return res.json(rows[0]);

    // crear pasajero demo
    const [result] = await pool.query(
      'INSERT INTO pasajeros (Pasaporte, Nombre, Email) VALUES (?, ?, ?)',
      ['DEMO-' + Date.now(), nombre || email, email || null]
    );

    const [newRow] = await pool.query('SELECT * FROM pasajeros WHERE IdPasajero = ?', [result.insertId]);
    res.json(newRow[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en login' });
  }
});

// Obtener tarjeta guardada por pasajero Id
app.get('/api/tarjeta', async (req, res) => {
  try {
    const { pasajeroId } = req.query;
    if (!pasajeroId) return res.status(400).json({ error: 'pasajeroId requerido' });

    const [rows] = await pool.query('SELECT IdTarjeta, IdPasajero, Titular, Last4 FROM tarjetas WHERE IdPasajero = ? LIMIT 1', [pasajeroId]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tarjeta' });
  }
});

// Guardar tarjeta (solo titular + last4)
app.post('/api/tarjeta', async (req, res) => {
  try {
    const { pasajeroId, titular, last4 } = req.body;
    if (!pasajeroId || !titular || !last4) return res.status(400).json({ error: 'pasajeroId, titular y last4 requeridos' });

    // reemplazar si existe
    await pool.query('DELETE FROM tarjetas WHERE IdPasajero = ?', [pasajeroId]);
    const [result] = await pool.query('INSERT INTO tarjetas (IdPasajero, Titular, Last4) VALUES (?, ?, ?)', [pasajeroId, titular, last4]);
    const [row] = await pool.query('SELECT IdTarjeta, IdPasajero, Titular, Last4 FROM tarjetas WHERE IdTarjeta = ?', [result.insertId]);
    res.json(row[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar tarjeta' });
  }
});

// Listar reservas por pasajeroId
app.get('/api/reservas', async (req, res) => {
  try {
    const { pasajeroId } = req.query;
    if (!pasajeroId) return res.status(400).json({ error: 'pasajeroId requerido' });

    const [rows] = await pool.query(
      `SELECT r.IdReserva, r.IdPasajero, r.IdVuelo, r.NumeroAsiento, r.Clase, r.Precio,
              v.Origen, v.Destino, v.FechaHoraSalida, v.FechaHoraLlegada
       FROM reservas r
       LEFT JOIN vuelos v ON r.IdVuelo = v.IdVuelo
       WHERE r.IdPasajero = ? ORDER BY v.FechaHoraSalida DESC`,
      [pasajeroId]
    );

    res.json(rows.map(r => ({
      idReserva: r.IdReserva,
      pasajeroId: r.IdPasajero,
      vueloId: r.IdVuelo,
      asiento: r.NumeroAsiento,
      clase: r.Clase,
      precio: r.Precio,
      origen: r.Origen,
      destino: r.Destino,
      fechaSalida: r.FechaHoraSalida,
      fechaLlegada: r.FechaHoraLlegada
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar reservas' });
  }
});

// Crear reserva
app.post('/api/reservas', async (req, res) => {
  try {
    const { pasajeroId, vueloId, numeroAsiento, clase, precio } = req.body;
    if (!pasajeroId || !vueloId || !numeroAsiento || !clase || precio == null) {
      return res.status(400).json({ error: 'faltan campos requeridos' });
    }

    // insertar
    const [result] = await pool.query(
      'INSERT INTO reservas (IdPasajero, IdVuelo, NumeroAsiento, Clase, Precio) VALUES (?, ?, ?, ?, ?)',
      [pasajeroId, vueloId, numeroAsiento, clase, precio]
    );

    const [row] = await pool.query('SELECT * FROM reservas WHERE IdReserva = ?', [result.insertId]);
    res.json(row[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
  console.log(`DB: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
});
