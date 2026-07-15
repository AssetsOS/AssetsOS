// =====================================
// AssetsOS Website JavaScript
// =====================================

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }

    });
});

// Fade animations
const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });

    },
    {
        threshold: 0.2
    }
);

document.querySelectorAll(
    ".card, .industry, .timeline-card, .dashboard, .workflow-card, .trusted-logo"
).forEach(element => {

    element.classList.add("fade-up");

    observer.observe(element);

});

// ===============================
// Dashboard Login Button
// ===============================

const loginButton = document.querySelector(".login-btn");

if (loginButton) {

    loginButton.addEventListener("click", () => {

        window.location.href = "login.html";

    });

}

// ===============================
// Early Access Button
// ===============================

const reserveButton = document.querySelector(".primary-btn");

if (reserveButton) {

    reserveButton.addEventListener("click", () => {

        const reserveSection =
            document.querySelector("#reserve");

        if (reserveSection) {

            reserveSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}

// ===============================
// Sticky Header Effect
// ===============================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});
