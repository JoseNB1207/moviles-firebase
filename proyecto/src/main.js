import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

import mostrarLogin from "./componentes/login.js";

function mostrarRegistro() {

    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Registro</h2>
        <input type="text" id="nombre" placeholder="Nombre"><br>
        <input type="email" id="correo" placeholder="Correo"><br>
        <input type="password" id="contrasena" placeholder="Contraseña"><br>
        <button id="btnRegistro">Registrarse</button>
        <p>¿Ya tienes cuenta? <button id="btnIrLogin" style="background:none; border:none; color:blue; cursor:pointer; text-decoration:underline;">Inicia sesión</button></p>
    `;

    document.getElementById("btnRegistro").addEventListener("click", async () => {
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
            const user = userCredential.user;

            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                nombre,
                correo
            });

            alert("Usuario registrado");
            mostrarLogin();
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    document.getElementById("btnIrLogin").addEventListener("click", mostrarLogin);
}

function mostrarBienvenida() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1>SpaceX Rockets App</h1>
            <p>Bienvenido a la aplicación de cohetes SpaceX</p>
            <button id="btnLogin" style="padding: 10px 20px; margin: 10px;">Iniciar Sesión</button>
            <button id="btnRegistro" style="padding: 10px 20px; margin: 10px;">Registrarse</button>
        </div>
    `;

    document.getElementById("btnLogin").addEventListener("click", mostrarLogin);
    document.getElementById("btnRegistro").addEventListener("click", mostrarRegistro);
}

// Inicializar la aplicación mostrando la pantalla de bienvenida
mostrarBienvenida();
