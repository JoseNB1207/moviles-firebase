import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import mostrarHome from "./home.js";

export default function mostrarLogin() {

    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <input type="email" id="correo" placeholder="Correo"><br>
        <input type="password" id="contrasena" placeholder="Contraseña"><br>
        <button id="btnLogin">Ingresar</button>
    `;

    document.getElementById("btnLogin").addEventListener("click", async () => {
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        try {
            await signInWithEmailAndPassword(auth, correo, contrasena);
            mostrarHome();
        } catch (error) {
            alert("Error al iniciar sesión: " + error.message);
        }
    });
}
