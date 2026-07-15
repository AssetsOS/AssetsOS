// =====================================
// AssetsOS Website Interactions
// =====================================

const siteHeader = document.getElementById("siteHeader");
const mainNav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");
const loginButton = document.getElementById("loginButton");
const reserveButton = document.getElementById("reserveButton");

// Add header shadow after scrolling.
window.addEventListener("scroll", () => {
    if (!siteHeader) {
        return;
    }

    siteHeader.classList.toggle(
        "scrolled",
        window.scrollY > 20
    );
});

// Open and close the mobile navigation menu.
if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });
}

// Smooth scrolling for internal links.
document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {
        link.addEventListener("click", (event) => {
            const selector = link.getAttribute("href");

            if (!selector || selector === "#") {
                return;
            }

            const target = document.querySelector(selector);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            if (mainNav?.classList.contains("open")) {
                mainNav.classList.remove("open");
                document.body.classList.remove("menu-open");

                menuToggle?.setAttribute(
                    "aria-expanded",
                    "false"
                );

                if (menuToggle) {
                    menuToggle.innerHTML =
                        '<i class="fa-solid fa-bars"></i>';
                }
            }
        });
    });

// Scroll the user to the early-access form.
if (reserveButton) {
    reserveButton.addEventListener("click", () => {
        document
            .getElementById("reserve")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    });
}

// Login is not available until the portal is developed.
if (loginButton) {
    loginButton.addEventListener("click", () => {
        alert(
            "The AssetsOS client portal is currently in development."
        );
    });
}

// Reveal cards as they enter the screen.
const revealElements = document.querySelectorAll(
    [
        ".workflow-card",
        ".card",
        ".industry",
        ".timeline-card",
        ".dashboard",
        ".form-container"
    ].join(",")
);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("show");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        element.classList.add("fade-up");
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("show");
    });
}
