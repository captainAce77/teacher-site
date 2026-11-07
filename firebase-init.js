import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDm4izjbxT5C9qvRPmYs0JAt8SlFcrx434",
    authDomain: "captain-ace-academy.firebaseapp.com",
    projectId: "captain-ace-academy",
    storageBucket: "captain-ace-academy.firebasestorage.app",
    messagingSenderId: "995860101419",
    appId: "1:995860101419:web:96da0e9745ee6bfad96d6e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);