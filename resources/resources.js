/**
 * TreatmentLane Directory - Resources Directory Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const filterForm = document.getElementById('directory-filter-form');
    const keywordInput = document.getElementById('filter-keyword');
    const locationInput = document.getElementById('filter-location');
    const categorySelect = document.getElementById('filter-category');
    const directoryGrid = document.getElementById('directory-grid');
    const emptyState = document.getElementById('directory-empty-state');
    const resetFiltersBtn = document.getElementById('btn-reset-filters');
    const verifiedCountEl = document.getElementById('verified-count');
    const demoCountEl = document.getElementById('demo-count');
    const paginationContainer = document.getElementById('pagination-container');

    // Pagination settings
    const itemsPerPage = 6;
    let currentPage = 1;
    let filteredResources = [];

    // 1. Mobile Menu Toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 2. Populate Category Select Dropdown
    if (categorySelect && window.RECOVERY_CATEGORIES) {
        window.RECOVERY_CATEGORIES.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    }

    // 3. Parse URL Parameters
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            keyword: params.get('keyword') || '',
            location: params.get('location') || '',
            category: params.get('category') || ''
        };
    }

    const initialParams = getUrlParams();
    if (keywordInput) keywordInput.value = initialParams.keyword;
    if (locationInput) locationInput.value = initialParams.location;
    if (categorySelect) categorySelect.value = initialParams.category;

    // 4. Filtering Logic
    async function filterDirectory() {
        const keyword = (keywordInput ? keywordInput.value : '').toLowerCase().trim();
        const location = (locationInput ? locationInput.value : '').toLowerCase().trim();
        const selectedCategory = categorySelect ? categorySelect.value : '';

        const client = window.getSupabaseClient();
        if (client) {
            try {
                let query = client.from('resources').select('*').eq('status', 'Published');
                
                if (keyword) {
                    query = query.ilike('name', `%${keyword}%`);
                }
                
                if (location) {
                    if (location.length === 2) {
                        query = query.eq('state', location.toUpperCase());
                    } else {
                        query = query.ilike('city', `%${location}%`);
                    }
                }

                if (selectedCategory) {
                    const { data: catRecord } = await client.from('categories').select('id').eq('name', selectedCategory).single();
                    if (catRecord) {
                        const { data: mappings } = await client.from('resource_categories').select('resource_id').eq('category_id', catRecord.id);
                        const ids = (mappings || []).map(m => m.resource_id);
                        query = query.in('id', ids.length > 0 ? ids : [-1]);
                    }
                }

                const { data: dbRes, error } = await query;
                if (!error && dbRes) {
                    const { data: allMappings } = await client.from('resource_categories').select('resource_id, categories(name)');
                    filteredResources = dbRes.map(r => {
                        const matches = allMappings ? allMappings.filter(m => m.resource_id === r.id) : [];
                        const categories = matches.map(m => m.categories.name);
                        return {
                            ...r,
                            gallery: r.gallery || [],
                            categories: categories.length > 0 ? categories : ['Support Service'],
                            reviewCount: r.review_count,
                            statusText: r.verification_status,
                            insuranceAccepted: r.insurance_accepted || []
                        };
                    });
                    currentPage = 1;
                    renderFilteredResults();
                    return;
                }
            } catch (e) {
                console.warn("Database directory search failed, using static data:", e);
            }
        }

        if (!window.RECOVERY_RESOURCES) return;

        filteredResources = window.RECOVERY_RESOURCES.filter(resource => {
            // Keyword Filter (Matches name, services, treatmentTypes, categories, about text)
            let matchesKeyword = true;
            if (keyword) {
                const nameMatch = resource.name.toLowerCase().includes(keyword);
                const servicesMatch = resource.services && resource.services.some(s => s.toLowerCase().includes(keyword));
                const treatmentsMatch = resource.treatmentTypes && resource.treatmentTypes.some(t => t.toLowerCase().includes(keyword));
                const categoriesMatch = resource.categories && resource.categories.some(c => c.toLowerCase().includes(keyword));
                const aboutMatch = (resource.aboutShort || '').toLowerCase().includes(keyword) || (resource.aboutLong || '').toLowerCase().includes(keyword);
                
                matchesKeyword = nameMatch || servicesMatch || treatmentsMatch || categoriesMatch || aboutMatch;
            }

            // Location Filter (Matches city, state, county, address)
            let matchesLocation = true;
            if (location) {
                const cityMatch = resource.city.toLowerCase().includes(location);
                const stateMatch = resource.state.toLowerCase().includes(location);
                const countyMatch = (resource.county || '').toLowerCase().includes(location);
                const addressMatch = (resource.address || '').toLowerCase().includes(location);
                
                matchesLocation = cityMatch || stateMatch || countyMatch || addressMatch;
            }

            // Category Filter
            let matchesCategory = true;
            if (selectedCategory) {
                matchesCategory = resource.categories && resource.categories.includes(selectedCategory);
            }

            return matchesKeyword && matchesLocation && matchesCategory;
        });

        currentPage = 1;
        renderFilteredResults();
    }

    // 5. Render Results
    function renderFilteredResults() {
        if (!directoryGrid) return;
        directoryGrid.innerHTML = '';

        // Update Counts
        if (verifiedCountEl) verifiedCountEl.textContent = '0'; // Real verified counts remain 0
        if (demoCountEl) demoCountEl.textContent = filteredResources.length.toString();

        if (filteredResources.length === 0) {
            directoryGrid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        directoryGrid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';

        // Paginate items
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredResources.slice(startIndex, endIndex);

        pageItems.forEach(resource => {
            const card = document.createElement('article');
            card.className = 'listing-card';

            // Fully clickable link overlay pointing to detail page
            const linkOverlay = document.createElement('a');
            linkOverlay.href = `detail.html?slug=${resource.slug}`;
            linkOverlay.className = 'card-link-overlay';
            linkOverlay.ariaLabel = `View details for ${resource.name}`;
            card.appendChild(linkOverlay);

            // Visual image container
            const visualArea = document.createElement('div');
            visualArea.className = 'listing-img-container';

            const img = document.createElement('img');
            img.src = resource.gallery && resource.gallery.length > 0 ? resource.gallery[0] : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80';
            img.alt = resource.name;
            img.loading = 'lazy';
            visualArea.appendChild(img);

            // Category badge (Teal background, white text)
            const badge = document.createElement('span');
            badge.className = 'listing-badge bg-teal';
            badge.textContent = resource.categories && resource.categories.length > 0 ? resource.categories[0] : 'Support Service';
            visualArea.appendChild(badge);

            card.appendChild(visualArea);

            // Card content container
            const content = document.createElement('div');
            content.className = 'listing-content';

            // Location line
            const location = document.createElement('p');
            location.className = 'listing-location';
            location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${resource.city}, ${resource.state}`;
            content.appendChild(location);

            // Title
            const title = document.createElement('h3');
            title.className = 'listing-title';
            title.textContent = resource.name;
            title.title = resource.name;
            content.appendChild(title);

            // Rating & reviews (Demo data labeled)
            const ratingContainer = document.createElement('div');
            ratingContainer.className = 'listing-rating';
            ratingContainer.innerHTML = `
                <span class="rating-stars"><i class="fa-solid fa-star"></i> ${resource.rating.toFixed(1)}</span>
                <span class="rating-count">(${resource.reviewCount} reviews) • <span style="color: var(--text-muted); font-size: 0.72rem; font-weight:600;">Demo</span></span>
            `;
            content.appendChild(ratingContainer);

            // Status line
            const statusContainer = document.createElement('div');
            statusContainer.className = 'listing-status';
            
            let statusText = 'Demo Listing / Testing Only';
            let statusIcon = 'fa-circle-check';
            if (resource.insuranceAccepted && resource.insuranceAccepted.length > 0) {
                statusText = 'Insurance Accepted';
                statusIcon = 'fa-file-invoice-dollar';
            } else if (resource.categories.includes("Support Groups")) {
                statusText = 'Free Group Session';
                statusIcon = 'fa-comments';
            }

            statusContainer.innerHTML = `<i class="fa-solid ${statusIcon}"></i> ${statusText}`;
            content.appendChild(statusContainer);

            card.appendChild(content);
            directoryGrid.appendChild(card);
        });

        renderPagination();
    }

    // 6. Pagination Rendering
    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderFilteredResults();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Page buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${currentPage === i ? 'active' : ''}`;
            pageBtn.textContent = i.toString();
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderFilteredResults();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationContainer.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderFilteredResults();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    // 7. Event Listeners
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterDirectory();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            if (keywordInput) keywordInput.value = '';
            if (locationInput) locationInput.value = '';
            if (categorySelect) categorySelect.value = '';
            filterDirectory();
        });
    }

    // Run initial filtering
    filterDirectory();
});
