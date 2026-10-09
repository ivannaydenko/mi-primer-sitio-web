document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("login-form");


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("password")
                .value;


        const usuarios =
            JSON.parse(
                localStorage.getItem("usuarios")
            ) || [];


        const usuario =
            usuarios.find(
                u =>
                    u.email.toLowerCase() === email &&
                    u.password === password
            );


        if (!usuario) {

            alert(
                "Correo o contraseña incorrectos."
            );

            return;
        }


        localStorage.setItem(
            "usuarioLogueado",
            usuario.nombre
        );


        alert(
            "¡Bienvenido/a " +
            usuario.nombre +
            "!"
        );


        window.location.href =
            "index.html";
    });

});
