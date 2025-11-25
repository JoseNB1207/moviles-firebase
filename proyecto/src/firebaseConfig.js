// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwOMC1hBDIZE9KnJCu9LLbU6OPE19WQns",
  authDomain: "app-firebase-73279.firebaseapp.com",
  projectId: "app-firebase-73279",
  storageBucket: "app-firebase-73279.firebasestorage.app",
  messagingSenderId: "513249213326",
  appId: "1:513249213326:web:91ebe479246e42e54502df",
  measurementId: "G-P53V75MS5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("🔥 Firebase conectado correctamente:", app.name);
