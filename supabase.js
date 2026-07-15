// =====================================
// AssetsOS Reservation Integration
// =====================================

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const reserveForm = document.getElementById("reserveForm");

if (reserveForm) {
    reserveForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = reserveForm.querySelector(
            'button[type="submit"]'
        );

        const textInputs = reserveForm.querySelectorAll(
            'input[type="text"]'
        );

        const full_name = textInputs[0]?.value.trim() || "";
        const company = textInputs[1]?.value.trim() || "";
        const email =
            reserveForm.querySelector('input[type="email"]')
                ?.value.trim() || "";
        const phone =
            reserveForm.querySelector('input[type="tel"]')
                ?.value.trim() || "";
        const industry =
            reserveForm.querySelector("select")?.value || "";
        const message =
            reserveForm.querySelector("textarea")?.value.trim() || "";

        if (!full_name || !email) {
            alert("Please enter your full name and email address.");
            return;
        }

        const originalButtonText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {
            // 1. Save reservation in the waitlist table
            const { error: databaseError } = await supabaseClient
                .from("waitlist")
                .insert({
                    full_name,
                    email,
                    phone,
                    company,
                    industry,
                    message
                });

            if (databaseError) {
                throw new Error(
                    `Database error: ${databaseError.message}`
                );
            }

            console.log("Reservation saved successfully.");

            // 2. Call the email Edge Function
            const { data: emailResult, error: functionError } =
                await supabaseClient.functions.invoke(
                    "send-reservation-email",
                    {
                        body: {
                            full_name,
                            email,
                            phone,
                            company,
                            industry,
                            message
                        }
                    }
                );

            if (functionError) {
                console.error(
                    "Email function failed:",
                    functionError
                );

                alert(
                    "Your reservation was saved successfully, but the confirmation email could not be sent yet."
                );

                reserveForm.reset();
                return;
            }

            console.log(
                "Email function response:",
                emailResult
            );

            alert(
                "Thank you! Your reservation was saved successfully."
            );

            reserveForm.reset();

        } catch (error) {
            console.error("Reservation error:", error);

            alert(
                "Reservation failed.\n\n" +
                (error instanceof Error
                    ? error.message
                    : String(error))
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}
