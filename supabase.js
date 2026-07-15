// ===============================
// AssetsOS Supabase Integration
// ===============================

// Create Supabase client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Reservation Form
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

        // Send Email via Edge Function
        try {

            const response = await fetch(
                "https://imnsyxxnltkwkihppzez.supabase.co/functions/v1/send-reservation-email",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                        "apikey": SUPABASE_ANON_KEY
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

            console.log("Edge Function Response:", result);

        } catch (err) {

            console.error("Edge Function Error:", err);

        }

        alert("🎉 Thank you for reserving your spot!\n\nWe've received your reservation.");

        form.reset();

    });

}

}
