document.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuarioLogueado");
  const userName = document.getElementById("user-name");
  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");
  const lista = document.getElementById("boletos-list");

  if (!usuario) {
    alert("Debés iniciar sesión para consultar tus boletos.");
    window.location.href = "login.html";
    return;
  }

  userName.textContent = `Hola, ${usuario}`;
  if (btnLogin) btnLogin.style.display = "none";
  if (btnLogout) btnLogout.style.display = "inline-block";

  if (btnLogin) btnLogin.addEventListener("click", () => window.location.href = "login.html");
  if (btnLogout) btnLogout.addEventListener("click", () => { localStorage.removeItem("usuarioLogueado"); window.location.href = "index.html"; });

  mostrarBoletos();

  function obtenerFechaActual() {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }

  function formatearFecha(fecha) {
    if (!fecha) return "-";
    const partes = fecha.split("-");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : fecha;
  }

  function generarTarjetaEmbarque(boleto) {
    return {
      numero: "PB-" + Math.floor(100000 + Math.random() * 900000),
      codigo: boleto.codigo,
      pasajero: boleto.pasajero,
      vuelo: boleto.vuelo,
      origen: boleto.origen,
      destino: boleto.destino,
      fecha: boleto.fecha || formatearFecha(boleto.fechaSalida),
      hora: boleto.horaSalida || "-",
      asiento: boleto.asiento
    };
  }

  function obtenerReservas() {
    return JSON.parse(localStorage.getItem("reservas") || "[]");
  }

  function guardarReservas(reservas) {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }

  function mostrarBoletos() {
    const reservas = obtenerReservas();
    const hoy = obtenerFechaActual();
    // Filtrar reservas del usuario
    const boletos = reservas.filter(r => r.pasajero === usuario);
    // Vigentes
    const vigentes = boletos.filter(b => !b.fechaSalida || b.fechaSalida >= hoy);

    lista.innerHTML = "";

    if (vigentes.length === 0) {
      lista.innerHTML = `
        <div class="empty-state">
          <h3>No tenés boletos vigentes</h3>
          <p>Cuando compres un vuelo, podrás realizar el check-in desde aquí.</p>
          <a class="back-button" href="index.html">Buscar vuelos</a>
        </div>
      `;
      return;
    }

    vigentes
      .slice()
      .sort((a, b) => (a.fechaSalida || "") .localeCompare(b.fechaSalida || ""))
      .forEach(boleto => {
        const div = document.createElement("article");
        div.className = "ticket-card";
        const yaCheckin = boleto.checkin === true;

        div.innerHTML = `
          <div class="ticket-main">
            <h3>Vuelo ${boleto.vuelo}</h3>
            <p><strong>${boleto.origen}</strong> → <strong>${boleto.destino}</strong></p>
            <p><strong>Fecha:</strong> ${boleto.fecha || formatearFecha(boleto.fechaSalida)}</p>
            <p><strong>Código:</strong> ${boleto.codigo}</p>

            <div class="boleto-detalles" style="display:none;">
              <p><strong>Pasajero:</strong> ${boleto.pasajero}</p>
              <p><strong>Salida:</strong> ${boleto.horaSalida || "-"}</p>
              <p><strong>Llegada:</strong> ${boleto.horaLlegada || "-"}</p>
              <p><strong>Asiento:</strong> ${boleto.asiento}</p>
              <p><strong>Precio:</strong> $${Number(boleto.precio || 0).toLocaleString("es-AR")}</p>
              ${boleto.fechaRegreso ? `<p><strong>Regreso:</strong> ${formatearFecha(boleto.fechaRegreso)}</p>` : ""}
              ${boleto.metodoPago ? `<p><strong>Pago:</strong> ${boleto.metodoPago} ${boleto.tarjetaFinal ? ` - **** ${boleto.tarjetaFinal}` : ""}</p>` : ""}
            </div>

            ${yaCheckin && boleto.tarjetaEmbarque ? `
              <div class="pase-abordar">
                <h4>Tarjeta de embarque</h4>
                <p><strong>Pasajero:</strong> ${boleto.tarjetaEmbarque.pasajero}</p>
                <p><strong>Vuelo:</strong> ${boleto.tarjetaEmbarque.vuelo}</p>
                <p><strong>Ruta:</strong> ${boleto.tarjetaEmbarque.origen} → ${boleto.tarjetaEmbarque.destino}</p>
                <p><strong>Fecha:</strong> ${boleto.tarjetaEmbarque.fecha}</p>
                <p><strong>Hora:</strong> ${boleto.tarjetaEmbarque.hora}</p>
                <p><strong>Asiento:</strong> ${boleto.tarjetaEmbarque.asiento}</p>
                <p class="pase-codigo">Pase: ${boleto.tarjetaEmbarque.numero}</p>
              </div>
            ` : ""}
          </div>

          <div class="ticket-actions">
            <button class="btn-consultar" type="button">Consultar boleto</button>
            ${yaCheckin ? `<span class="status status-checkin">Check-in realizado</span>` : `<button class="btn-checkin" type="button">Realizar Check-in</button>`}
          </div>
        `;

        // toggle details
        const detalles = div.querySelector(".boleto-detalles");
        const consultar = div.querySelector(".btn-consultar");
        consultar.addEventListener("click", () => {
          const visible = detalles.style.display !== "none";
          detalles.style.display = visible ? "none" : "block";
          consultar.textContent = visible ? "Consultar boleto" : "Ocultar boleto";
        });

        const botonCheckin = div.querySelector(".btn-checkin");
        if (botonCheckin) {
          botonCheckin.addEventListener("click", () => realizarCheckin(boleto.codigo));
        }

        lista.appendChild(div);
      });
  }

  function realizarCheckin(codigo) {
    const reservas = obtenerReservas();
    const idx = reservas.findIndex(r => r.codigo === codigo && r.pasajero === usuario);
    if (idx === -1) { alert("No se encontró la reserva."); return; }

    const boleto = reservas[idx];
    if (boleto.fechaSalida && boleto.fechaSalida < obtenerFechaActual()) {
      alert("Este vuelo ya pasó y no se puede realizar el Check-in.");
      mostrarBoletos();
      return;
    }

    boleto.checkin = true;
    boleto.estado = "Check-in realizado";
    boleto.tarjetaEmbarque = generarTarjetaEmbarque(boleto);

    reservas[idx] = boleto;
    guardarReservas(reservas);

    // también actualizar mis-viajes si lo muestra desde la misma fuente (reservas)

    alert("Check-in realizado correctamente. Tu tarjeta de embarque ya está disponible.");
    mostrarBoletos();
  }

});
