import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.body.style.visibility = "visible";
    } else {
        window.location.href = "login.html";
    }
});

document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
});

window.addEventListener("quiz-finished", async (event) => {
    const user = auth.currentUser;
    if (!user) return;

    const status = document.createElement("p");
    document.getElementById("quiz-result").appendChild(status);

    try {
        await addDoc(collection(db, "results", user.uid, "attempts"), {
            pin: user.email.split("@")[0],
            subject: event.detail.subject,
            topic: event.detail.topic,
            score: event.detail.score,
            total: event.detail.total,
            createdAt: serverTimestamp()
        });
        status.textContent = "Your result has been saved.";
    } catch (error) {
        console.log(error.code);
        status.textContent = "Your score could not be saved. Please tell your teacher.";
    }
});