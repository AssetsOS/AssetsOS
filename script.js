// ===============================
// AssetsOS JavaScript
// ===============================

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// Fade-in animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll(".card, .industry, .timeline-card, .dashboard")
.forEach(el => {
    el.classList.add("fade-up");
    observer.observe(el);
});

// Login button
const login = document.querySelector(".login-btn");

if (login) {
    login.addEventListener("click", () => {
        alert("Login Portal Coming Soon");
    });
}

// Reserve button
const reserve = document.querySelector(".primary-btn");

if (reserve) {
    reserve.addEventListener("click", () => {
        const reserveSection = document.querySelector("#reserve");

        if (reserveSection) {
            reserveSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}
