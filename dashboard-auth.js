// =====================================
// AssetsOS Dashboard Access Protection
// =====================================

if (
    typeof supabase === "undefined" ||
    typeof SUPABASE_URL === "undefined" ||
    typeof SUPABASE_ANON_KEY === "undefined"
) {
    console.error(
        "Supabase or the AssetsOS configuration failed to load."
    );

    window.location.replace("login.html");
} else {
    const supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    async function protectDashboard() {
        const {
            data: { session },
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(
                "Dashboard session check failed:",
                error
            );

            window.location.replace("login.html");
            return;
        }

        if (!session) {
            window.location.replace("login.html");
            return;
        }

        document.body.classList.add("authenticated");

        const userEmail =
            session.user?.email || "Authenticated user";

        const profileName =
            document.querySelector(
                ".profile-button strong"
            );

        const profileRole =
            document.querySelector(
                ".profile-button small"
            );

        const profileInitials =
            document.querySelector(
                ".profile-button > span"
            );

        if (profileName) {
            profileName.textContent = userEmail;
        }

        if (profileRole) {
            profileRole.textContent = "Authenticated User";
        }

        if (profileInitials) {
            const initials = userEmail
                .split("@")[0]
                .split(/[.\-_]/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join("");

            profileInitials.textContent =
                initials || "AU";
        }
    }

    protectDashboard();

    supabaseClient.auth.onAuthStateChange(
        (_event, session) => {
            if (!session) {
                window.location.replace("login.html");
            }
        }
    );
}
