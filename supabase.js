// =====================================
// AssetsOS Reservation Integration
// =====================================

const formMessage = document.getElementById("formMessage");
const reserveForm = document.getElementById("reserveForm");

function displayFormMessage(message, type) {
    if (!formMessage) {
        return;
    }

    formMessage.textContent = message;

    formMessage.className =
        `form-message show ${type}`;
}

function clearFormMessage() {
    if (!formMessage) {
        return;
    }

    formMessage.textContent = "";
    formMessage.className = "form-message";
}

function getInputValue(id) {
    const field = document.getElementById(id);

    return field?.value.trim() || "";
}

if (
    typeof supabase === "undefined" ||
    typeof SUPABASE_URL === "undefined" ||
    typeof SUPABASE_ANON_KEY === "undefined"
) {
    console.error(
        "Supabase failed to load or the configuration is missing."
    );

    displayFormMessage(
        "The reservation service is currently unavailable. Please try again later.",
        "error"
    );
} else if (reserveForm) {
    const supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    reserveForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();
            clearFormMessage();

            const submitButton =
                reserveForm.querySelector(
                    'button[type="submit"]'
                );

            const full_name = getInputValue("full_name");
            const email = getInputValue("email");
            const company = getInputValue("company");
            const phone = getInputValue("phone");
            const industry = getInputValue("industry");
            const message = getInputValue("message");

            if (!full_name || !email) {
                displayFormMessage(
                    "Please enter your full name and email address.",
                    "error"
                );

                return;
            }

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                displayFormMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }

            const payload = {
                full_name,
                email,
                phone,
                company,
                industry,
                message
            };

            const originalButtonContent =
                submitButton?.innerHTML || "Reserve My Spot";

            if (submitButton) {
                submitButton.disabled = true;

                submitButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Submitting
                `;
            }

            try {
                // Save the reservation in the waitlist table.
                const {
                    error: databaseError
                } = await supabaseClient
                    .from("waitlist")
                    .insert(payload);

                if (databaseError) {
                    throw new Error(
                        databaseError.message
                    );
                }

                // Ask the Edge Function to send the notification email.
                const {
                    data: functionData,
                    error: functionError
                } = await supabaseClient
                    .functions
                    .invoke(
                        "send-reservation-email",
                        {
                            body: payload
                        }
                    );

                if (functionError) {
                    console.error(
                        "Reservation email error:",
                        functionError
                    );

                    displayFormMessage(
                        "Your reservation was saved successfully, but the email notification could not be sent.",
                        "warning"
                    );

                    reserveForm.reset();
                    return;
                }

                console.log(
                    "Email function response:",
                    functionData
                );

                displayFormMessage(
                    "Thank you. Your early-access reservation was saved successfully.",
                    "success"
                );

                reserveForm.reset();

            } catch (error) {
                console.error(
                    "Reservation submission error:",
                    error
                );

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : String(error);

                displayFormMessage(
                    `Your reservation could not be submitted. ${errorMessage}`,
                    "error"
                );

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML =
                        originalButtonContent;
                }
            }
        }
    );
}
