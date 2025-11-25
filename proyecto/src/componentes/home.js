import mostrarOriginal from "./original.js";
import mostrarLogout from "./logout.js";

export default async function mostrarHome() {

    const app = document.getElementById("app");
    app.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button id="btnJugar" style="padding: 10px 20px; margin: 5px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">🎮 Jugar</button>
            <button id="btnCerrarSesion" style="padding: 10px 20px; margin: 5px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cerrar Sesión</button>
        </div>
        <h2>Cargando rockets...</h2>
    `;

    document.getElementById("btnJugar").addEventListener("click", mostrarOriginal);
    document.getElementById("btnCerrarSesion").addEventListener("click", mostrarLogout);

    try {
        const response = await fetch("https://api.spacexdata.com/v4/rockets");
        const rockets = await response.json();

        const container = document.createElement("div");
        container.id = "rockets-container";

        rockets.forEach((rocket) => {
            const card = document.createElement("div");
            card.classList.add("app-card");

            card.innerHTML = `
                <img src="${rocket.flickr_images[0]}" alt="${rocket.name}">
                <h2>${rocket.name}</h2>
                <p><b>País:</b> ${rocket.country}</p>
                <p><b>Compañía:</b> ${rocket.company}</p>
                <p><b>Etapas:</b> ${rocket.stages}</p>
                <p><b>Activo:</b> ${rocket.active}</p>
                <p>${rocket.description}</p>
                <a href="${rocket.wikipedia}" target="_blank">Wikipedia</a>
            `;

            container.appendChild(card);
        });

        const existingContainer = app.querySelector("#rockets-container");
        if (existingContainer) {
            app.removeChild(existingContainer);
        }
        app.appendChild(container);

    } catch (error) {
        console.error(error);
        app.innerHTML = "<p>Error cargando rockets 😢</p>";
    }
}
