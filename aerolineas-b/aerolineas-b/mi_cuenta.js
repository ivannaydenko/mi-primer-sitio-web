document.addEventListener("DOMContentLoaded", () => {

    const usuarioLogueado =
        localStorage.getItem("usuarioLogueado");


    if (!usuarioLogueado) {

        alert(
            "Debés iniciar sesión para acceder a tu cuenta."
        );

        window.location.href =
            "login.html";

        return;
    }


    const userName =
        document.getElementById("user-name");

    const btnLogout =
        document.getElementById("btn-logout");


    userName.textContent =
        "Hola, " + usuarioLogueado;


    btnLogout.addEventListener("click", () => {

        localStorage.removeItem(
            "usuarioLogueado"
        );

        window.location.href =
            "index.html";
    });


    cargarDatosUsuario();


    document
        .getElementById("datos-form")
        .addEventListener(
            "submit",
            guardarDatos
        );


    document
        .getElementById("password-form")
        .addEventListener(
            "submit",
            cambiarPassword
        );


    const tarjetaForm =
        document.getElementById("tarjeta-form");

    if (tarjetaForm) {
        tarjetaForm.addEventListener(
            "submit",
            guardarTarjeta
        );
    }


    const btnEliminarTarjeta =
        document.getElementById("btn-eliminar-tarjeta");

    if (btnEliminarTarjeta) {
        btnEliminarTarjeta.addEventListener(
            "click",
            eliminarTarjeta
        );
    }


    const numeroInput =
        document.getElementById("numero-tarjeta");

    if (numeroInput) {
        numeroInput.addEventListener(
            "input",
            formatearNumeroTarjeta
        );
    }


    const vencimientoInput =
        document.getElementById("vencimiento");

    if (vencimientoInput) {
        vencimientoInput.addEventListener(
            "input",
            formatearVencimiento
        );
    }


    const cvvInput =
        document.getElementById("cvv");

    if (cvvInput) {
        cvvInput.addEventListener(
            "input",
            () => {
                cvvInput.value =
                    cvvInput.value
                        .replace(/\D/g, "")
                        .slice(0, 4);
            }
        );
    }


    renderTarjeta();
});


/* =========================
   CARGAR DATOS
========================= */

function cargarDatosUsuario() {

    const usuarioLogueado =
        localStorage.getItem(
            "usuarioLogueado"
        );


    const usuarios =
        JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];


    const usuario =
        usuarios.find(
            u =>
                u.nombre === usuarioLogueado
        );


    if (!usuario) {

        alert(
            "No se encontraron los datos de tu cuenta."
        );

        return;
    }


    document.getElementById(
        "nombre"
    ).value = usuario.nombre;


    document.getElementById(
        "email"
    ).value = usuario.email;
}


/* =========================
   MODIFICAR DATOS
========================= */

function guardarDatos(event) {

    event.preventDefault();


    const nombreNuevo =
        document
            .getElementById("nombre")
            .value
            .trim();


    const emailNuevo =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();


    const nombreAnterior =
        localStorage.getItem(
            "usuarioLogueado"
        );


    let usuarios =
        JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];


    const indice =
        usuarios.findIndex(
            u =>
                u.nombre === nombreAnterior
        );


    if (indice === -1) {

        alert(
            "No se encontró el usuario."
        );

        return;
    }


    const correoExiste =
        usuarios.some(
            (u, i) =>
                i !== indice &&
                u.email.toLowerCase() === emailNuevo
        );


    if (correoExiste) {

        alert(
            "Ese correo ya está siendo utilizado por otra cuenta."
        );

        return;
    }


    const nombreYaExiste =
        usuarios.some(
            (u, i) =>
                i !== indice &&
                u.nombre.toLowerCase() ===
                nombreNuevo.toLowerCase()
        );


    if (nombreYaExiste) {

        alert(
            "Ese nombre ya está siendo utilizado por otra cuenta."
        );

        return;
    }


    const usuarioAnterior =
        usuarios[indice];


    const datosAntiguos =
        {
            nombre: usuarioAnterior.nombre,
            email: usuarioAnterior.email
        };


    usuarios[indice].nombre =
        nombreNuevo;

    usuarios[indice].email =
        emailNuevo;


    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );


    if (
        datosAntiguos.nombre !==
        nombreNuevo
    ) {

        migrarDatosUsuario(
            datosAntiguos.nombre,
            nombreNuevo
        );
    }


    localStorage.setItem(
        "usuarioLogueado",
        nombreNuevo
    );


    document.getElementById(
        "user-name"
    ).textContent =
        "Hola, " + nombreNuevo;


    const message =
        document.getElementById(
            "datos-message"
        );


    message.textContent =
        "✓ Datos actualizados correctamente.";

    message.style.color =
        "#15803d";


    alert(
        "Tus datos fueron modificados correctamente."
    );
}


/* =========================
   CAMBIAR CONTRASEÑA
========================= */

function cambiarPassword(event) {

    event.preventDefault();


    const actual =
        document
            .getElementById(
                "password-actual"
            )
            .value;


    const nueva =
        document
            .getElementById(
                "password-nueva"
            )
            .value;


    const confirmar =
        document
            .getElementById(
                "password-confirmar"
            )
            .value;


    const usuarioLogueado =
        localStorage.getItem(
            "usuarioLogueado"
        );


    let usuarios =
        JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];


    const indice =
        usuarios.findIndex(
            u =>
                u.nombre ===
                usuarioLogueado
        );


    if (indice === -1) {

        alert(
            "No se encontró el usuario."
        );

        return;
    }


    if (
        usuarios[indice].password !==
        actual
    ) {

        alert(
            "La contraseña actual es incorrecta."
        );

        return;
    }


    if (nueva.length < 4) {

        alert(
            "La nueva contraseña debe tener al menos 4 caracteres."
        );

        return;
    }


    if (nueva !== confirmar) {

        alert(
            "Las nuevas contraseñas no coinciden."
        );

        return;
    }


    if (actual === nueva) {

        alert(
            "La nueva contraseña debe ser diferente a la anterior."
        );

        return;
    }


    usuarios[indice].password =
        nueva;


    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );


    document.getElementById(
        "password-form"
    ).reset();


    const message =
        document.getElementById(
            "password-message"
        );


    message.textContent =
        "✓ Contraseña modificada correctamente.";

    message.style.color =
        "#15803d";


    alert(
        "Tu contraseña fue modificada correctamente."
    );
}


/* =========================
   TARJETA DE CRÉDITO
========================= */

function formatearNumeroTarjeta() {

    const input =
        document.getElementById("numero-tarjeta");

    if (!input) {
        return;
    }

    const valor =
        input.value
            .replace(/\D/g, "")
            .slice(0, 16);

    input.value =
        valor
            .replace(/(\d{4})(?=\d)/g, "$1 ")
            .trim();
}


function formatearVencimiento() {

    const input =
        document.getElementById("vencimiento");

    if (!input) {
        return;
    }

    let valor =
        input.value
            .replace(/\D/g, "")
            .slice(0, 4);

    if (valor.length > 2) {
        valor =
            valor.slice(0, 2) +
            "/" +
            valor.slice(2);
    }

    input.value = valor;
}


function guardarTarjeta(event) {

    event.preventDefault();

    const usuario =
        localStorage.getItem("usuarioLogueado");

    if (!usuario) {
        return;
    }

    const titular =
        document
            .getElementById("titular")
            .value
            .trim();

    const numero =
        document
            .getElementById("numero-tarjeta")
            .value
            .replace(/\s+/g, "")
            .trim();

    const vencimiento =
        document
            .getElementById("vencimiento")
            .value
            .trim();

    const cvv =
        document
            .getElementById("cvv")
            .value
            .trim();

    const mensaje =
        document.getElementById("tarjeta-message");

    if (!titular || !numero || !vencimiento || !cvv) {
        mensaje.textContent =
            "Completá todos los campos de la tarjeta.";
        mensaje.style.color = "#b91c1c";
        return;
    }

    if (!/^\d{16}$/.test(numero)) {
        mensaje.textContent =
            "El número de tarjeta debe tener 16 dígitos.";
        mensaje.style.color = "#b91c1c";
        return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) {
        mensaje.textContent =
            "El vencimiento debe tener formato MM/AA.";
        mensaje.style.color = "#b91c1c";
        return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        mensaje.textContent =
            "El CVV debe tener 3 o 4 dígitos.";
        mensaje.style.color = "#b91c1c";
        return;
    }

    const tarjeta = {
        titular: titular,
        numero: numero.slice(-4),
        vencimiento: vencimiento
    };

    localStorage.setItem(
        `tarjeta_${usuario}`,
        JSON.stringify(tarjeta)
    );

    mensaje.textContent =
        "✓ Tarjeta guardada correctamente.";
    mensaje.style.color = "#15803d";

    document
        .getElementById("tarjeta-form")
        .reset();

    renderTarjeta();
}


function renderTarjeta() {

    const usuario =
        localStorage.getItem("usuarioLogueado");

    const tarjetaInfo =
        document.getElementById("tarjeta-info");

    const btnEliminar =
        document.getElementById("btn-eliminar-tarjeta");

    if (!tarjetaInfo || !btnEliminar) {
        return;
    }

    const tarjeta =
        JSON.parse(
            localStorage.getItem(
                `tarjeta_${usuario}`
            ) || "null"
        );

    if (!tarjeta) {
        tarjetaInfo.innerHTML =
            "<p id='sin-tarjeta'>No tenés una tarjeta registrada.</p>";
        btnEliminar.style.display = "none";
        return;
    }

    tarjetaInfo.innerHTML = `
        <div class="tarjeta-card">
            <div class="tarjeta-chip"></div>
            <div class="tarjeta-numero">
                •••• •••• •••• ${tarjeta.numero}
            </div>
            <div class="tarjeta-row">
                <div>
                    <small>Titular</small>
                    <strong>${escapeHtml(tarjeta.titular)}</strong>
                </div>
                <div>
                    <small>Vence</small>
                    <strong>${tarjeta.vencimiento}</strong>
                </div>
            </div>
        </div>
    `;

    btnEliminar.style.display = "inline-block";
}


function eliminarTarjeta() {

    const usuario =
        localStorage.getItem("usuarioLogueado");

    const confirmar =
        confirm(
            "¿Seguro que querés eliminar tu tarjeta guardada?"
        );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem(
        `tarjeta_${usuario}`
    );

    const mensaje =
        document.getElementById("tarjeta-message");

    if (mensaje) {
        mensaje.textContent =
            "✓ Tarjeta eliminada.";
        mensaje.style.color = "#15803d";
    }

    renderTarjeta();
}


function escapeHtml(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   MIGRAR VIAJES
========================= */

function migrarDatosUsuario(
    nombreAnterior,
    nombreNuevo
) {

    const claveAnteriorViajes =
        "viajes_" + nombreAnterior;


    const claveNuevoViajes =
        "viajes_" + nombreNuevo;


    const claveAnteriorBoletos =
        "boletos_" + nombreAnterior;


    const claveNuevoBoletos =
        "boletos_" + nombreNuevo;


    const viajes =
        JSON.parse(
            localStorage.getItem(
                claveAnteriorViajes
            )
        ) || [];


    const boletos =
        JSON.parse(
            localStorage.getItem(
                claveAnteriorBoletos
            )
        ) || [];


    const viajesActualizados =
        viajes.map(viaje => {

            viaje.pasajero =
                nombreNuevo;

            return viaje;

        });

    const boletosActualizados =
        boletos.map(boleto => {

            boleto.pasajero =
                nombreNuevo;


            if (
                boleto.tarjetaEmbarque
            ) {

                boleto
                    .tarjetaEmbarque
                    .pasajero =
                    nombreNuevo;
            }


            return boleto;

        });

    localStorage.setItem(
        claveNuevoViajes,
        JSON.stringify(
            viajesActualizados
        )
    );


    localStorage.setItem(
        claveNuevoBoletos,
        JSON.stringify(
            boletosActualizados
        )
    );


    localStorage.removeItem(
        claveAnteriorViajes
    );


    localStorage.removeItem(
        claveAnteriorBoletos
    );
}
