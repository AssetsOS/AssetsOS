// ======================================================
// AssetsOS Asset Register
// Part 1: Authentication, state and organisation setup
// ======================================================

const assetSupabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ======================================================
// APPLICATION STATE
// ======================================================

const assetState = {
    session: null,
    user: null,
    organisation: null,
    membership: null,

    assets: [],
    filteredAssets: [],

    categories: [],
    departments: [],
    locations: []
};

// ======================================================
// PAGE ELEMENTS
// ======================================================

const sidebar = document.querySelector(".sidebar");

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

const organisationRequired =
    document.getElementById("organisationRequired");

const openOrganisationModalButton =
    document.getElementById(
        "openOrganisationModalButton"
    );

const organisationModal =
    document.getElementById("organisationModal");

const closeOrganisationModalButton =
    document.getElementById(
        "closeOrganisationModalButton"
    );

const cancelOrganisationButton =
    document.getElementById(
        "cancelOrganisationButton"
    );

const organisationForm =
    document.getElementById("organisationForm");

const organisationFormMessage =
    document.getElementById(
        "organisationFormMessage"
    );

const saveOrganisationButton =
    document.getElementById(
        "saveOrganisationButton"
    );

const assetsLoading =
    document.getElementById("assetsLoading");

const assetPageMessage =
    document.getElementById("assetPageMessage");

// ======================================================
// GENERAL HELPERS
// ======================================================

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatRole(role) {
    const roleNames = {
        owner: "Organisation Owner",
        admin: "Administrator",
        asset_manager: "Asset Manager",
        technician: "Technician",
        viewer: "Viewer"
    };

    return roleNames[role] || "AssetsOS User";
}

function generateInitials(value) {
    const cleanValue = String(value || "")
        .split("@")[0]
        .trim();

    if (!cleanValue) {
        return "AU";
    }

    const parts = cleanValue
        .split(/[.\-_\s]+/)
        .filter(Boolean)
        .slice(0, 2);

    return parts
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "AU";
}

function setButtonLoading(
    button,
    isLoading,
    loadingText,
    defaultHtml
) {
    if (!button) {
        return;
    }

    button.disabled = isLoading;

    button.innerHTML = isLoading
        ? `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>${escapeHtml(loadingText)}</span>
        `
        : defaultHtml;
}

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
        `asset-form-message show ${type}`;
}

function showPageMessage(
    message,
    type = "error"
) {
    if (!assetPageMessage) {
        return;
    }

    assetPageMessage.textContent = message;
    assetPageMessage.className =
        `asset-page-message show ${type}`;
}

function clearMessage(element) {
    if (!element) {
        return;
    }

    element.textContent = "";

    if (element === assetPageMessage) {
        element.className = "asset-page-message";
    } else {
        element.className = "asset-form-message";
    }
}

function openModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

// ======================================================
// MOBILE SIDEBAR
// ======================================================

if (mobileMenuButton && sidebar) {
    mobileMenuButton.addEventListener(
        "click",
        () => {
            const isOpen =
                sidebar.classList.toggle("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileMenuButton.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        }
    );
}

// ======================================================
// AUTHENTICATION
// ======================================================

async function loadAuthenticatedUser() {
    const {
        data: { session },
        error
    } = await assetSupabase.auth.getSession();

    if (error) {
        console.error(
            "Unable to read authenticated session:",
            error
        );

        window.location.replace("login.html");
        return false;
    }

    if (!session) {
        window.location.replace("login.html");
        return false;
    }

    assetState.session = session;
    assetState.user = session.user;

    const userEmail =
        session.user.email || "Authenticated User";

    const metadata =
        session.user.user_metadata || {};

    if (profileName) {
        profileName.textContent =
            metadata.full_name ||
            userEmail;
    }

    if (profileInitials) {
        profileInitials.textContent =
            generateInitials(
                metadata.full_name || userEmail
            );
    }

    return true;
}

// ======================================================
// SIGN OUT
// ======================================================

if (logoutButton) {
    logoutButton.addEventListener(
        "click",
        async () => {
            const defaultHtml = `
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sign Out</span>
            `;

            setButtonLoading(
                logoutButton,
                true,
                "Signing Out...",
                defaultHtml
            );

            const { error } =
                await assetSupabase.auth.signOut();

            if (error) {
                console.error(
                    "Sign-out failed:",
                    error
                );

                setButtonLoading(
                    logoutButton,
                    false,
                    "",
                    defaultHtml
                );

                showPageMessage(
                    "Sign out failed. Please try again.",
                    "error"
                );

                return;
            }

            window.location.replace("login.html");
        }
    );
}

// ======================================================
// LOAD USER ORGANISATION
// ======================================================

async function loadOrganisationMembership() {
    const userId = assetState.user?.id;

    if (!userId) {
        return false;
    }

    const {
        data,
        error
    } = await assetSupabase
        .from("organisation_members")
        .select(`
            id,
            organisation_id,
            role,
            status,
            organisations (
                id,
                name,
                industry,
                email,
                phone,
                status,
                created_at
            )
        `)
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            "Unable to load organisation membership:",
            error
        );

        showPageMessage(
            `Your organisation could not be loaded. ${error.message}`,
            "error"
        );

        return false;
    }

    if (!data || !data.organisations) {
        assetState.organisation = null;
        assetState.membership = null;

        if (workspaceName) {
            workspaceName.textContent =
                "No Organisation";
        }

        if (profileRole) {
            profileRole.textContent =
                "Organisation Setup Required";
        }

        organisationRequired?.classList.remove(
            "hidden"
        );

        return false;
    }

    assetState.membership = data;
    assetState.organisation =
        data.organisations;

    if (workspaceName) {
        workspaceName.textContent =
            data.organisations.name;
    }

    if (profileRole) {
        profileRole.textContent =
            formatRole(data.role);
    }

    organisationRequired?.classList.add(
        "hidden"
    );

    return true;
}

// ======================================================
// ORGANISATION MODAL
// ======================================================

function openOrganisationModal() {
    clearMessage(organisationFormMessage);
    organisationForm?.reset();
    openModal(organisationModal);

    window.setTimeout(() => {
        document
            .getElementById("organisation_name")
            ?.focus();
    }, 100);
}

function closeOrganisationModal() {
    closeModal(organisationModal);
    clearMessage(organisationFormMessage);
}

openOrganisationModalButton?.addEventListener(
    "click",
    openOrganisationModal
);

closeOrganisationModalButton?.addEventListener(
    "click",
    closeOrganisationModal
);

cancelOrganisationButton?.addEventListener(
    "click",
    closeOrganisationModal
);

organisationModal?.addEventListener(
    "click",
    (event) => {
        if (event.target === organisationModal) {
            closeOrganisationModal();
        }
    }
);

// ======================================================
// CREATE ORGANISATION
// ======================================================

if (organisationForm) {
    organisationForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();
            clearMessage(organisationFormMessage);

            const organisationName =
                document
                    .getElementById(
                        "organisation_name"
                    )
                    ?.value.trim() || "";

            const industry =
                document
                    .getElementById(
                        "organisation_industry"
                    )
                    ?.value || "";

            const email =
                document
                    .getElementById(
                        "organisation_email"
                    )
                    ?.value.trim() || "";

            const phone =
                document
                    .getElementById(
                        "organisation_phone"
                    )
                    ?.value.trim() || "";

            if (!organisationName) {
                showMessage(
                    organisationFormMessage,
                    "Enter the organisation name.",
                    "error"
                );

                return;
            }

            const defaultHtml = `
                <i class="fa-solid fa-building-circle-check"></i>
                <span>Create Workspace</span>
            `;

            setButtonLoading(
                saveOrganisationButton,
                true,
                "Creating Workspace...",
                defaultHtml
            );

            try {
                const {
                    data: organisation,
                    error: organisationError
                } = await assetSupabase
                    .from("organisations")
                    .insert({
                        name: organisationName,
                        industry:
                            industry || null,
                        email:
                            email || null,
                        phone:
                            phone || null,
                        status: "active",
                        created_by:
                            assetState.user.id
                    })
                    .select()
                    .single();

                if (organisationError) {
                    throw organisationError;
                }

                const {
                    error: membershipError
                } = await assetSupabase
                    .from("organisation_members")
                    .insert({
                        organisation_id:
                            organisation.id,
                        user_id:
                            assetState.user.id,
                        role: "owner",
                        status: "active"
                    });

                if (membershipError) {
                    throw membershipError;
                }

                assetState.organisation =
                    organisation;

                assetState.membership = {
                    organisation_id:
                        organisation.id,
                    role: "owner",
                    status: "active",
                    organisations:
                        organisation
                };

                if (workspaceName) {
                    workspaceName.textContent =
                        organisation.name;
                }

                if (profileRole) {
                    profileRole.textContent =
                        "Organisation Owner";
                }

                organisationRequired?.classList.add(
                    "hidden"
                );

                showMessage(
                    organisationFormMessage,
                    "Organisation workspace created successfully.",
                    "success"
                );

                window.setTimeout(() => {
                    closeOrganisationModal();
                    initialiseOrganisationData();
                }, 700);

            } catch (error) {
                console.error(
                    "Organisation creation failed:",
                    error
                );

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : String(error);

                showMessage(
                    organisationFormMessage,
                    `The organisation could not be created. ${errorMessage}`,
                    "error"
                );

            } finally {
                setButtonLoading(
                    saveOrganisationButton,
                    false,
                    "",
                    defaultHtml
                );
            }
        }
    );
}

// ======================================================
// INITIALISATION
// ======================================================

async function initialiseAssetRegister() {
    const authenticated =
        await loadAuthenticatedUser();

    if (!authenticated) {
        return;
    }

    const hasOrganisation =
        await loadOrganisationMembership();

    document.body.classList.add(
        "authenticated"
    );

    if (!hasOrganisation) {
        assetsLoading?.classList.add("hidden");

        if (
            typeof renderAssets === "function"
        ) {
            renderAssets([]);
        }

        return;
    }

    await initialiseOrganisationData();
}

async function initialiseOrganisationData() {
    clearMessage(assetPageMessage);

    if (!assetState.organisation?.id) {
        return;
    }

    if (
        typeof loadReferenceData === "function" &&
        typeof loadAssets === "function"
    ) {
        await Promise.all([
            loadReferenceData(),
            loadAssets()
        ]);
    }
}

initialiseAssetRegister();
// ======================================================
// PART 2
// Load Categories, Departments, Locations and Assets
// ======================================================

// ------------------------------------------------------
// HTML Elements
// ------------------------------------------------------

const categorySelect =
    document.getElementById("category_id");

const departmentSelect =
    document.getElementById("department_id");

const locationSelect =
    document.getElementById("location_id");

const assetTableBody =
    document.getElementById("assetTableBody");

const assetTableWrapper =
    document.getElementById("assetTableWrapper");

const assetEmptyState =
    document.getElementById("assetEmptyState");

const totalAssetsMetric =
    document.getElementById("totalAssetsMetric");

const totalValueMetric =
    document.getElementById("totalValueMetric");

const activeAssetsMetric =
    document.getElementById("activeAssetsMetric");

const attentionAssetsMetric =
    document.getElementById("attentionAssetsMetric");

// ------------------------------------------------------
// Currency
// ------------------------------------------------------

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-ZA",
        {
            style: "currency",
            currency: "ZAR"
        }
    ).format(Number(value || 0));

}

// ------------------------------------------------------
// Populate Select Lists
// ------------------------------------------------------

function populateSelect(select, items) {

    if (!select) return;

    select.innerHTML =
        `<option value="">Select</option>`;

    items.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item.id;

        option.textContent = item.name;

        select.appendChild(option);

    });

}

// ------------------------------------------------------
// Load Reference Data
// ------------------------------------------------------

async function loadReferenceData() {

    const organisationId =
        assetState.organisation.id;

    // Categories

    const { data: categories } =
        await assetSupabase
            .from("asset_categories")
            .select("*")
            .eq(
                "organisation_id",
                organisationId
            )
            .order("name");

    assetState.categories =
        categories || [];

    populateSelect(
        categorySelect,
        assetState.categories
    );

    // Departments

    const { data: departments } =
        await assetSupabase
            .from("departments")
            .select("*")
            .eq(
                "organisation_id",
                organisationId
            )
            .order("name");

    assetState.departments =
        departments || [];

    populateSelect(
        departmentSelect,
        assetState.departments
    );

    // Locations

    const { data: locations } =
        await assetSupabase
            .from("locations")
            .select("*")
            .eq(
                "organisation_id",
                organisationId
            )
            .order("name");

    assetState.locations =
        locations || [];

    populateSelect(
        locationSelect,
        assetState.locations
    );

}

// ------------------------------------------------------
// Load Assets
// ------------------------------------------------------

async function loadAssets() {

    assetsLoading?.classList.remove("hidden");

    assetTableWrapper?.classList.add(
        "hidden"
    );

    assetEmptyState?.classList.add(
        "hidden"
    );

    const { data, error } =
        await assetSupabase
            .from("assets")
            .select(`
                *,
                asset_categories(name),
                departments(name),
                locations(name)
            `)
            .eq(
                "organisation_id",
                assetState.organisation.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    assetsLoading?.classList.add(
        "hidden"
    );

    if (error) {

        console.error(error);

        showPageMessage(
            error.message,
            "error"
        );

        return;

    }

    assetState.assets = data || [];

    assetState.filteredAssets =
        [...assetState.assets];

    updateDashboardMetrics();

    renderAssets(
        assetState.filteredAssets
    );

}

// ------------------------------------------------------
// Dashboard Metrics
// ------------------------------------------------------

function updateDashboardMetrics() {

    totalAssetsMetric.textContent =
        assetState.assets.length;

    let totalValue = 0;

    let active = 0;

    let attention = 0;

    assetState.assets.forEach(asset => {

        totalValue +=
            Number(
                asset.current_value || 0
            );

        if (
            asset.status === "active"
        ) {

            active++;

        }

        if (
            asset.condition === "poor" ||
            asset.condition === "critical"
        ) {

            attention++;

        }

    });

    totalValueMetric.textContent =
        formatCurrency(totalValue);

    activeAssetsMetric.textContent =
        active;

    attentionAssetsMetric.textContent =
        attention;

}

// ------------------------------------------------------
// Render Asset Table
// ------------------------------------------------------

function renderAssets(assets) {

    assetTableBody.innerHTML = "";

    if (!assets.length) {

        assetTableWrapper.classList.add(
            "hidden"
        );

        assetEmptyState.classList.remove(
            "hidden"
        );

        return;

    }

    assetTableWrapper.classList.remove(
        "hidden"
    );

    assetEmptyState.classList.add(
        "hidden"
    );

    assets.forEach(asset => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

<td>

<div class="asset-name">

<div class="asset-avatar">

<i class="fa-solid fa-box"></i>

</div>

<div>

<strong>

${escapeHtml(asset.asset_name)}

</strong>

<span>

${escapeHtml(asset.manufacturer || "")}

</span>

</div>

</div>

</td>

<td class="asset-code">

${escapeHtml(asset.asset_code)}

</td>

<td>

${escapeHtml(
asset.asset_categories?.name || "-"
)}

</td>

<td>

${escapeHtml(
asset.departments?.name || "-"
)}

</td>

<td>

${escapeHtml(
asset.locations?.name || "-"
)}

</td>

<td>

<span class="status-badge status-${asset.status.replace("_","-")}">

${asset.status.replaceAll("_"," ")}

</span>

</td>

<td>

<span class="condition condition-${asset.condition}">

${asset.condition.replaceAll("_"," ")}

</span>

</td>

<td class="asset-value">

${formatCurrency(
asset.current_value
)}

</td>

<td>

<div class="action-buttons">

<button
class="action-btn edit"
data-id="${asset.id}">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="action-btn delete"
data-id="${asset.id}">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

`;

        assetTableBody.appendChild(
            row
        );

    });

}
// ======================================================
// PART 3
// Asset Modal, Create, Edit, Delete, Search and Filters
// ======================================================

// ------------------------------------------------------
// Asset form elements
// ------------------------------------------------------

const assetModal =
    document.getElementById("assetModal");

const assetForm =
    document.getElementById("assetForm");

const assetModalTitle =
    document.getElementById("assetModalTitle");

const assetRecordId =
    document.getElementById("assetRecordId");

const openAssetModalButton =
    document.getElementById(
        "openAssetModalButton"
    );

const emptyAddAssetButton =
    document.getElementById(
        "emptyAddAssetButton"
    );

const closeAssetModalButton =
    document.getElementById(
        "closeAssetModalButton"
    );

const cancelAssetButton =
    document.getElementById(
        "cancelAssetButton"
    );

const saveAssetButton =
    document.getElementById(
        "saveAssetButton"
    );

const assetFormMessage =
    document.getElementById(
        "assetFormMessage"
    );

// ------------------------------------------------------
// Delete modal elements
// ------------------------------------------------------

const deleteModal =
    document.getElementById("deleteModal");

const deleteAssetId =
    document.getElementById(
        "deleteAssetId"
    );

const cancelDeleteButton =
    document.getElementById(
        "cancelDeleteButton"
    );

const confirmDeleteButton =
    document.getElementById(
        "confirmDeleteButton"
    );

const deleteMessage =
    document.getElementById(
        "deleteMessage"
    );

// ------------------------------------------------------
// Search and filter elements
// ------------------------------------------------------

const assetSearch =
    document.getElementById("assetSearch");

const globalSearch =
    document.getElementById("globalSearch");

const statusFilter =
    document.getElementById("statusFilter");

const conditionFilter =
    document.getElementById(
        "conditionFilter"
    );

const refreshAssetsButton =
    document.getElementById(
        "refreshAssetsButton"
    );

// ------------------------------------------------------
// Asset form field helpers
// ------------------------------------------------------

function getFieldValue(id) {
    const field = document.getElementById(id);

    if (!field) {
        return "";
    }

    return field.value.trim();
}

function getOptionalNumber(id) {
    const rawValue = getFieldValue(id);

    if (rawValue === "") {
        return null;
    }

    const numberValue = Number(rawValue);

    return Number.isFinite(numberValue)
        ? numberValue
        : null;
}

function getOptionalValue(id) {
    const value = getFieldValue(id);

    return value === ""
        ? null
        : value;
}

// ------------------------------------------------------
// Asset modal controls
// ------------------------------------------------------

function resetAssetForm() {
    assetForm?.reset();

    if (assetRecordId) {
        assetRecordId.value = "";
    }

    if (assetModalTitle) {
        assetModalTitle.textContent =
            "Add Asset";
    }

    const statusField =
        document.getElementById("status");

    const conditionField =
        document.getElementById(
            "condition"
        );

    if (statusField) {
        statusField.value = "active";
    }

    if (conditionField) {
        conditionField.value =
            "not_assessed";
    }

    clearMessage(assetFormMessage);
}

function canManageAssets() {
    const allowedRoles = [
        "owner",
        "admin",
        "asset_manager"
    ];

    return allowedRoles.includes(
        assetState.membership?.role
    );
}

function openAddAssetModal() {
    clearMessage(assetPageMessage);

    if (!assetState.organisation?.id) {
        showPageMessage(
            "Create an organisation workspace before adding assets.",
            "warning"
        );

        openOrganisationModal();
        return;
    }

    if (!canManageAssets()) {
        showPageMessage(
            "Your account does not have permission to create assets.",
            "error"
        );

        return;
    }

    resetAssetForm();
    openModal(assetModal);

    window.setTimeout(() => {
        document
            .getElementById("asset_name")
            ?.focus();
    }, 100);
}

function closeAssetModal() {
    closeModal(assetModal);
    resetAssetForm();
}

openAssetModalButton?.addEventListener(
    "click",
    openAddAssetModal
);

emptyAddAssetButton?.addEventListener(
    "click",
    openAddAssetModal
);

closeAssetModalButton?.addEventListener(
    "click",
    closeAssetModal
);

cancelAssetButton?.addEventListener(
    "click",
    closeAssetModal
);

assetModal?.addEventListener(
    "click",
    (event) => {
        if (event.target === assetModal) {
            closeAssetModal();
        }
    }
);

// ------------------------------------------------------
// Build asset payload
// ------------------------------------------------------

function buildAssetPayload() {
    return {
        organisation_id:
            assetState.organisation.id,

        asset_name:
            getFieldValue("asset_name"),

        asset_code:
            getFieldValue("asset_code"),

        category_id:
            getOptionalValue("category_id"),

        department_id:
            getOptionalValue("department_id"),

        location_id:
            getOptionalValue("location_id"),

        description:
            getOptionalValue("description"),

        serial_number:
            getOptionalValue("serial_number"),

        manufacturer:
            getOptionalValue("manufacturer"),

        model:
            getOptionalValue("model"),

        supplier:
            getOptionalValue("supplier"),

        status:
            getFieldValue("status") ||
            "active",

        condition:
            getFieldValue("condition") ||
            "not_assessed",

        purchase_date:
            getOptionalValue("purchase_date"),

        purchase_price:
            getOptionalNumber("purchase_price"),

        current_value:
            getOptionalNumber("current_value"),

        warranty_start_date:
            getOptionalValue(
                "warranty_start_date"
            ),

        warranty_end_date:
            getOptionalValue(
                "warranty_end_date"
            ),

        notes:
            getOptionalValue("notes"),

        created_by:
            assetState.user.id
    };
}

// ------------------------------------------------------
// Validate asset form
// ------------------------------------------------------

function validateAssetPayload(payload) {
    if (!payload.asset_name) {
        return "Enter the asset name.";
    }

    if (!payload.asset_code) {
        return "Enter a unique asset code.";
    }

    if (
        payload.purchase_price !== null &&
        payload.purchase_price < 0
    ) {
        return "Purchase price cannot be negative.";
    }

    if (
        payload.current_value !== null &&
        payload.current_value < 0
    ) {
        return "Current value cannot be negative.";
    }

    if (
        payload.warranty_start_date &&
        payload.warranty_end_date &&
        payload.warranty_end_date <
            payload.warranty_start_date
    ) {
        return "Warranty end date cannot be earlier than the start date.";
    }

    return null;
}

// ------------------------------------------------------
// Create or update asset
// ------------------------------------------------------

if (assetForm) {
    assetForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();
            clearMessage(assetFormMessage);

            if (
                !assetState.organisation?.id ||
                !assetState.user?.id
            ) {
                showMessage(
                    assetFormMessage,
                    "Your organisation or user session could not be verified.",
                    "error"
                );

                return;
            }

            if (!canManageAssets()) {
                showMessage(
                    assetFormMessage,
                    "You do not have permission to save assets.",
                    "error"
                );

                return;
            }

            const payload =
                buildAssetPayload();

            const validationError =
                validateAssetPayload(payload);

            if (validationError) {
                showMessage(
                    assetFormMessage,
                    validationError,
                    "error"
                );

                return;
            }

            const recordId =
                assetRecordId?.value || "";

            const editing =
                Boolean(recordId);

            const defaultHtml = `
                <i class="fa-solid fa-floppy-disk"></i>
                <span>
                    ${editing
                        ? "Update Asset"
                        : "Save Asset"}
                </span>
            `;

            setButtonLoading(
                saveAssetButton,
                true,
                editing
                    ? "Updating Asset..."
                    : "Saving Asset...",
                defaultHtml
            );

            try {
                let databaseError = null;

                if (editing) {
                    const updatePayload = {
                        ...payload
                    };

                    delete updatePayload.created_by;

                    const {
                        error
                    } = await assetSupabase
                        .from("assets")
                        .update(updatePayload)
                        .eq("id", recordId)
                        .eq(
                            "organisation_id",
                            assetState.organisation.id
                        );

                    databaseError = error;
                } else {
                    const {
                        error
                    } = await assetSupabase
                        .from("assets")
                        .insert(payload);

                    databaseError = error;
                }

                if (databaseError) {
                    throw databaseError;
                }

                showMessage(
                    assetFormMessage,
                    editing
                        ? "Asset updated successfully."
                        : "Asset added successfully.",
                    "success"
                );

                await loadAssets();

                window.setTimeout(() => {
                    closeAssetModal();
                }, 650);

            } catch (error) {
                console.error(
                    "Asset save failed:",
                    error
                );

                let message =
                    error instanceof Error
                        ? error.message
                        : String(error);

                if (
                    message.toLowerCase()
                        .includes(
                            "assets_organisation_id_asset_code_key"
                        ) ||
                    message.toLowerCase()
                        .includes(
                            "duplicate key"
                        )
                ) {
                    message =
                        "That asset code is already used by another asset in this organisation.";
                }

                showMessage(
                    assetFormMessage,
                    `The asset could not be saved. ${message}`,
                    "error"
                );

            } finally {
                setButtonLoading(
                    saveAssetButton,
                    false,
                    "",
                    defaultHtml
                );
            }
        }
    );
}

// ------------------------------------------------------
// Open asset for editing
// ------------------------------------------------------

function openEditAssetModal(assetId) {
    if (!canManageAssets()) {
        showPageMessage(
            "You do not have permission to edit assets.",
            "error"
        );

        return;
    }

    const asset = assetState.assets.find(
        (item) => item.id === assetId
    );

    if (!asset) {
        showPageMessage(
            "The selected asset could not be found.",
            "error"
        );

        return;
    }

    resetAssetForm();

    if (assetModalTitle) {
        assetModalTitle.textContent =
            "Edit Asset";
    }

    if (assetRecordId) {
        assetRecordId.value = asset.id;
    }

    const values = {
        asset_name:
            asset.asset_name,

        asset_code:
            asset.asset_code,

        category_id:
            asset.category_id,

        department_id:
            asset.department_id,

        location_id:
            asset.location_id,

        serial_number:
            asset.serial_number,

        description:
            asset.description,

        manufacturer:
            asset.manufacturer,

        model:
            asset.model,

        supplier:
            asset.supplier,

        status:
            asset.status,

        condition:
            asset.condition,

        purchase_date:
            asset.purchase_date,

        purchase_price:
            asset.purchase_price,

        current_value:
            asset.current_value,

        warranty_start_date:
            asset.warranty_start_date,

        warranty_end_date:
            asset.warranty_end_date,

        notes:
            asset.notes
    };

    Object.entries(values).forEach(
        ([fieldId, value]) => {
            const field =
                document.getElementById(fieldId);

            if (field) {
                field.value =
                    value ?? "";
            }
        }
    );

    openModal(assetModal);

    window.setTimeout(() => {
        document
            .getElementById("asset_name")
            ?.focus();
    }, 100);
}

// ------------------------------------------------------
// Delete modal controls
// ------------------------------------------------------

function openDeleteAssetModal(assetId) {
    if (!canManageAssets()) {
        showPageMessage(
            "You do not have permission to delete assets.",
            "error"
        );

        return;
    }

    const assetExists =
        assetState.assets.some(
            (item) => item.id === assetId
        );

    if (!assetExists) {
        showPageMessage(
            "The selected asset could not be found.",
            "error"
        );

        return;
    }

    clearMessage(deleteMessage);

    if (deleteAssetId) {
        deleteAssetId.value = assetId;
    }

    openModal(deleteModal);
}

function closeDeleteModal() {
    closeModal(deleteModal);
    clearMessage(deleteMessage);

    if (deleteAssetId) {
        deleteAssetId.value = "";
    }
}

cancelDeleteButton?.addEventListener(
    "click",
    closeDeleteModal
);

deleteModal?.addEventListener(
    "click",
    (event) => {
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    }
);

// ------------------------------------------------------
// Confirm asset deletion
// ------------------------------------------------------

confirmDeleteButton?.addEventListener(
    "click",
    async () => {
        const assetId =
            deleteAssetId?.value || "";

        if (!assetId) {
            showMessage(
                deleteMessage,
                "No asset was selected.",
                "error"
            );

            return;
        }

        const defaultHtml = `
            <i class="fa-solid fa-trash-can"></i>
            Delete Asset
        `;

        setButtonLoading(
            confirmDeleteButton,
            true,
            "Deleting...",
            defaultHtml
        );

        try {
            const {
                error
            } = await assetSupabase
                .from("assets")
                .delete()
                .eq("id", assetId)
                .eq(
                    "organisation_id",
                    assetState.organisation.id
                );

            if (error) {
                throw error;
            }

            await loadAssets();

            closeDeleteModal();

            showPageMessage(
                "Asset deleted successfully.",
                "success"
            );

        } catch (error) {
            console.error(
                "Asset deletion failed:",
                error
            );

            showMessage(
                deleteMessage,
                `The asset could not be deleted. ${
                    error instanceof Error
                        ? error.message
                        : String(error)
                }`,
                "error"
            );

        } finally {
            setButtonLoading(
                confirmDeleteButton,
                false,
                "",
                defaultHtml
            );
        }
    }
);

// ------------------------------------------------------
// Table action delegation
// ------------------------------------------------------

assetTableBody?.addEventListener(
    "click",
    (event) => {
        const editButton =
            event.target.closest(
                ".action-btn.edit"
            );

        const deleteButton =
            event.target.closest(
                ".action-btn.delete"
            );

        if (editButton) {
            openEditAssetModal(
                editButton.dataset.id
            );

            return;
        }

        if (deleteButton) {
            openDeleteAssetModal(
                deleteButton.dataset.id
            );
        }
    }
);

// ------------------------------------------------------
// Search and filtering
// ------------------------------------------------------

function normaliseSearchValue(value) {
    return String(value || "")
        .toLowerCase()
        .trim();
}

function applyAssetFilters() {
    const searchValue =
        normaliseSearchValue(
            assetSearch?.value ||
            globalSearch?.value
        );

    const selectedStatus =
        statusFilter?.value || "";

    const selectedCondition =
        conditionFilter?.value || "";

    assetState.filteredAssets =
        assetState.assets.filter(
            (asset) => {
                const searchableText = [
                    asset.asset_name,
                    asset.asset_code,
                    asset.serial_number,
                    asset.manufacturer,
                    asset.model,
                    asset.supplier,
                    asset.asset_categories?.name,
                    asset.departments?.name,
                    asset.locations?.name
                ]
                    .map(normaliseSearchValue)
                    .join(" ");

                const matchesSearch =
                    !searchValue ||
                    searchableText.includes(
                        searchValue
                    );

                const matchesStatus =
                    !selectedStatus ||
                    asset.status ===
                        selectedStatus;

                const matchesCondition =
                    !selectedCondition ||
                    asset.condition ===
                        selectedCondition;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesCondition
                );
            }
        );

    renderAssets(
        assetState.filteredAssets
    );
}

assetSearch?.addEventListener(
    "input",
    () => {
        if (globalSearch) {
            globalSearch.value =
                assetSearch.value;
        }

        applyAssetFilters();
    }
);

globalSearch?.addEventListener(
    "input",
    () => {
        if (assetSearch) {
            assetSearch.value =
                globalSearch.value;
        }

        applyAssetFilters();
    }
);

statusFilter?.addEventListener(
    "change",
    applyAssetFilters
);

conditionFilter?.addEventListener(
    "change",
    applyAssetFilters
);

// ------------------------------------------------------
// Refresh assets
// ------------------------------------------------------

refreshAssetsButton?.addEventListener(
    "click",
    async () => {
        const defaultHtml = `
            <i class="fa-solid fa-rotate"></i>
            Refresh
        `;

        setButtonLoading(
            refreshAssetsButton,
            true,
            "Refreshing...",
            defaultHtml
        );

        clearMessage(assetPageMessage);

        try {
            await Promise.all([
                loadReferenceData(),
                loadAssets()
            ]);

            showPageMessage(
                "Asset register refreshed.",
                "success"
            );

        } catch (error) {
            console.error(
                "Asset refresh failed:",
                error
            );

            showPageMessage(
                "The asset register could not be refreshed.",
                "error"
            );

        } finally {
            setButtonLoading(
                refreshAssetsButton,
                false,
                "",
                defaultHtml
            );
        }
    }
);

// ------------------------------------------------------
// Escape key closes open modal
// ------------------------------------------------------

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key !== "Escape") {
            return;
        }

        if (
            organisationModal &&
            !organisationModal.classList.contains(
                "hidden"
            )
        ) {
            closeOrganisationModal();
            return;
        }

        if (
            assetModal &&
            !assetModal.classList.contains(
                "hidden"
            )
        ) {
            closeAssetModal();
            return;
        }

        if (
            deleteModal &&
            !deleteModal.classList.contains(
                "hidden"
            )
        ) {
            closeDeleteModal();
        }
    }
);
// ======================================================
// PART 4
// Final safeguards, navigation and permission handling
// ======================================================

// ------------------------------------------------------
// Disable asset creation when organisation is missing
// ------------------------------------------------------

function updateAssetCreationAvailability() {
    const hasOrganisation =
        Boolean(assetState.organisation?.id);

    const allowed =
        hasOrganisation &&
        canManageAssets();

    [
        openAssetModalButton,
        emptyAddAssetButton
    ].forEach((button) => {
        if (!button) {
            return;
        }

        button.disabled = !allowed;

        button.title = !hasOrganisation
            ? "Create an organisation workspace first."
            : !canManageAssets()
                ? "Your role cannot create assets."
                : "";
    });
}

// ------------------------------------------------------
// Update organisation-dependent interface
// ------------------------------------------------------

function refreshOrganisationInterface() {
    const hasOrganisation =
        Boolean(assetState.organisation?.id);

    organisationRequired?.classList.toggle(
        "hidden",
        hasOrganisation
    );

    updateAssetCreationAvailability();

    if (!hasOrganisation) {
        assetState.assets = [];
        assetState.filteredAssets = [];

        updateDashboardMetrics();
        renderAssets([]);
    }
}

// ------------------------------------------------------
// Improve reference-data loading error handling
// ------------------------------------------------------

async function loadReferenceTable(
    tableName,
    stateKey,
    selectElement
) {
    const organisationId =
        assetState.organisation?.id;

    if (!organisationId) {
        assetState[stateKey] = [];
        populateSelect(selectElement, []);
        return;
    }

    const {
        data,
        error
    } = await assetSupabase
        .from(tableName)
        .select("id, name")
        .eq(
            "organisation_id",
            organisationId
        )
        .order("name", {
            ascending: true
        });

    if (error) {
        console.error(
            `Unable to load ${tableName}:`,
            error
        );

        assetState[stateKey] = [];
        populateSelect(selectElement, []);

        showPageMessage(
            `Some organisation options could not be loaded. ${error.message}`,
            "warning"
        );

        return;
    }

    assetState[stateKey] = data || [];

    populateSelect(
        selectElement,
        assetState[stateKey]
    );
}

// Replace the earlier reference-data loader with
// a version that reports individual table errors.
loadReferenceData = async function () {
    await Promise.all([
        loadReferenceTable(
            "asset_categories",
            "categories",
            categorySelect
        ),

        loadReferenceTable(
            "departments",
            "departments",
            departmentSelect
        ),

        loadReferenceTable(
            "locations",
            "locations",
            locationSelect
        )
    ]);
};

// ------------------------------------------------------
// Preserve form select values after reference reload
// ------------------------------------------------------

function setSelectValue(
    fieldId,
    value
) {
    const field =
        document.getElementById(fieldId);

    if (!field) {
        return;
    }

    const normalisedValue =
        value ?? "";

    const optionExists =
        Array.from(field.options).some(
            (option) =>
                option.value ===
                normalisedValue
        );

    field.value = optionExists
        ? normalisedValue
        : "";
}

// Replace edit-opening function so dropdown values
// are set only after their options are available.
const originalOpenEditAssetModal =
    openEditAssetModal;

openEditAssetModal = async function (
    assetId
) {
    if (!canManageAssets()) {
        showPageMessage(
            "You do not have permission to edit assets.",
            "error"
        );

        return;
    }

    const asset =
        assetState.assets.find(
            (item) =>
                item.id === assetId
        );

    if (!asset) {
        showPageMessage(
            "The selected asset could not be found.",
            "error"
        );

        return;
    }

    await loadReferenceData();

    resetAssetForm();

    if (assetModalTitle) {
        assetModalTitle.textContent =
            "Edit Asset";
    }

    if (assetRecordId) {
        assetRecordId.value =
            asset.id;
    }

    const basicValues = {
        asset_name:
            asset.asset_name,

        asset_code:
            asset.asset_code,

        serial_number:
            asset.serial_number,

        description:
            asset.description,

        manufacturer:
            asset.manufacturer,

        model:
            asset.model,

        supplier:
            asset.supplier,

        status:
            asset.status,

        condition:
            asset.condition,

        purchase_date:
            asset.purchase_date,

        purchase_price:
            asset.purchase_price,

        current_value:
            asset.current_value,

        warranty_start_date:
            asset.warranty_start_date,

        warranty_end_date:
            asset.warranty_end_date,

        notes:
            asset.notes
    };

    Object.entries(
        basicValues
    ).forEach(
        ([fieldId, value]) => {
            const field =
                document.getElementById(
                    fieldId
                );

            if (field) {
                field.value =
                    value ?? "";
            }
        }
    );

    setSelectValue(
        "category_id",
        asset.category_id
    );

    setSelectValue(
        "department_id",
        asset.department_id
    );

    setSelectValue(
        "location_id",
        asset.location_id
    );

    openModal(assetModal);

    window.setTimeout(() => {
        document
            .getElementById(
                "asset_name"
            )
            ?.focus();
    }, 100);
};

// ------------------------------------------------------
// Prevent viewers from seeing edit/delete buttons
// ------------------------------------------------------

const originalRenderAssets =
    renderAssets;

renderAssets = function (
    assets
) {
    originalRenderAssets(assets);

    const canManage =
        canManageAssets();

    document
        .querySelectorAll(
            ".action-buttons"
        )
        .forEach((container) => {
            container.classList.toggle(
                "hidden",
                !canManage
            );
        });
};

// ------------------------------------------------------
// Create default reference records
// ------------------------------------------------------

async function createDefaultReferenceRecords() {
    const organisationId =
        assetState.organisation?.id;

    const userId =
        assetState.user?.id;

    if (!organisationId || !userId) {
        return;
    }

    const defaults = [
        {
            table:
                "asset_categories",
            records: [
                {
                    name:
                        "Information Technology",
                    description:
                        "Computers, printers, networking equipment and related technology."
                },
                {
                    name:
                        "Furniture",
                    description:
                        "Office furniture and fixtures."
                },
                {
                    name:
                        "Vehicles",
                    description:
                        "Motor vehicles and fleet assets."
                },
                {
                    name:
                        "Equipment",
                    description:
                        "General operational equipment."
                }
            ]
        },

        {
            table:
                "departments",
            records: [
                {
                    name:
                        "Administration",
                    description:
                        "Administrative department."
                },
                {
                    name:
                        "Information Technology",
                    description:
                        "Technology and systems department."
                },
                {
                    name:
                        "Operations",
                    description:
                        "Operational department."
                }
            ]
        },

        {
            table:
                "locations",
            records: [
                {
                    name:
                        "Head Office",
                    description:
                        "Primary organisation location."
                },
                {
                    name:
                        "Storage",
                    description:
                        "General storage location."
                }
            ]
        }
    ];

    for (const group of defaults) {
        const {
            count,
            error: countError
        } = await assetSupabase
            .from(group.table)
            .select("id", {
                count: "exact",
                head: true
            })
            .eq(
                "organisation_id",
                organisationId
            );

        if (countError) {
            console.error(
                `Unable to inspect ${group.table}:`,
                countError
            );

            continue;
        }

        if (
            typeof count === "number" &&
            count > 0
        ) {
            continue;
        }

        const records =
            group.records.map(
                (record) => ({
                    ...record,
                    organisation_id:
                        organisationId,
                    created_by:
                        userId
                })
            );

        const {
            error: insertError
        } = await assetSupabase
            .from(group.table)
            .insert(records);

        if (insertError) {
            console.error(
                `Unable to create defaults for ${group.table}:`,
                insertError
            );
        }
    }
}

// ------------------------------------------------------
// Replace organisation data initialisation
// ------------------------------------------------------

initialiseOrganisationData =
    async function () {
        clearMessage(
            assetPageMessage
        );

        if (
            !assetState.organisation?.id
        ) {
            refreshOrganisationInterface();
            return;
        }

        refreshOrganisationInterface();

        try {
            await createDefaultReferenceRecords();

            await Promise.all([
                loadReferenceData(),
                loadAssets()
            ]);

            updateAssetCreationAvailability();

        } catch (error) {
            console.error(
                "Organisation data initialisation failed:",
                error
            );

            showPageMessage(
                `Organisation data could not be initialised. ${
                    error instanceof Error
                        ? error.message
                        : String(error)
                }`,
                "error"
            );
        }
    };

// ------------------------------------------------------
// React to authentication changes
// ------------------------------------------------------

assetSupabase.auth.onAuthStateChange(
    (_event, session) => {
        if (!session) {
            window.location.replace(
                "login.html"
            );
        }
    }
);

// ------------------------------------------------------
// Close sidebar after selecting a page on mobile
// ------------------------------------------------------

document
    .querySelectorAll(
        ".sidebar-nav a"
    )
    .forEach((link) => {
        link.addEventListener(
            "click",
            () => {
                if (
                    window.innerWidth > 850
                ) {
                    return;
                }

                sidebar?.classList.remove(
                    "open"
                );

                mobileMenuButton?.setAttribute(
                    "aria-expanded",
                    "false"
                );

                if (
                    mobileMenuButton
                ) {
                    mobileMenuButton.innerHTML =
                        '<i class="fa-solid fa-bars"></i>';
                }
            }
        );
    });

// ------------------------------------------------------
// Prevent placeholder sidebar links from jumping
// ------------------------------------------------------

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

// ------------------------------------------------------
// Final startup interface synchronisation
// ------------------------------------------------------

window.addEventListener(
    "load",
    () => {
        refreshOrganisationInterface();
        updateAssetCreationAvailability();
    }
);
// ======================================================
// FIX: Re-enable Add Asset after startup completes
// ======================================================

async function finalAssetRegisterStartup() {
    try {
        const authenticated = await loadAuthenticatedUser();

        if (!authenticated) {
            return;
        }

        const hasOrganisation =
            await loadOrganisationMembership();

        document.body.classList.add("authenticated");

        if (!hasOrganisation) {
            refreshOrganisationInterface();
            assetsLoading?.classList.add("hidden");
            renderAssets([]);
            return;
        }

        await initialiseOrganisationData();

        refreshOrganisationInterface();
        updateAssetCreationAvailability();

        if (openAssetModalButton) {
            openAssetModalButton.disabled = false;
        }

        if (emptyAddAssetButton) {
            emptyAddAssetButton.disabled = false;
        }

    } catch (error) {
        console.error(
            "AssetsOS startup failed:",
            error
        );

        showPageMessage(
            error instanceof Error
                ? error.message
                : "The asset register could not start.",
            "error"
        );

        document.body.classList.add("authenticated");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(
        finalAssetRegisterStartup,
        300
    );
});
