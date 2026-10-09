document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("registro-form");


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const nombre =
            document
                .getElementById("nombre")
                .value
                .trim();


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


        const confirmPassword =
            document
                .getElementById("confirm-password")
                .value;


        if (password !== confirmPassword) {

            alert(
                "Las contraseñas no coinciden."
            );

            return;
        }


        let usuarios =
            JSON.parse(
                localStorage.getItem("usuarios")
            ) || [];


        const existe =
            usuarios.some(
                u =>
                    u.email.toLowerCase() === email
            );


        if (existe) {

            alert(
                "Ya existe una cuenta con ese correo."
            );

            return;
        }


        const nuevoUsuario = {

            nombre: nombre,

            email: email,

            password: password
        };


        usuarios.push(nuevoUsuario);


        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );


        alert(
            "Cuenta creada correctamente."
        );


        window.location.href =
            "login.html";
    });

});
