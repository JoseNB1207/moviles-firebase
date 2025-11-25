import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import mostrarLogin from "./login.js";

export default function mostrarLogout() {

    const app = document.getElementById("app");
    app.innerHTML = `<p>Cerrando sesión...</p>`;

    signOut(auth)
        .then(() => mostrarLogin())
        .catch(() => mostrarLogin());
}
