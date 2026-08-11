/**
 * RecoveryOn Directory - State Page Controller
 * Handles dynamic content rendering, location filtering, and state-first routing.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile navigation menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // 2. Fetch state slug from query parameters
    const getQueryParam = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    };

    const stateSlug = getQueryParam('slug') || 'ca'; // Fallback to CA
    const stateObj = window.RECOVERY_STATES.find(s => 
        s.abbr.toLowerCase() === stateSlug.toLowerCase() || 
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === stateSlug.toLowerCase()
    );

    const errorSection = document.getElementById('error-section');
    const stateHeaderSection = document.getElementById('state-header-section');
    const resultsSection = document.getElementById('results-section');

    if (!stateObj) {
        // Show error state
        if (errorSection) errorSection.style.display = 'flex';
        if (stateHeaderSection) stateHeaderSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'none';
        return;
    }

    // Populate Page Meta
    document.title = `Recovery Resources in ${stateObj.name} | RecoveryOn Directory`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', `Browse local recovery services, detox programs, counselors, and support groups in ${stateObj.name}.`);
    }

    // Replace state name text placeholders
    document.querySelectorAll('.state-name-text').forEach(el => {
        el.textContent = stateObj.name;
    });

    // 3. Render Breadcrumbs
    const breadcrumbsEl = document.getElementById('state-breadcrumbs');
    if (breadcrumbsEl) {
        breadcrumbsEl.innerHTML = `
            <a href="../index.html">Home</a>
            <i class="fa-solid fa-chevron-right"></i>
            <a href="../index.html#directory">States</a>
            <i class="fa-solid fa-chevron-right"></i>
            <span>${stateObj.name}</span>
        `;
    }

    // 4. Render Headings
    const titleEl = document.getElementById('state-title');
    const introEl = document.getElementById('state-intro');
    const seoTitleEl = document.getElementById('seo-title');
    const seoTextEl = document.getElementById('seo-text');

    if (titleEl) titleEl.textContent = `Recovery Resources in ${stateObj.name}`;
    if (introEl) introEl.textContent = stateObj.intro;
    if (seoTitleEl) seoTitleEl.textContent = `Finding Recovery Support in ${stateObj.name}`;
    
    // Set dynamic SEO Text
    if (seoTextEl) {
        seoTextEl.textContent = `Navigating recovery pathways in ${stateObj.name} involves understanding the state-wide resources available, including outpatient counseling, peer-led recovery fellowships, and residential treatment clinics. We help you explore local options. When selecting care, ensure you verify facility credentials, level of care required, and private health insurance network details directly with providers.`;
    }

    // 5. Popular Cities rendering
    const popularCitiesGrid = document.getElementById('popular-cities-grid');
    const allCitiesGrid = document.getElementById('all-cities-grid');
    
    let activeCityFilter = null;

    function renderCitiesList() {
        if (!popularCitiesGrid || !allCitiesGrid) return;
        popularCitiesGrid.innerHTML = '';
        allCitiesGrid.innerHTML = '';

        // Popular cities (first 5)
        const popularCities = stateObj.cities.slice(0, 5);
        popularCities.forEach(city => {
            const btn = document.createElement('button');
            btn.className = `state-btn ${activeCityFilter === city ? 'active' : ''}`;
            btn.style.textAlign = 'center';
            btn.style.padding = '10px';
            btn.style.cursor = 'pointer';
            if (activeCityFilter === city) {
                btn.style.backgroundColor = 'var(--primary-color)';
                btn.style.color = 'white';
            }
            btn.innerHTML = `
                <span style="font-weight:600; display:block;">${city}</span>
                <span style="font-size:0.72rem; opacity:0.8;">0 listings</span>
            `;
            btn.addEventListener('click', () => {
                toggleCityFilter(city);
            });
            popularCitiesGrid.appendChild(btn);
        });

        // All cities within the state
        stateObj.cities.forEach(city => {
            const btn = document.createElement('button');
            btn.className = `state-btn ${activeCityFilter === city ? 'active' : ''}`;
            btn.style.textAlign = 'center';
            btn.style.padding = '10px';
            btn.style.cursor = 'pointer';
            if (activeCityFilter === city) {
                btn.style.backgroundColor = 'var(--primary-color)';
                btn.style.color = 'white';
            }
            btn.innerHTML = `
                <span style="font-weight:600; display:block;">${city}</span>
                <span style="font-size:0.72rem; opacity:0.8;">0 listings</span>
            `;
            btn.addEventListener('click', () => {
                toggleCityFilter(city);
            });
            allCitiesGrid.appendChild(btn);
        });
    }

    function toggleCityFilter(city) {
        if (activeCityFilter === city) {
            activeCityFilter = null; // Clear filter
        } else {
            activeCityFilter = city;
        }
        renderCitiesList();
        applyFilters();
    }

    // 6. Filter & Render Resource Cards
    const resultsGrid = document.getElementById('state-results-grid');
    const emptyState = document.getElementById('results-empty-state');
    const verifiedCountEl = document.getElementById('verified-count');
    const demoCountEl = document.getElementById('demo-count');

    // Filter resources matching current state abbreviation
    const allResources = window.RECOVERY_RESOURCES || [];
    const stateResources = allResources.filter(res => 
        res.state.toUpperCase() === stateObj.abbr.toUpperCase()
    );

    function renderResources(resourcesList) {
        if (!resultsGrid) return;
        resultsGrid.innerHTML = '';

        if (resourcesList.length === 0) {
            emptyState.style.display = 'block';
            if (verifiedCountEl) verifiedCountEl.textContent = '0';
            if (demoCountEl) demoCountEl.textContent = '0';
            return;
        }

        emptyState.style.display = 'none';
        if (verifiedCountEl) verifiedCountEl.textContent = '0'; // Strict rule: keep verified counts at 0
        if (demoCountEl) demoCountEl.textContent = resourcesList.length.toString();

        resourcesList.forEach(res => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.style.cursor = 'pointer';
            
            // Redirect card click to detailed view page
            card.addEventListener('click', () => {
                window.location.href = `../resources/detail.html?slug=${res.slug}`;
            });

            // Card HTML structure
            const verifiedBadge = res.statusText === 'Verified Center' 
                ? `<span class="card-badge badge-primary"><i class="fa-solid fa-circle-check"></i> ${res.statusText}</span>` 
                : `<span class="card-badge badge-secondary"><i class="fa-solid fa-clock"></i> ${res.statusText}</span>`;

            // Display category tags
            let tagsHTML = '';
            if (res.categories && res.categories.length > 0) {
                res.categories.forEach(cat => {
                    tagsHTML += `<span class="tag">${cat}</span>`;
                });
            }

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${res.image}" alt="${res.name}" class="card-image">
                    ${verifiedBadge}
                </div>
                <div class="card-body">
                    <div class="card-meta">
                        <span class="card-location"><i class="fa-solid fa-location-dot"></i> ${res.city}, ${res.state}</span>
                        <div class="card-rating">
                            <i class="fa-solid fa-star"></i> <span>${res.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <h3 class="card-title">${res.name}</h3>
                    <p class="card-desc">${res.aboutShort}</p>
                    <div class="card-tags">
                        ${tagsHTML}
                    </div>
                </div>
            `;
            resultsGrid.appendChild(card);
        });
    }

    const keywordInput = document.getElementById('search-keyword');
    const cityInput = document.getElementById('search-city');

    function applyFilters() {
        const keyword = keywordInput ? keywordInput.value.toLowerCase().trim() : '';
        const citySearch = cityInput ? cityInput.value.toLowerCase().trim() : '';

        const filtered = stateResources.filter(res => {
            const matchesKeyword = !keyword || 
                res.name.toLowerCase().includes(keyword) || 
                res.aboutShort.toLowerCase().includes(keyword) ||
                res.categories.some(c => c.toLowerCase().includes(keyword)) ||
                res.treatmentTypes.some(t => t.toLowerCase().includes(keyword));

            // Location check combining specific click filter and search box input filter
            let matchesLocation = true;
            if (activeCityFilter) {
                matchesLocation = res.city.toLowerCase() === activeCityFilter.toLowerCase();
            }
            if (matchesLocation && citySearch) {
                matchesLocation = res.city.toLowerCase().includes(citySearch) || 
                                  res.county.toLowerCase().includes(citySearch) ||
                                  res.address.toLowerCase().includes(citySearch);
            }

            return matchesKeyword && matchesLocation;
        });

        renderResources(filtered);
    }

    // Initial render
    renderCitiesList();
    renderResources(stateResources);

    // 7. Search Form Submission Handler
    const searchForm = document.getElementById('state-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }

    // 8. Browse Categories Section
    const categoriesGrid = document.getElementById('state-categories-grid');
    if (categoriesGrid) {
        categoriesGrid.innerHTML = '';
        window.RECOVERY_CATEGORIES.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div class="cat-icon-wrapper"><i class="fa-solid ${cat.icon}"></i></div>
                <h3 class="cat-title">${cat.name}</h3>
                <span class="cat-count">${cat.countText}</span>
            `;
            card.addEventListener('click', () => {
                window.location.href = `../categories/index.html?slug=${cat.slug}`;
            });
            categoriesGrid.appendChild(card);
        });
    }

    // 9. FAQ Accordion Rendering for State
    const faqAccordion = document.getElementById('state-faq-accordion');
    if (faqAccordion) {
        const stateFAQs = [
            {
                q: `How do I locate local support groups in ${stateObj.name}?`,
                a: `You can filter the local directory search under the "Browse Services" section to find "Support Groups" located within ${stateObj.name}, or refine by your local city name above.`
            },
            {
                q: `Are the treatment center records in ${stateObj.name} real?`,
                a: `The listings currently shown are demonstration records created for design validation and usability testing. Verified clinical listings counts are strictly set to 0.`
            },
            {
                q: `Can I submit a new listing for a facility in ${stateObj.name}?`,
                a: `Yes! Providers and facilitators can register using our standard "Add a Listing" portal linked in the main header.`
            }
        ];

        faqAccordion.innerHTML = '';
        
        stateFAQs.forEach((faq, index) => {
            const item = document.createElement('div');
            item.className = 'faq-item';
            
            const header = document.createElement('button');
            header.className = 'faq-header';
            header.id = `faq-header-${index}`;
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', `faq-content-${index}`);
            header.innerHTML = `
                <span class="faq-question">${faq.q}</span>
                <span class="faq-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span>
            `;
            
            const content = document.createElement('div');
            content.className = 'faq-content';
            content.id = `faq-content-${index}`;
            content.setAttribute('aria-labelledby', `faq-header-${index}`);
            content.innerHTML = `
                <div class="faq-answer">
                    <p>${faq.a}</p>
                </div>
            `;
            
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                
                // Close other accordion items
                faqAccordion.querySelectorAll('.faq-header').forEach(h => {
                    if (h !== header) {
                        h.setAttribute('aria-expanded', 'false');
                        const associatedContent = document.getElementById(h.getAttribute('aria-controls'));
                        if (associatedContent) associatedContent.style.maxHeight = null;
                    }
                });

                header.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.style.maxHeight = null;
                }
            });
            
            item.appendChild(header);
            item.appendChild(content);
            faqAccordion.appendChild(item);
        });
    }
});
