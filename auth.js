// =====================================
// AssetsOS Login Authentication
// =====================================

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginSubmitButton = document.getElementById(
    "loginSubmitButton"
);
const loginMessage = document.getElementById("loginMessage");
const passwordToggle = document.getElementById(
    "passwordToggle"
);

function showLoginMessage(message, type) {
    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;
    loginMessage.className =
        `login-message show ${type}`;
}

function clearLoginMessage() {
    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = "";
    loginMessage.className = "login-message";
}

function setLoading(isLoading) {
    if (!loginSubmitButton) {
        return;
    }

    loginSubmitButton.disabled = isLoading;

    loginSubmitButton.innerHTML = isLoading
        ? `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Signing in...</span>
        `
        : `
            <span>Sign in securely</span>
            <i class="fa-solid fa-arrow-right"></i>
        `;
}

// Show or hide the password.
if (passwordToggle && loginPassword) {
    passwordToggle.addEventListener("click", () => {
        const passwordIsHidden =
            loginPassword.type === "password";

        loginPassword.type = passwordIsHidden
            ? "text"
            : "password";

        passwordToggle.innerHTML = passwordIsHidden
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

        passwordToggle.setAttribute(
            "aria-label",
            passwordIsHidden
                ? "Hide password"
                : "Show password"
        );
    });
}

if (
    typeof supabase === "undefined" ||
    typeof SUPABASE_URL === "undefined" ||
    typeof SUPABASE_ANON_KEY === "undefined"
) {
    console.error(
        "Supabase or the AssetsOS configuration failed to load."
    );

    showLoginMessage(
        "The login service is currently unavailable. Please try again later.",
        "error"
    );

} else {
    const supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    // If the user is already signed in, send them to the dashboard.
    async function redirectExistingUser() {
        const {
            data: { session },
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(
                "Session check failed:",
                error
            );

            return;
        }

        if (session) {
            window.location.replace("dashboard.html");
        }
    }

    redirectExistingUser();

    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();
                clearLoginMessage();

                const email =
                    loginEmail?.value.trim() || "";

                const password =
                    loginPassword?.value || "";

                if (!email || !password) {
                    showLoginMessage(
                        "Enter your email address and password.",
                        "error"
                    );

                    return;
                }

                setLoading(true);

                try {
                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth
                            .signInWithPassword({
                                email,
                                password
                            });

                    if (error) {
                        throw error;
                    }

                    if (!data.session) {
                        throw new Error(
                            "A secure session could not be created."
                        );
                    }

                    showLoginMessage(
                        "Login successful. Opening your dashboard...",
                        "success"
                    );

                    window.setTimeout(() => {
                        window.location.replace(
                            "dashboard.html"
                        );
                    }, 700);

                } catch (error) {
                    console.error(
                        "AssetsOS login failed:",
                        error
                    );

                    let message =
                        "Your email address or password is incorrect.";

                    const errorText =
                        error instanceof Error
                            ? error.message.toLowerCase()
                            : "";

                    if (
                        errorText.includes(
                            "email not confirmed"
                        )
                    ) {
                        message =
                            "Your email address has not been verified yet.";
                    } else if (
                        errorText.includes(
                            "too many requests"
                        )
                    ) {
                        message =
                            "Too many login attempts. Wait a moment and try again.";
                    }

                    showLoginMessage(
                        message,
                        "error"
                    );

                } finally {
                    setLoading(false);
                }
            }
        );
    }
}
