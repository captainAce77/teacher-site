import { auth, db } from "./firebase-init.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const loginSection = document.getElementById("teacher-login");
const resultsSection = document.getElementById("results-section");
const form = document.getElementById("teacher-form");
const errorEl = document.getElementById("teacher-error");
const body = document.getElementById("results-body");
const countEl = document.getElementById("results-count");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("teacher-email").value.trim();
    const password = document.getElementById("teacher-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .catch(() => { errorEl.textContent = "Login failed. Check your email and password."; });
});

document.getElementById("teacher-logout").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = "none";
        resultsSection.style.display = "block";
        loadResults();
    } else {
        loginSection.style.display = "block";
        resultsSection.style.display = "none";
    }
});

function addCell(row, text) {
    const td = document.createElement("td");
    td.textContent = text;
    row.appendChild(td);
}

async function loadResults() {
    body.innerHTML = "";
    try {
        const snapshot = await getDocs(collectionGroup(db, "attempts"));
        const rows = snapshot.docs.map(d => d.data());
        rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        rows.forEach(r => {
            const tr = document.createElement("tr");
            addCell(tr, r.pin);
            addCell(tr, r.subject);
            addCell(tr, r.topic);
            addCell(tr, `${r.score}/${r.total}`);
            addCell(tr, r.createdAt ? r.createdAt.toDate().toLocaleString() : "");
            body.appendChild(tr);
        });

        countEl.textContent = `${rows.length} attempt(s) recorded.`;
    } catch (error) {
        countEl.textContent = "Could not load results. Make sure you are logged in as the teacher.";
    }
}