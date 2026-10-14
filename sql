-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-07-2026 a las 06:49:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aerolinealowcost`
--
CREATE DATABASE IF NOT EXISTS `aerolinealowcost` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aerolinealowcost`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaciontripulacion`
--

DROP TABLE IF EXISTS `asignaciontripulacion`;
CREATE TABLE `asignaciontripulacion` (
  `IdVuelo` int(11) NOT NULL,
  `IdTripulante` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignaciontripulacion`
--

INSERT INTO `asignaciontripulacion` (`IdVuelo`, `IdTripulante`) VALUES
(1, 1),
(1, 3),
(2, 1),
(3, 2),
(5, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aviones`
--

DROP TABLE IF EXISTS `aviones`;
CREATE TABLE `aviones` (
  `Matricula` varchar(10) NOT NULL,
  `Modelo` varchar(50) NOT NULL,
  `Fabricante` varchar(50) NOT NULL,
  `Capacidad` int(11) NOT NULL CHECK (`Capacidad` > 0),
  `Autonomia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `aviones`
--

INSERT INTO `aviones` (`Matricula`, `Modelo`, `Fabricante`, `Capacidad`, `Autonomia`) VALUES
('EC-MUT', 'Airbus A350-900', 'Airbus', 348, 15000),
('LV-FUA', 'Boeing 737-800', 'Boeing', 170, 5700),
('LV-GHO', 'Airbus A320neo', 'Airbus', 186, 6500),
('LV-KCD', 'Embraer E190', 'Embraer', 96, 4500),
('N538LA', 'Boeing 787-9', 'Boeing', 313, 14140);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pasajeros`
--

DROP TABLE IF EXISTS `pasajeros`;
CREATE TABLE `pasajeros` (
  `IdPasajero` int(11) NOT NULL,
  `Pasaporte` varchar(20) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `NroViajeroFrecuente` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pasajeros`
--

INSERT INTO `pasajeros` (`IdPasajero`, `Pasaporte`, `Nombre`, `Email`, `Telefono`, `NroViajeroFrecuente`) VALUES
(1, 'ARG123456', 'Carlos Gómez', 'carlos.gomez@email.com', '+541144445555', 'VF-99821'),
(2, 'ESP789012', 'María Enríquez', 'maria.enriquez@email.com', '+34611223344', 'VF-10293'),
(3, 'USA456789', 'John Doe', 'john.doe@email.com', '+15551234567', NULL),
(4, 'BRA987654', 'Aline Silva', 'aline.silva@email.com', '+5511999998888', 'VF-55432'),
(5, 'ARG654321', 'Juan Pérez', 'juan.perez@email.com', '+5491133332222', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

DROP TABLE IF EXISTS `reservas`;
CREATE TABLE `reservas` (
  `IdReserva` int(11) NOT NULL,
  `IdPasajero` int(11) NOT NULL,
  `IdVuelo` int(11) NOT NULL,
  `NumeroAsiento` varchar(5) NOT NULL,
  `Clase` varchar(20) NOT NULL CHECK (`Clase` in ('Economy','Business','Primera')),
  `Precio` decimal(10,2) NOT NULL CHECK (`Precio` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`IdReserva`, `IdPasajero`, `IdVuelo`, `NumeroAsiento`, `Clase`, `Precio`) VALUES
(1, 1, 1, '12A', 'Economy', 850.00),
(2, 2, 3, '03J', 'Business', 2400.00),
(3, 3, 1, '12B', 'Economy', 850.00),
(4, 4, 4, '08C', 'Economy', 320.00),
(5, 5, 2, '01A', 'Primera', 150.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tripulacion`
--

DROP TABLE IF EXISTS `tripulacion`;
CREATE TABLE `tripulacion` (
  `IdTripulante` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Rol` varchar(30) NOT NULL CHECK (`Rol` in ('Piloto','Copiloto','Comisario','Azafata')),
  `Certificacion` varchar(50) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tripulacion`
--

INSERT INTO `tripulacion` (`IdTripulante`, `Nombre`, `Rol`, `Certificacion`, `Telefono`) VALUES
(1, 'Marcos González', 'Piloto', 'ATPL-A320/B737', '+541155556666'),
(2, 'Laura Martínez', 'Copiloto', 'CPL-B787/A350', '+541177778888'),
(3, 'Roberto Gómez', 'Comisario', 'TCP-Internacional', '+541122223333'),
(4, 'Ana López', 'Azafata', 'TCP-Nacional', '+541199990000'),
(5, 'Christian Dupont', 'Piloto', 'ATPL-A350', '+33144445555');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelos`
--

DROP TABLE IF EXISTS `vuelos`;
CREATE TABLE `vuelos` (
  `IdVuelo` int(11) NOT NULL,
  `Matricula` varchar(10) NOT NULL,
  `Origen` char(3) NOT NULL,
  `Destino` char(3) NOT NULL,
  `FechaHoraSalida` datetime NOT NULL,
  `FechaHoraLlegada` datetime NOT NULL
) ;

--
-- Volcado de datos para la tabla `vuelos`
--

INSERT INTO `vuelos` (`IdVuelo`, `Matricula`, `Origen`, `Destino`, `FechaHoraSalida`, `FechaHoraLlegada`) VALUES
(1, 'LV-FUA', 'EZE', 'MIA', '2026-08-15 23:30:00', '2026-08-16 07:30:00'),
(2, 'LV-GHO', 'AEP', 'COR', '2026-08-16 08:00:00', '2026-08-16 09:15:00'),
(3, 'N538LA', 'SCL', 'MAD', '2026-08-17 20:00:00', '2026-08-18 13:45:00'),
(4, 'LV-KCD', 'EZE', 'GRU', '2026-08-18 14:10:00', '2026-08-18 16:55:00'),
(5, 'EC-MUT', 'MAD', 'EZE', '2026-08-19 23:55:00', '2026-08-20 07:50:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asignaciontripulacion`
--
ALTER TABLE `asignaciontripulacion`
  ADD PRIMARY KEY (`IdVuelo`,`IdTripulante`),
  ADD KEY `IdTripulante` (`IdTripulante`);

--
-- Indices de la tabla `aviones`
--
ALTER TABLE `aviones`
  ADD PRIMARY KEY (`Matricula`);

--
-- Indices de la tabla `pasajeros`
--
ALTER TABLE `pasajeros`
  ADD PRIMARY KEY (`IdPasajero`),
  ADD UNIQUE KEY `Pasaporte` (`Pasaporte`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `NroViajeroFrecuente` (`NroViajeroFrecuente`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`IdReserva`),
  ADD UNIQUE KEY `UQ_Vuelo_Asiento` (`IdVuelo`,`NumeroAsiento`),
  ADD KEY `IdPasajero` (`IdPasajero`);

--
-- Indices de la tabla `tripulacion`
--
ALTER TABLE `tripulacion`
  ADD PRIMARY KEY (`IdTripulante`);

--
-- Indices de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  ADD PRIMARY KEY (`IdVuelo`),
  ADD KEY `Matricula` (`Matricula`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pasajeros`
--
ALTER TABLE `pasajeros`
  MODIFY `IdPasajero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `IdReserva` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tripulacion`
--
ALTER TABLE `tripulacion`
  MODIFY `IdTripulante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  MODIFY `IdVuelo` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asignaciontripulacion`
--
ALTER TABLE `asignaciontripulacion`
  ADD CONSTRAINT `asignaciontripulacion_ibfk_1` FOREIGN KEY (`IdVuelo`) REFERENCES `vuelos` (`IdVuelo`) ON DELETE CASCADE,
  ADD CONSTRAINT `asignaciontripulacion_ibfk_2` FOREIGN KEY (`IdTripulante`) REFERENCES `tripulacion` (`IdTripulante`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`IdPasajero`) REFERENCES `pasajeros` (`IdPasajero`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`IdVuelo`) REFERENCES `vuelos` (`IdVuelo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vuelos`
--
ALTER TABLE `vuelos`
  ADD CONSTRAINT `vuelos_ibfk_1` FOREIGN KEY (`Matricula`) REFERENCES `aviones` (`Matricula`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

--
-- Mostrar todos los pasajeros registrados

Select*
From pasajeros;

-- Mostrar todos los pasajeros que viajan en un vuelo determinado
-- Ejemplo: pasajeros del vuelo 1

Select p.IdPasajero, p.Nombre, p.Email, r.NumeroAsiento, r.Clase
From pasajeros p
Inner Join reservas r
	ON p.IdPasajero = r.IdPasajero
WHERE r.IdVuelo = 1;

-- Mostrar los datos de todos los vuelos junto con el avión utilizado
Select v.IdVuelo, v.Origen, v.Destino, v.FechaHoraSalida, v.FechaHoraLlegada, a.Matricula, a.Modelo, a.Fabricante, a.Capacidad
FROM vuelos v
INNER JOIN aviones a
	ON v.Matricula = a.Matricula;
    
-- Mostrar los vuelos que salen desde EZE
Select idVuelo, Origen, Destino, FechaHoraSalida, FechaHoraLlegada
FROM vuelos
WHERE Origen = "EZE";

-- Mostrar los vuelos que llegan a EZE

Select
	IdVuelo, Origen, Destino, FechaHoraSalida, FechaHoraLlegada
FROM vuelos
WHERE Destino = "EZE";

-- Mostrar las reservas de cada pasajero

Select p.Nombre AS Pasajero, v.IdVuelo, vOrigen, v.Origen, v.Destino, r.NumeroAsiento, r.Clase, r.Precio
FROM pasajeros p
INNER JOIN reservas r
	ON p.IdPasajeros = r.IdPasajero
INNER JOIN vuelos v
	ON r.Id.Vuelo = v.IdVuelo
ORDER BY p.Nombre;

-- 7. Mostrar los pasajeros que tienen tarjeta de viajero frecuente
Select IdPasajero, Nombre, Email, NroViajeroFrecuente
FROM pasajeros
WHERE NroViajeFrecuente IS NOT NULL;

-- Mostrar las reservas de clase Economy
SELECT r.IdReserva, p.Nombre AS Pasajero, v.IdVuelo, v.Origen, v.Destino, r.NumeroAsiento, r.Precio
FROM reservas r
INNER JOIN pasajeros p
	ON r.IdPasajero = p.IdPasajero
INNER JOIN  vuelos v
	ON r.IdVuelo = v.IdVuelo
WHERE r.Clase = "Economy";

-- Mostrar los vuelos junto con la cantidad de reservas que tienen

SELECT v.IdVuelo, v.Origen, v.Destino, COUNT(r.IdReserva) AS CantidadReservas
FROM vuelos v
LEFT JOIN reservas r
	ON v.IdVuelo = r.IdVuelo
GROUP BY v.IdVuelo, v.Origen, v.Destino
ORDER BY CantidadReservas DESC;

-- Mostrar cuánto dinero recaudó cada vuelo mediante reservas
SELECT v.IdVuelo, v.Origen, v.Destino, COALESCE(SUM(r.Precio), 0) AS Recaudacion
FROM vuelos v
LEFT JOIN reservas r
	ON v.IdVuelo = r.IdVuelo
GROUP BY v.IdVuelo, v.Origen, v.Destino ORDER BY Recaudacion DESC;

-- Mostrar la tripulación asignada a cada vuelo
SELECT v.IdVuelo, v.Origen, v.Destino, tNombre AS Tripulante, t.Rol, t.Certificacion
FROM vuelos v
INNER JOIN asignaciontripulacion at
	ON v.IdVuelo = at.IdVuelo
INNER JOIN tripulacion t
	ON at.IdTripulante = t.IdTripulante
ORDER BY v.IdVuelo;

-- Mostrar solamente los pilotos asignados a vuelos
SELECT v.IdVuelo, v.Origen, v.Destino, t.Nombre AS Piloto, t,Certificacion
FROM vuelos v
INNER JOIN asignaciontripulacion at
	ON v.IdVuelo = at.IdVuelo
INNER JOIN tripulacion t
	ON at.IdTripulante = t.IdTripulante
WHERE t.Rol = "Piloto";

-- Mostrar los aviones con capacidad mayor a 200 pasajeros
SELECT Matricula, Modelo, Fabricante, Capacidad, Autonomia
FROM aviones
WHERE Capacidad > 200;

-- Mostrar el vuelo con mayor precio de reserva
SELECT v.IdVuelo, v.Origen, v.Destino, r.Precio
FROM vuelos v
INNER JOIN reservas r
	ON v.IdVuelo = r.IdVuelo
WHERE r.Precio = (
	SELECT MAX(Precio)
    FROM reservas
);

-- Mostrar el pasajero que más dinero gastó en reservas
SELECT p.IdPasajero, p.Nombre,
	SUM(r.Precio) AS TotalGastado
FROM pasajeros p
INNER JOIN reservas r
	ON p.IdPasajero = r.IdPasajero
GROUP BY
	p.IdPasajero,
    p.Nombre
ORDER BY TotalGastado DESC
LIMIT 1;

-- Stored Procedure --

-- Mostrar todos los pasajeros de un vuelo
DELIMITER //

CREATE PROCEDURE pasajeros_por_vuelo(IN p_IdVuelo INT)
BEGIN
	Select
		p.IdPasajero, p.Nombre, p.Pasaporte, p.Email, r.NumeroAsiento, r.Clase, r.Precio
        FROM pasajeros p
        INNER JOIN reservas r ON p.IdPasajero = r.IdPasajero
        Where r.IdVuelo = p_IdVuelo
        ORDER BY r.NumeroAsiento;
END //


DELIMITER ;

CALL pasajeros_por_vuelo(1);

-- Mostrar información de un vuelo
DELIMITER //

CREATE PROCEDURE informacion_vuelo(IN p_IdVuelo INT)
BEGIN
	SELECT v.IdVuelo, v.Origen, v.Destino, v.FechaHoraSalida, v.FechaHoraLlegada, a.Matricula, a.Modelo, a.Fabricante, a.Capacidad
    FROM vuelos v
    INNER JOIN aviones a ON v.Matricula = a.Matricula
    WHERE v.IdVuelo = p_IdVuelo;
    
END //

DELIMITER ;

CALL informacion_vuelo(3);

-- Mostrar las reservas de un pasajero

DELIMITER //

CREATE PROCEDURE reservas_por_pasajero(IN p_IdPasajero INT)
BEGIN
	SELECT r.IdReserva, p.Nombre AS Pasajero, v.IdVuelo, v.Origen, v.Destino, v.FechaHoraSalida, r.NumeroAsiento, r.Clase, r.Precio
    FROM reservas r ON r.IdPasajero = p.IdPasajero
    INNER JOIN vuelos v ON r.IdVuelo = v.IdVuelo
    WHERE r.IdPasajero = p_IdPasajero
    ORDER BY v.FechaHoraSalida;
    
END //

DELIMITER ;

CALL reservas_por_pasajero(1);

-- Mostrar la tripulación de un vuelo

DELIMITER //

CREATE PROCEDURE tripulacion_por_vuelo(IN p_IdVuelo INT)
BEGIN
	SELECT v.IdVuelo, v.Origen, v.Destino, t.IdTripulante, t.Nombre, t.Rol, t.Certificacion
    FROM vuelos v
    INNER JOIN asignaciontripulacion at ON v.IdVuelo = at.IdVuelo
    INNER JOIN tripulacion t ON at.IdTripulante = t.IdTripulante
    WHERE v.IdVuelo = p_IdVuelo;
    
END //

DELIMITER ;

CALL tripulacion_por_vuelo(1);

-- Calcular cuánto dinero recaudó un vuelo

DELIMITER //

CREATE PROCEDURE recaudacion_por_vuelo(IN p_IdVuelo INT)
BEGIN
	SELECT v.IdVuelo, v.Origen, v.Destino, COUNT(r.IdReserva) AS CantidadReservas,
    COALESCE(SUM(r.Precio), 0) AS RecaudacionTotal
    FROM vuelos v
    LEFT JOIN reservas r ON v.IdVuelo = r.IdVuelo
    GROUP BY v.IdVuelo, v.Origen, v.Destino;
    
END //

DELIMITER ;

CALL recaudacion_por_vuelo(1);

DELIMITER //

-- Buscar pasajeros que tienen programa de viajero frecuente
DELIMITER //

CREATE PROCEDURE pasajeros_frecuentes()
BEGIN
	SELECT IdPasajero, Nombre, Pasaporte, Email, NroViajeroFrecuente
    FROM pasajeros 
    WHERE NroViajeFrecuente IS NOT NULL
    ORDER BY Nombre;
END //

DELIMITER ;

CALL pasajeros_frecuentes();

DELIMITER //

-- Mostrar todos los vuelos de un origen determinado
CREATE PROCEDURE vuelos_por_origen(IN p_Origen CHAR(3))
BEGIN
	SELECT IdVuelo, Origen, Destino, FechaHoraSalida, FechaHoraLlegada, Matricula
    FROM vuelos
    WHERE Origen = p_Origen
    ORDER BY FechaHoraSalida;

END //

DELIMITER ;

CALL vuelos_por_origen("EZE");

-- Mostrar pasajeros de una determinada clase
DELIMITER //

CREATE PROCEDURE pasajeros_por_clase(IN p_Clase VARCHAR(20))
BEGIN
	SELECT p.IdPasajero, p.Nombre, p.Pasaporte, r.IdVuelo, r.NumeroAsiento, r.Clase, r.Precio
    FROM pasajeros p
    INNER JOIN reservas r ON p.IdPasajero = r.IdPasajero
    WHERE r.Clase = p_Clase
    ORDER BY p.Nombre;
    
END //

DELIMITER ;

DELIMITER //

DELIMITER ;

CALL vuelos_por_origen("EZE");

-- Mostrar los vuelos y su cantidad de pasajeros
DELIMITER //

CREATE PROCEDURE pasajeros_por_clase(IN p_Clase VARCHAR(20))
BEGIN 
	SELECT p.IdPasajero, p.Nombre, p.Pasaporte, r.IdVuelo, r.NumeroAsiento, r.Clase, r.Precio
    FROM pasajeros p
    INNER JOIN reservas r ON p.IdPasajero = r.IdPasajero
    WHERE r.Clase = p_Clase
    ORDER BY p.Nombre;

END //
DELIMITER ;

CALL pasajeros_por_clase("Business");


USE aerolinealowcost;

INSERT INTO vuelos
(Matricula, Origen, Destino, FechaHoraSalida, FechaHoraLlegada)
VALUES
('N538LA', 'EZE', 'MIA', '2026-10-02 23:30:00', '2026-10-03 07:30:00'),
('N538LA', 'MIA', 'EZE', '2026-10-05 21:00:00', '2026-10-06 06:30:00'),
('LV-KCD', 'AEP', 'COR', '2026-10-02 08:00:00', '2026-10-02 09:15:00'),
('LV-KCD', 'COR', 'AEP', '2026-10-04 18:00:00', '2026-10-04 19:15:00'),
('LV-GHO', 'EZE', 'GRU', '2026-10-03 14:10:00', '2026-10-03 16:55:00'),
('LV-GHO', 'GRU', 'EZE', '2026-10-06 17:30:00', '2026-10-06 19:20:00'),
('EC-MUT', 'EZE', 'MAD', '2026-10-05 20:00:00', '2026-10-06 13:45:00'),
('EC-MUT', 'MAD', 'EZE', '2026-10-10 23:55:00', '2026-10-11 07:50:00'),
('N538LA', 'SCL', 'MAD', '2026-10-07 20:00:00', '2026-10-08 13:45:00'),
('N538LA', 'MAD', 'SCL', '2026-10-12 20:00:00', '2026-10-13 07:00:00'),
('LV-FUA', 'EZE', 'SCL', '2026-10-08 10:00:00', '2026-10-08 13:00:00'),
('LV-FUA', 'SCL', 'EZE', '2026-10-10 14:30:00', '2026-10-10 17:30:00');

USE aerolinealowcost;

Create Table if not exists historial_reservas (
	IdHistorial INT auto_increment Primary key,
    IdReserva INT,
    IdPasajero INT,
    IdVuelo INT,
    Accion VARCHAR(30),
    FechaHora DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

CREATE TRIGGER trg_validar_horario_vuelo BEFORE INSERT ON vuelos FOR EACH ROW
BEGIN
	IF NEW.FechaHoraLlegada <= NEW.FechaHoraSalida THEN
		SIGNAL SQLSTATE "45000"
        SET MESSAGE_TEXT = "Error: la fecha de llegada debe ser posterior a la fecha de salida";
	END IF;
END//

DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_validar_horario_vuelo_update BEFORE UPDATE ON vuelos FOR EACH ROW
BEGIN 
	IF NEW.FechaHoraLlegada <= NEW.FechaHoraSalida THEN
		SIGNAL SQLSTATE "45000"
        SET MESSAGE_TEXT = "Error: la fecha de llegada debe ser posterior a la fecha de salida";
	END IF;
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_limitar_reservas_capacidad
BEFORE INSERT ON reservas
FOR EACH ROW
BEGIN
    DECLARE capacidad_avion INT;
    DECLARE cantidad_reservas INT;

    SELECT a.Capacidad
    INTO capacidad_avion
    FROM vuelos v
    INNER JOIN aviones a ON v.Matricula = a.Matricula
    WHERE v.IdVuelo = NEW.IdVuelo;

    SELECT COUNT(*)
    INTO cantidad_reservas
    FROM reservas
    WHERE IdVuelo = NEW.IdVuelo;

    IF cantidad_reservas >= capacidad_avion THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: el vuelo ya alcanzo la capacidad maxima del avion.';
    END IF;
END //

DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_evitar_reserva_duplicada BEFORE INSERT ON reservas FOR EACH ROW
BEGIN
	DECLARE reservas_pasajero INT;
    
    SELECT COUNT(*)
    INTO reservas_pasajero
    FROM reservas
    WHERE IdPasajero = NEW.IdVuelo;
    
    IF reservas_pasajero > 0 THEN
		SIGNAL SQLSTATE "45000"
        SET MESSAGE_TEXT = "Error: el pasajero ya tiene una reserva para este vuelo";
	END IF;
END//

DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_validar_asiento BEFORE INSERT ON reservas FOR EACH ROW
BEGIN
	IF NEW.NumeroAsiento NOT REGEXP "^[0-9{2}[A-Z]]$" THEN
		SIGNAL SQLSTATE "45000"
        SET MESSAGE_TEXT = "Error: el numero de asietno debe tener formato 01A, 12B, 23C, etc";
	END IF;
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_evitar_tripulante_duplicado
BEFORE INSERT ON asignaciontripulacion
FOR EACH ROW
BEGIN
    DECLARE cantidad INT;

    SELECT COUNT(*)
    INTO cantidad
    FROM asignaciontripulacion
    WHERE IdVuelo = NEW.IdVuelo
      AND IdTripulante = NEW.IdTripulante;

    IF cantidad > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: el tripulante ya esta asignado a este vuelo.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_limitar_pilotos_vuelo
BEFORE INSERT ON asignaciontripulacion
FOR EACH ROW
BEGIN
    DECLARE cantidad_pilotos INT;
    DECLARE rol_tripulante VARCHAR(30);

    SELECT Rol
    INTO rol_tripulante
    FROM tripulacion
    WHERE IdTripulante = NEW.IdTripulante;

    SELECT COUNT(*)
    INTO cantidad_pilotos
    FROM asignaciontripulacion at
    INNER JOIN tripulacion t
        ON at.IdTripulante = t.IdTripulante
    WHERE at.IdVuelo = NEW.IdVuelo
      AND t.Rol = 'Piloto';

    IF rol_tripulante = 'Piloto' AND cantidad_pilotos >= 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: un vuelo no puede tener mas de 2 pilotos.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_historial_eliminacion_reserva
AFTER DELETE ON reservas
FOR EACH ROW
BEGIN
    INSERT INTO historial_reservas
    (
        IdReserva,
        IdPasajero,
        IdVuelo,
        Accion
    )
    VALUES
    (
        OLD.IdReserva,
        OLD.IdPasajero,
        OLD.IdVuelo,
        'Reserva eliminada'
    );
END //

DELIMITER ;
