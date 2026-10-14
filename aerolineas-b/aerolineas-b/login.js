document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("login-form");


    form.addEventListener("submit", async (event) => {

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


        // Primero intentamos con los usuarios locales (para compatibilidad)
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


        // Si no está en localStorage, intentamos login demo contra la API (sin contraseña)
        if (!usuario) {

            try {
                const API = "http://localhost:3000/api";

                const nombreGuess = email.includes("@") ? email.split("@")[0] : email;

                const res = await fetch(`${API}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nombreGuess, email })
                });

                if (res.ok) {
                    const user = await res.json();

                    localStorage.setItem(
                        "usuarioLogueado",
                        user.Nombre
                    );

                    localStorage.setItem(
                        "pasajeroId",
                        user.IdPasajero
                    );

                    alert("¡Bienvenido/a " + user.Nombre + "!");
                    window.location.href = "index.html";
                    return;
                }

            } catch (err) {
                console.error(err);
            }

            alert(
                "Correo o contraseña incorrectos."
            );

            return;
        }


        // Si está en localStorage, iniciamos sesión local y sincronizamos con la API (crea pasajero si hace falta)
        localStorage.setItem(
            "usuarioLogueado",
            usuario.nombre
        );

        try {
            const API = "http://localhost:3000/api";

            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: usuario.nombre, email: usuario.email })
            });

            if (res.ok) {
                const u = await res.json();
                localStorage.setItem("pasajeroId", u.IdPasajero);
            }
        } catch (err) {
            console.error(err);
        }


        alert(
            "¡Bienvenido/a " +
            usuario.nombre +
            "!"
        );


        window.location.href =
            "index.html";
    });

});
