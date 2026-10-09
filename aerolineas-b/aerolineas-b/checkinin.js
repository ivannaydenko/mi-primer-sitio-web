document.addEventListener("DOMContentLoaded", () => {

    const usuario =
        localStorage.getItem("usuarioLogueado");

    const lista =
        document.getElementById("boletos-list");

    const userName =
        document.getElementById("user-name");

    const btnLogin =
        document.getElementById("btn-login");

    const btnLogout =
        document.getElementById("btn-logout");


    // ==========================================
    // VERIFICAR SESIÓN
    // ==========================================

    if (!usuario) {

        alert(
            "Debes iniciar sesión para consultar tus boletos."
        );

        window.location.href =
            "login.html";

        return;
    }


    userName.textContent =
        `Hola, ${usuario}`;

    btnLogin.style.display =
        "none";

    btnLogout.style.display =
        "inline-block";


    btnLogin.addEventListener(
        "click",
        () => {

            window.location.href =
                "login.html";

        }
    );


    btnLogout.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "usuarioLogueado"
            );

            window.location.href =
                "index.html";

        }
    );


    // ==========================================
    // FECHA ACTUAL
    // ==========================================

    function obtenerFechaActual() {

        const ahora =
            new Date();

        const año =
            ahora.getFullYear();

        const mes =
            String(
                ahora.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                ahora.getDate()
            ).padStart(2, "0");

        return `${año}-${mes}-${dia}`;

    }


    // ==========================================
    // FORMATEAR FECHA
    // ==========================================

    function formatearFecha(fecha) {

        if (!fecha) {
            return "-";
        }

        const partes =
            fecha.split("-");

        return partes.length === 3
            ? `${partes[2]}/${partes[1]}/${partes[0]}`
            : fecha;

    }


    // ==========================================
    // OBTENER BOLETOS
    // ==========================================

    function obtenerBoletos() {

        return (
            JSON.parse(
                localStorage.getItem(
                    "boletos_" + usuario
                )
            ) || []
        );

    }


    // ==========================================
    // GUARDAR BOLETOS
    // ==========================================

    function guardarBoletos(boletos) {

        localStorage.setItem(
            "boletos_" + usuario,
            JSON.stringify(boletos)
        );

    }


    // ==========================================
    // ACTUALIZAR MIS VIAJES
    // ==========================================

    function actualizarViaje(boleto) {

        const clave =
            "viajes_" + usuario;

        const viajes =
            JSON.parse(
                localStorage.getItem(clave)
            ) || [];


        const viaje =
            viajes.find(
                v =>
                    v.codigo ===
                    boleto.codigo
            );


        if (viaje) {

            viaje.checkin =
                boleto.checkin;

            viaje.estado =
                boleto.estado;

            viaje.tarjetaEmbarque =
                boleto.tarjetaEmbarque ||
                null;


            localStorage.setItem(
                clave,
                JSON.stringify(viajes)
            );

        }

    }


    // ==========================================
    // GENERAR PASE DE ABORDAR
    // ==========================================

    function generarTarjetaEmbarque(boleto) {

        return {

            numero:
                "PB-" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                ),

            codigo:
                boleto.codigo,

            pasajero:
                boleto.pasajero,

            vuelo:
                boleto.vuelo,

            origen:
                boleto.origen,

            destino:
                boleto.destino,

            fecha:
                boleto.fecha,

            hora:
                boleto.horaSalida || "-",

            asiento:
                boleto.asiento

        };

    }


    // ==========================================
    // MOSTRAR BOLETOS
    // ==========================================

    function mostrarBoletos() {

        const boletos =
            obtenerBoletos();

        const hoy =
            obtenerFechaActual();


        // Solamente boletos que todavía no caducaron

        const vigentes =
            boletos.filter(
                boleto =>
                    boleto.fechaSalida >= hoy
            );


        lista.innerHTML = "";


        // ======================================
        // NO HAY BOLETOS
        // ======================================

        if (vigentes.length === 0) {

            lista.innerHTML = `

                <div class="empty-state">

                    <h3>
                        No tienes boletos vigentes
                    </h3>

                    <p>
                        Cuando compres un vuelo,
                        podrás consultar el boleto
                        y realizar el Check-in desde aquí.
                    </p>

                    <a
                        class="back-button"
                        href="index.html"
                    >
                        Buscar vuelos
                    </a>

                </div>

            `;

            return;
        }


        // ======================================
        // ORDENAR POR FECHA
        // ======================================

        vigentes
            .slice()
            .sort(
                (a, b) =>
                    a.fechaSalida.localeCompare(
                        b.fechaSalida
                    )
            )
            .forEach(
                boleto => {

                    const div =
                        document.createElement(
                            "article"
                        );


                    div.className =
                        "ticket-card";


                    const yaCheckin =
                        boleto.checkin === true;


                    // ==================================
                    // TARJETA DEL BOLETO
                    // ==================================

                    div.innerHTML = `

                        <div class="ticket-main">

                            <h3>
                                 Vuelo ${boleto.vuelo}
                            </h3>


                            <p>
                                <strong>
                                    ${boleto.origen}
                                </strong>

                                →

                                <strong>
                                    ${boleto.destino}
                                </strong>
                            </p>


                            <p>
                                <strong>
                                    Fecha:
                                </strong>

                                ${
                                    boleto.fecha ||
                                    formatearFecha(
                                        boleto.fechaSalida
                                    )
                                }
                            </p>


                            <p>
                                <strong>
                                    Código:
                                </strong>

                                ${boleto.codigo}
                            </p>


                            <!-- DETALLES DEL BOLETO -->

                            <div
                                class="boleto-detalles"
                                style="display:none;"
                            >

                                <p>
                                    <strong>
                                        Pasajero:
                                    </strong>

                                    ${boleto.pasajero}
                                </p>


                                <p>
                                    <strong>
                                        Salida:
                                    </strong>

                                    ${boleto.horaSalida || "-"}
                                </p>


                                <p>
                                    <strong>
                                        Llegada:
                                    </strong>

                                    ${boleto.horaLlegada || "-"}
                                </p>


                                <p>
                                    <strong>
                                        Asiento:
                                    </strong>

                                    ${boleto.asiento}
                                </p>


                                <p>
                                    <strong>
                                        Precio:
                                    </strong>

                                    $${Number(
                                        boleto.precio
                                    ).toLocaleString(
                                        "es-AR"
                                    )}
                                </p>


                                ${
                                    boleto.fechaRegreso
                                        ? `
                                            <p>
                                                <strong>
                                                    Regreso:
                                                </strong>

                                                ${formatearFecha(
                                                    boleto.fechaRegreso
                                                )}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>


                            ${
                                yaCheckin &&
                                boleto.tarjetaEmbarque
                                    ? `

                                    <div class="pase-abordar">

                                        <h3>
                                             Tarjeta de embarque
                                        </h3>


                                        <p>
                                            <strong>
                                                Pasajero:
                                            </strong>

                                            ${boleto.tarjetaEmbarque.pasajero}
                                        </p>


                                        <p>
                                            <strong>
                                                Vuelo:
                                            </strong>

                                            ${boleto.tarjetaEmbarque.vuelo}
                                        </p>


                                        <p>
                                            <strong>
                                                Ruta:
                                            </strong>

                                            ${boleto.tarjetaEmbarque.origen}
                                            →
                                            ${boleto.tarjetaEmbarque.destino}
                                        </p>


                                        <p>
                                            <strong>
                                                Fecha:
                                            </strong>

                                            ${boleto.tarjetaEmbarque.fecha}
                                        </p>


                                        <p>
                                            <strong>
                                                Hora:
                                            </strong>

                                            ${boleto.tarjetaEmbarque.hora}
                                        </p>


                                        <p>
                                            <strong>
                                                Asiento:
                                            </strong>

                                            ${boleto.tarjetaEmbarque.asiento}
                                        </p>


                                        <p class="pase-codigo">
                                            Pase:
                                            ${boleto.tarjetaEmbarque.numero}
                                        </p>

                                    </div>

                                `
                                : ""
                            }

                        </div>


                        <div class="ticket-actions">

                            <button
                                class="btn-consultar"
                                type="button"
                            >
                                Consultar boleto
                            </button>


                            ${
                                yaCheckin

                                    ? `

                                        <span
                                            class="status completed"
                                        >
                                            Check-in realizado
                                        </span>

                                    `

                                    : `

                                        <button
                                            class="btn-checkin"
                                            type="button"
                                        >
                                            Realizar Check-in
                                        </button>

                                    `
                            }

                        </div>

                    `;


                    // ==================================
                    // CONSULTAR BOLETO
                    // ==================================

                    const detalles =
                        div.querySelector(
                            ".boleto-detalles"
                        );


                    const consultar =
                        div.querySelector(
                            ".btn-consultar"
                        );


                    consultar.addEventListener(
                        "click",
                        () => {

                            const visible =
                                detalles.style.display !==
                                "none";


                            detalles.style.display =
                                visible
                                    ? "none"
                                    : "block";


                            consultar.textContent =
                                visible
                                    ? "Consultar boleto"
                                    : "Ocultar boleto";

                        }
                    );


                    // ==================================
                    // CHECK-IN
                    // ==================================

                    const botonCheckin =
                        div.querySelector(
                            ".btn-checkin"
                        );


                    if (botonCheckin) {

                        botonCheckin.addEventListener(
                            "click",
                            () => {

                                const boletosActualizados =
                                    obtenerBoletos();


                                const boletoActual =
                                    boletosActualizados.find(
                                        b =>
                                            b.codigo ===
                                            boleto.codigo
                                    );


                                if (!boletoActual) {
                                    return;
                                }


                                // Verificar que no haya caducado

                                if (
                                    boletoActual.fechaSalida <
                                    obtenerFechaActual()
                                ) {

                                    alert(
                                        "Este vuelo ya pasó y no se puede realizar el Check-in."
                                    );

                                    mostrarBoletos();

                                    return;
                                }


                                // ==================================
                                // REALIZAR CHECK-IN
                                // ==================================

                                boletoActual.checkin =
                                    true;


                                boletoActual.estado =
                                    "Check-in realizado";


                                boletoActual.tarjetaEmbarque =
                                    generarTarjetaEmbarque(
                                        boletoActual
                                    );


                                // Guardar boleto

                                guardarBoletos(
                                    boletosActualizados
                                );


                                // Actualizar Mis Viajes

                                actualizarViaje(
                                    boletoActual
                                );


                                alert(
                                    "Check-in realizado correctamente.\n\n" +
                                    "Tu tarjeta de embarque ya está disponible."
                                );


                                mostrarBoletos();

                            }
                        );

                    }


                    lista.appendChild(
                        div
                    );

                }
            );

    }


    // ==========================================
    // INICIAR
    // ==========================================

    mostrarBoletos();

});
