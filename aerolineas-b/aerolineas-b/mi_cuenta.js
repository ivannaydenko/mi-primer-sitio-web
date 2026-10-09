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


    /* Verificar si el nuevo correo
       pertenece a otra cuenta */

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


    /*
       Si cambia el nombre, también
       trasladamos sus viajes y boletos
       para que no los pierda.
    */

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
