// =====================================
// AssetsOS Dashboard Interactions
// =====================================

const sidebar = document.querySelector(".sidebar");
const mobileMenuButton =
    document.getElementById("mobileMenuButton");
const logoutButton =
    document.getElementById("logoutButton");

// Mobile sidebar
if (mobileMenuButton && sidebar) {
    mobileMenuButton.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileMenuButton.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });
}

// Sign out
if (
    logoutButton &&
    typeof supabase !== "undefined" &&
    typeof SUPABASE_URL !== "undefined" &&
    typeof SUPABASE_ANON_KEY !== "undefined"
) {
    const dashboardSupabase = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        logoutButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Signing Out...</span>
        `;

        const { error } =
            await dashboardSupabase.auth.signOut();

        if (error) {
            console.error("Sign-out failed:", error);

            logoutButton.disabled = false;
            logoutButton.innerHTML = `
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sign Out</span>
            `;

            alert("Sign out failed. Please try again.");
            return;
        }

        window.location.replace("login.html");
    });
}
