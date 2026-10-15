document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        // Primero intentamos con los usuarios locales (compatibilidad)
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioLocal = usuarios.find(u => u.email.toLowerCase() === email && u.password === password);

        const API = "http://localhost:3000/api";

        if (usuarioLocal) {
            // Iniciamos sesión localmente
            localStorage.setItem("usuarioLogueado", usuarioLocal.nombre);

            // Intentamos sincronizar/obtener pasajeroId desde el backend (no bloqueante)
            try {
                const res = await fetch(`${API}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (res.ok) {
                    const data = await res.json();
                    // aceptar distintos nombres de campo que pueda devolver el backend
                    const id = data.pasajeroId || data.IdPasajero || data.id;
                    const nombre = data.nombre || data.Nombre || usuarioLocal.nombre;

                    if (id) localStorage.setItem("pasajeroId", id);
                    if (nombre) localStorage.setItem("usuarioLogueado", nombre);
                }
            } catch (err) {
                console.warn("No se pudo sincronizar con backend:", err);
            }

            alert("¡Bienvenido/a " + usuarioLocal.nombre + "!");
            window.location.href = "index.html";
            return;
        }

        // Si no está en localStorage, intentamos autenticar contra el backend
        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const data = await res.json();
                const id = data.pasajeroId || data.IdPasajero || data.id;
                const nombre = data.nombre || data.Nombre || (email.includes("@") ? email.split("@")[0] : email);

                localStorage.setItem("usuarioLogueado", nombre);
                if (id) localStorage.setItem("pasajeroId", id);

                alert("¡Bienvenido/a " + nombre + "!");
                window.location.href = "index.html";
                return;
            }

            // error del servidor -> mostrar mensaje si viene
            const errBody = await res.json().catch(() => null);
            const msg = (errBody && (errBody.error || errBody.message)) || "Correo o contraseña incorrectos.";
            alert(msg);
        } catch (err) {
            console.error(err);
            alert("No se pudo conectar con el servidor de autenticación. Revisa que el backend esté corriendo.");
        }
    });

});
