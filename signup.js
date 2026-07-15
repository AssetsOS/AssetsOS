// ======================================================
// AssetsOS Customer Signup
// Part 1: Setup, validation and password controls
// ======================================================

const signupSupabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ======================================================
// PAGE ELEMENTS
// ======================================================

const signupForm =
    document.getElementById("signupForm");

const fullNameInput =
    document.getElementById("fullName");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const acceptTermsInput =
    document.getElementById("acceptTerms");

const signupButton =
    document.getElementById("signupButton");

const signupMessage =
    document.getElementById("signupMessage");

const togglePasswordButton =
    document.getElementById("togglePassword");

const toggleConfirmPasswordButton =
    document.getElementById(
        "toggleConfirmPassword"
    );

// ======================================================
// MESSAGE HELPERS
// ======================================================

function showSignupMessage(
    message,
    type = "error"
) {
    if (!signupMessage) {
        return;
    }

    signupMessage.textContent = message;

    signupMessage.className =
        `signup-message show ${type}`;
}

function clearSignupMessage() {
    if (!signupMessage) {
        return;
    }

    signupMessage.textContent = "";
    signupMessage.className =
        "signup-message";
}

// ======================================================
// BUTTON LOADING STATE
// ======================================================

function setSignupButtonLoading(
    isLoading
) {
    if (!signupButton) {
        return;
    }

    signupButton.disabled = isLoading;

    signupButton.innerHTML = isLoading
        ? `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Creating Account...</span>
        `
        : `
            <i class="fa-solid fa-user-plus"></i>
            <span>Create Account</span>
        `;
}

// ======================================================
// PASSWORD VISIBILITY
// ======================================================

function togglePasswordVisibility(
    input,
    button
) {
    if (!input || !button) {
        return;
    }

    const isPassword =
        input.type === "password";

    input.type = isPassword
        ? "text"
        : "password";

    button.setAttribute(
        "aria-label",
        isPassword
            ? "Hide password"
            : "Show password"
    );

    button.innerHTML = isPassword
        ? '<i class="fa-regular fa-eye-slash"></i>'
        : '<i class="fa-regular fa-eye"></i>';
}

togglePasswordButton?.addEventListener(
    "click",
    () => {
        togglePasswordVisibility(
            passwordInput,
            togglePasswordButton
        );
    }
);

toggleConfirmPasswordButton?.addEventListener(
    "click",
    () => {
        togglePasswordVisibility(
            confirmPasswordInput,
            toggleConfirmPasswordButton
        );
    }
);

// ======================================================
// INPUT HELPERS
// ======================================================

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

function validateSignupForm() {
    const fullName =
        fullNameInput?.value.trim() || "";

    const email =
        normaliseEmail(emailInput?.value);

    const password =
        passwordInput?.value || "";

    const confirmPassword =
        confirmPasswordInput?.value || "";

    if (!fullName) {
        return "Enter your full name.";
    }

    if (fullName.length < 2) {
        return "Your full name must contain at least 2 characters.";
    }

    if (!email) {
        return "Enter your email address.";
    }

    if (!isValidEmail(email)) {
        return "Enter a valid email address.";
    }

    if (!password) {
        return "Create a password.";
    }

    if (password.length < 8) {
        return "Your password must contain at least 8 characters.";
    }

    if (password !== confirmPassword) {
        return "The passwords do not match.";
    }

    if (!acceptTermsInput?.checked) {
        return "You must accept the Terms of Service and Privacy Policy.";
    }

    return null;
}

// ======================================================
// CLEAR OLD ERRORS WHILE TYPING
// ======================================================

[
    fullNameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    acceptTermsInput
].forEach((field) => {
    field?.addEventListener(
        "input",
        clearSignupMessage
    );

    field?.addEventListener(
        "change",
        clearSignupMessage
    );
});
// ======================================================
// PART 2
// Supabase account creation and email verification
// ======================================================

function getEmailRedirectUrl() {
    const currentUrl =
        new URL(window.location.href);

    const pathParts =
        currentUrl.pathname
            .split("/")
            .filter(Boolean);

    const repositoryName =
        pathParts.length > 1
            ? pathParts[0]
            : "";

    const basePath =
        repositoryName
            ? `/${repositoryName}`
            : "";

    return `${currentUrl.origin}${basePath}/login.html?verified=true`;
}

// ======================================================
// CREATE CUSTOMER ACCOUNT
// ======================================================

signupForm?.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();
        clearSignupMessage();

        const validationError =
            validateSignupForm();

        if (validationError) {
            showSignupMessage(
                validationError,
                "error"
            );

            return;
        }

        const fullName =
            fullNameInput.value.trim();

        const email =
            normaliseEmail(
                emailInput.value
            );

        const password =
            passwordInput.value;

        setSignupButtonLoading(true);

        try {
            const {
                data,
                error
            } = await signupSupabase
                .auth
                .signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo:
                            getEmailRedirectUrl(),

                        data: {
                            full_name:
                                fullName
                        }
                    }
                });

            if (error) {
                throw error;
            }

            if (!data.user) {
                throw new Error(
                    "The account could not be created."
                );
            }

            /*
             * When email confirmation is enabled,
             * Supabase creates the user but does not
             * create an active session until the user
             * confirms the email.
             */
            if (!data.session) {
                showSignupMessage(
                    `Account created. We sent a verification email to ${email}. Open the email and confirm your account before signing in.`,
                    "success"
                );

                signupForm.reset();

                passwordInput.type =
                    "password";

                confirmPasswordInput.type =
                    "password";

                togglePasswordButton.innerHTML =
                    '<i class="fa-regular fa-eye"></i>';

                toggleConfirmPasswordButton.innerHTML =
                    '<i class="fa-regular fa-eye"></i>';

                signupButton.disabled = true;

                return;
            }

            /*
             * This runs only when email confirmation
             * is disabled in Supabase.
             */
            showSignupMessage(
                "Your account was created successfully. Redirecting to your dashboard...",
                "success"
            );

            window.setTimeout(() => {
                window.location.replace(
                    "dashboard.html"
                );
            }, 1200);

        } catch (error) {
            console.error(
                "AssetsOS signup failed:",
                error
            );

            let errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error);

            const normalisedError =
                errorMessage.toLowerCase();

            if (
                normalisedError.includes(
                    "already registered"
                ) ||
                normalisedError.includes(
                    "user already registered"
                )
            ) {
                errorMessage =
                    "An account already exists for this email address. Sign in instead.";
            }

            if (
                normalisedError.includes(
                    "password"
                ) &&
                normalisedError.includes(
                    "weak"
                )
            ) {
                errorMessage =
                    "Choose a stronger password with at least 8 characters.";
            }

            if (
                normalisedError.includes(
                    "rate limit"
                )
            ) {
                errorMessage =
                    "Too many registration attempts were made. Wait a few minutes and try again.";
            }

            if (
                normalisedError.includes(
                    "failed to fetch"
                ) ||
                normalisedError.includes(
                    "network"
                )
            ) {
                errorMessage =
                    "AssetsOS could not connect to the server. Check your internet connection and try again.";
            }

            showSignupMessage(
                errorMessage,
                "error"
            );

        } finally {
            if (
                !signupMessage
                    ?.classList
                    .contains("success") ||
                signupForm
                    ?.querySelector(
                        'input[type="email"]'
                    )
                    ?.value
            ) {
                setSignupButtonLoading(
                    false
                );
            }
        }
    }
);

// ======================================================
// REDIRECT AUTHENTICATED USERS
// ======================================================

async function redirectExistingUser() {
    const {
        data: { session },
        error
    } = await signupSupabase
        .auth
        .getSession();

    if (error) {
        console.error(
            "Unable to inspect signup session:",
            error
        );

        return;
    }

    if (session) {
        window.location.replace(
            "dashboard.html"
        );
    }
}

redirectExistingUser();
