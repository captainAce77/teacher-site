import { auth } from "./firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const pinInput = document.getElementById("pin-input");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const pin = pinInput.value.trim();
    const email = `${pin}@students.captainaceacademy.com`;

    signInWithEmailAndPassword(auth, email, pin)
        .then(() => {
            window.location.href = "ca-quiz.html";
        })
        .catch(() => {
            loginError.textContent = "Incorrect PIN. Please try again.";
        });
});