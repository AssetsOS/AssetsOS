// ======================================================
// AssetsOS Organisation Onboarding
// Part 1: Supabase setup, authentication and navigation
// ======================================================

const onboardingSupabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ======================================================
// APPLICATION STATE
// ======================================================

const onboardingState = {
    currentStep: 1,
    totalSteps: 4,
    session: null,
    user: null,
    selectedLogoFile: null,
    selectedLogoPreviewUrl: null
};

// ======================================================
// PAGE ELEMENTS
// ======================================================

const onboardingForm =
    document.getElementById("onboardingForm");

const onboardingMessage =
    document.getElementById("onboardingMessage");

const formSteps =
    Array.from(
        document.querySelectorAll(".form-step")
    );

const progressSteps =
    Array.from(
        document.querySelectorAll(
            ".progress-step"
        )
    );

const backButton =
    document.getElementById("backButton");

nextButton?.addEventListener(
    "click",
    () => {
        if (
            onboardingState.currentStep <
            onboardingState.totalSteps
        ) {
            moveToStep(
                onboardingState.currentStep + 1
            );
        }
    }
);

const finishButton =
    document.getElementById("finishButton");

const logoutButton =
    document.getElementById("logoutButton");

// ======================================================
// ORGANISATION FORM FIELDS
// ======================================================

const organisationNameInput =
    document.getElementById(
        "organisationName"
    );

const industryInput =
    document.getElementById("industry");

const organisationEmailInput =
    document.getElementById(
        "organisationEmail"
    );

const organisationPhoneInput =
    document.getElementById(
        "organisationPhone"
    );

const countryInput =
    document.getElementById("country");

const currencyInput =
    document.getElementById("currency");

const timezoneInput =
    document.getElementById("timezone");

// ======================================================
// LOGO ELEMENTS
// ======================================================

const organisationLogoInput =
    document.getElementById(
        "organisationLogo"
    );

const logoUploadButton =
    document.getElementById(
        "logoUploadButton"
    );

const removeLogoButton =
    document.getElementById(
        "removeLogoButton"
    );

const logoPreview =
    document.getElementById("logoPreview");

const reviewLogo =
    document.getElementById("reviewLogo");

// ======================================================
// REVIEW ELEMENTS
// ======================================================

const reviewOrganisationName =
    document.getElementById(
        "reviewOrganisationName"
    );

const reviewIndustry =
    document.getElementById(
        "reviewIndustry"
    );

const reviewCountry =
    document.getElementById(
        "reviewCountry"
    );

const reviewCurrency =
    document.getElementById(
        "reviewCurrency"
    );

const reviewTimezone =
    document.getElementById(
        "reviewTimezone"
    );

const reviewOwner =
    document.getElementById(
        "reviewOwner"
    );

// ======================================================
// MESSAGE HELPERS
// ======================================================

function showOnboardingMessage(
    message,
    type = "error"
) {
    if (!onboardingMessage) {
        return;
    }

    onboardingMessage.textContent = message;

    onboardingMessage.className =
        `onboarding-message show ${type}`;
}

function clearOnboardingMessage() {
    if (!onboardingMessage) {
        return;
    }

    onboardingMessage.textContent = "";

    onboardingMessage.className =
        "onboarding-message";
}

// ======================================================
// BUTTON LOADING STATE
// ======================================================

function setFinishButtonLoading(
    isLoading
) {
    if (!finishButton) {
        return;
    }

    finishButton.disabled = isLoading;

    finishButton.innerHTML = isLoading
        ? `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Creating Workspace...
        `
        : `
            <i class="fa-solid fa-rocket"></i>
            Create Workspace
        `;
}

// ======================================================
// AUTHENTICATION CHECK
// ======================================================

async function loadAuthenticatedUser() {
    const {
        data: { session },
        error
    } = await onboardingSupabase
        .auth
        .getSession();

    if (error) {
        console.error(
            "Unable to read onboarding session:",
            error
        );

        window.location.replace(
            "login.html"
        );

        return false;
    }

    if (!session) {
        window.location.replace(
            "login.html"
        );

        return false;
    }

    onboardingState.session = session;
    onboardingState.user = session.user;

    if (
        organisationEmailInput &&
        !organisationEmailInput.value
    ) {
        organisationEmailInput.value =
            session.user.email || "";
    }

    if (reviewOwner) {
        reviewOwner.textContent =
            session.user.user_metadata
                ?.full_name ||
            session.user.email ||
            "Authenticated user";
    }

    return true;
}

// ======================================================
// CHECK EXISTING ORGANISATION
// ======================================================

async function checkExistingOrganisation() {
    const userId =
        onboardingState.user?.id;

    if (!userId) {
        return false;
    }

    const {
        data,
        error
    } = await onboardingSupabase
        .from("organisation_members")
        .select(
            "id, organisation_id, status"
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            "Unable to check organisation membership:",
            error
        );

        showOnboardingMessage(
            `Your workspace status could not be checked. ${error.message}`,
            "error"
        );

        return false;
    }

    if (data?.organisation_id) {
        window.location.replace(
            "dashboard.html"
        );

        return true;
    }

    return false;
}

// ======================================================
// STEP DISPLAY
// ======================================================

function renderCurrentStep() {
    formSteps.forEach((step) => {
        const stepNumber =
            Number(step.dataset.step);

        step.classList.toggle(
            "active",
            stepNumber ===
                onboardingState.currentStep
        );
    });

    progressSteps.forEach((step) => {
        const stepNumber =
            Number(
                step.dataset.stepIndicator
            );

        step.classList.toggle(
            "active",
            stepNumber ===
                onboardingState.currentStep
        );

        step.classList.toggle(
            "completed",
            stepNumber <
                onboardingState.currentStep
        );

        const numberBadge =
            step.querySelector(":scope > span");

        if (numberBadge) {
            numberBadge.innerHTML =
                stepNumber <
                onboardingState.currentStep
                    ? '<i class="fa-solid fa-check"></i>'
                    : String(stepNumber);
        }
    });

    backButton?.classList.toggle(
        "hidden",
        onboardingState.currentStep === 1
    );

    nextButton?.classList.toggle(
        "hidden",
        onboardingState.currentStep ===
            onboardingState.totalSteps
    );

    finishButton?.classList.toggle(
        "hidden",
        onboardingState.currentStep !==
            onboardingState.totalSteps
    );

    clearOnboardingMessage();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ======================================================
// STEP NAVIGATION
// ======================================================

function moveToStep(stepNumber) {
    const safeStep = Math.min(
        onboardingState.totalSteps,
        Math.max(1, stepNumber)
    );

    onboardingState.currentStep =
        safeStep;

    renderCurrentStep();
}

backButton?.addEventListener(
    "click",
    () => {
        if (
            onboardingState.currentStep > 1
        ) {
            moveToStep(
                onboardingState.currentStep - 1
            );
        }
    }
);

nextButton?.addEventListener(
    "click",
    () => {
        if (
            onboardingState.currentStep <
            onboardingState.totalSteps
        ) {
            moveToStep(
                onboardingState.currentStep + 1
            );
        }
    }
);

// ======================================================
// SIGN OUT
// ======================================================

logoutButton?.addEventListener(
    "click",
    async () => {
        logoutButton.disabled = true;

        logoutButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Signing out...
        `;

        const {
            error
        } = await onboardingSupabase
            .auth
            .signOut();

        if (error) {
            console.error(
                "Onboarding sign-out failed:",
                error
            );

            showOnboardingMessage(
                "Sign out failed. Please try again.",
                "error"
            );

            logoutButton.disabled = false;

            logoutButton.innerHTML = `
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                Sign out and use another account
            `;

            return;
        }

        window.location.replace(
            "login.html"
        );
    }
);

// ======================================================
// INITIALISATION
// ======================================================

async function initialiseOnboarding() {
    const authenticated =
        await loadAuthenticatedUser();

    if (!authenticated) {
        return;
    }

    const alreadyConfigured =
        await checkExistingOrganisation();

    if (alreadyConfigured) {
        return;
    }

    renderCurrentStep();

    document.body.style.visibility =
        "visible";
}

initialiseOnboarding();
// ======================================================
// PART 2
// Validation, country defaults, logo preview and review
// ======================================================

// ======================================================
// VALIDATION HELPERS
// ======================================================

function normaliseEmail(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value
    );
}

function validateCurrentStep() {
    clearOnboardingMessage();

    if (onboardingState.currentStep === 1) {
        const organisationName =
            organisationNameInput?.value.trim() ||
            "";

        const industry =
            industryInput?.value || "";

        const organisationEmail =
            normaliseEmail(
                organisationEmailInput?.value
            );

        if (!organisationName) {
            return "Enter your company or organisation name.";
        }

        if (organisationName.length < 2) {
            return "The organisation name must contain at least 2 characters.";
        }

        if (!industry) {
            return "Select your organisation's industry.";
        }

        if (
            organisationEmail &&
            !isValidEmail(
                organisationEmail
            )
        ) {
            return "Enter a valid organisation email address.";
        }
    }

    if (onboardingState.currentStep === 2) {
        if (!countryInput?.value) {
            return "Select your organisation's country.";
        }

        if (!currencyInput?.value) {
            return "Select your organisation's currency.";
        }

        if (!timezoneInput?.value) {
            return "Select your organisation's time zone.";
        }
    }

    return null;
}

// ======================================================
// REPLACE NEXT BUTTON LOGIC WITH VALIDATION
// ======================================================

nextButton?.addEventListener(
    "click",
    () => {
        const validationError =
            validateCurrentStep();

        if (validationError) {
            showOnboardingMessage(
                validationError,
                "error"
            );

            return;
        }

        if (
            onboardingState.currentStep === 3
        ) {
            updateReviewScreen();
        }

        if (
            onboardingState.currentStep <
            onboardingState.totalSteps
        ) {
            moveToStep(
                onboardingState.currentStep + 1
            );
        }
    }
);

// ======================================================
// COUNTRY DEFAULTS
// ======================================================

const countryDefaults = {
    "South Africa": {
        currency: "ZAR",
        timezone: "Africa/Johannesburg"
    },

    Botswana: {
        currency: "BWP",
        timezone: "Africa/Gaborone"
    },

    Eswatini: {
        currency: "SZL",
        timezone: "Africa/Johannesburg"
    },

    Lesotho: {
        currency: "LSL",
        timezone: "Africa/Johannesburg"
    },

    Mozambique: {
        currency: "MZN",
        timezone: "Africa/Maputo"
    },

    Namibia: {
        currency: "NAD",
        timezone: "Africa/Windhoek"
    },

    Zimbabwe: {
        currency: "USD",
        timezone: "Africa/Harare"
    }
};



// ======================================================
// LOGO UPLOAD
// ======================================================

logoUploadButton?.addEventListener(
    "click",
    () => {
        organisationLogoInput?.click();
    }
);

organisationLogoInput?.addEventListener(
    "change",
    () => {
        clearOnboardingMessage();

        const file =
            organisationLogoInput.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            organisationLogoInput.value = "";

            showOnboardingMessage(
                "Upload a PNG, JPG or WEBP image.",
                "error"
            );

            return;
        }

        const maxFileSize =
            2 * 1024 * 1024;

        if (file.size > maxFileSize) {
            organisationLogoInput.value = "";

            showOnboardingMessage(
                "The organisation logo must be smaller than 2 MB.",
                "error"
            );

            return;
        }

        if (
            onboardingState
                .selectedLogoPreviewUrl
        ) {
            URL.revokeObjectURL(
                onboardingState
                    .selectedLogoPreviewUrl
            );
        }

        const previewUrl =
            URL.createObjectURL(file);

        onboardingState.selectedLogoFile =
            file;

        onboardingState.selectedLogoPreviewUrl =
            previewUrl;

        if (logoPreview) {
            logoPreview.innerHTML = `
                <img
                    src="${previewUrl}"
                    alt="Selected organisation logo"
                >
            `;
        }

        if (reviewLogo) {
            reviewLogo.innerHTML = `
                <img
                    src="${previewUrl}"
                    alt="Organisation logo preview"
                >
            `;
        }

        removeLogoButton?.classList.remove(
            "hidden"
        );
    }
);

// ======================================================
// REMOVE SELECTED LOGO
// ======================================================

removeLogoButton?.addEventListener(
    "click",
    () => {
        if (
            onboardingState
                .selectedLogoPreviewUrl
        ) {
            URL.revokeObjectURL(
                onboardingState
                    .selectedLogoPreviewUrl
            );
        }

        onboardingState.selectedLogoFile =
            null;

        onboardingState.selectedLogoPreviewUrl =
            null;

        if (organisationLogoInput) {
            organisationLogoInput.value = "";
        }

        if (logoPreview) {
            logoPreview.innerHTML =
                '<i class="fa-regular fa-image"></i>';
        }

        if (reviewLogo) {
            reviewLogo.innerHTML =
                '<i class="fa-regular fa-building"></i>';
        }

        removeLogoButton.classList.add(
            "hidden"
        );
    }
);

// ======================================================
// REVIEW SCREEN
// ======================================================

function setReviewValue(
    element,
    value
) {
    if (!element) {
        return;
    }

    element.textContent =
        value || "—";
}

function updateReviewScreen() {
    setReviewValue(
        reviewOrganisationName,
        organisationNameInput?.value.trim()
    );

    setReviewValue(
        reviewIndustry,
        industryInput?.value
    );

    setReviewValue(
        reviewCountry,
        countryInput?.value
    );

    setReviewValue(
        reviewCurrency,
        currencyInput?.value
    );

    setReviewValue(
        reviewTimezone,
        timezoneInput?.value
    );

    setReviewValue(
        reviewOwner,
        onboardingState.user
            ?.user_metadata
            ?.full_name ||
        onboardingState.user?.email ||
        "Authenticated user"
    );

    if (
        onboardingState
            .selectedLogoPreviewUrl &&
        reviewLogo
    ) {
        reviewLogo.innerHTML = `
            <img
                src="${onboardingState.selectedLogoPreviewUrl}"
                alt="Organisation logo preview"
            >
        `;
    }
}

// ======================================================
// CLEAR ERRORS WHEN USER EDITS FIELDS
// ======================================================

[
    organisationNameInput,
    industryInput,
    organisationEmailInput,
    organisationPhoneInput,
    countryInput,
    currencyInput,
    timezoneInput
].forEach((field) => {
    field?.addEventListener(
        "input",
        clearOnboardingMessage
    );

    field?.addEventListener(
        "change",
        clearOnboardingMessage
    );
});
// ======================================================
// PART 3
// Logo upload, organisation creation and membership
// ======================================================

// ======================================================
// FILE NAME HELPERS
// ======================================================

function sanitiseFileName(value) {
    return String(value || "logo")
        .toLowerCase()
        .replace(/[^a-z0-9.\-_]/g, "-")
        .replace(/-+/g, "-");
}

function getFileExtension(file) {
    const originalName =
        file?.name || "";

    const extension =
        originalName
            .split(".")
            .pop()
            ?.toLowerCase();

    if (
        extension &&
        ["png", "jpg", "jpeg", "webp"]
            .includes(extension)
    ) {
        return extension;
    }

    const mimeExtensions = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp"
    };

    return mimeExtensions[file?.type] || "png";
}

// ======================================================
// UPLOAD ORGANISATION LOGO
// ======================================================

async function uploadOrganisationLogo(
    organisationId
) {
    const file =
        onboardingState.selectedLogoFile;

    if (!file) {
        return null;
    }

    const extension =
        getFileExtension(file);

    const originalName =
        sanitiseFileName(file.name);

    const fileName = [
        Date.now(),
        crypto.randomUUID(),
        originalName
    ].join("-");

    const filePath =
        `${organisationId}/${fileName}.${extension}`;

    const {
        error: uploadError
    } = await onboardingSupabase
        .storage
        .from("organisation-logos")
        .upload(
            filePath,
            file,
            {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type
            }
        );

    if (uploadError) {
        throw new Error(
            `The organisation was created, but the logo could not be uploaded. ${uploadError.message}`
        );
    }

    const {
        data: publicUrlData
    } = onboardingSupabase
        .storage
        .from("organisation-logos")
        .getPublicUrl(filePath);

    return (
        publicUrlData?.publicUrl ||
        null
    );
}

// ======================================================
// BUILD ORGANISATION RECORD
// ======================================================

function buildOrganisationRecord() {
    return {
        name:
            organisationNameInput
                ?.value
                .trim() || "",

        industry:
            industryInput?.value ||
            null,

        email:
            normaliseEmail(
                organisationEmailInput?.value
            ) || null,

        phone:
            organisationPhoneInput
                ?.value
                .trim() || null,

        country:
            countryInput?.value ||
            null,

        currency:
            currencyInput?.value ||
            "ZAR",

        timezone:
            timezoneInput?.value ||
            "Africa/Johannesburg",

        status:
            "active",

        created_by:
            onboardingState.user.id
    };
}

// ======================================================
// FINAL FORM VALIDATION
// ======================================================

function validateCompleteOnboarding() {
    const organisationName =
        organisationNameInput
            ?.value
            .trim() || "";

    const industry =
        industryInput?.value || "";

    const country =
        countryInput?.value || "";

    const currency =
        currencyInput?.value || "";

    const timezone =
        timezoneInput?.value || "";

    const organisationEmail =
        normaliseEmail(
            organisationEmailInput?.value
        );

    if (!organisationName) {
        return "Enter your organisation name.";
    }

    if (organisationName.length < 2) {
        return "The organisation name must contain at least 2 characters.";
    }

    if (!industry) {
        return "Select your organisation's industry.";
    }

    if (
        organisationEmail &&
        !isValidEmail(organisationEmail)
    ) {
        return "Enter a valid organisation email address.";
    }

    if (!country) {
        return "Select your organisation's country.";
    }

    if (!currency) {
        return "Select your organisation's currency.";
    }

    if (!timezone) {
        return "Select your organisation's time zone.";
    }

    return null;
}

// ======================================================
// CHECK FOR DUPLICATE MEMBERSHIP
// ======================================================

async function userAlreadyHasOrganisation() {
    const {
        data,
        error
    } = await onboardingSupabase
        .from("organisation_members")
        .select(
            "id, organisation_id, status"
        )
        .eq(
            "user_id",
            onboardingState.user.id
        )
        .eq(
            "status",
            "active"
        )
        .limit(1)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data || null;
}

// ======================================================
// CREATE ORGANISATION
// ======================================================

async function createOrganisation() {
    const organisationRecord =
        buildOrganisationRecord();

    const {
        data: organisation,
        error
    } = await onboardingSupabase
        .from("organisations")
        .insert(organisationRecord)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return organisation;
}

// ======================================================
// CREATE OWNER MEMBERSHIP
// ======================================================

async function createOwnerMembership(
    organisationId
) {
    const {
        data: membership,
        error
    } = await onboardingSupabase
        .from("organisation_members")
        .insert({
            organisation_id:
                organisationId,

            user_id:
                onboardingState.user.id,

            role:
                "owner",

            status:
                "active"
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return membership;
}

// ======================================================
// UPDATE ORGANISATION LOGO
// ======================================================

async function saveOrganisationLogo(
    organisationId,
    logoUrl
) {
    if (!logoUrl) {
        return;
    }

    const {
        error
    } = await onboardingSupabase
        .from("organisations")
        .update({
            logo_url:
                logoUrl
        })
        .eq(
            "id",
            organisationId
        )
        .eq(
            "created_by",
            onboardingState.user.id
        );

    if (error) {
        throw error;
    }
}

// ======================================================
// UPDATE USER PROFILE
// ======================================================

async function updateUserProfile(
    organisationId
) {
    const user =
        onboardingState.user;

    if (!user?.id) {
        return;
    }

    const profileRecord = {
        id:
            user.id,

        full_name:
            user.user_metadata
                ?.full_name ||
            null,

        email:
            user.email ||
            null,

        organisation_id:
            organisationId,

        updated_at:
            new Date().toISOString()
    };

    const {
        error
    } = await onboardingSupabase
        .from("profiles")
        .upsert(
            profileRecord,
            {
                onConflict: "id"
            }
        );

    if (error) {
        console.warn(
            "The profile could not be updated:",
            error
        );
    }
}

// ======================================================
// REMOVE INCOMPLETE ORGANISATION
// ======================================================

async function removeIncompleteOrganisation(
    organisationId
) {
    if (!organisationId) {
        return;
    }

    const {
        error
    } = await onboardingSupabase
        .from("organisations")
        .delete()
        .eq(
            "id",
            organisationId
        )
        .eq(
            "created_by",
            onboardingState.user.id
        );

    if (error) {
        console.error(
            "Unable to remove incomplete organisation:",
            error
        );
    }
}
// ======================================================
// PART 4
// Finish onboarding and create complete workspace
// ======================================================

// ======================================================
// CREATE DEFAULT WORKSPACE DATA
// ======================================================

async function createDefaultWorkspaceData(
    organisationId
) {
    const userId =
        onboardingState.user.id;

    const departments = [
        {
            organisation_id:
                organisationId,
            name:
                "Administration",
            description:
                "Administrative department.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Operations",
            description:
                "Operational department.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Information Technology",
            description:
                "Technology and systems department.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Finance",
            description:
                "Finance and accounting department.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Human Resources",
            description:
                "Human resources department.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Procurement",
            description:
                "Procurement and supplier management.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Maintenance",
            description:
                "Asset maintenance department.",
            created_by:
                userId
        }
    ];

    const categories = [
        {
            organisation_id:
                organisationId,
            name:
                "Computers",
            description:
                "Desktop computers and workstations.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Laptops",
            description:
                "Portable computers and notebooks.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Servers",
            description:
                "Physical servers and server equipment.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Networking",
            description:
                "Routers, switches and networking equipment.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Furniture",
            description:
                "Office furniture and fixtures.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Vehicles",
            description:
                "Organisation vehicles and fleet assets.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Mobile Devices",
            description:
                "Mobile phones, tablets and handheld devices.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Printers",
            description:
                "Printers, scanners and multifunction devices.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Software Licences",
            description:
                "Software licences and digital subscriptions.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Office Equipment",
            description:
                "General office equipment and appliances.",
            created_by:
                userId
        }
    ];

    const locations = [
        {
            organisation_id:
                organisationId,
            name:
                "Head Office",
            description:
                "Primary organisation office.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Warehouse",
            description:
                "Main storage and warehouse facility.",
            created_by:
                userId
        },
        {
            organisation_id:
                organisationId,
            name:
                "Remote Site",
            description:
                "General remote operating location.",
            created_by:
                userId
        }
    ];

    const [
        departmentResult,
        categoryResult,
        locationResult
    ] = await Promise.all([
        onboardingSupabase
            .from("departments")
            .insert(departments),

        onboardingSupabase
            .from("asset_categories")
            .insert(categories),

        onboardingSupabase
            .from("locations")
            .insert(locations)
    ]);

    if (departmentResult.error) {
        throw new Error(
            `Departments could not be created. ${departmentResult.error.message}`
        );
    }

    if (categoryResult.error) {
        throw new Error(
            `Asset categories could not be created. ${categoryResult.error.message}`
        );
    }

    if (locationResult.error) {
        throw new Error(
            `Locations could not be created. ${locationResult.error.message}`
        );
    }
}

// ======================================================
// FINAL ONBOARDING SUBMISSION
// ======================================================

onboardingForm?.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();
        clearOnboardingMessage();

        if (
            onboardingState.currentStep !==
            onboardingState.totalSteps
        ) {
            return;
        }

        const validationError =
            validateCompleteOnboarding();

        if (validationError) {
            showOnboardingMessage(
                validationError,
                "error"
            );

            return;
        }

        if (!onboardingState.user?.id) {
            showOnboardingMessage(
                "Your login session could not be verified. Sign in again.",
                "error"
            );

            return;
        }

        setFinishButtonLoading(true);

        let organisationId = null;

        try {
            const existingMembership =
                await userAlreadyHasOrganisation();

            if (
                existingMembership
                    ?.organisation_id
            ) {
                showOnboardingMessage(
                    "Your workspace already exists. Redirecting to the dashboard...",
                    "success"
                );

                window.setTimeout(() => {
                    window.location.replace(
                        "dashboard.html"
                    );
                }, 700);

                return;
            }

            // ------------------------------------------
            // 1. Create organisation
            // ------------------------------------------

            const organisation =
                await createOrganisation();

            organisationId =
                organisation.id;

            // ------------------------------------------
            // 2. Create owner membership
            // ------------------------------------------

            await createOwnerMembership(
                organisationId
            );

            // ------------------------------------------
            // 3. Create default organisation data
            // ------------------------------------------

            await createDefaultWorkspaceData(
                organisationId
            );

            // ------------------------------------------
            // 4. Upload optional organisation logo
            // ------------------------------------------

            if (
                onboardingState
                    .selectedLogoFile
            ) {
                try {
                    const logoUrl =
                        await uploadOrganisationLogo(
                            organisationId
                        );

                    if (logoUrl) {
                        await saveOrganisationLogo(
                            organisationId,
                            logoUrl
                        );
                    }
                } catch (logoError) {
                    console.error(
                        "Logo upload failed:",
                        logoError
                    );

                    /*
                     * The workspace remains valid even
                     * when the optional logo fails.
                     */
                }
            }

            // ------------------------------------------
            // 5. Attempt profile update
            // ------------------------------------------

            try {
                await updateUserProfile(
                    organisationId
                );
            } catch (profileError) {
                console.warn(
                    "Profile update skipped:",
                    profileError
                );
            }

            // ------------------------------------------
            // 6. Success and redirect
            // ------------------------------------------

            showOnboardingMessage(
                "Your AssetsOS workspace has been created successfully. Redirecting to the dashboard...",
                "success"
            );

            if (
                onboardingState
                    .selectedLogoPreviewUrl
            ) {
                URL.revokeObjectURL(
                    onboardingState
                        .selectedLogoPreviewUrl
                );

                onboardingState
                    .selectedLogoPreviewUrl =
                    null;
            }

            window.setTimeout(() => {
                window.location.replace(
                    "dashboard.html"
                );
            }, 1200);

        } catch (error) {

    console.error("===== FULL ERROR =====");
    console.dir(error);
    console.log(error);
    console.log(JSON.stringify(error, null, 2));

    let message =
    error?.message ||
    error?.details ||
    error?.hint ||
    JSON.stringify(error);

            const lowerMessage =
                message.toLowerCase();

            if (
                lowerMessage.includes(
                    "row-level security"
                ) ||
                lowerMessage.includes(
                    "permission denied"
                )
            ) {
                message =
                    "Supabase security blocked the request. The organisation policies need to be checked.";
            }

            if (
                lowerMessage.includes(
                    "duplicate key"
                )
            ) {
                message =
                    "This workspace or membership may already exist.";
            }

            if (
                lowerMessage.includes(
                    "failed to fetch"
                ) ||
                lowerMessage.includes(
                    "network"
                )
            ) {
                message =
                    "AssetsOS could not connect to Supabase. Check your internet connection.";
            }

            showOnboardingMessage(
                `The workspace could not be created. ${message}`,
                "error"
            );

        } finally {
            setFinishButtonLoading(false);
        }
    }
);

// ======================================================
// AUTHENTICATION STATE CHANGES
// ======================================================

onboardingSupabase.auth.onAuthStateChange(
    (event, session) => {
        if (
            event === "SIGNED_OUT" ||
            !session
        ) {
            window.location.replace(
                "login.html"
            );
        }
    }
);

// ======================================================
// CLEAN UP LOGO PREVIEW
// ======================================================

window.addEventListener(
    "beforeunload",
    () => {
        if (
            onboardingState
                .selectedLogoPreviewUrl
        ) {
            URL.revokeObjectURL(
                onboardingState
                    .selectedLogoPreviewUrl
            );
        }
    }
);
