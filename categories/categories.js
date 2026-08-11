/**
 * RecoveryOn Directory - Category Page Controller
 * Handles dynamic content fetching, listing rendering, and interactions.
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

    // 2. Fetch category slug from query parameters
    const getQueryParam = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    };

    const catSlug = getQueryParam('slug') || 'treatment-centers'; // Fallback
    const category = window.RECOVERY_CATEGORIES.find(c => c.slug === catSlug);

    const errorSection = document.getElementById('error-section');
    const categoryHeaderSection = document.getElementById('category-header-section');
    const resultsSection = document.getElementById('results-section');

    if (!category) {
        // Show error state
        if (errorSection) errorSection.style.display = 'flex';
        if (categoryHeaderSection) categoryHeaderSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'none';
        return;
    }

    // Populate Page Meta
    document.title = `${category.name} | RecoveryOn Directory`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', `Find local ${category.name.toLowerCase()} resources. Browse verified and demo services in your area.`);
    }

    // 3. Render Breadcrumbs
    const breadcrumbsEl = document.getElementById('category-breadcrumbs');
    if (breadcrumbsEl) {
        breadcrumbsEl.innerHTML = `
            <a href="../index.html">Home</a>
            <i class="fa-solid fa-chevron-right"></i>
            <a href="../index.html#categories">Categories</a>
            <i class="fa-solid fa-chevron-right"></i>
            <span>${category.name}</span>
        `;
    }

    // 4. Render Headings
    const titleEl = document.getElementById('category-title');
    const introEl = document.getElementById('category-intro');
    const seoTitleEl = document.getElementById('seo-title');
    const seoTextEl = document.getElementById('seo-text');

    if (titleEl) titleEl.textContent = category.name;
    if (introEl) introEl.textContent = category.intro;
    if (seoTitleEl) seoTitleEl.textContent = `Understanding ${category.name}`;
    if (seoTextEl) seoTextEl.textContent = category.seoText;

    // 5. Filter & Render Resource Cards
    const resultsGrid = document.getElementById('category-results-grid');
    const emptyState = document.getElementById('results-empty-state');
    const verifiedCountEl = document.getElementById('verified-count');
    const demoCountEl = document.getElementById('demo-count');

    // Filter resources matching current category
    const allResources = window.RECOVERY_RESOURCES || [];
    const categoryResources = allResources.filter(res => 
        res.categories && res.categories.includes(category.name)
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

    // Initial load
    renderResources(categoryResources);

    // 6. Search within Category Form Handler
    const searchForm = document.getElementById('category-search-form');
    const keywordInput = document.getElementById('search-keyword');
    const locationInput = document.getElementById('search-location');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keyword = keywordInput.value.toLowerCase().trim();
            const location = locationInput.value.toLowerCase().trim();

            // Filter resources
            const filtered = categoryResources.filter(res => {
                const matchesKeyword = !keyword || 
                    res.name.toLowerCase().includes(keyword) || 
                    res.aboutShort.toLowerCase().includes(keyword) ||
                    res.treatmentTypes.some(t => t.toLowerCase().includes(keyword));

                const matchesLocation = !location || 
                    res.city.toLowerCase().includes(location) || 
                    res.state.toLowerCase().includes(location) || 
                    res.county.toLowerCase().includes(location) ||
                    res.address.toLowerCase().includes(location);

                return matchesKeyword && matchesLocation;
            });

            renderResources(filtered);
        });
    }

    // 7. Related Categories Rendering
    const relatedGrid = document.getElementById('related-categories-grid');
    if (relatedGrid) {
        relatedGrid.innerHTML = '';
        const otherCategories = window.RECOVERY_CATEGORIES.filter(c => c.slug !== category.slug).slice(0, 4);

        otherCategories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div class="cat-icon-wrapper"><i class="fa-solid ${cat.icon}"></i></div>
                <h3 class="cat-title">${cat.name}</h3>
                <span class="cat-count">${cat.countText}</span>
            `;
            card.addEventListener('click', () => {
                window.location.href = `index.html?slug=${cat.slug}`;
            });
            relatedGrid.appendChild(card);
        });
    }

    // 8. States Availability Grid
    const statesGrid = document.getElementById('category-states-grid');
    if (statesGrid) {
        statesGrid.innerHTML = '';
        const statesList = window.RECOVERY_STATES;

        statesList.forEach(state => {
            const btn = document.createElement('a');
            btn.className = 'state-btn';
            btn.style.textAlign = 'center';
            btn.style.padding = '12px';
            btn.href = `../states/index.html?slug=${state.abbr.toLowerCase()}`;
            btn.innerHTML = `
                <span style="font-weight:600; display:block;">${state.name}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">0 providers</span>
            `;
            statesGrid.appendChild(btn);
        });
    }

    // 9. FAQ Accordion Rendering
    const faqAccordion = document.getElementById('category-faq-accordion');
    if (faqAccordion && category.faqs) {
        faqAccordion.innerHTML = '';
        
        category.faqs.forEach((faq, index) => {
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
                
                // Close all other items
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
