import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig.js";

export default async function mostrarJuego() {
    const app = document.getElementById("app");
    const user = auth.currentUser;

    if (!user) {
        app.innerHTML = "<p>Debes iniciar sesión para jugar</p>";
        return;
    }

    let puntuacion = 0;
    let mejorPuntuacion = 0;
    let juegoActivo = true;
    let velocidad = 2;

    // Obtener la puntuación más alta del usuario
    try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            mejorPuntuacion = docSnap.data().mejorPuntuacion || 0;
        }
    } catch (error) {
        console.error("Error al obtener puntuación:", error);
    }

    app.innerHTML = `
        <div style="text-align: center; font-family: Arial; background: #1a1a2e; color: #00d4ff; padding: 20px; border-radius: 10px;">
            <h2>🚀 JUEGO DE COHETES 🚀</h2>
            <p>Puntuación: <span id="puntuacion">0</span></p>
            <p>Mejor Puntuación: <span id="mejorPuntuacion">${mejorPuntuacion}</span></p>
            <p id="instrucciones">Haz clic en los cohetes que aparecen para ganar puntos. ¡Sé rápido!</p>
            <div id="gameArea" style="
                position: relative;
                width: 100%;
                height: 400px;
                background: linear-gradient(135deg, #0f3460, #16213e);
                border: 3px solid #00d4ff;
                border-radius: 10px;
                margin: 20px 0;
                overflow: hidden;
            "></div>
            <button id="btnIniciar" style="
                padding: 10px 20px;
                font-size: 16px;
                background: #00d4ff;
                color: #1a1a2e;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Iniciar Juego</button>
            <button id="btnParar" style="
                padding: 10px 20px;
                font-size: 16px;
                background: #e94560;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                display: none;
                margin-left: 10px;
            ">Parar Juego</button>
        </div>
    `;

    const gameArea = document.getElementById("gameArea");
    const btnIniciar = document.getElementById("btnIniciar");
    const btnParar = document.getElementById("btnParar");
    const puntuacionDiv = document.getElementById("puntuacion");
    const mejorPuntuacionDiv = document.getElementById("mejorPuntuacion");

    function crearCohete() {
        if (!juegoActivo) return;

        const cohete = document.createElement("div");
        cohete.innerHTML = "🚀";
        cohete.style.cssText = `
            position: absolute;
            font-size: 40px;
            cursor: pointer;
            left: ${Math.random() * (gameArea.offsetWidth - 50)}px;
            top: ${Math.random() * (gameArea.offsetHeight - 50)}px;
            user-select: none;
            animation: parpadear 0.5s infinite;
        `;

        cohete.addEventListener("click", async () => {
            puntuacion += 10;
            velocidad += 0.5;
            puntuacionDiv.textContent = puntuacion;
            cohete.remove();
            crearCohete();
        });

        gameArea.appendChild(cohete);

        setTimeout(() => {
            if (cohete.parentNode) {
                cohete.remove();
                crearCohete();
            }
        }, Math.max(1000 - velocidad * 100, 300));
    }

    btnIniciar.addEventListener("click", () => {
        puntuacion = 0;
        velocidad = 2;
        juegoActivo = true;
        puntuacionDiv.textContent = puntuacion;
        gameArea.innerHTML = "";
        btnIniciar.style.display = "none";
        btnParar.style.display = "inline-block";
        document.getElementById("instrucciones").textContent = "¡Juego en marcha!";
        
        // Agregar estilos de animación
        if (!document.getElementById("estilosJuego")) {
            const style = document.createElement("style");
            style.id = "estilosJuego";
            style.textContent = `
                @keyframes parpadear {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }

        crearCohete();
    });

    btnParar.addEventListener("click", async () => {
        juegoActivo = false;
        gameArea.innerHTML = "";
        btnIniciar.style.display = "inline-block";
        btnParar.style.display = "none";

        if (puntuacion > mejorPuntuacion) {
            mejorPuntuacion = puntuacion;
            mejorPuntuacionDiv.textContent = mejorPuntuacion;
            document.getElementById("instrucciones").textContent = `¡Nuevo récord! Puntuación: ${puntuacion}`;

            try {
                const docRef = doc(db, "usuarios", user.uid);
                await setDoc(docRef, {
                    mejorPuntuacion: mejorPuntuacion
                }, { merge: true });
                console.log("✅ Puntuación guardada correctamente en Firebase:", mejorPuntuacion);
            } catch (error) {
                console.error("❌ Error al guardar puntuación:", error);
                alert("Error al guardar: " + error.message);
            }
        } else {
            document.getElementById("instrucciones").textContent = `Juego terminado. Puntuación: ${puntuacion}`;
        }
    });
}
