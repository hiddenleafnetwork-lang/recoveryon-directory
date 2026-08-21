/**
 * RecoveryOn Directory - Internal Admin Panel Controller (SPA Router & Engine)
 * Integrates client-side Supabase DB connection, SheetJS Excel parser, mapping, validation, duplicate prevention, and editor.
 */

const config = window.RECOVERYON_CONFIG || {};
let supabaseUrl = config.SUPABASE_URL || localStorage.getItem('RECOVERYON_SUPABASE_URL');
let supabaseKey = config.SUPABASE_KEY || localStorage.getItem('RECOVERYON_SUPABASE_KEY');
let supabase = null;
let currentUser = null;

// Global taxonomy lists loaded at startup
let dbCategories = [];
let dbStates = [];
let dbTaxonomyTerms = [];

// Pagination state for Resources list
let resourcesCurrentPage = 1;
const resourcesPerPage = 10;
let resourcesTotalCount = 0;

// Wizard Import data state
let importFileRawData = []; // Array of raw objects from file
let importSheetNames = [];
let importSelectedSheet = "";
let importMappedColumns = {};
let importValidationResults = {
    valid: [],
    warning: [],
    invalid: []
};
let importDuplicateConfig = {
    rules: {
        source: true,
        nameLoc: true,
        website: false,
        phone: false
    },
    action: 'skip' // 'skip' or 'update'
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial connection verification
    if (!verifyConnectionSettings()) {
        redirectToLogin();
        return;
    }

    // Initialize Supabase Client
    try {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    } catch (e) {
        console.error("Supabase client init failed", e);
        redirectToLogin();
        return;
    }

    // Check Authenticated Session with Timeout
    let session = null;
    let sessionError = null;

    try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Database connection timed out. Please check your network and configuration.")), 6000)
        );

        const result = await Promise.race([sessionPromise, timeoutPromise]);
        session = result.data ? result.data.session : null;
        sessionError = result.error;
    } catch (e) {
        console.error("Session verification failed", e);
        showConnectionError(e.message || "Failed to reach the database server. Verify your settings.");
        return;
    }

    if (sessionError || !session) {
        redirectToLogin();
        return;
    }

    currentUser = session.user;
    document.getElementById('admin-user-email').textContent = currentUser.email;
    document.getElementById('admin-shell').style.display = 'flex';
    hideLoading();

    // 2. Load Core Data & Bind Navigation Menu Click handlers
    await loadInitialTaxonomy();
    setupNavigation();
    setupLogout();
    
    // Initial section routing
    switchSection('dashboard');
});

/* =========================================================================
   AUTHENTICATION & CONNECTION MANAGEMENT
   ========================================================================= */

function verifyConnectionSettings() {
    if (!supabaseUrl || !supabaseKey) return false;
    let url = supabaseUrl.toLowerCase().trim();
    let key = supabaseKey.trim();
    if (url.includes('xxxxxxxx.supabase.co') || url.includes('your-project-id') || url === "") return false;
    if (key.toLowerCase().includes('eyjhbgcioijiu3i1n') && key.length < 50) return false;
    return true;
}

function redirectToLogin() {
    hideLoading();
    let pathname = window.location.pathname;
    let adminIndex = pathname.indexOf('/admin');
    if (adminIndex !== -1) {
        let basePath = pathname.substring(0, adminIndex);
        window.location.href = window.location.origin + basePath + '/admin/login.html';
    } else {
        window.location.href = 'login.html';
    }
}

function showConnectionError(message) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.backgroundColor = '#ffffff';
        overlay.innerHTML = `
            <div style="text-align: center; max-width: 450px; padding: 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #ef4444; background-color: #fef2f2; font-family: 'Plus Jakarta Sans', sans-serif;">
                <i class="fa-solid fa-circle-exclamation" style="font-size: 3.5rem; color: #ef4444; margin-bottom: 20px; display: block;"></i>
                <h2 style="font-size: 1.3rem; color: #991b1b; margin-bottom: 12px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border:none; padding:0; background:none;">Database Connection Error</h2>
                <p style="color: #7f1d1d; font-size: 0.92rem; line-height: 1.6; margin-bottom: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">${message}</p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button onclick="window.location.reload();" style="padding: 8px 16px; border: 1px solid var(--border-color); background: white; border-radius: 6px; cursor: pointer; font-weight:600; font-family: 'Plus Jakarta Sans', sans-serif;">Retry</button>
                    <button onclick="redirectToLogin();" style="padding: 8px 16px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight:600; font-family: 'Plus Jakarta Sans', sans-serif;">Configure / Sign In</button>
                </div>
            </div>
        `;
    }
}

function setupLogout() {
    document.getElementById('btn-logout-action').addEventListener('click', async (e) => {
        e.preventDefault();
        showLoading("Signing out...");
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.warn("Signout request failed", err);
        }
        
        try {
            let projectRef = supabaseUrl.split('//')[1].split('.')[0];
            localStorage.removeItem('sb-' + projectRef + '-auth-token');
        } catch (err) {
            console.warn("Unable to parse supabaseUrl for auth token key removal", err);
        }
        
        redirectToLogin();
    });
}

function showLoading(text = "Loading...") {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

/* =========================================================================
   NAVIGATION & SECTION ROUTER
   ========================================================================= */

function setupNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Manage Active Class
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const sectionName = item.getAttribute('data-target');
            switchSection(sectionName);
        });
    });
}

function switchSection(sectionId) {
    // Hide all panels
    document.querySelectorAll('.dashboard-section').forEach(sec => sec.style.display = 'none');
    
    // Show target section
    const targetEl = document.getElementById(`sec-${sectionId}`);
    if (targetEl) targetEl.style.display = 'block';

    // Update Top Header Page title label
    const titleLabels = {
        'dashboard': 'Dashboard Overview',
        'resources': 'Resources Management',
        'import': 'Excel/CSV Import Wizard',
        'locations': 'States & Locations Manager',
        'taxonomy': 'Categories & Taxonomy Manager',
        'history': 'Import History Logs',
        'settings': 'Dashboard Connection Settings',
        'editor': 'Edit Resource Details'
    };
    document.getElementById('page-title-label').textContent = titleLabels[sectionId] || 'Admin Dashboard';

    // Trigger Section Specific loader
    if (sectionId === 'dashboard') {
        loadDashboardOverview();
    } else if (sectionId === 'resources') {
        loadResourcesList();
    } else if (sectionId === 'locations') {
        loadLocationsList();
    } else if (sectionId === 'taxonomy') {
        loadTaxonomyList();
    } else if (sectionId === 'history') {
        loadImportHistory();
    } else if (sectionId === 'settings') {
        loadSettingsSection();
    }
}

/* =========================================================================
   CORE TAXONOMY PREFETCH
   ========================================================================= */

async function loadInitialTaxonomy() {
    try {
        // Fetch Categories
        const { data: cats } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
        dbCategories = cats || [];

        // Fetch States
        const { data: sts } = await supabase.from('states').select('*').order('name', { ascending: true });
        dbStates = sts || [];

        // Fetch Taxonomy Terms
        const { data: terms } = await supabase.from('taxonomy_terms').select('*').order('name', { ascending: true });
        dbTaxonomyTerms = terms || [];

        // Populate Dropdowns in resources filters
        const stateFilter = document.getElementById('res-filter-state');
        if (stateFilter) {
            stateFilter.innerHTML = '<option value="">All States</option>';
            dbStates.forEach(s => {
                stateFilter.innerHTML += `<option value="${s.code}">${s.name}</option>`;
            });
        }

        const catFilter = document.getElementById('res-filter-category');
        if (catFilter) {
            catFilter.innerHTML = '<option value="">All Categories</option>';
            dbCategories.forEach(c => {
                catFilter.innerHTML += `<option value="${c.id}">${c.name}</option>`;
            });
        }
    } catch (e) {
        console.error("Core taxonomy loads failed", e);
    }
}

/* =========================================================================
   SECTION 1: DASHBOARD OVERVIEW
   ========================================================================= */

async function loadDashboardOverview() {
    showLoading("Generating metrics...");

    try {
        // Query resources aggregate stats
        const { data: allResources } = await supabase.from('resources').select('id, status, state, rating, google_rating, address, phone, website, city, county');
        const { data: allBatches } = await supabase.from('import_batches').select('created_at').order('created_at', { ascending: false }).limit(1);

        const totalCount = allResources ? allResources.length : 0;
        let published = 0;
        let draft = 0;
        let imported = 0;
        let needsReview = 0;
        let statesCovered = new Set();
        let citiesCovered = new Set();
        let qualityIssues = [];

        if (allResources) {
            allResources.forEach(res => {
                // Status tally
                if (res.status === 'Published') published++;
                else if (res.status === 'Draft') draft++;
                else if (res.status === 'Imported') imported++;
                else if (res.status === 'Needs Review') needsReview++;

                // Locations tally
                if (res.state) statesCovered.add(res.state);
                if (res.city) citiesCovered.add(`${res.city}, ${res.state}`);

                // Quality issue analysis
                let issues = [];
                if (!res.address) issues.push("Missing street address");
                if (!res.phone) issues.push("Missing phone number");
                if (!res.website) issues.push("Missing website URL");
                if (!res.rating && !res.google_rating) issues.push("No ratings available");

                if (issues.length > 0) {
                    qualityIssues.push({
                        id: res.id,
                        name: res.name,
                        location: `${res.city || 'Unknown'}, ${res.state || 'N/A'}`,
                        issues: issues.join(", ")
                    });
                }
            });
        }

        // Category breakdown query
        const { data: resCats } = await supabase.from('resource_categories').select('category_id');
        const catCounts = {};
        if (resCats) {
            resCats.forEach(rc => {
                catCounts[rc.category_id] = (catCounts[rc.category_id] || 0) + 1;
            });
        }

        // Render Stats Summary Cards
        const lastImport = allBatches && allBatches.length > 0 ? new Date(allBatches[0].created_at).toLocaleDateString() : 'N/A';
        const statsHtml = `
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-label">Total Resources</span>
                    <span class="stat-icon"><i class="fa-solid fa-folder-open"></i></span>
                </div>
                <div class="stat-value">${totalCount}</div>
                <p class="stat-desc">Resources mapped in system</p>
            </div>
            <div class="stat-card" style="border-left: 3px solid #16a34a;">
                <div class="stat-header">
                    <span class="stat-label">Published</span>
                    <span class="stat-icon" style="color:#16a34a; background-color:#f0fdf4;"><i class="fa-solid fa-circle-check"></i></span>
                </div>
                <div class="stat-value">${published}</div>
                <p class="stat-desc">Live on public frontend</p>
            </div>
            <div class="stat-card" style="border-left: 3px solid #d97706;">
                <div class="stat-header">
                    <span class="stat-label">Draft / Review</span>
                    <span class="stat-icon" style="color:#d97706; background-color:#fffbeb;"><i class="fa-solid fa-clock"></i></span>
                </div>
                <div class="stat-value">${draft + needsReview}</div>
                <p class="stat-desc">Awaiting editorial review</p>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-label">Imported Staging</span>
                    <span class="stat-icon"><i class="fa-solid fa-file-import"></i></span>
                </div>
                <div class="stat-value">${imported}</div>
                <p class="stat-desc">Freshly uploaded spreadsheet data</p>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-label">Locations</span>
                    <span class="stat-icon"><i class="fa-solid fa-map-location-dot"></i></span>
                </div>
                <div class="stat-value">${statesCovered.size} States</div>
                <p class="stat-desc">${citiesCovered.size} Cities covered</p>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-label">Last Import</span>
                    <span class="stat-icon"><i class="fa-solid fa-calendar-check"></i></span>
                </div>
                <div class="stat-value" style="font-size:1.35rem; padding-top:8px;">${lastImport}</div>
                <p class="stat-desc">Most recent spreadsheet run</p>
            </div>
        `;
        document.getElementById('dashboard-stats-container').innerHTML = statsHtml;

        // Render States breakdown table
        const stateBreakdownBody = document.getElementById('dash-state-breakdown');
        stateBreakdownBody.innerHTML = '';
        const stateCounts = {};
        if (allResources) {
            allResources.forEach(res => {
                if (res.state) stateCounts[res.state] = (stateCounts[res.state] || 0) + 1;
            });
        }
        const sortedStates = Object.keys(stateCounts).sort((a,b) => stateCounts[b] - stateCounts[a]);
        if (sortedStates.length === 0) {
            stateBreakdownBody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:var(--text-muted);">No records in database.</td></tr>`;
        } else {
            sortedStates.forEach(code => {
                const stateName = dbStates.find(s => s.code === code)?.name || code;
                stateBreakdownBody.innerHTML += `
                    <tr>
                        <td style="font-weight:600;">${stateName}</td>
                        <td>${stateCounts[code]} resources</td>
                    </tr>
                `;
            });
        }

        // Render Categories breakdown table
        const categoryBreakdownBody = document.getElementById('dash-category-breakdown');
        categoryBreakdownBody.innerHTML = '';
        let hasCategoryData = false;
        dbCategories.forEach(cat => {
            const count = catCounts[cat.id] || 0;
            if (count > 0) hasCategoryData = true;
            categoryBreakdownBody.innerHTML += `
                <tr>
                    <td style="font-weight:600;"><i class="fa-solid ${cat.icon}" style="margin-right:8px; color:var(--primary-color);"></i> ${cat.name}</td>
                    <td>${count} resources</td>
                </tr>
            `;
        });
        if (!hasCategoryData) {
            categoryBreakdownBody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:var(--text-muted);">No category mappings found.</td></tr>`;
        }

        // Render Quality Issues
        const qualityBody = document.getElementById('dash-quality-issues');
        qualityBody.innerHTML = '';
        if (qualityIssues.length === 0) {
            qualityBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:20px;">All clear! No issues found.</td></tr>`;
        } else {
            qualityIssues.slice(0, 5).forEach(issue => {
                qualityBody.innerHTML += `
                    <tr>
                        <td style="font-weight:600;">${issue.name}</td>
                        <td>${issue.location}</td>
                        <td><span style="color:#e11d48; font-weight:600;">${issue.issues}</span></td>
                        <td><button class="btn btn-secondary btn-sm" onclick="editResource(${issue.id})">Fix</button></td>
                    </tr>
                `;
            });
        }

    } catch (e) {
        console.error("Dashboard calculation failed", e);
    }

    hideLoading();
}

/* =========================================================================
   SECTION 2: RESOURCES LIST MANAGER
   ========================================================================= */

let selectedResourceIds = [];

function loadResourcesList() {
    selectedResourceIds = [];
    document.getElementById('res-bulk-bar').style.display = 'none';
    document.getElementById('res-select-all').checked = false;

    // Reset filters bindings
    const applyBtn = document.getElementById('btn-apply-filters');
    const resetBtn = document.getElementById('btn-reset-filters');
    
    // Remove previous listeners
    const newApply = applyBtn.cloneNode(true);
    applyBtn.parentNode.replaceChild(newApply, applyBtn);
    const newReset = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newReset, resetBtn);

    document.getElementById('btn-apply-filters').addEventListener('click', () => {
        resourcesCurrentPage = 1;
        fetchResourcesTable();
    });

    document.getElementById('btn-reset-filters').addEventListener('click', () => {
        document.getElementById('res-search').value = '';
        document.getElementById('res-filter-state').value = '';
        document.getElementById('res-filter-category').value = '';
        document.getElementById('res-filter-status').value = '';
        resourcesCurrentPage = 1;
        fetchResourcesTable();
    });

    // Setup Bulk triggers
    setupBulkActions();

    fetchResourcesTable();
}

async function fetchResourcesTable() {
    showLoading("Loading resources...");
    
    const searchVal = document.getElementById('res-search').value.trim();
    const stateVal = document.getElementById('res-filter-state').value;
    const catVal = document.getElementById('res-filter-category').value;
    const statusVal = document.getElementById('res-filter-status').value;

    try {
        let query = supabase.from('resources').select('id, name, city, state, rating, status, verification_status, updated_at', { count: 'exact' });

        // Apply filters
        if (searchVal) {
            query = query.or(`name.ilike.%${searchVal}%,source_id.eq.${searchVal}`);
        }
        if (stateVal) {
            query = query.eq('state', stateVal);
        }
        if (statusVal) {
            query = query.eq('status', statusVal);
        }

        // Category filter is join table: get mapped resource IDs first
        if (catVal) {
            const { data: mappedRes } = await supabase.from('resource_categories').select('resource_id').eq('category_id', catVal);
            const resourceIds = (mappedRes || []).map(r => r.resource_id);
            query = query.in('id', resourceIds.length > 0 ? resourceIds : [-1]); // If none mapped, query -1 to return empty
        }

        // Apply Pagination
        const from = (resourcesCurrentPage - 1) * resourcesPerPage;
        const to = from + resourcesPerPage - 1;
        
        query = query.order('updated_at', { ascending: false })
                     .range(from, to);

        const { data: resourcesList, count, error } = await query;

        if (error) throw error;

        resourcesTotalCount = count || 0;

        // Render Table rows
        const tableBody = document.getElementById('res-table-body');
        tableBody.innerHTML = '';

        if (!resourcesList || resourcesList.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 40px; color:var(--text-muted);">No resources found matching search criteria.</td></tr>`;
        } else {
            // Retrieve category mappings in one batch to reduce latency
            const resIds = resourcesList.map(r => r.id);
            const { data: resCats } = await supabase.from('resource_categories').select('resource_id, category_id').in('resource_id', resIds);

            resourcesList.forEach(res => {
                const checked = selectedResourceIds.includes(res.id) ? 'checked' : '';
                
                // Get Categories for resource
                const mappings = resCats ? resCats.filter(rc => rc.resource_id === res.id) : [];
                const catNames = mappings.map(m => dbCategories.find(c => c.id === m.category_id)?.name || '').filter(n => n).join(', ');

                // Status Badge class
                let statusClass = 'badge-muted';
                if (res.status === 'Published') statusClass = 'badge-success';
                else if (res.status === 'Draft') statusClass = 'badge-info';
                else if (res.status === 'Needs Review') statusClass = 'badge-warning';
                else if (res.status === 'Archived') statusClass = 'badge-danger';

                const updatedDate = new Date(res.updated_at).toLocaleDateString();

                tableBody.innerHTML += `
                    <tr class="${checked ? 'selected' : ''}">
                        <td><input type="checkbox" class="res-row-select" data-id="${res.id}" ${checked}></td>
                        <td style="font-weight:700; color:var(--text-primary);">${res.name}</td>
                        <td>${res.city}, ${res.state}</td>
                        <td style="font-size:0.78rem; font-weight:600; color:var(--text-secondary);">${catNames || 'N/A'}</td>
                        <td><span style="font-weight:700;"><i class="fa-solid fa-star" style="color:#eab308; margin-right:4px;"></i> ${res.rating.toFixed(1)}</span></td>
                        <td><span class="badge ${statusClass}">${res.status}</span></td>
                        <td><span class="badge badge-muted">${res.verification_status}</span></td>
                        <td>${updatedDate}</td>
                        <td>
                            <div class="table-actions">
                                <button class="action-btn" title="Edit" onclick="editResource(${res.id})"><i class="fa-solid fa-pencil"></i></button>
                                <button class="action-btn" title="Preview Public Page" onclick="previewPublicResource('${res.slug}')"><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }

        // Setup individual row checkboxes click listeners
        setupRowSelection();

        // Render Pagination numbers
        renderPaginationControls(from, to);

    } catch (e) {
        console.error("Failed to load resources list", e);
    }

    hideLoading();
}

function setupRowSelection() {
    const rowCheckboxes = document.querySelectorAll('.res-row-select');
    const selectAllCheckbox = document.getElementById('res-select-all');

    rowCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const id = parseInt(cb.getAttribute('data-id'));
            const tr = cb.closest('tr');
            if (cb.checked) {
                selectedResourceIds.push(id);
                tr.classList.add('selected');
            } else {
                selectedResourceIds = selectedResourceIds.filter(val => val !== id);
                tr.classList.remove('selected');
            }
            updateBulkBar();
        });
    });

    selectAllCheckbox.onclick = () => {
        rowCheckboxes.forEach(cb => {
            const id = parseInt(cb.getAttribute('data-id'));
            const tr = cb.closest('tr');
            cb.checked = selectAllCheckbox.checked;
            if (selectAllCheckbox.checked) {
                if (!selectedResourceIds.includes(id)) selectedResourceIds.push(id);
                tr.classList.add('selected');
            } else {
                selectedResourceIds = selectedResourceIds.filter(val => val !== id);
                tr.classList.remove('selected');
            }
        });
        updateBulkBar();
    };
}

function updateBulkBar() {
    const bulkBar = document.getElementById('res-bulk-bar');
    const selectedCount = document.getElementById('res-selected-count');

    if (selectedResourceIds.length > 0) {
        bulkBar.style.display = 'flex';
        selectedCount.textContent = selectedResourceIds.length;
    } else {
        bulkBar.style.display = 'none';
    }
}

function renderPaginationControls(from, to) {
    const infoEl = document.getElementById('res-pagination-info');
    const buttonsContainer = document.getElementById('res-pagination-buttons');
    
    const countDisplay = resourcesTotalCount;
    infoEl.textContent = countDisplay > 0 ? `Showing ${from + 1}-${Math.min(to + 1, countDisplay)} of ${countDisplay} entries` : `Showing 0-0 of 0 entries`;

    buttonsContainer.innerHTML = '';
    const totalPages = Math.ceil(countDisplay / resourcesPerPage);

    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.disabled = resourcesCurrentPage === 1;
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.addEventListener('click', () => {
        resourcesCurrentPage--;
        fetchResourcesTable();
    });
    buttonsContainer.appendChild(prevBtn);

    // Number Buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, resourcesCurrentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${p === resourcesCurrentPage ? 'page-active' : ''}`;
        pageBtn.textContent = p;
        pageBtn.addEventListener('click', () => {
            resourcesCurrentPage = p;
            fetchResourcesTable();
        });
        buttonsContainer.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.disabled = resourcesCurrentPage === totalPages;
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.addEventListener('click', () => {
        resourcesCurrentPage++;
        fetchResourcesTable();
    });
    buttonsContainer.appendChild(nextBtn);
}

function setupBulkActions() {
    document.getElementById('bulk-publish').onclick = () => bulkUpdateStatus('Published');
    document.getElementById('bulk-unpublish').onclick = () => bulkUpdateStatus('Draft');
    
    document.getElementById('bulk-delete').onclick = () => {
        showConfirmModal(
            `Delete ${selectedResourceIds.length} Resources`,
            `Are you absolutely sure you want to delete the ${selectedResourceIds.length} selected resources? This operation is permanent and cannot be undone.`,
            async () => {
                showLoading("Deleting resources...");
                try {
                    const { error } = await supabase.from('resources').delete().in('id', selectedResourceIds);
                    if (error) throw error;
                    alert("Selected resources deleted successfully.");
                    loadResourcesList();
                } catch (e) {
                    alert("Delete failed: " + e.message);
                    hideLoading();
                }
            }
        );
    };
}

async function bulkUpdateStatus(newStatus) {
    showLoading(`Updating resources status to ${newStatus}...`);
    try {
        const { error } = await supabase.from('resources').update({ status: newStatus }).in('id', selectedResourceIds);
        if (error) throw error;
        alert(`Status updated to ${newStatus} for selected resources.`);
        loadResourcesList();
    } catch (e) {
        alert("Bulk update failed: " + e.message);
        hideLoading();
    }
}

function previewPublicResource(slug) {
    window.open(`../resources/detail.html?slug=${slug}`, '_blank');
}

/* =========================================================================
   CONFIRMATION MODAL HELPER
   ========================================================================= */

function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-body').innerHTML = message;
    
    const confirmBtn = document.getElementById('confirm-yes-btn');
    // Replace listener
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    
    document.getElementById('confirm-yes-btn').addEventListener('click', () => {
        modal.style.display = 'none';
        onConfirm();
    });

    modal.style.display = 'flex';
}

/* =========================================================================
   SECTION 3: EXCEL / CSV IMPORT WORKFLOW WIZARD
   ========================================================================= */

// Define mapping presets
const AUTO_MAPPING_DICTIONARY = {
    name: ['resource name', 'name', 'facility name', 'title', 'center name', 'resource_name', 'facility_name'],
    source_id: ['source id', 'external id', 'id', 'source_id', 'external_id', 'provider id'],
    status: ['status', 'data status', 'data_status'],
    verification_status: ['verification status', 'verification_status', 'badge status'],
    about_short: ['short description', 'about short', 'excerpt', 'about_short', 'description_short'],
    about_long: ['long description', 'about long', 'about_long', 'description_long', 'body'],
    phone: ['phone', 'phone number', 'tel', 'phone_number'],
    email: ['email', 'email address', 'email_address'],
    website: ['website', 'website url', 'url', 'web_link', 'website_url'],
    google_business_url: ['google profile', 'google maps link', 'google_business_url', 'google profile url'],
    address: ['address', 'street address', 'street', 'address_line1'],
    address_line2: ['address 2', 'address line 2', 'address_line2', 'suite', 'unit'],
    city: ['city', 'town', 'city_name'],
    county: ['county', 'parish', 'district'],
    state: ['state', 'state code', 'state abbreviation', 'state_code'],
    zip: ['zip', 'zipcode', 'zip code', 'postal code', 'postal_code'],
    latitude: ['latitude', 'lat', 'lat_coord'],
    longitude: ['longitude', 'lon', 'lng', 'lon_coord'],
    rating: ['rating', 'google rating', 'stars'],
    review_count: ['review count', 'reviews', 'review_count'],
    insurance_accepted: ['insurance accepted', 'insurance accepted providers', 'insurance_accepted'],
    payment_options: ['payment options', 'payment methods', 'payment_options'],
    founded_year: ['founded year', 'year founded', 'founded_year'],
    bed_count: ['bed count', 'capacity', 'beds', 'bed_count'],
    accreditation: ['accreditation', 'accreditations', 'accreditation_details'],
    licensing: ['licensing', 'license', 'registry info'],
    program_length: ['program length', 'duration', 'program_length']
};

let fileColumns = [];

function setupImportWizard() {
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('file-input');

    // Reset steps nodes visual
    updateImportStepsVisual(1);

    dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--primary-color)';
    };

    dropzone.ondragleave = () => {
        dropzone.style.borderColor = 'var(--support-border)';
    };

    dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--support-border)';
        if (e.dataTransfer.files.length > 0) {
            handleUploadedFile(e.dataTransfer.files[0]);
        }
    };

    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            handleUploadedFile(fileInput.files[0]);
        }
    };
}

function handleUploadedFile(file) {
    showLoading("Reading spreadsheet file...");

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            importSheetNames = workbook.SheetNames;
            
            // Set first sheet active initially
            importSelectedSheet = importSheetNames[0];
            
            // Display details
            document.getElementById('meta-file-name').textContent = file.name;
            document.getElementById('meta-file-size').textContent = (file.size / 1024).toFixed(1);
            
            // Render Sheet Selector if workbook has multiple sheets
            const sheetSelect = document.getElementById('sheet-select');
            const selectorWrapper = document.getElementById('sheet-select-wrapper');
            if (importSheetNames.length > 1) {
                selectorWrapper.style.display = 'block';
                sheetSelect.innerHTML = '';
                importSheetNames.forEach(sheet => {
                    sheetSelect.innerHTML += `<option value="${sheet}">${sheet}</option>`;
                });
                
                sheetSelect.onchange = () => {
                    importSelectedSheet = sheetSelect.value;
                    parseSheetData(workbook);
                };
            } else {
                selectorWrapper.style.display = 'none';
            }

            parseSheetData(workbook);

            document.getElementById('upload-file-meta').style.display = 'block';
            
            // Proceed button bind
            document.getElementById('btn-next-step-1').onclick = () => {
                loadColumnMappingStep();
            };

        } catch (err) {
            alert("Error parsing workbook: " + err.message);
        }
        hideLoading();
    };
    reader.readAsArrayBuffer(file);
}

function parseSheetData(workbook) {
    const sheet = workbook.Sheets[importSelectedSheet];
    // Convert sheet to json array of objects
    importFileRawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    document.getElementById('meta-row-count').textContent = importFileRawData.length;

    // Get column names from first row keys
    if (importFileRawData.length > 0) {
        fileColumns = Object.keys(importFileRawData[0]);
    } else {
        fileColumns = [];
    }
}

function updateImportStepsVisual(stepNum) {
    for (let i = 1; i <= 5; i++) {
        const stepNode = document.getElementById(`step-node-${i}`);
        if (stepNode) {
            stepNode.classList.remove('active', 'completed');
            if (i < stepNum) {
                stepNode.classList.add('completed');
            } else if (i === stepNum) {
                stepNode.classList.add('active');
            }
        }
    }

    // Toggle panels visibility
    for (let i = 1; i <= 5; i++) {
        const panel = document.getElementById(`import-panel-${i}`);
        if (panel) panel.style.display = (i === stepNum) ? 'block' : 'none';
    }
}

/* WIZARD STEP 2: COLUMN MAPPING */
function loadColumnMappingStep() {
    if (importFileRawData.length === 0) {
        alert("Spreadsheet does not contain any valid data rows.");
        return;
    }

    updateImportStepsVisual(2);

    const mappingContainer = document.getElementById('mapping-container');
    mappingContainer.innerHTML = '';

    // Database fields to select from
    const dbFieldsOptions = `
        <option value="">[ Ignore ]</option>
        <option value="name">Resource Name (Required)</option>
        <option value="source_id">Source ID / External ID</option>
        <option value="about_short">Short Description</option>
        <option value="about_long">Long Description</option>
        <option value="phone">Phone Number</option>
        <option value="email">Email Address</option>
        <option value="website">Website URL</option>
        <option value="google_business_url">Google Profile URL</option>
        <option value="address">Street Address</option>
        <option value="address_line2">Address Line 2</option>
        <option value="city">City (Required)</option>
        <option value="county">County</option>
        <option value="state">State Abbreviation (Required)</option>
        <option value="zip">ZIP Code</option>
        <option value="latitude">Latitude</option>
        <option value="longitude">Longitude</option>
        <option value="rating">Rating (0-5)</option>
        <option value="review_count">Review Count</option>
        <option value="insurance_accepted">Insurance Accepted (List)</option>
        <option value="payment_options">Payment Methods</option>
        <option value="founded_year">Year Founded</option>
        <option value="bed_count">Capacity Beds</option>
        <option value="accreditation">Accreditation Info</option>
        <option value="licensing">Licensing Info</option>
        <option value="program_length">Program Length</option>
    `;

    fileColumns.forEach((col, idx) => {
        const row = document.createElement('div');
        row.className = 'mapping-row';
        
        // Auto match mapping logic
        let matchedField = "";
        const lowerCol = col.toLowerCase().trim();
        for (const [field, synonyms] of Object.entries(AUTO_MAPPING_DICTIONARY)) {
            if (synonyms.includes(lowerCol)) {
                matchedField = field;
                break;
            }
        }

        row.innerHTML = `
            <div class="mapping-field"><i class="fa-solid fa-file-csv" style="color:var(--primary-color); margin-right:8px;"></i> ${col}</div>
            <div class="mapping-arrow"><i class="fa-solid fa-arrow-right"></i></div>
            <div>
                <select class="filter-input map-select-input" data-col="${col}" style="width: 100%;">
                    ${dbFieldsOptions}
                </select>
            </div>
        `;
        mappingContainer.appendChild(row);

        // Pre-select if auto-mapped
        if (matchedField) {
            const selectEl = row.querySelector('.map-select-input');
            selectEl.value = matchedField;
        }
    });

    // Navigation buttons
    document.getElementById('btn-back-step-2').onclick = () => updateImportStepsVisual(1);
    
    document.getElementById('btn-next-step-2').onclick = () => {
        // Collect mapping config
        importMappedColumns = {};
        const selects = document.querySelectorAll('.map-select-input');
        selects.forEach(sel => {
            const col = sel.getAttribute('data-col');
            const val = sel.value;
            if (val) {
                importMappedColumns[val] = col;
            }
        });

        // Validate required fields are mapped
        if (!importMappedColumns.name || !importMappedColumns.city || !importMappedColumns.state) {
            alert("Critical Column Mapping Error: You must map 'Resource Name', 'City', and 'State Abbreviation' before proceeding.");
            return;
        }

        runImportValidation();
    };
}

/* WIZARD STEP 3: DATA VALIDATION */
function runImportValidation() {
    updateImportStepsVisual(3);
    showLoading("Validating spreadsheet rows...");

    importValidationResults = {
        valid: [],
        warning: [],
        invalid: []
    };

    const issuesList = document.getElementById('validation-issues-list');
    issuesList.innerHTML = '';

    importFileRawData.forEach((row, idx) => {
        const rowNum = idx + 1;
        const name = row[importMappedColumns.name] || '';
        const city = row[importMappedColumns.city] || '';
        const state = (row[importMappedColumns.state] || '').trim().toUpperCase();
        
        let errors = [];
        let warnings = [];

        // 1. Core Errors
        if (!name.trim()) {
            errors.push("Missing Resource Name");
        }
        if (!city.trim()) {
            errors.push("Missing City");
        }
        if (!state.trim()) {
            errors.push("Missing State Code");
        } else if (state.length !== 2) {
            errors.push(`Invalid State Code format: '${state}' (must be 2-letter abbreviation)`);
        } else {
            // Check state matches seed database list
            const matchedState = dbStates.find(s => s.code === state);
            if (!matchedState) {
                errors.push(`State code '${state}' is not mapped to any US states in database.`);
            }
        }

        // 2. Format Warnings
        const email = row[importMappedColumns.email] || '';
        if (email && !email.includes('@')) {
            warnings.push(`Malformed email format: '${email}'`);
        }

        const website = row[importMappedColumns.website] || '';
        if (website && !website.startsWith('http')) {
            warnings.push(`Website URL missing protocol prefix (http/https): '${website}'`);
        }

        const zip = row[importMappedColumns.zip] || '';
        if (zip && isNaN(zip)) {
            warnings.push(`ZIP Code is not numeric: '${zip}'`);
        }

        const lat = row[importMappedColumns.latitude];
        const lon = row[importMappedColumns.longitude];
        if ((lat && isNaN(lat)) || (lon && isNaN(lon))) {
            warnings.push("Latitude or Longitude coordinate is not a valid floating number");
        }

        // Group rows based on issues
        const processedRow = {
            rowNum,
            name,
            city,
            state,
            rawData: row,
            errors,
            warnings
        };

        if (errors.length > 0) {
            importValidationResults.invalid.push(processedRow);
        } else if (warnings.length > 0) {
            importValidationResults.warning.push(processedRow);
        } else {
            importValidationResults.valid.push(processedRow);
        }
    });

    // Populate Counts
    document.getElementById('val-valid-count').textContent = importValidationResults.valid.length;
    document.getElementById('val-warning-count').textContent = importValidationResults.warning.length;
    document.getElementById('val-invalid-count').textContent = importValidationResults.invalid.length;

    // Render log messages
    const allIssues = [...importValidationResults.invalid, ...importValidationResults.warning];
    if (allIssues.length === 0) {
        issuesList.innerHTML = `<p style="color:#10b981; text-align:center; padding: 20px; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Validation passed! 100% of rows are valid.</p>`;
        document.getElementById('btn-download-errors').style.display = 'none';
    } else {
        document.getElementById('btn-download-errors').style.display = 'inline-flex';
        allIssues.slice(0, 100).forEach(issue => {
            const type = issue.errors.length > 0 ? 'invalid' : 'warning';
            const icon = type === 'invalid' ? 'fa-circle-xmark' : 'fa-triangle-exclamation';
            const message = type === 'invalid' ? issue.errors.join(", ") : issue.warnings.join(", ");
            
            issuesList.innerHTML += `
                <div class="validation-item ${type}">
                    <div class="validation-status-icon"><i class="fa-solid ${icon}"></i></div>
                    <div class="validation-details">
                        <h4>Row ${issue.rowNum}: ${issue.name || 'Unnamed Resource'}</h4>
                        <p>${message}</p>
                    </div>
                </div>
            `;
        });

        // Add downloader trigger
        document.getElementById('btn-download-errors').onclick = () => {
            downloadValidationLogsCSV(allIssues);
        };
    }

    hideLoading();

    // Navigation buttons
    document.getElementById('btn-back-step-3').onclick = () => updateImportStepsVisual(2);
    
    document.getElementById('btn-next-step-3').onclick = () => {
        if (importValidationResults.valid.length === 0 && importValidationResults.warning.length === 0) {
            alert("No importable rows available. Please upload a spreadsheet containing valid resource items.");
            return;
        }
        loadDuplicateRulesStep();
    };
}

function downloadValidationLogsCSV(allIssues) {
    let csvContent = "data:text/csv;charset=utf-8,Row Number,Resource Name,Type,Issues Detected\r\n";
    allIssues.forEach(issue => {
        const type = issue.errors.length > 0 ? "Error" : "Warning";
        const message = type === "Error" ? issue.errors.join("; ") : issue.warnings.join("; ");
        csvContent += `"${issue.rowNum}","${issue.name.replace(/"/g, '""')}","${type}","${message.replace(/"/g, '""')}"\r\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `validation_errors_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* WIZARD STEP 4: DUPLICATE RULES */
function loadDuplicateRulesStep() {
    updateImportStepsVisual(4);

    // Navigation bindings
    document.getElementById('btn-back-step-4').onclick = () => updateImportStepsVisual(3);
    
    document.getElementById('btn-next-step-4').onclick = () => {
        // Collect duplicate rule parameters
        importDuplicateConfig.rules.source = document.getElementById('dup-rule-source').checked;
        importDuplicateConfig.rules.nameLoc = document.getElementById('dup-rule-name-loc').checked;
        importDuplicateConfig.rules.website = document.getElementById('dup-rule-website').checked;
        importDuplicateConfig.rules.phone = document.getElementById('dup-rule-phone').checked;
        
        importDuplicateConfig.action = document.querySelector('name="dup-action"').checked ? 
            document.querySelector('input[name="dup-action"]:checked').value : 'skip';

        loadPreviewStep();
    };
}

/* WIZARD STEP 5: PREVIEW & BATCH COMMIT */
async function loadPreviewStep() {
    updateImportStepsVisual(5);
    showLoading("Analyzing duplicates...");

    // Retrieve import-eligible rows (valid + warning rows)
    const eligibleRows = [...importValidationResults.valid, ...importValidationResults.warning];
    
    let projectedNew = 0;
    let projectedUpdate = 0;
    let projectedSkip = 0;

    // Fetch existing records for duplicate comparisons
    try {
        const { data: dbRecords } = await supabase.from('resources').select('id, name, city, state, website, phone, source_id');
        
        eligibleRows.forEach(row => {
            const raw = row.rawData;
            const sourceId = raw[importMappedColumns.source_id] || '';
            const name = (raw[importMappedColumns.name] || '').trim().toLowerCase();
            const city = (raw[importMappedColumns.city] || '').trim().toLowerCase();
            const state = (raw[importMappedColumns.state] || '').trim().toUpperCase();
            const website = (raw[importMappedColumns.website] || '').trim().toLowerCase();
            const phone = (raw[importMappedColumns.phone] || '').replace(/\D/g, '');

            let duplicateFound = false;

            if (dbRecords) {
                for (const dbRec of dbRecords) {
                    // Check Rule 1: Source ID Match
                    if (importDuplicateConfig.rules.source && sourceId && dbRec.source_id === sourceId) {
                        duplicateFound = true;
                        row.matchedDbId = dbRec.id;
                        break;
                    }
                    // Check Rule 2: Name + Location Match
                    if (importDuplicateConfig.rules.nameLoc && name && city && state) {
                        if (dbRec.name.toLowerCase().trim() === name && 
                            dbRec.city.toLowerCase().trim() === city && 
                            dbRec.state.toUpperCase() === state) {
                            duplicateFound = true;
                            row.matchedDbId = dbRec.id;
                            break;
                        }
                    }
                    // Check Rule 3: Website Domain Match
                    if (importDuplicateConfig.rules.website && website && dbRec.website) {
                        if (dbRec.website.toLowerCase().includes(website) || website.includes(dbRec.website.toLowerCase())) {
                            duplicateFound = true;
                            row.matchedDbId = dbRec.id;
                            break;
                        }
                    }
                    // Check Rule 4: Phone Match
                    if (importDuplicateConfig.rules.phone && phone && dbRec.phone) {
                        const cleanDbPhone = dbRec.phone.replace(/\D/g, '');
                        if (cleanDbPhone === phone) {
                            duplicateFound = true;
                            row.matchedDbId = dbRec.id;
                            break;
                        }
                    }
                }
            }

            if (duplicateFound) {
                row.isDuplicate = true;
                if (importDuplicateConfig.action === 'skip') {
                    projectedSkip++;
                } else {
                    projectedUpdate++;
                }
            } else {
                row.isDuplicate = false;
                projectedNew++;
            }
        });

        // Set Metric values
        document.getElementById('proj-new-count').textContent = projectedNew;
        document.getElementById('proj-update-count').textContent = projectedUpdate;
        document.getElementById('proj-skipped-count').textContent = projectedSkip;

        // Render Preview Table headers & rows
        const previewHeader = document.getElementById('preview-table-header');
        const previewBody = document.getElementById('preview-table-body');
        
        previewHeader.innerHTML = '<th>Row #</th>';
        const activeMappedFields = Object.keys(importMappedColumns).slice(0, 5); // Show first 5 mapped fields for space
        activeMappedFields.forEach(field => {
            previewHeader.innerHTML += `<th>${field}</th>`;
        });
        previewHeader.innerHTML += '<th>Projected Result</th>';

        previewBody.innerHTML = '';
        eligibleRows.slice(0, 5).forEach(row => {
            const raw = row.rawData;
            let rowHtml = `<tr><td>${row.rowNum}</td>`;
            activeMappedFields.forEach(field => {
                const colName = importMappedColumns[field];
                rowHtml += `<td>${raw[colName] || ''}</td>`;
            });

            // projected result badge
            let resultBadge = '<span class="badge badge-success">INSERT (New)</span>';
            if (row.isDuplicate) {
                resultBadge = importDuplicateConfig.action === 'skip' ? 
                    '<span class="badge badge-danger">SKIP (Duplicate)</span>' : 
                    '<span class="badge badge-warning">UPDATE (Duplicate)</span>';
            }
            rowHtml += `<td>${resultBadge}</td></tr>`;
            previewBody.innerHTML += rowHtml;
        });

    } catch (e) {
        console.error("Preview preparation failed", e);
    }

    hideLoading();

    // Bind Navigation actions
    document.getElementById('btn-back-step-5').onclick = () => updateImportStepsVisual(4);
    
    document.getElementById('btn-commit-import').onclick = () => {
        showConfirmModal(
            "Finalize spreadsheet import",
            "This will upload the mapped resources into the database. Are you sure you want to proceed?",
            () => executeStagedImport(eligibleRows)
        );
    };
}

async function executeStagedImport(eligibleRows) {
    document.getElementById('import-preview-footer-actions').style.display = 'none';
    const progressWrapper = document.getElementById('import-progress-wrapper');
    const progressBar = document.getElementById('import-progress-bar');
    const progressText = document.getElementById('import-progress-status');
    const progressPercent = document.getElementById('import-progress-percentage');
    progressWrapper.style.display = 'block';

    const batchSize = 20; // Supabase bulk inserts optimized batch size
    const totalRows = eligibleRows.length;
    let processedCount = 0;

    let newCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    // Create import batch record in Supabase
    let batchId = null;
    try {
        const { data: batch, error } = await supabase.from('import_batches').insert({
            file_name: document.getElementById('meta-file-name').textContent,
            uploaded_by: currentUser.email,
            row_count: totalRows,
            status: 'Processing'
        }).select().single();
        
        if (error) throw error;
        batchId = batch.id;
    } catch (e) {
        alert("Failed to initialize import log tracking batch: " + e.message);
        document.getElementById('import-preview-footer-actions').style.display = 'flex';
        progressWrapper.style.display = 'none';
        return;
    }

    // Process rows in batches loop
    for (let i = 0; i < totalRows; i += batchSize) {
        const chunk = eligibleRows.slice(i, i + batchSize);
        const inserts = [];
        const updates = [];
        const logs = [];

        chunk.forEach(row => {
            const raw = row.rawData;

            if (row.isDuplicate && importDuplicateConfig.action === 'skip') {
                skippedCount++;
                logs.push({
                    batch_id: batchId,
                    row_number: row.rowNum,
                    resource_name: row.name,
                    status: 'Warning',
                    message: 'Skipped: Duplicate record detected.'
                });
                return;
            }

            // Map data record attributes
            const resourceObj = {
                name: raw[importMappedColumns.name],
                source_id: raw[importMappedColumns.source_id] || null,
                slug: raw[importMappedColumns.slug] || generateSlug(raw[importMappedColumns.name]),
                status: 'Imported', // Default to Imported status
                verification_status: raw[importMappedColumns.verification_status] || 'Demo Data',
                about_short: raw[importMappedColumns.about_short] || null,
                about_long: raw[importMappedColumns.about_long] || null,
                phone: raw[importMappedColumns.phone] || null,
                email: raw[importMappedColumns.email] || null,
                website: raw[importMappedColumns.website] || null,
                google_business_url: raw[importMappedColumns.google_business_url] || null,
                address: raw[importMappedColumns.address] || null,
                address_line2: raw[importMappedColumns.address_line2] || null,
                city: raw[importMappedColumns.city],
                county: raw[importMappedColumns.county] || null,
                state: (raw[importMappedColumns.state] || '').trim().toUpperCase(),
                zip: raw[importMappedColumns.zip] || null,
                latitude: parseFloat(raw[importMappedColumns.latitude]) || null,
                longitude: parseFloat(raw[importMappedColumns.longitude]) || null,
                rating: parseFloat(raw[importMappedColumns.rating]) || 0.0,
                review_count: parseInt(raw[importMappedColumns.review_count]) || 0,
                founded_year: parseInt(raw[importMappedColumns.founded_year]) || null,
                bed_count: parseInt(raw[importMappedColumns.bed_count]) || null,
                licensing: raw[importMappedColumns.licensing] || null,
                program_length: raw[importMappedColumns.program_length] || null,
                last_imported_at: new Date().toISOString()
            };

            // Accreditations and insurance array lists mappings parsing
            const insuranceRaw = raw[importMappedColumns.insurance_accepted] || '';
            if (insuranceRaw) {
                resourceObj.insurance_accepted = insuranceRaw.split(',').map(s => s.trim()).filter(Boolean);
            }

            const accreditRaw = raw[importMappedColumns.accreditation] || '';
            if (accreditRaw) {
                resourceObj.acacreditation = accreditRaw.split(',').map(s => s.trim()).filter(Boolean);
            }

            if (row.isDuplicate && importDuplicateConfig.action === 'update') {
                resourceObj.id = row.matchedDbId;
                updates.push(resourceObj);
            } else {
                inserts.push(resourceObj);
            }
        });

        // Commit DB insertions
        if (inserts.length > 0) {
            try {
                const { data: insertedRecords, error } = await supabase.from('resources').insert(inserts).select();
                if (error) throw error;
                newCount += insertedRecords.length;
                insertedRecords.forEach(rec => {
                    logs.push({
                        batch_id: batchId,
                        row_number: chunk.find(c => c.name === rec.name)?.rowNum || 0,
                        resource_name: rec.name,
                        status: 'Success',
                        message: 'Inserted new resource record successfully.',
                        imported_resource_id: rec.id
                    });
                });
            } catch (e) {
                console.error("Batch insert error", e);
                failedCount += inserts.length;
                inserts.forEach(ins => {
                    logs.push({
                        batch_id: batchId,
                        row_number: chunk.find(c => c.name === ins.name)?.rowNum || 0,
                        resource_name: ins.name,
                        status: 'Failed',
                        message: 'Insert failed: ' + e.message
                    });
                });
            }
        }

        // Commit DB updates
        if (updates.length > 0) {
            for (const upd of updates) {
                try {
                    const { error } = await supabase.from('resources').update(upd).eq('id', upd.id);
                    if (error) throw error;
                    updatedCount++;
                    logs.push({
                        batch_id: batchId,
                        row_number: chunk.find(c => c.name === upd.name)?.rowNum || 0,
                        resource_name: upd.name,
                        status: 'Success',
                        message: 'Updated duplicate resource record successfully.',
                        imported_resource_id: upd.id
                    });
                } catch (e) {
                    console.error("Row update error", e);
                    failedCount++;
                    logs.push({
                        batch_id: batchId,
                        row_number: chunk.find(c => c.name === upd.name)?.rowNum || 0,
                        resource_name: upd.name,
                        status: 'Failed',
                        message: 'Update failed: ' + e.message
                    });
                }
            }
        }

        // Save Batch logs
        if (logs.length > 0) {
            await supabase.from('import_logs').insert(logs);
        }

        // Update progress bar
        processedCount += chunk.length;
        const percent = Math.round((processedCount / totalRows) * 100);
        progressBar.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
        progressText.textContent = `Imported ${processedCount} of ${totalRows} records...`;
    }

    // Update Import batch status to completed
    try {
        await supabase.from('import_batches').update({
            new_count: newCount,
            updated_count: updatedCount,
            skipped_count: skippedCount,
            failed_count: failedCount,
            status: 'Completed'
        }).eq('id', batchId);
    } catch (e) {
        console.error("Batch close failed", e);
    }

    alert(`Spreadsheet import complete! Mapped rows: ${totalRows}. New: ${newCount}, Updated: ${updatedCount}, Skipped: ${skippedCount}, Failed: ${failedCount}`);
    
    // Switch to import history logs view
    switchSection('history');
}

function generateSlug(text) {
    return text.toString().toLowerCase().trim()
        .replace(/&/g, '-and-')         // Replace & with 'and'
        .replace(/[^a-z0-9 -]/g, '')     // Remove invalid chars
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/-+/g, '-');           // Remove duplicate -
}

/* =========================================================================
   SECTION 4: STATES & LOCATIONS
   ========================================================================= */

async function loadLocationsList() {
    showLoading("Loading locations...");
    const tableBody = document.getElementById('loc-table-body');
    tableBody.innerHTML = '';

    try {
        // Query resource state count groupings
        const { data: resources } = await supabase.from('resources').select('state');
        const stateCounts = {};
        if (resources) {
            resources.forEach(r => {
                if (r.state) stateCounts[r.state] = (stateCounts[r.state] || 0) + 1;
            });
        }

        dbStates.forEach(state => {
            const count = stateCounts[state.code] || 0;
            const citiesStr = state.cities ? state.cities.join(', ') : 'None listed';
            tableBody.innerHTML += `
                <tr>
                    <td style="font-weight:700; color:var(--text-primary);">${state.code}</td>
                    <td style="font-weight:600;">${state.name}</td>
                    <td><span class="badge ${count > 0 ? 'badge-success' : 'badge-muted'}">${count} Resources</span></td>
                    <td style="font-size:0.8rem; color:var(--text-secondary); max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${citiesStr}">${citiesStr}</td>
                </tr>
            `;
        });
    } catch (e) {
        console.error("Locations fetch failed", e);
    }
    hideLoading();
}

/* =========================================================================
   SECTION 5: CATEGORIES & TAXONOMY
   ========================================================================= */

async function loadTaxonomyList() {
    showLoading("Loading taxonomy terms...");
    
    const catListBody = document.getElementById('tax-categories-list');
    catListBody.innerHTML = '';

    const summaryContainer = document.getElementById('tax-terms-summary');
    summaryContainer.innerHTML = '';

    try {
        // Categories list
        const { data: resCats } = await supabase.from('resource_categories').select('category_id');
        const catCounts = {};
        if (resCats) {
            resCats.forEach(rc => {
                catCounts[rc.category_id] = (catCounts[rc.category_id] || 0) + 1;
            });
        }

        dbCategories.forEach(cat => {
            const count = catCounts[cat.id] || 0;
            catListBody.innerHTML += `
                <tr>
                    <td>${cat.display_order}</td>
                    <td style="font-weight:700; color:var(--text-primary);">${cat.name}</td>
                    <td><i class="fa-solid ${cat.icon}" style="color:var(--primary-color);"></i> <code>${cat.icon}</code></td>
                    <td><span class="badge ${cat.is_active ? 'badge-success' : 'badge-muted'}">${cat.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td><span class="badge badge-info">${count} mapped</span></td>
                </tr>
            `;
        });

        // Add taxonomy term submit listener
        const form = document.getElementById('tax-term-form');
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        document.getElementById('tax-term-form').onsubmit = async (e) => {
            e.preventDefault();
            const type = document.getElementById('tax-term-type').value;
            const name = document.getElementById('tax-term-name').value.trim();
            const order = parseInt(document.getElementById('tax-term-order').value) || 0;
            const slug = generateSlug(name);

            showLoading("Adding taxonomy tag...");
            try {
                const { error } = await supabase.from('taxonomy_terms').insert({
                    type,
                    name,
                    slug,
                    display_order: order
                });
                if (error) throw error;
                alert("Taxonomy tag term added successfully.");
                await loadInitialTaxonomy();
                loadTaxonomyList();
            } catch (err) {
                alert("Add failed: " + err.message);
                hideLoading();
            }
        };

        // Render dynamic summary counts
        const typeLabels = {
            treatment_type: "Treatment Type",
            level_of_care: "Level of Care",
            condition: "Condition",
            therapy: "Therapy",
            amenity: "Amenity",
            insurance_provider: "Insurance",
            accreditation: "Accreditation"
        };

        const typeCounts = {};
        dbTaxonomyTerms.forEach(t => {
            typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
        });

        Object.keys(typeLabels).forEach(type => {
            const count = typeCounts[type] || 0;
            summaryContainer.innerHTML += `
                <span class="badge badge-muted" style="padding:6px 12px; margin-bottom:4px;">${typeLabels[type]}: ${count} terms</span>
            `;
        });

    } catch (e) {
        console.error("Taxonomy rendering failed", e);
    }

    hideLoading();
}

/* =========================================================================
   SECTION 6: IMPORT HISTORY & ROLLBACK LOGS
   ========================================================================= */

async function loadImportHistory() {
    showLoading("Loading history logs...");
    const tableBody = document.getElementById('history-table-body');
    tableBody.innerHTML = '';

    try {
        const { data: batches } = await supabase.from('import_batches').select('*').order('created_at', { ascending: false });

        if (!batches || batches.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">No import batches recorded.</td></tr>`;
        } else {
            batches.forEach(b => {
                const dateStr = new Date(b.created_at).toLocaleString();
                
                let badgeClass = 'badge-muted';
                if (b.status === 'Completed') badgeClass = 'badge-success';
                else if (b.status === 'Processing') badgeClass = 'badge-info';
                else if (b.status === 'Rolled Back') badgeClass = 'badge-danger';

                const rollbackBtn = b.status === 'Completed' ? 
                    `<button class="btn btn-danger btn-sm" onclick="rollbackImportBatch(${b.id}, '${b.file_name.replace(/'/g, "\\'")}')">Rollback</button>` : 
                    `<span>-</span>`;

                tableBody.innerHTML += `
                    <tr>
                        <td style="font-weight:700;">#${b.id}</td>
                        <td style="font-weight:600; color:var(--text-primary);">${b.file_name}</td>
                        <td>${dateStr}</td>
                        <td>${b.uploaded_by}</td>
                        <td><span style="color:#16a34a; font-weight:700;">+${b.new_count}</span></td>
                        <td><span style="color:#d97706; font-weight:700;">~${b.updated_count}</span></td>
                        <td><span style="color:#ef4444; font-weight:700;">${b.failed_count}</span></td>
                        <td><span class="badge ${badgeClass}">${b.status}</span></td>
                        <td>${rollbackBtn}</td>
                    </tr>
                `;
            });
        }
    } catch (e) {
        console.error("Import history logs query failed", e);
    }
    hideLoading();
}

async function rollbackImportBatch(batchId, fileName) {
    showConfirmModal(
        "Rollback Import Batch #" + batchId,
        `Are you absolutely sure you want to roll back the import for <strong>${fileName}</strong>? All resource records inserted in this batch will be deleted, and batch log status will set to Rolled Back.`,
        async () => {
            showLoading("Performing database rollback...");
            try {
                // Get resource IDs created during this batch
                const { data: logs } = await supabase.from('import_logs').select('imported_resource_id').eq('batch_id', batchId).eq('status', 'Success');
                
                const resourceIds = (logs || []).map(l => l.imported_resource_id).filter(Boolean);

                if (resourceIds.length > 0) {
                    const { error } = await supabase.from('resources').delete().in('id', resourceIds);
                    if (error) throw error;
                }

                // Update Batch status to rolled back
                await supabase.from('import_batches').update({ status: 'Rolled Back' }).eq('id', batchId);
                
                alert("Import batch rolled back successfully. Resources deleted: " + resourceIds.length);
                loadImportHistory();
            } catch (err) {
                alert("Rollback failed: " + err.message);
                hideLoading();
            }
        }
    );
}

/* =========================================================================
   SECTION 7: SETTINGS CONFIGURATION
   ========================================================================= */

function loadSettingsSection() {
    document.getElementById('settings-url').value = supabaseUrl || '';
    document.getElementById('settings-key').value = supabaseKey || '';

    const form = document.getElementById('settings-db-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const url = document.getElementById('settings-url').value.trim();
        const key = document.getElementById('settings-key').value.trim();

        localStorage.setItem('RECOVERYON_SUPABASE_URL', url);
        localStorage.setItem('RECOVERYON_SUPABASE_KEY', key);
        
        supabaseUrl = url;
        supabaseKey = key;
        supabase = window.supabase.createClient(url, key);

        alert("Connection parameters saved successfully.");
        location.reload();
    };
}

/* =========================================================================
   RESOURCE TABBED EDITOR VIEW CONTROLLER
   ========================================================================= */

let activeEditingResourceId = null;

async function editResource(resourceId) {
    showLoading("Opening resource editor...");
    activeEditingResourceId = resourceId;

    // Reset Tabs Focus
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="tab-basic"]').classList.add('active');
    document.getElementById('tab-basic').classList.add('active');

    // Populate taxonomy selectors
    renderEditorTaxonomyCheckboxes();

    try {
        const { data: res, error } = await supabase.from('resources').select('*').eq('id', resourceId).single();
        if (error) throw error;

        // Populate form inputs
        document.getElementById('editor-resource-name-header').textContent = `Edit: ${res.name}`;
        document.getElementById('ed-name').value = res.name || '';
        document.getElementById('ed-slug').value = res.slug || '';
        document.getElementById('ed-source-id').value = res.source_id || '';
        document.getElementById('ed-status').value = res.status || 'Imported';
        document.getElementById('ed-verification-status').value = res.verification_status || 'Demo Data';
        document.getElementById('ed-about-short').value = res.about_short || '';
        document.getElementById('ed-about-long').value = res.about_long || '';

        // Location
        document.getElementById('ed-address').value = res.address || '';
        document.getElementById('ed-address2').value = res.address_line2 || '';
        document.getElementById('ed-city').value = res.city || '';
        document.getElementById('ed-county').value = res.county || '';
        document.getElementById('ed-zip').value = res.zip || '';
        document.getElementById('ed-latitude').value = res.latitude || '';
        document.getElementById('ed-longitude').value = res.longitude || '';

        // Contacts
        document.getElementById('ed-phone').value = res.phone || '';
        document.getElementById('ed-email').value = res.email || '';
        document.getElementById('ed-website').value = res.website || '';
        document.getElementById('ed-google-profile').value = res.google_business_url || '';

        // Insurance & Payment
        document.getElementById('ed-payment-options').value = res.payment_options ? res.payment_options.join(', ') : '';
        document.getElementById('ed-insurance-accepted').value = res.insurance_accepted ? res.insurance_accepted.join(', ') : '';
        document.getElementById('ed-private-pay').checked = res.private_pay;
        document.getElementById('ed-financing').value = res.financing_info || '';

        // Media
        document.getElementById('ed-logo').value = res.logo || '';
        document.getElementById('ed-featured-image').value = res.featured_image || '';
        document.getElementById('ed-gallery').value = res.gallery ? res.gallery.join('\n') : '';
        document.getElementById('ed-image-alt').value = res.image_alt_text || '';

        // Org info
        document.getElementById('ed-founded').value = res.founded_year || '';
        document.getElementById('ed-beds').value = res.bed_count || '';
        document.getElementById('ed-accreditation').value = res.accreditation ? res.accreditation.join(', ') : '';
        document.getElementById('ed-licensing').value = res.licensing || '';
        document.getElementById('ed-program-length').value = res.program_length || '';
        document.getElementById('ed-google-rating').value = res.google_rating || '';
        document.getElementById('ed-google-review-count').value = res.google_review_count || '';

        // SEO
        document.getElementById('ed-seo-title').value = res.seo_title || '';
        document.getElementById('ed-seo-desc').value = res.meta_description || '';
        document.getElementById('ed-canonical').value = res.canonical_slug || '';
        document.getElementById('ed-index').checked = res.index_noindex;

        // Select State dropdown
        const stateSelect = document.getElementById('ed-state');
        stateSelect.innerHTML = '<option value="">Select State</option>';
        dbStates.forEach(s => {
            stateSelect.innerHTML += `<option value="${s.code}" ${res.state === s.code ? 'selected' : ''}>${s.name}</option>`;
        });

        // Set mapped checkboxes (Categories and taxonomy terms)
        const { data: resCats } = await supabase.from('resource_categories').select('category_id').eq('resource_id', resourceId);
        const mappedCatIds = (resCats || []).map(c => c.category_id);
        document.querySelectorAll('.ed-cat-checkbox').forEach(cb => {
            const catId = parseInt(cb.getAttribute('data-id'));
            cb.checked = mappedCatIds.includes(catId);
        });

        const { data: resTerms } = await supabase.from('resource_taxonomy').select('term_id').eq('resource_id', resourceId);
        const mappedTermIds = (resTerms || []).map(t => t.term_id);
        document.querySelectorAll('.ed-term-checkbox').forEach(cb => {
            const termId = parseInt(cb.getAttribute('data-id'));
            cb.checked = mappedTermIds.includes(termId);
        });

        // Bind editor button click triggers
        setupEditorActionButtons();

        // Display Editor panel
        switchSection('editor');

    } catch (err) {
        alert("Load resource edit pane failed: " + err.message);
    }
    hideLoading();
}

function renderEditorTaxonomyCheckboxes() {
    // Render categories list checkboxes
    const catContainer = document.getElementById('ed-categories-checks');
    catContainer.innerHTML = '';
    dbCategories.forEach(cat => {
        catContainer.innerHTML += `
            <label><input type="checkbox" class="ed-cat-checkbox" data-id="${cat.id}"> ${cat.name}</label>
        `;
    });

    // Reset taxonomy containers
    const termTypes = ['treatment_type', 'level_of_care', 'condition', 'therapy', 'amenity', 'insurance_provider'];
    termTypes.forEach(type => {
        const container = document.getElementById(`ed-terms-${type}`);
        if (container) {
            container.innerHTML = '';
            const filteredTerms = dbTaxonomyTerms.filter(t => t.type === type);
            if (filteredTerms.length === 0) {
                container.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted); grid-column:span 3;">No terms defined in this vocabulary.</span>`;
            } else {
                filteredTerms.forEach(t => {
                    container.innerHTML += `
                        <label><input type="checkbox" class="ed-term-checkbox" data-id="${t.id}"> ${t.name}</label>
                    `;
                });
            }
        }
    });

    // Tab bindings listeners
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.onclick = () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            
            const paneId = btn.getAttribute('data-tab');
            document.getElementById(paneId).classList.add('active');
        };
    });
}

function setupEditorActionButtons() {
    document.getElementById('editor-cancel').onclick = () => switchSection('resources');
    
    // Save as Draft
    document.getElementById('editor-save-draft').onclick = () => commitEditorSave('Draft');

    // Save as Published
    document.getElementById('editor-publish').onclick = () => commitEditorSave('Published');
}

async function commitEditorSave(targetStatus) {
    const name = document.getElementById('ed-name').value.trim();
    const slug = document.getElementById('ed-slug').value.trim();
    const city = document.getElementById('ed-city').value.trim();
    const state = document.getElementById('ed-state').value;

    if (!name || !slug || !city || !state) {
        alert("Validation error: Name, Slug, City, and State are required fields.");
        return;
    }

    showLoading("Saving changes...");

    // Gather update objects properties
    const resourceObj = {
        name,
        slug,
        source_id: document.getElementById('ed-source-id').value.trim() || null,
        status: targetStatus,
        verification_status: document.getElementById('ed-verification-status').value || 'Demo Data',
        about_short: document.getElementById('ed-about-short').value.trim() || null,
        about_long: document.getElementById('ed-about-long').value.trim() || null,
        address: document.getElementById('ed-address').value.trim() || null,
        address_line2: document.getElementById('ed-address2').value.trim() || null,
        city,
        county: document.getElementById('ed-county').value.trim() || null,
        state,
        zip: document.getElementById('ed-zip').value.trim() || null,
        latitude: parseFloat(document.getElementById('ed-latitude').value) || null,
        longitude: parseFloat(document.getElementById('ed-longitude').value) || null,
        phone: document.getElementById('ed-phone').value.trim() || null,
        email: document.getElementById('ed-email').value.trim() || null,
        website: document.getElementById('ed-website').value.trim() || null,
        google_business_url: document.getElementById('ed-google-profile').value.trim() || null,
        
        private_pay: document.getElementById('ed-private-pay').checked,
        financing_info: document.getElementById('ed-financing').value.trim() || null,
        logo: document.getElementById('ed-logo').value.trim() || null,
        featured_image: document.getElementById('ed-featured-image').value.trim() || null,
        image_alt_text: document.getElementById('ed-image-alt').value.trim() || null,
        
        founded_year: parseInt(document.getElementById('ed-founded').value) || null,
        bed_count: parseInt(document.getElementById('ed-beds').value) || null,
        licensing: document.getElementById('ed-licensing').value.trim() || null,
        program_length: document.getElementById('ed-program-length').value.trim() || null,
        google_rating: parseFloat(document.getElementById('ed-google-rating').value) || null,
        google_review_count: parseInt(document.getElementById('ed-google-review-count').value) || null,

        seo_title: document.getElementById('ed-seo-title').value.trim() || null,
        meta_description: document.getElementById('ed-seo-desc').value.trim() || null,
        canonical_slug: document.getElementById('ed-canonical').value.trim() || null,
        index_noindex: document.getElementById('ed-index').checked
    };

    // Array fields
    const payment = document.getElementById('ed-payment-options').value;
    resourceObj.payment_options = payment ? payment.split(',').map(s => s.trim()).filter(Boolean) : [];

    const insurance = document.getElementById('ed-insurance-accepted').value;
    resourceObj.insurance_accepted = insurance ? insurance.split(',').map(s => s.trim()).filter(Boolean) : [];

    const accredit = document.getElementById('ed-accreditation').value;
    resourceObj.accreditation = accredit ? accredit.split(',').map(s => s.trim()).filter(Boolean) : [];

    const gallery = document.getElementById('ed-gallery').value;
    resourceObj.gallery = gallery ? gallery.split('\n').map(s => s.trim()).filter(Boolean) : [];

    try {
        // Save Resource
        const { error } = await supabase.from('resources').update(resourceObj).eq('id', activeEditingResourceId);
        if (error) throw error;

        // Clear and Save Mapped Categories checkboxes
        await supabase.from('resource_categories').delete().eq('resource_id', activeEditingResourceId);
        const categoryInserts = [];
        document.querySelectorAll('.ed-cat-checkbox:checked').forEach(cb => {
            categoryInserts.push({
                resource_id: activeEditingResourceId,
                category_id: parseInt(cb.getAttribute('data-id'))
            });
        });
        if (categoryInserts.length > 0) {
            await supabase.from('resource_categories').insert(categoryInserts);
        }

        // Clear and Save Mapped Taxonomy Terms checkboxes
        await supabase.from('resource_taxonomy').delete().eq('resource_id', activeEditingResourceId);
        const termInserts = [];
        document.querySelectorAll('.ed-term-checkbox:checked').forEach(cb => {
            termInserts.push({
                resource_id: activeEditingResourceId,
                term_id: parseInt(cb.getAttribute('data-id'))
            });
        });
        if (termInserts.length > 0) {
            await supabase.from('resource_taxonomy').insert(termInserts);
        }

        alert("Resource saved successfully.");
        switchSection('resources');
    } catch (err) {
        alert("Failed to save changes: " + err.message);
        hideLoading();
    }
}

/* =========================================================================
   UTILITY SECTION ACTIONS
   ========================================================================= */

function loadSettingsSectionUi() {
    // Settings parameters initialized
}
