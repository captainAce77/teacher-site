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