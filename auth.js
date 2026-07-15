// ======================================================
// AssetsOS Authentication
// Complete replacement auth.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    // ==================================================
    // CHECK REQUIRED CONFIGURATION
    // ==================================================

    const configurationAvailable =
        typeof window.supabase !== "undefined" &&
        typeof SUPABASE_URL !== "undefined" &&
        typeof SUPABASE_ANON_KEY !== "undefined" &&
        Boolean(SUPABASE_URL) &&
        Boolean(SUPABASE_ANON_KEY);

    // ==================================================
    // PAGE ELEMENTS
    // ==================================================

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
    document.getElementById("loginEmail");

    const passwordInput =
    document.getElementById("loginPassword");

    const loginButton =
        document.getElementById("loginButton");

    const loginMessage =
        document.getElementById("loginMessage");

    const togglePasswordButton =
        document.getElementById("togglePassword");

    const rememberMeInput =
        document.getElementById("rememberMe");

    // ==================================================
    // MESSAGE HELPERS
    // ==================================================

    function showLoginMessage(
        message,
        type = "error"
    ) {
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
        loginMessage.className =
            "login-message";
    }

    // ==================================================
    // BUTTON LOADING STATE
    // ==================================================

    function setLoginButtonLoading(
        isLoading
    ) {
        if (!loginButton) {
            return;
        }

        loginButton.disabled = isLoading;

        loginButton.innerHTML = isLoading
            ? `
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Signing in...</span>
            `
            : `
                <span>Sign in securely</span>
                <i class="fa-solid fa-arrow-right"></i>
            `;
    }

    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    function normaliseEmail(value) {
        return String(value || "")
            .trim()
            .toLowerCase();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );
    }

    function validateLoginForm() {
        const email =
            normaliseEmail(
                emailInput?.value
            );

        const password =
            passwordInput?.value || "";

        if (!email) {
            return "Enter your email address.";
        }

        if (!isValidEmail(email)) {
            return "Enter a valid email address.";
        }

        if (!password) {
            return "Enter your password.";
        }

        return null;
    }

    // ==================================================
    // STOP IF CONFIGURATION IS MISSING
    // ==================================================

    if (!configurationAvailable) {
        console.error(
            "Supabase or the AssetsOS configuration failed to load."
        );

        showLoginMessage(
            "The login service is currently unavailable. Please try again later.",
            "error"
        );

        if (loginButton) {
            loginButton.disabled = true;
        }

        return;
    }

    // ==================================================
    // CREATE SUPABASE CLIENT
    // ==================================================

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

    // ==================================================
    // ROUTE AUTHENTICATED USER
    // ==================================================

    async function routeAuthenticatedUser() {
        const {
            data: { user },
            error: userError
        } = await supabaseClient
            .auth
            .getUser();

        if (userError) {
            console.error(
                "Unable to load authenticated user:",
                userError
            );

            showLoginMessage(
                "Your session could not be verified. Please sign in again.",
                "error"
            );

            return;
        }

        if (!user) {
            return;
        }

        const {
            data: membership,
            error: membershipError
        } = await supabaseClient
            .from("organisation_members")
            .select(
                "id, organisation_id, role, status"
            )
            .eq("user_id", user.id)
            .eq("status", "active")
            .limit(1)
            .maybeSingle();

        if (membershipError) {
            console.error(
                "Unable to check organisation membership:",
                membershipError
            );

            showLoginMessage(
                `Your organisation status could not be checked. ${membershipError.message}`,
                "error"
            );

            return;
        }

        if (membership?.organisation_id) {
            window.location.replace(
                "dashboard.html"
            );

            return;
        }

        window.location.replace(
            "onboarding.html"
        );
    }

    // ==================================================
    // CHECK EXISTING SESSION
    // ==================================================

    async function redirectExistingUser() {
        const {
            data: { session },
            error
        } = await supabaseClient
            .auth
            .getSession();

        if (error) {
            console.error(
                "Unable to inspect existing session:",
                error
            );

            return;
        }

        if (session) {
            await routeAuthenticatedUser();
        }
    }

    // ==================================================
    // PASSWORD VISIBILITY
    // ==================================================

    togglePasswordButton?.addEventListener(
        "click",
        () => {
            if (!passwordInput) {
                return;
            }

            const passwordHidden =
                passwordInput.type ===
                "password";

            passwordInput.type =
                passwordHidden
                    ? "text"
                    : "password";

            togglePasswordButton.innerHTML =
                passwordHidden
                    ? '<i class="fa-regular fa-eye-slash"></i>'
                    : '<i class="fa-regular fa-eye"></i>';

            togglePasswordButton.setAttribute(
                "aria-label",
                passwordHidden
                    ? "Hide password"
                    : "Show password"
            );
        }
    );

    // ==================================================
    // REMEMBER EMAIL
    // ==================================================

    function loadRememberedEmail() {
        try {
            const rememberedEmail =
                localStorage.getItem(
                    "assetsos_login_email"
                );

            if (
                rememberedEmail &&
                emailInput
            ) {
                emailInput.value =
                    rememberedEmail;

                if (rememberMeInput) {
                    rememberMeInput.checked =
                        true;
                }
            }
        } catch (error) {
            console.warn(
                "Unable to load remembered email:",
                error
            );
        }
    }

    function saveRememberedEmail(
        email
    ) {
        try {
            if (
                rememberMeInput?.checked
            ) {
                localStorage.setItem(
                    "assetsos_login_email",
                    email
                );
            } else {
                localStorage.removeItem(
                    "assetsos_login_email"
                );
            }
        } catch (error) {
            console.warn(
                "Unable to save remembered email:",
                error
            );
        }
    }

    // ==================================================
    // LOGIN SUBMISSION
    // ==================================================

    loginForm?.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();
            clearLoginMessage();

            const validationError =
                validateLoginForm();

            if (validationError) {
                showLoginMessage(
                    validationError,
                    "error"
                );

                return;
            }

            const email =
                normaliseEmail(
                    emailInput.value
                );

            const password =
                passwordInput.value;

            setLoginButtonLoading(true);

            try {
                const {
                    data,
                    error
                } = await supabaseClient
                    .auth
                    .signInWithPassword({
                        email,
                        password
                    });

                if (error) {
                    throw error;
                }

                if (
                    !data.session ||
                    !data.user
                ) {
                    throw new Error(
                        "AssetsOS could not create a login session."
                    );
                }

                saveRememberedEmail(email);

                showLoginMessage(
                    "Sign-in successful. Preparing your workspace...",
                    "success"
                );

                await routeAuthenticatedUser();

            } catch (error) {
                console.error(
                    "AssetsOS login failed:",
                    error
                );

                let errorMessage =
                    error instanceof Error
                        ? error.message
                        : String(error);

                const normalisedMessage =
                    errorMessage.toLowerCase();

                if (
                    normalisedMessage.includes(
                        "invalid login credentials"
                    )
                ) {
                    errorMessage =
                        "The email address or password is incorrect.";
                }

                if (
                    normalisedMessage.includes(
                        "email not confirmed"
                    )
                ) {
                    errorMessage =
                        "Confirm your email address before signing in.";
                }

                if (
                    normalisedMessage.includes(
                        "failed to fetch"
                    ) ||
                    normalisedMessage.includes(
                        "network"
                    )
                ) {
                    errorMessage =
                        "AssetsOS could not connect to Supabase. Check your internet connection and try again.";
                }

                if (
                    normalisedMessage.includes(
                        "too many requests"
                    ) ||
                    normalisedMessage.includes(
                        "rate limit"
                    )
                ) {
                    errorMessage =
                        "Too many login attempts were made. Wait a few minutes and try again.";
                }

                showLoginMessage(
                    errorMessage,
                    "error"
                );

                setLoginButtonLoading(false);
            }
        }
    );

    // ==================================================
    // CLEAR ERRORS WHEN TYPING
    // ==================================================

    emailInput?.addEventListener(
        "input",
        clearLoginMessage
    );

    passwordInput?.addEventListener(
        "input",
        clearLoginMessage
    );

    // ==================================================
    // AUTHENTICATION STATE
    // ==================================================

    supabaseClient.auth.onAuthStateChange(
        async (event, session) => {
            if (
                event === "SIGNED_IN" &&
                session
            ) {
                await routeAuthenticatedUser();
            }
        }
    );

    // ==================================================
    // VERIFIED EMAIL MESSAGE
    // ==================================================

    const pageParameters =
        new URLSearchParams(
            window.location.search
        );

    if (
        pageParameters.get("verified") ===
        "true"
    ) {
        showLoginMessage(
            "Your email has been verified. You can now sign in.",
            "success"
        );
    }

    // ==================================================
    // START LOGIN PAGE
    // ==================================================

    loadRememberedEmail();
    redirectExistingUser();
});
