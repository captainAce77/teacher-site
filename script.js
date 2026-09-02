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