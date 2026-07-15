// ===============================
// AssetsOS Supabase Integration
// ===============================

// Create Supabase client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Get the reservation form
const form = document.getElementById("reserveForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const full_name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const company = form.querySelectorAll('input[type="text"]')[1].value;
        const phone = form.querySelector('input[type="tel"]').value;
        const industry = form.querySelector("select").value;
        const message = form.querySelector("textarea").value;

        // Save reservation to Supabase
        const { error } = await supabaseClient
            .from("waitlist")
            .insert([
                {
                    full_name,
                    email,
                    phone,
                    company,
                    industry,
                    message
                }
            ]);

        if (error) {

            console.error(error);

            alert("❌ Reservation failed.\n\n" + error.message);

            return;

        }

        // Call Edge Function to send emails
        try {

            const response = await fetch(
                "https://imnsyxxnltkwkihppzez.supabase.co/functions/v1/send-reservation-email",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        full_name,
                        email,
                        phone,
                        company,
                        industry,
                        message
                    })
                }
            );

            const result = await response.json();

            console.log("Email Function:", result);

        } catch (err) {

            console.error("Email Function Error:", err);

        }

        alert("🎉 Thank you for reserving your spot!\n\nWe've received your reservation successfully!");

        form.reset();

    });

}
