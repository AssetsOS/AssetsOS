// ======================================================
// AssetsOS Settings Module
// Part 1: Setup, authentication and page navigation
// ======================================================

const settingsSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ======================================================
// APPLICATION STATE
// ======================================================

const settingsState = {
    user: null,
    membership: null,
    organisation: null,

    activeSection: "organisation",

    categories: [],
    departments: [],
    locations: [],

    selectedLogoFile: null,
    selectedLogoPreviewUrl: null,

    originalOrganisationData: null
};

// ======================================================
// PAGE ELEMENTS
// ======================================================

const sidebar =
    document.getElementById("sidebar");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const logoutButton =
    document.getElementById("logoutButton");

const workspaceName =
    document.getElementById("workspaceName");

const profileInitials =
    document.getElementById("profileInitials");

const profileName =
    document.getElementById("profileName");

const profileRole =
    document.getElementById("profileRole");

const settingsSearch =
    document.getElementById("settingsSearch");

const settingsPageMessage =
    document.getElementById("settingsPageMessage");

// ======================================================
// SETTINGS NAVIGATION
// ======================================================

const settingsNavigationButtons =
    Array.from(
        document.querySelectorAll(
            "[data-settings-section]"
        )
    );

const settingsSectionPanels =
    Array.from(
        document.querySelectorAll(
            "[data-section-panel]"
        )
    );

const sidebarSettingsLinks =
    Array.from(
        document.querySelectorAll(
            "[data-settings-link]"
        )
    );

// ======================================================
// ORGANISATION FORM ELEMENTS
// ======================================================

const organisationSettingsForm =
    document.getElementById(
        "organisationSettingsForm"
    );

const organisationFormMessage =
    document.getElementById(
        "organisationFormMessage"
    );

const organisationName =
    document.getElementById(
        "organisationName"
    );

const organisationIndustry =
    document.getElementById(
        "organisationIndustry"
    );

const organisationRegistrationNumber =
    document.getElementById(
        "organisationRegistrationNumber"
    );

const organisationEmail =
    document.getElementById(
        "organisationEmail"
    );

const organisationPhone =
    document.getElementById(
        "organisationPhone"
    );

const organisationWebsite =
    document.getElementById(
        "organisationWebsite"
    );

const organisationTaxNumber =
    document.getElementById(
        "organisationTaxNumber"
    );

const organisationCountry =
    document.getElementById(
        "organisationCountry"
    );

const organisationCurrency =
    document.getElementById(
        "organisationCurrency"
    );

const organisationTimezone =
    document.getElementById(
        "organisationTimezone"
    );

const organisationAddress =
    document.getElementById(
        "organisationAddress"
    );

const organisationCity =
    document.getElementById(
        "organisationCity"
    );

const organisationProvince =
    document.getElementById(
        "organisationProvince"
    );

const organisationPostalCode =
    document.getElementById(
        "organisationPostalCode"
    );

const saveOrganisationButton =
    document.getElementById(
        "saveOrganisationButton"
    );

const resetOrganisationButton =
    document.getElementById(
        "resetOrganisationButton"
    );

// ======================================================
// ORGANISATION LOGO ELEMENTS
// ======================================================

const organisationLogoPreview =
    document.getElementById(
        "organisationLogoPreview"
    );

const organisationLogoInput =
    document.getElementById(
        "organisationLogoInput"
    );

const changeOrganisationLogoButton =
    document.getElementById(
        "changeOrganisationLogoButton"
    );

const removeOrganisationLogoButton =
    document.getElementById(
        "removeOrganisationLogoButton"
    );

// ======================================================
// CATEGORY ELEMENTS
// ======================================================

const categorySearch =
    document.getElementById(
        "categorySearch"
    );

const refreshCategoriesButton =
    document.getElementById(
        "refreshCategoriesButton"
    );

const categoriesLoading =
    document.getElementById(
        "categoriesLoading"
    );

const categoriesEmptyState =
    document.getElementById(
        "categoriesEmptyState"
    );

const categoriesTableWrapper =
    document.getElementById(
        "categoriesTableWrapper"
    );

const categoriesTableBody =
    document.getElementById(
        "categoriesTableBody"
    );

// ======================================================
// DEPARTMENT ELEMENTS
// ======================================================

const departmentSearch =
    document.getElementById(
        "departmentSearch"
    );

const refreshDepartmentsButton =
    document.getElementById(
        "refreshDepartmentsButton"
    );

const departmentsLoading =
    document.getElementById(
        "departmentsLoading"
    );

const departmentsEmptyState =
    document.getElementById(
        "departmentsEmptyState"
    );

const departmentsTableWrapper =
    document.getElementById(
        "departmentsTableWrapper"
    );

const departmentsTableBody =
    document.getElementById(
        "departmentsTableBody"
    );

// ======================================================
// LOCATION ELEMENTS
// ======================================================

const locationSearch =
    document.getElementById(
        "locationSearch"
    );

const refreshLocationsButton =
    document.getElementById(
        "refreshLocationsButton"
    );

const locationsLoading =
    document.getElementById(
        "locationsLoading"
    );

const locationsEmptyState =
    document.getElementById(
        "locationsEmptyState"
    );

const locationsTableWrapper =
    document.getElementById(
        "locationsTableWrapper"
    );

const locationsTableBody =
    document.getElementById(
        "locationsTableBody"
    );

// ======================================================
// REFERENCE MODAL ELEMENTS
// ======================================================

const referenceModal =
    document.getElementById(
        "referenceModal"
    );

const referenceModalEyebrow =
    document.getElementById(
        "referenceModalEyebrow"
    );

const referenceModalTitle =
    document.getElementById(
        "referenceModalTitle"
    );

const closeReferenceModalButton =
    document.getElementById(
        "closeReferenceModalButton"
    );

const referenceForm =
    document.getElementById(
        "referenceForm"
    );

const referenceRecordId =
    document.getElementById(
        "referenceRecordId"
    );

const referenceType =
    document.getElementById(
        "referenceType"
    );

const referenceName =
    document.getElementById(
        "referenceName"
    );

const referenceDescription =
    document.getElementById(
        "referenceDescription"
    );

const referenceFormMessage =
    document.getElementById(
        "referenceFormMessage"
    );

const cancelReferenceButton =
    document.getElementById(
        "cancelReferenceButton"
    );

const saveReferenceButton =
    document.getElementById(
        "saveReferenceButton"
    );

// ======================================================
// DELETE MODAL ELEMENTS
// ======================================================

const deleteReferenceModal =
    document.getElementById(
        "deleteReferenceModal"
    );

const deleteReferenceText =
    document.getElementById(
        "deleteReferenceText"
    );

const deleteReferenceId =
    document.getElementById(
        "deleteReferenceId"
    );

const deleteReferenceType =
    document.getElementById(
        "deleteReferenceType"
    );

const deleteReferenceMessage =
    document.getElementById(
        "deleteReferenceMessage"
    );

const cancelDeleteReferenceButton =
    document.getElementById(
        "cancelDeleteReferenceButton"
    );

const confirmDeleteReferenceButton =
    document.getElementById(
        "confirmDeleteReferenceButton"
    );

// ======================================================
// MESSAGE HELPERS
// ======================================================

function showMessage(
    element,
    message,
    type = "error"
) {
    if (!element) {
        return;
    }

    element.textContent = message;

    element.className =
        `${element.className
            .split(" ")
            .filter(
                (className) =>
                    ![
                        "show",
                        "success",
                        "warning",
                        "error"
                    ].includes(className)
            )
            .join(" ")} show ${type}`;
}

function clearMessage(element) {
    if (!element) {
        return;
    }

    element.textContent = "";

    element.classList.remove(
        "show",
        "success",
        "warning",
        "error"
    );
}

function showPageMessage(
    message,
    type = "error"
) {
    showMessage(
        settingsPageMessage,
        message,
        type
    );
}

// ======================================================
// TEXT HELPERS
// ======================================================

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function normaliseSearch(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-ZA",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(date);
}

function getInitials(value) {
    const words =
        String(value || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (!words.length) {
        return "AU";
    }

    return words
        .slice(0, 2)
        .map(
            (word) =>
                word.charAt(0).toUpperCase()
        )
        .join("");
}

// ======================================================
// MODAL HELPERS
// ======================================================

function openModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.remove("hidden");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}

function closeModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.add("hidden");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}

// ======================================================
// SECTION NAVIGATION
// ======================================================

function showSettingsSection(
    sectionName,
    updateHash = true
) {
    const validSections = [
        "organisation",
        "categories",
        "departments",
        "locations"
    ];

    const safeSection =
        validSections.includes(sectionName)
            ? sectionName
            : "organisation";

    settingsState.activeSection =
        safeSection;

    settingsNavigationButtons.forEach(
        (button) => {
            button.classList.toggle(
                "active",
                button.dataset
                    .settingsSection ===
                    safeSection
            );
        }
    );

    settingsSectionPanels.forEach(
        (panel) => {
            panel.classList.toggle(
                "active",
                panel.dataset
                    .sectionPanel ===
                    safeSection
            );
        }
    );

    if (updateHash) {
        const newUrl =
            safeSection === "organisation"
                ? "settings.html"
                : `settings.html#${safeSection}`;

        window.history.replaceState(
            null,
            "",
            newUrl
        );
    }

    clearMessage(
        settingsPageMessage
    );
}

settingsNavigationButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                showSettingsSection(
                    button.dataset
                        .settingsSection
                );
            }
        );
    }
);

sidebarSettingsLinks.forEach(
    (link) => {
        link.addEventListener(
            "click",
            (event) => {
                event.preventDefault();

                showSettingsSection(
                    link.dataset
                        .settingsLink
                );
            }
        );
    }
);

// ======================================================
// SIDEBAR
// ======================================================

mobileMenuButton?.addEventListener(
    "click",
    () => {
        const isOpen =
            sidebar?.classList.toggle(
                "open"
            );

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(Boolean(isOpen))
        );

        mobileMenuButton.innerHTML =
            isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
    }
);

// ======================================================
// PLACEHOLDER NAVIGATION
// ======================================================

document
    .querySelectorAll(
        '.sidebar-nav a[href="#"]'
    )
    .forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                event.preventDefault();

                showPageMessage(
                    "This AssetsOS module is still under development.",
                    "warning"
                );
            }
        );
    });

// ======================================================
// AUTHENTICATION
// ======================================================

async function loadAuthenticatedUser() {
    const {
        data: { session },
        error
    } = await settingsSupabase
        .auth
        .getSession();

    if (error) {
        console.error(
            "Unable to load session:",
            error
        );

        window.location.replace(
            "login.html"
        );

        return false;
    }

    if (!session?.user) {
        window.location.replace(
            "login.html"
        );

        return false;
    }

    settingsState.user =
        session.user;

    const fullName =
        session.user
            .user_metadata
            ?.full_name ||
        session.user.email ||
        "Authenticated User";

    if (profileName) {
        profileName.textContent =
            fullName;
    }

    if (profileInitials) {
        profileInitials.textContent =
            getInitials(fullName);
    }

    return true;
}

// ======================================================
// LOAD MEMBERSHIP AND ORGANISATION
// ======================================================

async function loadOrganisationContext() {
    const userId =
        settingsState.user?.id;

    if (!userId) {
        return false;
    }

    const {
        data: membership,
        error: membershipError
    } = await settingsSupabase
        .from("organisation_members")
        .select(
            `
                id,
                organisation_id,
                role,
                status
            `
        )
        .eq(
            "user_id",
            userId
        )
        .eq(
            "status",
            "active"
        )
        .limit(1)
        .maybeSingle();

    if (membershipError) {
        throw membershipError;
    }

    if (!membership?.organisation_id) {
        window.location.replace(
            "onboarding.html"
        );

        return false;
    }

    settingsState.membership =
        membership;

    const {
        data: organisation,
        error: organisationError
    } = await settingsSupabase
        .from("organisations")
        .select("*")
        .eq(
            "id",
            membership.organisation_id
        )
        .single();

    if (organisationError) {
        throw organisationError;
    }

    settingsState.organisation =
        organisation;

    if (workspaceName) {
        workspaceName.textContent =
            organisation.name ||
            "AssetsOS Organisation";
    }

    if (profileRole) {
        profileRole.textContent =
            String(
                membership.role ||
                "member"
            )
                .replaceAll("_", " ")
                .replace(
                    /\b\w/g,
                    (letter) =>
                        letter.toUpperCase()
                );
    }

    return true;
}

// ======================================================
// SIGN OUT
// ======================================================

logoutButton?.addEventListener(
    "click",
    async () => {
        logoutButton.disabled =
            true;

        logoutButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Signing Out...</span>
        `;

        const {
            error
        } = await settingsSupabase
            .auth
            .signOut();

        if (error) {
            console.error(
                "Sign-out failed:",
                error
            );

            showPageMessage(
                "Sign out failed. Please try again.",
                "error"
            );

            logoutButton.disabled =
                false;

            logoutButton.innerHTML = `
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sign Out</span>
            `;

            return;
        }

        window.location.replace(
            "login.html"
        );
    }
);

// ======================================================
// AUTHENTICATION STATE CHANGES
// ======================================================

settingsSupabase.auth.onAuthStateChange(
    (_event, session) => {
        if (!session) {
            window.location.replace(
                "login.html"
            );
        }
    }
);

// ======================================================
// INITIAL SECTION
// ======================================================

function loadInitialSection() {
    const hash =
        window.location.hash
            .replace("#", "")
            .trim();

    showSettingsSection(
        hash || "organisation",
        false
    );
}
// ======================================================
// PART 2
// Organisation settings and logo management
// ======================================================

// ======================================================
// COUNTRY DEFAULTS
// ======================================================

const organisationCountryDefaults = {
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

organisationCountry?.addEventListener(
    "change",
    () => {
        const defaults =
            organisationCountryDefaults[
                organisationCountry.value
            ];

        if (!defaults) {
            return;
        }

        if (organisationCurrency) {
            organisationCurrency.value =
                defaults.currency;
        }

        if (organisationTimezone) {
            organisationTimezone.value =
                defaults.timezone;
        }

        clearMessage(
            organisationFormMessage
        );
    }
);

// ======================================================
// ORGANISATION PERMISSIONS
// ======================================================

function canManageOrganisation() {
    return [
        "owner",
        "admin"
    ].includes(
        settingsState.membership?.role
    );
}

function updateOrganisationPermissions() {
    const allowed =
        canManageOrganisation();

    const formFields = [
        organisationName,
        organisationIndustry,
        organisationRegistrationNumber,
        organisationEmail,
        organisationPhone,
        organisationWebsite,
        organisationTaxNumber,
        organisationCountry,
        organisationCurrency,
        organisationTimezone,
        organisationAddress,
        organisationCity,
        organisationProvince,
        organisationPostalCode
    ];

    formFields.forEach(
        (field) => {
            if (field) {
                field.disabled =
                    !allowed;
            }
        }
    );

    if (saveOrganisationButton) {
        saveOrganisationButton.disabled =
            !allowed;
    }

    if (resetOrganisationButton) {
        resetOrganisationButton.disabled =
            !allowed;
    }

    if (
        changeOrganisationLogoButton
    ) {
        changeOrganisationLogoButton.disabled =
            !allowed;
    }

    if (
        removeOrganisationLogoButton
    ) {
        removeOrganisationLogoButton.disabled =
            !allowed;
    }

    if (!allowed) {
        showMessage(
            organisationFormMessage,
            "Only organisation owners and administrators can update these settings.",
            "warning"
        );
    }
}

// ======================================================
// ORGANISATION FORM HELPERS
// ======================================================

function setOrganisationField(
    field,
    value
) {
    if (!field) {
        return;
    }

    field.value =
        value ?? "";
}

function getOrganisationFormData() {
    return {
        name:
            organisationName
                ?.value
                .trim() || "",

        industry:
            organisationIndustry
                ?.value || null,

        registration_number:
            organisationRegistrationNumber
                ?.value
                .trim() || null,

        email:
            organisationEmail
                ?.value
                .trim()
                .toLowerCase() || null,

        phone:
            organisationPhone
                ?.value
                .trim() || null,

        website:
            organisationWebsite
                ?.value
                .trim() || null,

        tax_number:
            organisationTaxNumber
                ?.value
                .trim() || null,

        country:
            organisationCountry
                ?.value || null,

        currency:
            organisationCurrency
                ?.value || "ZAR",

        timezone:
            organisationTimezone
                ?.value ||
            "Africa/Johannesburg",

        address:
            organisationAddress
                ?.value
                .trim() || null,

        city:
            organisationCity
                ?.value
                .trim() || null,

        province:
            organisationProvince
                ?.value
                .trim() || null,

        postal_code:
            organisationPostalCode
                ?.value
                .trim() || null
    };
}

function validateOrganisationData(
    organisationData
) {
    if (!organisationData.name) {
        return "Enter the organisation name.";
    }

    if (
        organisationData.name.length < 2
    ) {
        return "The organisation name must contain at least 2 characters.";
    }

    if (!organisationData.industry) {
        return "Select the organisation industry.";
    }

    if (!organisationData.country) {
        return "Select the organisation country.";
    }

    if (!organisationData.currency) {
        return "Select the organisation currency.";
    }

    if (!organisationData.timezone) {
        return "Select the organisation time zone.";
    }

    if (
        organisationData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            organisationData.email
        )
    ) {
        return "Enter a valid organisation email address.";
    }

    if (
        organisationData.website
    ) {
        try {
            new URL(
                organisationData.website
            );
        } catch {
            return "Enter a complete website address beginning with https://";
        }
    }

    return null;
}

// ======================================================
// LOAD ORGANISATION FORM
// ======================================================

function populateOrganisationForm() {
    const organisation =
        settingsState.organisation;

    if (!organisation) {
        return;
    }

    setOrganisationField(
        organisationName,
        organisation.name
    );

    setOrganisationField(
        organisationIndustry,
        organisation.industry
    );

    setOrganisationField(
        organisationRegistrationNumber,
        organisation.registration_number
    );

    setOrganisationField(
        organisationEmail,
        organisation.email
    );

    setOrganisationField(
        organisationPhone,
        organisation.phone
    );

    setOrganisationField(
        organisationWebsite,
        organisation.website
    );

    setOrganisationField(
        organisationTaxNumber,
        organisation.tax_number
    );

    setOrganisationField(
        organisationCountry,
        organisation.country
    );

    setOrganisationField(
        organisationCurrency,
        organisation.currency || "ZAR"
    );

    setOrganisationField(
        organisationTimezone,
        organisation.timezone ||
        "Africa/Johannesburg"
    );

    setOrganisationField(
        organisationAddress,
        organisation.address
    );

    setOrganisationField(
        organisationCity,
        organisation.city
    );

    setOrganisationField(
        organisationProvince,
        organisation.province
    );

    setOrganisationField(
        organisationPostalCode,
        organisation.postal_code
    );

    settingsState.originalOrganisationData = {
        ...organisation
    };

    renderOrganisationLogo(
        organisation.logo_url
    );

    updateOrganisationPermissions();
}

// ======================================================
// ORGANISATION LOGO DISPLAY
// ======================================================

function renderOrganisationLogo(
    logoUrl
) {
    if (!organisationLogoPreview) {
        return;
    }

    if (logoUrl) {
        organisationLogoPreview.innerHTML = `
            <img
                src="${escapeHtml(logoUrl)}"
                alt="Organisation logo"
            >
        `;

        removeOrganisationLogoButton
            ?.classList
            .remove("hidden");

        return;
    }

    organisationLogoPreview.innerHTML =
        '<i class="fa-regular fa-building"></i>';

    removeOrganisationLogoButton
        ?.classList
        .add("hidden");
}

// ======================================================
// RESET ORGANISATION FORM
// ======================================================

function resetOrganisationForm() {
    if (
        settingsState
            .selectedLogoPreviewUrl
    ) {
        URL.revokeObjectURL(
            settingsState
                .selectedLogoPreviewUrl
        );
    }

    settingsState.selectedLogoFile =
        null;

    settingsState.selectedLogoPreviewUrl =
        null;

    if (organisationLogoInput) {
        organisationLogoInput.value =
            "";
    }

    if (
        settingsState
            .originalOrganisationData
    ) {
        settingsState.organisation = {
            ...settingsState
                .originalOrganisationData
        };
    }

    clearMessage(
        organisationFormMessage
    );

    populateOrganisationForm();
}

resetOrganisationButton?.addEventListener(
    "click",
    resetOrganisationForm
);

// ======================================================
// LOGO FILE SELECTION
// ======================================================

changeOrganisationLogoButton
    ?.addEventListener(
        "click",
        () => {
            organisationLogoInput
                ?.click();
        }
    );

organisationLogoInput?.addEventListener(
    "change",
    () => {
        clearMessage(
            organisationFormMessage
        );

        const file =
            organisationLogoInput
                .files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            organisationLogoInput.value =
                "";

            showMessage(
                organisationFormMessage,
                "Upload a PNG, JPG or WEBP image.",
                "error"
            );

            return;
        }

        const maximumSize =
            2 * 1024 * 1024;

        if (file.size > maximumSize) {
            organisationLogoInput.value =
                "";

            showMessage(
                organisationFormMessage,
                "The organisation logo must be smaller than 2 MB.",
                "error"
            );

            return;
        }

        if (
            settingsState
                .selectedLogoPreviewUrl
        ) {
            URL.revokeObjectURL(
                settingsState
                    .selectedLogoPreviewUrl
            );
        }

        const previewUrl =
            URL.createObjectURL(file);

        settingsState.selectedLogoFile =
            file;

        settingsState.selectedLogoPreviewUrl =
            previewUrl;

        renderOrganisationLogo(
            previewUrl
        );
    }
);

// ======================================================
// LOGO UPLOAD HELPERS
// ======================================================

function getLogoExtension(file) {
    const extension =
        String(file?.name || "")
            .split(".")
            .pop()
            ?.toLowerCase();

    if (
        [
            "png",
            "jpg",
            "jpeg",
            "webp"
        ].includes(extension)
    ) {
        return extension;
    }

    const mimeExtensions = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp"
    };

    return (
        mimeExtensions[file?.type] ||
        "png"
    );
}

async function uploadOrganisationLogo() {
    const file =
        settingsState.selectedLogoFile;

    const organisationId =
        settingsState.organisation?.id;

    if (!file || !organisationId) {
        return (
            settingsState.organisation
                ?.logo_url ||
            null
        );
    }

    const extension =
        getLogoExtension(file);

    const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath =
        `${organisationId}/${fileName}`;

    const {
        error: uploadError
    } = await settingsSupabase
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
        throw uploadError;
    }

    const {
        data: publicUrlData
    } = settingsSupabase
        .storage
        .from("organisation-logos")
        .getPublicUrl(filePath);

    return (
        publicUrlData?.publicUrl ||
        null
    );
}

// ======================================================
// REMOVE ORGANISATION LOGO
// ======================================================

removeOrganisationLogoButton
    ?.addEventListener(
        "click",
        async () => {
            if (
                !canManageOrganisation()
            ) {
                return;
            }

            clearMessage(
                organisationFormMessage
            );

            removeOrganisationLogoButton.disabled =
                true;

            try {
                const {
                    error
                } = await settingsSupabase
                    .from("organisations")
                    .update({
                        logo_url: null,
                        updated_at:
                            new Date()
                                .toISOString()
                    })
                    .eq(
                        "id",
                        settingsState
                            .organisation.id
                    );

                if (error) {
                    throw error;
                }

                settingsState
                    .organisation
                    .logo_url =
                    null;

                settingsState
                    .originalOrganisationData
                    .logo_url =
                    null;

                settingsState.selectedLogoFile =
                    null;

                if (
                    settingsState
                        .selectedLogoPreviewUrl
                ) {
                    URL.revokeObjectURL(
                        settingsState
                            .selectedLogoPreviewUrl
                    );
                }

                settingsState.selectedLogoPreviewUrl =
                    null;

                if (organisationLogoInput) {
                    organisationLogoInput.value =
                        "";
                }

                renderOrganisationLogo(null);

                showMessage(
                    organisationFormMessage,
                    "Organisation logo removed successfully.",
                    "success"
                );

            } catch (error) {
                console.error(
                    "Logo removal failed:",
                    error
                );

                showMessage(
                    organisationFormMessage,
                    `The logo could not be removed. ${
                        error?.message ||
                        String(error)
                    }`,
                    "error"
                );

            } finally {
                removeOrganisationLogoButton.disabled =
                    false;
            }
        }
    );

// ======================================================
// SAVE ORGANISATION SETTINGS
// ======================================================

organisationSettingsForm?.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        clearMessage(
            organisationFormMessage
        );

        if (
            !canManageOrganisation()
        ) {
            showMessage(
                organisationFormMessage,
                "Your account cannot update organisation settings.",
                "error"
            );

            return;
        }

        const organisationData =
            getOrganisationFormData();

        const validationError =
            validateOrganisationData(
                organisationData
            );

        if (validationError) {
            showMessage(
                organisationFormMessage,
                validationError,
                "error"
            );

            return;
        }

        saveOrganisationButton.disabled =
            true;

        saveOrganisationButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Saving Organisation...
        `;

        try {
            let logoUrl =
                settingsState.organisation
                    ?.logo_url ||
                null;

            if (
                settingsState
                    .selectedLogoFile
            ) {
                logoUrl =
                    await uploadOrganisationLogo();
            }

            const updatePayload = {
                ...organisationData,

                logo_url:
                    logoUrl,

                updated_at:
                    new Date()
                        .toISOString()
            };

            const {
                data: updatedOrganisation,
                error
            } = await settingsSupabase
                .from("organisations")
                .update(updatePayload)
                .eq(
                    "id",
                    settingsState
                        .organisation.id
                )
                .select()
                .single();

            if (error) {
                throw error;
            }

            settingsState.organisation =
                updatedOrganisation;

            settingsState.originalOrganisationData = {
                ...updatedOrganisation
            };

            settingsState.selectedLogoFile =
                null;

            if (
                settingsState
                    .selectedLogoPreviewUrl
            ) {
                URL.revokeObjectURL(
                    settingsState
                        .selectedLogoPreviewUrl
                );
            }

            settingsState.selectedLogoPreviewUrl =
                null;

            if (organisationLogoInput) {
                organisationLogoInput.value =
                    "";
            }

            if (workspaceName) {
                workspaceName.textContent =
                    updatedOrganisation.name;
            }

            renderOrganisationLogo(
                updatedOrganisation
                    .logo_url
            );

            showMessage(
                organisationFormMessage,
                "Organisation settings saved successfully.",
                "success"
            );

        } catch (error) {
            console.error(
                "Organisation update failed:",
                error
            );

            showMessage(
                organisationFormMessage,
                `The organisation could not be updated. ${
                    error?.message ||
                    error?.details ||
                    String(error)
                }`,
                "error"
            );

        } finally {
            saveOrganisationButton.disabled =
                false;

            saveOrganisationButton.innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                Save Organisation
            `;
        }
    }
);

// ======================================================
// CLEAR ORGANISATION FORM ERRORS
// ======================================================

[
    organisationName,
    organisationIndustry,
    organisationRegistrationNumber,
    organisationEmail,
    organisationPhone,
    organisationWebsite,
    organisationTaxNumber,
    organisationCountry,
    organisationCurrency,
    organisationTimezone,
    organisationAddress,
    organisationCity,
    organisationProvince,
    organisationPostalCode
].forEach(
    (field) => {
        field?.addEventListener(
            "input",
            () => {
                clearMessage(
                    organisationFormMessage
                );
            }
        );

        field?.addEventListener(
            "change",
            () => {
                clearMessage(
                    organisationFormMessage
                );
            }
        );
    }
);
// ======================================================
// PART 3
// Load, search and render reference data
// ======================================================

// ======================================================
// REFERENCE CONFIGURATION
// ======================================================

const referenceConfiguration = {
    categories: {
        table: "asset_categories",
        stateKey: "categories",
        searchInput: categorySearch,
        loadingElement: categoriesLoading,
        emptyStateElement: categoriesEmptyState,
        tableWrapperElement: categoriesTableWrapper,
        tableBodyElement: categoriesTableBody,
        iconClass: "fa-layer-group",
        singularLabel: "Category",
        pluralLabel: "Categories"
    },

    departments: {
        table: "departments",
        stateKey: "departments",
        searchInput: departmentSearch,
        loadingElement: departmentsLoading,
        emptyStateElement: departmentsEmptyState,
        tableWrapperElement: departmentsTableWrapper,
        tableBodyElement: departmentsTableBody,
        iconClass: "fa-sitemap",
        singularLabel: "Department",
        pluralLabel: "Departments"
    },

    locations: {
        table: "locations",
        stateKey: "locations",
        searchInput: locationSearch,
        loadingElement: locationsLoading,
        emptyStateElement: locationsEmptyState,
        tableWrapperElement: locationsTableWrapper,
        tableBodyElement: locationsTableBody,
        iconClass: "fa-location-dot",
        singularLabel: "Location",
        pluralLabel: "Locations"
    }
};

// ======================================================
// REFERENCE PERMISSIONS
// ======================================================

function canManageReferenceData() {
    return [
        "owner",
        "admin",
        "asset_manager"
    ].includes(
        settingsState.membership?.role
    );
}

// ======================================================
// LOAD REFERENCE RECORDS
// ======================================================

async function loadReferenceData(
    referenceType
) {
    const configuration =
        referenceConfiguration[
            referenceType
        ];

    const organisationId =
        settingsState.organisation?.id;

    if (
        !configuration ||
        !organisationId
    ) {
        return;
    }

    configuration.loadingElement
        ?.classList
        .remove("hidden");

    configuration.emptyStateElement
        ?.classList
        .add("hidden");

    configuration.tableWrapperElement
        ?.classList
        .add("hidden");

    const {
        data,
        error
    } = await settingsSupabase
        .from(configuration.table)
        .select(`
            id,
            name,
            description,
            created_at
        `)
        .eq(
            "organisation_id",
            organisationId
        )
        .order(
            "name",
            {
                ascending: true
            }
        );

    configuration.loadingElement
        ?.classList
        .add("hidden");

    if (error) {
        console.error(
            `Unable to load ${configuration.table}:`,
            error
        );

        showPageMessage(
            `${configuration.pluralLabel} could not be loaded. ${error.message}`,
            "error"
        );

        return;
    }

    settingsState[
        configuration.stateKey
    ] = data || [];

    renderReferenceData(
        referenceType
    );
}

// ======================================================
// COUNT ASSETS FOR REFERENCE RECORDS
// ======================================================

async function loadReferenceAssetCounts(
    referenceType
) {
    const configuration =
        referenceConfiguration[
            referenceType
        ];

    const organisationId =
        settingsState.organisation?.id;

    if (
        !configuration ||
        !organisationId
    ) {
        return {};
    }

    const foreignKeyMap = {
        categories: "category_id",
        departments: "department_id",
        locations: "location_id"
    };

    const foreignKey =
        foreignKeyMap[
            referenceType
        ];

    const {
        data,
        error
    } = await settingsSupabase
        .from("assets")
        .select(foreignKey)
        .eq(
            "organisation_id",
            organisationId
        )
        .not(
            foreignKey,
            "is",
            null
        );

    if (error) {
        console.warn(
            `Unable to count assets for ${referenceType}:`,
            error
        );

        return {};
    }

    return (data || []).reduce(
        (counts, asset) => {
            const referenceId =
                asset[foreignKey];

            if (!referenceId) {
                return counts;
            }

            counts[referenceId] =
                (counts[referenceId] || 0) + 1;

            return counts;
        },
        {}
    );
}

// ======================================================
// FILTER REFERENCE RECORDS
// ======================================================

function getFilteredReferenceRecords(
    referenceType
) {
    const configuration =
        referenceConfiguration[
            referenceType
        ];

    if (!configuration) {
        return [];
    }

    const records =
        settingsState[
            configuration.stateKey
        ] || [];

    const searchValue =
        normaliseSearch(
            configuration
                .searchInput
                ?.value
        );

    if (!searchValue) {
        return records;
    }

    return records.filter(
        (record) => {
            const searchableText = [
                record.name,
                record.description
            ]
                .map(normaliseSearch)
                .join(" ");

            return searchableText.includes(
                searchValue
            );
        }
    );
}

// ======================================================
// RENDER REFERENCE DATA
// ======================================================

async function renderReferenceData(
    referenceType
) {
    const configuration =
        referenceConfiguration[
            referenceType
        ];

    if (!configuration) {
        return;
    }

    const records =
        getFilteredReferenceRecords(
            referenceType
        );

    const assetCounts =
        await loadReferenceAssetCounts(
            referenceType
        );

    const tableBody =
        configuration.tableBodyElement;

    if (tableBody) {
        tableBody.innerHTML = "";
    }

    if (!records.length) {
        configuration.tableWrapperElement
            ?.classList
            .add("hidden");

        configuration.emptyStateElement
            ?.classList
            .remove("hidden");

        return;
    }

    configuration.emptyStateElement
        ?.classList
        .add("hidden");

    configuration.tableWrapperElement
        ?.classList
        .remove("hidden");

    records.forEach(
        (record) => {
            const row =
                document.createElement(
                    "tr"
                );

            const assetCount =
                assetCounts[
                    record.id
                ] || 0;

            row.innerHTML = `
                <td>
                    <div class="reference-name-cell">

                        <div class="reference-record-icon">
                            <i class="fa-solid ${configuration.iconClass}"></i>
                        </div>

                        <strong>
                            ${escapeHtml(record.name)}
                        </strong>

                    </div>
                </td>

                <td>
                    <div class="reference-description">
                        ${escapeHtml(
                            record.description ||
                            "No description"
                        )}
                    </div>
                </td>

                <td>
                    <span class="reference-count-badge">
                        ${assetCount}
                    </span>
                </td>

                <td>
                    ${escapeHtml(
                        formatDate(
                            record.created_at
                        )
                    )}
                </td>

                <td>
                    <div class="reference-actions">

                        <button
                            type="button"
                            class="reference-action-button edit"
                            data-reference-action="edit"
                            data-reference-type="${referenceType}"
                            data-reference-id="${record.id}"
                            aria-label="Edit ${escapeHtml(
                                record.name
                            )}"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button
                            type="button"
                            class="reference-action-button delete"
                            data-reference-action="delete"
                            data-reference-type="${referenceType}"
                            data-reference-id="${record.id}"
                            data-reference-count="${assetCount}"
                            aria-label="Delete ${escapeHtml(
                                record.name
                            )}"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>
                </td>
            `;

            if (!canManageReferenceData()) {
                row
                    .querySelectorAll(
                        ".reference-action-button"
                    )
                    .forEach(
                        (button) => {
                            button.disabled =
                                true;

                            button.title =
                                "Your role cannot modify this record.";
                        }
                    );
            }

            tableBody?.appendChild(
                row
            );
        }
    );
}

// ======================================================
// LOAD ALL REFERENCE DATA
// ======================================================

async function loadAllReferenceData() {
    await Promise.all([
        loadReferenceData(
            "categories"
        ),

        loadReferenceData(
            "departments"
        ),

        loadReferenceData(
            "locations"
        )
    ]);
}

// ======================================================
// SEARCH EVENTS
// ======================================================

categorySearch?.addEventListener(
    "input",
    () => {
        renderReferenceData(
            "categories"
        );
    }
);

departmentSearch?.addEventListener(
    "input",
    () => {
        renderReferenceData(
            "departments"
        );
    }
);

locationSearch?.addEventListener(
    "input",
    () => {
        renderReferenceData(
            "locations"
        );
    }
);

// ======================================================
// REFRESH BUTTON HELPER
// ======================================================

async function refreshReferenceData(
    referenceType,
    button
) {
    if (!button) {
        return;
    }

    const originalHtml =
        button.innerHTML;

    button.disabled =
        true;

    button.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Refreshing...
    `;

    clearMessage(
        settingsPageMessage
    );

    try {
        await loadReferenceData(
            referenceType
        );

        showPageMessage(
            `${referenceConfiguration[
                referenceType
            ].pluralLabel} refreshed successfully.`,
            "success"
        );

    } catch (error) {
        console.error(
            `Refresh failed for ${referenceType}:`,
            error
        );

        showPageMessage(
            `The records could not be refreshed. ${
                error?.message ||
                String(error)
            }`,
            "error"
        );

    } finally {
        button.disabled =
            false;

        button.innerHTML =
            originalHtml;
    }
}

refreshCategoriesButton
    ?.addEventListener(
        "click",
        () => {
            refreshReferenceData(
                "categories",
                refreshCategoriesButton
            );
        }
    );

refreshDepartmentsButton
    ?.addEventListener(
        "click",
        () => {
            refreshReferenceData(
                "departments",
                refreshDepartmentsButton
            );
        }
    );

refreshLocationsButton
    ?.addEventListener(
        "click",
        () => {
            refreshReferenceData(
                "locations",
                refreshLocationsButton
            );
        }
    );

// ======================================================
// GLOBAL SETTINGS SEARCH
// ======================================================

settingsSearch?.addEventListener(
    "input",
    () => {
        const searchValue =
            normaliseSearch(
                settingsSearch.value
            );

        if (!searchValue) {
            return;
        }

        const matchingSection =
            [
                {
                    name:
                        "organisation",
                    keywords:
                        "organisation company profile logo country currency timezone address"
                },

                {
                    name:
                        "categories",
                    keywords:
                        "category categories classification asset"
                },

                {
                    name:
                        "departments",
                    keywords:
                        "department departments organisational structure"
                },

                {
                    name:
                        "locations",
                    keywords:
                        "location locations office warehouse site"
                }
            ].find(
                (section) =>
                    section.keywords.includes(
                        searchValue
                    )
            );

        if (
            matchingSection &&
            matchingSection.name !==
                settingsState.activeSection
        ) {
            showSettingsSection(
                matchingSection.name
            );
        }
    }
);
// ======================================================
// PART 4
// Add, edit and delete reference data
// ======================================================

// ======================================================
// OPEN REFERENCE MODAL BUTTONS
// ======================================================

const openReferenceModalButtons =
    Array.from(
        document.querySelectorAll(
            "[data-open-reference-modal]"
        )
    );

openReferenceModalButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                const type =
                    button.dataset
                        .openReferenceModal;

                openReferenceEditor(
                    type
                );
            }
        );
    }
);

// ======================================================
// REFERENCE LABEL HELPERS
// ======================================================

function getReferenceConfiguration(
    type
) {
    return (
        referenceConfiguration[
            type
        ] || null
    );
}

function getReferenceRecord(
    type,
    recordId
) {
    const configuration =
        getReferenceConfiguration(
            type
        );

    if (!configuration) {
        return null;
    }

    return (
        settingsState[
            configuration.stateKey
        ] || []
    ).find(
        (record) =>
            record.id === recordId
    ) || null;
}

// ======================================================
// OPEN ADD / EDIT MODAL
// ======================================================

function openReferenceEditor(
    type,
    recordId = ""
) {
    clearMessage(
        referenceFormMessage
    );

    const configuration =
        getReferenceConfiguration(
            type
        );

    if (!configuration) {
        showPageMessage(
            "The selected settings section is invalid.",
            "error"
        );

        return;
    }

    if (!canManageReferenceData()) {
        showPageMessage(
            "Your account does not have permission to manage this data.",
            "error"
        );

        return;
    }

    referenceForm?.reset();

    if (referenceRecordId) {
        referenceRecordId.value =
            recordId;
    }

    if (referenceType) {
        referenceType.value =
            type;
    }

    const editing =
        Boolean(recordId);

    if (referenceModalEyebrow) {
        referenceModalEyebrow.textContent =
            configuration.singularLabel;
    }

    if (referenceModalTitle) {
        referenceModalTitle.textContent =
            editing
                ? `Edit ${configuration.singularLabel}`
                : `Add ${configuration.singularLabel}`;
    }

    if (saveReferenceButton) {
        saveReferenceButton.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            ${
                editing
                    ? `Update ${configuration.singularLabel}`
                    : `Save ${configuration.singularLabel}`
            }
        `;
    }

    if (editing) {
        const record =
            getReferenceRecord(
                type,
                recordId
            );

        if (!record) {
            showPageMessage(
                "The selected record could not be found.",
                "error"
            );

            return;
        }

        if (referenceName) {
            referenceName.value =
                record.name || "";
        }

        if (referenceDescription) {
            referenceDescription.value =
                record.description || "";
        }
    }

    openModal(
        referenceModal
    );

    window.setTimeout(
        () => {
            referenceName?.focus();
        },
        80
    );
}

// ======================================================
// CLOSE REFERENCE MODAL
// ======================================================

function closeReferenceEditor() {
    closeModal(
        referenceModal
    );

    referenceForm?.reset();

    if (referenceRecordId) {
        referenceRecordId.value =
            "";
    }

    if (referenceType) {
        referenceType.value =
            "";
    }

    clearMessage(
        referenceFormMessage
    );
}

closeReferenceModalButton
    ?.addEventListener(
        "click",
        closeReferenceEditor
    );

cancelReferenceButton
    ?.addEventListener(
        "click",
        closeReferenceEditor
    );

referenceModal?.addEventListener(
    "click",
    (event) => {
        if (
            event.target ===
            referenceModal
        ) {
            closeReferenceEditor();
        }
    }
);

// ======================================================
// VALIDATE REFERENCE FORM
// ======================================================

function validateReferenceForm() {
    const type =
        referenceType?.value || "";

    const configuration =
        getReferenceConfiguration(
            type
        );

    const name =
        referenceName
            ?.value
            .trim() || "";

    if (!configuration) {
        return "The selected record type is invalid.";
    }

    if (!name) {
        return `Enter the ${configuration.singularLabel.toLowerCase()} name.`;
    }

    if (name.length < 2) {
        return "The name must contain at least 2 characters.";
    }

    return null;
}

// ======================================================
// CHECK DUPLICATE NAME
// ======================================================

function hasDuplicateReferenceName(
    type,
    name,
    excludedRecordId = ""
) {
    const configuration =
        getReferenceConfiguration(
            type
        );

    if (!configuration) {
        return false;
    }

    const normalisedName =
        normaliseSearch(name);

    return (
        settingsState[
            configuration.stateKey
        ] || []
    ).some(
        (record) =>
            record.id !==
                excludedRecordId &&
            normaliseSearch(
                record.name
            ) === normalisedName
    );
}

// ======================================================
// SAVE REFERENCE RECORD
// ======================================================

referenceForm?.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        clearMessage(
            referenceFormMessage
        );

        if (!canManageReferenceData()) {
            showMessage(
                referenceFormMessage,
                "Your account cannot modify this data.",
                "error"
            );

            return;
        }

        const validationError =
            validateReferenceForm();

        if (validationError) {
            showMessage(
                referenceFormMessage,
                validationError,
                "error"
            );

            return;
        }

        const type =
            referenceType.value;

        const configuration =
            getReferenceConfiguration(
                type
            );

        const recordId =
            referenceRecordId
                ?.value || "";

        const editing =
            Boolean(recordId);

        const name =
            referenceName.value.trim();

        const description =
            referenceDescription
                ?.value
                .trim() || null;

        if (
            hasDuplicateReferenceName(
                type,
                name,
                recordId
            )
        ) {
            showMessage(
                referenceFormMessage,
                `A ${configuration.singularLabel.toLowerCase()} with this name already exists.`,
                "error"
            );

            return;
        }

        const originalHtml =
            saveReferenceButton.innerHTML;

        saveReferenceButton.disabled =
            true;

        saveReferenceButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${
                editing
                    ? "Updating..."
                    : "Saving..."
            }
        `;

        try {
            const payload = {
                organisation_id:
                    settingsState
                        .organisation.id,

                name,

                description,

                updated_at:
                    new Date()
                        .toISOString()
            };

            let savedRecord;

            if (editing) {
                const {
                    data,
                    error
                } = await settingsSupabase
                    .from(
                        configuration.table
                    )
                    .update(payload)
                    .eq(
                        "id",
                        recordId
                    )
                    .eq(
                        "organisation_id",
                        settingsState
                            .organisation.id
                    )
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                savedRecord =
                    data;

            } else {
                payload.created_by =
                    settingsState.user.id;

                const {
                    data,
                    error
                } = await settingsSupabase
                    .from(
                        configuration.table
                    )
                    .insert(payload)
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                savedRecord =
                    data;
            }

            const currentRecords =
                settingsState[
                    configuration.stateKey
                ] || [];

            if (editing) {
                settingsState[
                    configuration.stateKey
                ] =
                    currentRecords.map(
                        (record) =>
                            record.id ===
                            savedRecord.id
                                ? savedRecord
                                : record
                    );
            } else {
                settingsState[
                    configuration.stateKey
                ] = [
                    ...currentRecords,
                    savedRecord
                ];
            }

            settingsState[
                configuration.stateKey
            ].sort(
                (firstRecord, secondRecord) =>
                    firstRecord.name
                        .localeCompare(
                            secondRecord.name
                        )
            );

            await renderReferenceData(
                type
            );

            showMessage(
                referenceFormMessage,
                editing
                    ? `${configuration.singularLabel} updated successfully.`
                    : `${configuration.singularLabel} added successfully.`,
                "success"
            );

            window.setTimeout(
                () => {
                    closeReferenceEditor();

                    showPageMessage(
                        editing
                            ? `${configuration.singularLabel} updated successfully.`
                            : `${configuration.singularLabel} added successfully.`,
                        "success"
                    );
                },
                600
            );

        } catch (error) {
            console.error(
                "Reference record save failed:",
                error
            );

            let message =
                error?.message ||
                error?.details ||
                String(error);

            const lowerMessage =
                message.toLowerCase();

            if (
                lowerMessage.includes(
                    "duplicate key"
                )
            ) {
                message =
                    `A ${configuration.singularLabel.toLowerCase()} with this name already exists.`;
            }

            if (
                lowerMessage.includes(
                    "row-level security"
                ) ||
                lowerMessage.includes(
                    "permission denied"
                )
            ) {
                message =
                    "Supabase security blocked this request. Check the reference-data RLS policies.";
            }

            showMessage(
                referenceFormMessage,
                `The record could not be saved. ${message}`,
                "error"
            );

        } finally {
            saveReferenceButton.disabled =
                false;

            saveReferenceButton.innerHTML =
                originalHtml;
        }
    }
);

// ======================================================
// REFERENCE TABLE ACTIONS
// ======================================================

function handleReferenceTableAction(
    event
) {
    const actionButton =
        event.target.closest(
            "[data-reference-action]"
        );

    if (!actionButton) {
        return;
    }

    const action =
        actionButton.dataset
            .referenceAction;

    const type =
        actionButton.dataset
            .referenceType;

    const recordId =
        actionButton.dataset
            .referenceId;

    if (
        action === "edit"
    ) {
        openReferenceEditor(
            type,
            recordId
        );

        return;
    }

    if (
        action === "delete"
    ) {
        openDeleteReferenceDialog(
            type,
            recordId,
            Number(
                actionButton.dataset
                    .referenceCount || 0
            )
        );
    }
}

[
    categoriesTableBody,
    departmentsTableBody,
    locationsTableBody
].forEach(
    (tableBody) => {
        tableBody?.addEventListener(
            "click",
            handleReferenceTableAction
        );
    }
);

// ======================================================
// OPEN DELETE DIALOG
// ======================================================

function openDeleteReferenceDialog(
    type,
    recordId,
    assetCount
) {
    clearMessage(
        deleteReferenceMessage
    );

    const configuration =
        getReferenceConfiguration(
            type
        );

    const record =
        getReferenceRecord(
            type,
            recordId
        );

    if (
        !configuration ||
        !record
    ) {
        showPageMessage(
            "The selected record could not be found.",
            "error"
        );

        return;
    }

    if (!canManageReferenceData()) {
        showPageMessage(
            "Your account cannot delete this record.",
            "error"
        );

        return;
    }

    if (deleteReferenceId) {
        deleteReferenceId.value =
            recordId;
    }

    if (deleteReferenceType) {
        deleteReferenceType.value =
            type;
    }

    if (deleteReferenceText) {
        deleteReferenceText.textContent =
            assetCount > 0
                ? `${record.name} is linked to ${assetCount} asset${assetCount === 1 ? "" : "s"} and cannot be deleted until those assets are reassigned.`
                : `${record.name} will be permanently removed from this organisation.`;
    }

    if (
        confirmDeleteReferenceButton
    ) {
        confirmDeleteReferenceButton.disabled =
            assetCount > 0;
    }

    if (assetCount > 0) {
        showMessage(
            deleteReferenceMessage,
            "This record is currently in use by the asset register.",
            "warning"
        );
    }

    openModal(
        deleteReferenceModal
    );
}

// ======================================================
// CLOSE DELETE DIALOG
// ======================================================

function closeDeleteReferenceDialog() {
    closeModal(
        deleteReferenceModal
    );

    if (deleteReferenceId) {
        deleteReferenceId.value =
            "";
    }

    if (deleteReferenceType) {
        deleteReferenceType.value =
            "";
    }

    if (
        confirmDeleteReferenceButton
    ) {
        confirmDeleteReferenceButton.disabled =
            false;
    }

    clearMessage(
        deleteReferenceMessage
    );
}

cancelDeleteReferenceButton
    ?.addEventListener(
        "click",
        closeDeleteReferenceDialog
    );

deleteReferenceModal?.addEventListener(
    "click",
    (event) => {
        if (
            event.target ===
            deleteReferenceModal
        ) {
            closeDeleteReferenceDialog();
        }
    }
);

// ======================================================
// CONFIRM DELETE
// ======================================================

confirmDeleteReferenceButton
    ?.addEventListener(
        "click",
        async () => {
            const type =
                deleteReferenceType
                    ?.value || "";

            const recordId =
                deleteReferenceId
                    ?.value || "";

            const configuration =
                getReferenceConfiguration(
                    type
                );

            if (
                !configuration ||
                !recordId
            ) {
                showMessage(
                    deleteReferenceMessage,
                    "No record was selected.",
                    "error"
                );

                return;
            }

            const originalHtml =
                confirmDeleteReferenceButton
                    .innerHTML;

            confirmDeleteReferenceButton.disabled =
                true;

            confirmDeleteReferenceButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Deleting...
            `;

            try {
                const foreignKeyMap = {
                    categories:
                        "category_id",
                    departments:
                        "department_id",
                    locations:
                        "location_id"
                };

                const foreignKey =
                    foreignKeyMap[type];

                const {
                    count,
                    error: countError
                } = await settingsSupabase
                    .from("assets")
                    .select(
                        "id",
                        {
                            count: "exact",
                            head: true
                        }
                    )
                    .eq(
                        "organisation_id",
                        settingsState
                            .organisation.id
                    )
                    .eq(
                        foreignKey,
                        recordId
                    );

                if (countError) {
                    throw countError;
                }

                if (
                    typeof count ===
                        "number" &&
                    count > 0
                ) {
                    throw new Error(
                        `This record is linked to ${count} asset${count === 1 ? "" : "s"} and cannot be deleted.`
                    );
                }

                const {
                    error
                } = await settingsSupabase
                    .from(
                        configuration.table
                    )
                    .delete()
                    .eq(
                        "id",
                        recordId
                    )
                    .eq(
                        "organisation_id",
                        settingsState
                            .organisation.id
                    );

                if (error) {
                    throw error;
                }

                settingsState[
                    configuration.stateKey
                ] =
                    (
                        settingsState[
                            configuration.stateKey
                        ] || []
                    ).filter(
                        (record) =>
                            record.id !==
                            recordId
                    );

                await renderReferenceData(
                    type
                );

                closeDeleteReferenceDialog();

                showPageMessage(
                    `${configuration.singularLabel} deleted successfully.`,
                    "success"
                );

            } catch (error) {
                console.error(
                    "Reference deletion failed:",
                    error
                );

                showMessage(
                    deleteReferenceMessage,
                    `The record could not be deleted. ${
                        error?.message ||
                        error?.details ||
                        String(error)
                    }`,
                    "error"
                );

            } finally {
                confirmDeleteReferenceButton.disabled =
                    false;

                confirmDeleteReferenceButton.innerHTML =
                    originalHtml;
            }
        }
    );

// ======================================================
// ESCAPE KEY
// ======================================================

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key !==
            "Escape"
        ) {
            return;
        }

        if (
            referenceModal &&
            !referenceModal
                .classList
                .contains("hidden")
        ) {
            closeReferenceEditor();

            return;
        }

        if (
            deleteReferenceModal &&
            !deleteReferenceModal
                .classList
                .contains("hidden")
        ) {
            closeDeleteReferenceDialog();
        }
    }
);
// ======================================================
// PART 4
// Add, edit and delete reference data
// ======================================================

// ======================================================
// OPEN REFERENCE MODAL BUTTONS
// ======================================================

const openReferenceModalButtons =
    Array.from(
        document.querySelectorAll(
            "[data-open-reference-modal]"
        )
    );

openReferenceModalButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                const type =
                    button.dataset
                        .openReferenceModal;

                openReferenceEditor(
                    type
                );
            }
        );
    }
);

// ======================================================
// REFERENCE LABEL HELPERS
// ======================================================

function getReferenceConfiguration(
    type
) {
    return (
        referenceConfiguration[
            type
        ] || null
    );
}

function getReferenceRecord(
    type,
    recordId
) {
    const configuration =
        getReferenceConfiguration(
            type
        );

    if (!configuration) {
        return null;
    }

    return (
        settingsState[
            configuration.stateKey
        ] || []
    ).find(
        (record) =>
            record.id === recordId
    ) || null;
}

// ======================================================
// OPEN ADD / EDIT MODAL
// ======================================================

function openReferenceEditor(
    type,
    recordId = ""
) {
    clearMessage(
        referenceFormMessage
    );

    const configuration =
        getReferenceConfiguration(
            type
        );

    if (!configuration) {
        showPageMessage(
            "The selected settings section is invalid.",
            "error"
        );

        return;
    }

    if (!canManageReferenceData()) {
        showPageMessage(
            "Your account does not have permission to manage this data.",
            "error"
        );

        return;
    }

    referenceForm?.reset();

    if (referenceRecordId) {
        referenceRecordId.value =
            recordId;
    }

    if (referenceType) {
        referenceType.value =
            type;
    }

    const editing =
        Boolean(recordId);

    if (referenceModalEyebrow) {
        referenceModalEyebrow.textContent =
            configuration.singularLabel;
    }

    if (referenceModalTitle) {
        referenceModalTitle.textContent =
            editing
                ? `Edit ${configuration.singularLabel}`
                : `Add ${configuration.singularLabel}`;
    }

    if (saveReferenceButton) {
        saveReferenceButton.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            ${
                editing
                    ? `Update ${configuration.singularLabel}`
                    : `Save ${configuration.singularLabel}`
            }
        `;
    }

    if (editing) {
        const record =
            getReferenceRecord(
                type,
                recordId
            );

        if (!record) {
            showPageMessage(
                "The selected record could not be found.",
                "error"
            );

            return;
        }

        if (referenceName) {
            referenceName.value =
                record.name || "";
        }

        if (referenceDescription) {
            referenceDescription.value =
                record.description || "";
        }
    }

    openModal(
        referenceModal
    );

    window.setTimeout(
        () => {
            referenceName?.focus();
        },
        80
    );
}

// ======================================================
// CLOSE REFERENCE MODAL
// ======================================================

function closeReferenceEditor() {
    closeModal(
        referenceModal
    );

    referenceForm?.reset();

    if (referenceRecordId) {
        referenceRecordId.value =
            "";
    }

    if (referenceType) {
        referenceType.value =
            "";
    }

    clearMessage(
        referenceFormMessage
    );
}

closeReferenceModalButton
    ?.addEventListener(
        "click",
        closeReferenceEditor
    );

cancelReferenceButton
    ?.addEventListener(
        "click",
        closeReferenceEditor
    );

referenceModal?.addEventListener(
    "click",
    (event) => {
        if (
            event.target ===
            referenceModal
        ) {
            closeReferenceEditor();
        }
    }
);

// ======================================================
// VALIDATE REFERENCE FORM
// ======================================================

function validateReferenceForm() {
    const type =
        referenceType?.value || "";

    const configuration =
        getReferenceConfiguration(
            type
        );

    const name =
        referenceName
            ?.value
            .trim() || "";

    if (!configuration) {
        return "The selected record type is invalid.";
    }

    if (!name) {
        return `Enter the ${configuration.singularLabel.toLowerCase()} name.`;
    }

    if (name.length < 2) {
        return "The name must contain at least 2 characters.";
    }

    return null;
}

// ======================================================
// CHECK DUPLICATE NAME
// ======================================================

function hasDuplicateReferenceName(
    type,
    name,
    excludedRecordId = ""
) {
    const configuration =
        getReferenceConfiguration(
            type
        );

    if (!configuration) {
        return false;
    }

    const normalisedName =
        normaliseSearch(name);

    return (
        settingsState[
            configuration.stateKey
        ] || []
    ).some(
        (record) =>
            record.id !==
                excludedRecordId &&
            normaliseSearch(
                record.name
            ) === normalisedName
    );
}

// ======================================================
// SAVE REFERENCE RECORD
// ======================================================

referenceForm?.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        clearMessage(
            referenceFormMessage
        );

        if (!canManageReferenceData()) {
            showMessage(
                referenceFormMessage,
                "Your account cannot modify this data.",
                "error"
            );

            return;
        }

        const validationError =
            validateReferenceForm();

        if (validationError) {
            showMessage(
                referenceFormMessage,
                validationError,
                "error"
            );

            return;
        }

        const type =
            referenceType.value;

        const configuration =
            getReferenceConfiguration(
                type
            );

        const recordId =
            referenceRecordId
                ?.value || "";

        const editing =
            Boolean(recordId);

        const name =
            referenceName.value.trim();

        const description =
            referenceDescription
                ?.value
                .trim() || null;

        if (
            hasDuplicateReferenceName(
                type,
                name,
                recordId
            )
        ) {
            showMessage(
                referenceFormMessage,
                `A ${configuration.singularLabel.toLowerCase()} with this name already exists.`,
                "error"
            );

            return;
        }

        const originalHtml =
            saveReferenceButton.innerHTML;

        saveReferenceButton.disabled =
            true;

        saveReferenceButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${
                editing
                    ? "Updating..."
                    : "Saving..."
            }
        `;

        try {
            const payload = {
                organisation_id:
                    settingsState
                        .organisation.id,

                name,

                description,

                updated_at:
                    new Date()
                        .toISOString()
            };

            let savedRecord;

            if (editing) {
                const {
                    data,
                    error
                } = await settingsSupabase
                    .from(
                        configuration.table
                    )
                    .update(payload)
                    .eq(
                        "id",
                        recordId
                    )
                    .eq(
                        "organisation_id",
                        settingsState
                            .organisation.id
                    )
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                savedRecord =
                    data;

            } else {
                payload.created_by =
                    settingsState.user.id;

                const {
                    data,
                    error
                } = await settingsSupabase
                    .from(
                        configuration.table
                    )
                    .insert(payload)
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                savedRecord =
                    data;
            }

            const currentRecords =
                settingsState[
                    configuration.stateKey
                ] || [];

            if (editing) {
                settingsState[
                    configuration.stateKey
                ] =
                    currentRecords.map(
                        (record) =>
                            record.id ===
                            savedRecord.id
                                ? savedRecord
                                : record
                    );
            } else {
                settingsState[
                    configuration.stateKey
                ] = [
                    ...currentRecords,
                    savedRecord
                ];
            }

            settingsState[
                configuration.stateKey
            ].sort(
                (firstRecord, secondRecord) =>
                    firstRecord.name
                        .localeCompare(
                            secondRecord.name
                        )
            );

            await renderReferenceData(
                type
            );

            showMessage(
                referenceFormMessage,
                editing
                    ? `${configuration.singularLabel} updated successfully.`
                    : `${configuration.singularLabel} added successfully.`,
                "success"
            );

            window.setTimeout(
                () => {
                    closeReferenceEditor();

                    showPageMessage(
                        editing
                            ? `${configuration.singularLabel} updated successfully.`
                            : `${configuration.singularLabel} added successfully.`,
                        "success"
                    );
                },
                600
            );

        } catch (error) {
            console.error(
                "Reference record save failed:",
                error
            );

            let message =
                error?.message ||
                error?.details ||
                String(error);

            const lowerMessage =
                message.toLowerCase();

            if (
                lowerMessage.includes(
                    "duplicate key"
                )
            ) {
                message =
                    `A ${configuration.singularLabel.toLowerCase()} with this name already exists.`;
            }

            if (
                lowerMessage.includes(
                    "row-level security"
                ) ||
                lowerMessage.includes(
                    "permission denied"
                )
            ) {
                message =
                    "Supabase security blocked this request. Check the reference-data RLS policies.";
            }

            showMessage(
                referenceFormMessage,
                `The record could not be saved. ${message}`,
                "error"
            );

        } finally {
            saveReferenceButton.disabled =
                false;

            saveReferenceButton.innerHTML =
                originalHtml;
        }
    }
);

// ======================================================
// REFERENCE TABLE ACTIONS
// ======================================================

function handleReferenceTableAction(
    event
) {
    const actionButton =
        event.target.closest(
            "[data-reference-action]"
        );

    if (!actionButton) {
        return;
    }

    const action =
        actionButton.dataset
            .referenceAction;

    const type =
        actionButton.dataset
            .referenceType;

    const recordId =
        actionButton.dataset
            .referenceId;

    if (
        action === "edit"
    ) {
        openReferenceEditor(
            type,
            recordId
        );

        return;
    }

    if (
        action === "delete"
    ) {
        openDeleteReferenceDialog(
            type,
            recordId,
            Number(
                actionButton.dataset
                    .referenceCount || 0
            )
        );
    }
}

[
    categoriesTableBody,
    departmentsTableBody,
    locationsTableBody
].forEach(
    (tableBody) => {
        tableBody?.addEventListener(
            "click",
            handleReferenceTableAction
        );
    }
);

// ======================================================
// OPEN DELETE DIALOG
// ======================================================

function openDeleteReferenceDialog(
    type,
    recordId,
    assetCount
) {
    clearMessage(
        deleteReferenceMessage
    );

    const configuration =
        getReferenceConfiguration(
            type
        );

    const record =
        getReferenceRecord(
            type,
            recordId
        );

    if (
        !configuration ||
        !record
    ) {
        showPageMessage(
            "The selected record could not be found.",
            "error"
        );

        return;
    }

    if (!canManageReferenceData()) {
        showPageMessage(
            "Your account cannot delete this record.",
            "error"
        );

        return;
    }

    if (deleteReferenceId) {
        deleteReferenceId.value =
            recordId;
    }

    if (deleteReferenceType) {
        deleteReferenceType.value =
            type;
    }

    if (deleteReferenceText) {
        deleteReferenceText.textContent =
            assetCount > 0
                ? `${record.name} is linked to ${assetCount} asset${assetCount === 1 ? "" : "s"} and cannot be deleted until those assets are reassigned.`
                : `${record.name} will be permanently removed from this organisation.`;
    }

    if (
        confirmDeleteReferenceButton
    ) {
        confirmDeleteReferenceButton.disabled =
            assetCount > 0;
    }

    if (assetCount > 0) {
        showMessage(
            deleteReferenceMessage,
            "This record is currently in use by the asset register.",
            "warning"
        );
    }

    openModal(
        deleteReferenceModal
    );
}

// ======================================================
// CLOSE DELETE DIALOG
// ======================================================

function closeDeleteReferenceDialog() {
    closeModal(
        deleteReferenceModal
    );

    if (deleteReferenceId) {
        deleteReferenceId.value =
            "";
    }

    if (deleteReferenceType) {
        deleteReferenceType.value =
            "";
    }

    if (
        confirmDeleteReferenceButton
    ) {
        confirmDeleteReferenceButton.disabled =
            false;
    }

    clearMessage(
        deleteReferenceMessage
    );
}

cancelDeleteReferenceButton
    ?.addEventListener(
        "click",
        closeDeleteReferenceDialog
    );

deleteReferenceModal?.addEventListener(
    "click",
    (event) => {
        if (
            event.target ===
            deleteReferenceModal
        ) {
            closeDeleteReferenceDialog();
        }
    }
);

// ======================================================
// CONFIRM DELETE
// ======================================================

confirmDeleteReferenceButton
    ?.addEventListener(
        "click",
        async () => {
            const type =
                deleteReferenceType
                    ?.value || "";

            const recordId =
                deleteReferenceId
                    ?.value || "";

            const configuration =
                getReferenceConfiguration(
                    type
                );

            if (
                !configuration ||
                !recordId
            ) {
                showMessage(
                    deleteReferenceMessage,
                    "No record was selected.",
                    "error"
                );

                return;
            }

            const originalHtml =
                confirmDeleteReferenceButton
                    .innerHTML;

            confirmDeleteReferenceButton.disabled =
                true;

            confirmDeleteReferenceButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Deleting...
            `;

            try {
                const foreignKeyMap = {
                    categories:
                        "category_id",
                    departments:
                        "department_id",
                    locations:
                        "location_id"
                };

                const foreignKey =
                    foreignKeyMap[type];

                const {
                    count,
                    error: countError
                } = await settingsSupabase
                    .from("assets")
                    .select(
                        "id",
                        {
                            count: "exact",
                            head: true
                        }
                    )
                    .eq(
                        "organisation_id",
                        settingsState
                            .organisation.id
                    )
                    .eq(
                        foreignKey,
                        recordId
                    );

                if (countError) {
                    throw countError;
                }

                if (
                    typeof count ===
                        "number" &&
                    count > 0
                ) {
                    throw new Error(
                        `This record is linked to ${count} asset${count === 1 ? "" : "s"} and cannot be deleted.`
                    );
                }

                const {
                    error
                } = await settingsSupabase
                    .from(
                        configuration.table
                    )
                    .delete()
                    .eq(
                        "id",
                        recordId
                    )
                    .eq(
                        "organisation_id",
                        settingsState
                            .organisation.id
                    );

                if (error) {
                    throw error;
                }

                settingsState[
                    configuration.stateKey
                ] =
                    (
                        settingsState[
                            configuration.stateKey
                        ] || []
                    ).filter(
                        (record) =>
                            record.id !==
                            recordId
                    );

                await renderReferenceData(
                    type
                );

                closeDeleteReferenceDialog();

                showPageMessage(
                    `${configuration.singularLabel} deleted successfully.`,
                    "success"
                );

            } catch (error) {
                console.error(
                    "Reference deletion failed:",
                    error
                );

                showMessage(
                    deleteReferenceMessage,
                    `The record could not be deleted. ${
                        error?.message ||
                        error?.details ||
                        String(error)
                    }`,
                    "error"
                );

            } finally {
                confirmDeleteReferenceButton.disabled =
                    false;

                confirmDeleteReferenceButton.innerHTML =
                    originalHtml;
            }
        }
    );

// ======================================================
// ESCAPE KEY
// ======================================================

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key !==
            "Escape"
        ) {
            return;
        }

        if (
            referenceModal &&
            !referenceModal
                .classList
                .contains("hidden")
        ) {
            closeReferenceEditor();

            return;
        }

        if (
            deleteReferenceModal &&
            !deleteReferenceModal
                .classList
                .contains("hidden")
        ) {
            closeDeleteReferenceDialog();
        }
    }
);
