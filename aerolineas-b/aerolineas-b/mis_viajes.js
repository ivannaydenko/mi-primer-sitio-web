document.addEventListener("DOMContentLoaded", () => {

    const usuario = localStorage.getItem("usuarioLogueado");

    const userName = document.getElementById("user-name");
    const btnLogin = document.getElementById("btn-login");
    const btnLogout = document.getElementById("btn-logout");

    if (!usuario) {
        alert("Debés iniciar sesión para ver tus viajes.");
        window.location.href = "login.html";
        return;
    }

    userName.textContent = "Hola, " + usuario;
    btnLogin.classList.add("hidden");
    btnLogout.classList.remove("hidden");

    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("pasajeroId");
        window.location.href = "index.html";
    });

    mostrarViajes();
});

async function mostrarViajes() {
    const pasajeroId = localStorage.getItem("pasajeroId");
    const container = document.getElementById("viajes-list");
    const API = "http://localhost:3000/api";

    if (!pasajeroId) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No se pudo identificar tu pasajero.</p>
                <a href="login.html" class="back-button">Ir a iniciar sesión</a>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch(`${API}/reservas?pasajeroId=${pasajeroId}`);
        if (!res.ok) throw new Error('Error fetching reservas: ' + res.status);
        const viajes = await res.json();

        if (!Array.isArray(viajes) || viajes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Todavía no tenés viajes reservados.</p>
                    <a href="index.html" class="back-button">Buscar vuelos</a>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        viajes.forEach(viaje => {
            const card = document.createElement("div");
            card.className = "travel-card";

            const fechaSalida = viaje.fechaSalida ? new Date(viaje.fechaSalida).toLocaleDateString("es-AR") : "-";
            const fechaLlegada = viaje.fechaLlegada ? new Date(viaje.fechaLlegada).toLocaleDateString("es-AR") : "-";

            card.innerHTML = `
                <div class="travel-header">
                    <div>
                        <h3>Vuelo ${viaje.vueloId || viaje.vuelo}</h3>
                        <span class="status status-programado">Reservado</span>
                    </div>

                    <div class="travel-actions">
                        <strong>${viaje.idReserva || viaje.id}</strong>
                        <button class="btn-eliminar" data-id="${viaje.idReserva || viaje.id}">🗑️ Eliminar boleto</button>
                    </div>
                </div>

                <div class="travel-info">
                    <p><strong>Pasajero:</strong> ${localStorage.getItem("usuarioLogueado")}</p>
                    <p><strong>Origen:</strong> ${viaje.origen}</p>
                    <p><strong>Destino:</strong> ${viaje.destino}</p>
                    <p><strong>Fecha de salida:</strong> ${fechaSalida}</p>
                    <p><strong>Fecha de llegada:</strong> ${fechaLlegada}</p>
                    <p><strong>Asiento:</strong> ${viaje.asiento || '-'}</p>
                    <p><strong>Precio:</strong> $${Number(viaje.precio || 0).toLocaleString("es-AR")}</p>
                    <p><strong>Pago:</strong> ${viaje.metodoPago || "Tarjeta guardada"} ${viaje.tarjetaFinal ? `- **** ${viaje.tarjetaFinal}` : ""}</p>
                </div>
            `;

            const deleteBtn = card.querySelector(".btn-eliminar");
            deleteBtn.addEventListener("click", () => {
                // Inform the user and optionally call the backend if endpoint exists.
                if (confirm('¿Seguro que querés eliminar este boleto?')) {
                    // Try delete on backend
                    fetch(`${API}/reservas/${deleteBtn.dataset.id}`, { method: 'DELETE' })
                        .then(r => {
                            if (!r.ok) throw new Error('No se pudo eliminar en el servidor');
                            alert('Reserva eliminada');
                            mostrarViajes();
                        })
                        .catch(err => {
                            console.warn(err);
                            alert('No se pudo eliminar en el servidor. Reintenta o elimina localmente.');
                        });
                }
            });

            container.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="empty-state">
                <p>No se pudieron cargar tus viajes.</p>
                <a href="index.html" class="back-button">Buscar vuelos</a>
            </div>
        `;
    }
}
