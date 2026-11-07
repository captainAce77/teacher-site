const currentPage = window.location.pathname.split("/").pop();

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "thanks.html";
            } else {
                alert("Something went wrong. Please try again.");
            }
        })
        .catch(() => {
            alert("Something went wrong. Please check your connection and try again.");
        });
    });
}

const searchInput = document.getElementById("lesson-search");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const items = document.querySelectorAll(".lesson-item");
        const blocks = document.querySelectorAll(".subject-block");

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const subjectHeading = item.closest(".subject-block").querySelector("h3").textContent.toLowerCase();
            const matches = text.includes(query) || subjectHeading.includes(query);
            item.style.display = matches ? "" : "none";
        });

        blocks.forEach(block => {
            const visibleItems = block.querySelectorAll(".lesson-item:not([style*='display: none'])");
            block.style.display = visibleItems.length > 0 ? "" : "none";
        });
    });
}

const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const isDark = document.body.getAttribute("data-theme") === "dark";

        if (isDark) {
            document.body.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        } else {
            document.body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️";
        }
    });
}

const addRowBtn = document.getElementById("add-row-btn");
const tableBody = document.getElementById("ca-table-body");
const classSelect = document.getElementById("class-select");
const subjectSelect = document.getElementById("subject-select");

function getStorageKey() {
    return `ca-data-${classSelect.value}-${subjectSelect.value}`;
}

function calculateGrade(total) {
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 45) return "D";
    if (total >= 40) return "E";
    return "F";
}

function createStudentRow(data = {}) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="student-name" placeholder="Name" value="${data.name || ""}"></td>
        <td><input type="number" class="ca1" min="0" max="15" value="${data.ca1 ?? ""}"></td>
        <td><input type="number" class="ca2" min="0" max="15" value="${data.ca2 ?? ""}"></td>
        <td><input type="number" class="ca3" min="0" max="30" value="${data.ca3 ?? ""}"></td>
        <td><input type="number" class="exam" min="0" max="40" value="${data.exam ?? ""}"></td>
        <td class="total-cell">${data.total || 0}</td>
        <td class="grade-cell">${data.grade || "-"}</td>
        <td><button class="remove-row-btn">Remove</button></td>
    `;
    return row;
}

function saveData() {
    const rows = tableBody.querySelectorAll("tr");
    const data = [];

    rows.forEach(row => {
        data.push({
            name: row.querySelector(".student-name").value,
            ca1: row.querySelector(".ca1").value,
            ca2: row.querySelector(".ca2").value,
            ca3: row.querySelector(".ca3").value,
            exam: row.querySelector(".exam").value,
            total: row.querySelector(".total-cell").textContent,
            grade: row.querySelector(".grade-cell").textContent
        });
    });

    localStorage.setItem(getStorageKey(), JSON.stringify(data));
}

function loadData() {
    tableBody.innerHTML = "";
    const saved = localStorage.getItem(getStorageKey());
    if (!saved) return;

    const data = JSON.parse(saved);
    data.forEach(entry => {
        tableBody.appendChild(createStudentRow(entry));
    });
}

if (addRowBtn && tableBody) {

    loadData();

    classSelect.addEventListener("change", loadData);
    subjectSelect.addEventListener("change", loadData);

    addRowBtn.addEventListener("click", function () {
        tableBody.appendChild(createStudentRow());
        saveData();
    });

    tableBody.addEventListener("input", function (event) {
        const row = event.target.closest("tr");

        if (event.target.matches(".ca1, .ca2, .ca3, .exam")) {
            const input = event.target;
            const max = parseFloat(input.max);
            const min = parseFloat(input.min);
            let value = parseFloat(input.value);

            if (!isNaN(value)) {
                if (value > max) value = max;
                if (value < min) value = min;
                input.value = value;
            }

            const ca1 = parseFloat(row.querySelector(".ca1").value) || 0;
            const ca2 = parseFloat(row.querySelector(".ca2").value) || 0;
            const ca3 = parseFloat(row.querySelector(".ca3").value) || 0;
            const exam = parseFloat(row.querySelector(".exam").value) || 0;
            const total = ca1 + ca2 + ca3 + exam;

            row.querySelector(".total-cell").textContent = total;
            row.querySelector(".grade-cell").textContent = calculateGrade(total);
        }

        saveData();
    });

    tableBody.addEventListener("click", function (event) {
        if (event.target.matches(".remove-row-btn")) {
            event.target.closest("tr").remove();
            saveData();
        }
    });
}

const exportBtn = document.getElementById("export-btn");

if (exportBtn) {
    exportBtn.addEventListener("click", function () {
        const rows = tableBody.querySelectorAll("tr");
        let csv = "Student Name,CA1,CA2,Assignment,Exam,Total,Grade\n";

        rows.forEach(row => {
            const name = row.querySelector(".student-name").value;
            const ca1 = row.querySelector(".ca1").value;
            const ca2 = row.querySelector(".ca2").value;
            const ca3 = row.querySelector(".ca3").value;
            const exam = row.querySelector(".exam").value;
            const total = row.querySelector(".total-cell").textContent;
            const grade = row.querySelector(".grade-cell").textContent;

            csv += `"${name}",${ca1},${ca2},${ca3},${exam},${total},${grade}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `CA_${classSelect.value}_${subjectSelect.value}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    });
}

const sortNameBtn = document.getElementById("sort-name-btn");
const sortTotalBtn = document.getElementById("sort-total-btn");

function getRowData() {
    const rows = tableBody.querySelectorAll("tr");
    const data = [];

    rows.forEach(row => {
        data.push({
            name: row.querySelector(".student-name").value,
            ca1: row.querySelector(".ca1").value,
            ca2: row.querySelector(".ca2").value,
            ca3: row.querySelector(".ca3").value,
            exam: row.querySelector(".exam").value,
            total: row.querySelector(".total-cell").textContent,
            grade: row.querySelector(".grade-cell").textContent
        });
    });

    return data;
}

function rebuildTable(data) {
    tableBody.innerHTML = "";
    data.forEach(entry => {
        tableBody.appendChild(createStudentRow(entry));
    });
    saveData();
}

if (sortNameBtn) {
    sortNameBtn.addEventListener("click", function () {
        const data = getRowData();
        data.sort((a, b) => a.name.localeCompare(b.name));
        rebuildTable(data);
    });
}

if (sortTotalBtn) {
    sortTotalBtn.addEventListener("click", function () {
        const data = getRowData();
        data.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
        rebuildTable(data);
    });
}

