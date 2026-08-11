/**
 * RecoveryOn Directory - Frontend Interactions
 * Controls mobile responsive menu, dynamic content rendering, and interactive UI behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const searchForm = document.getElementById('search-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // 1. Mobile Menu Toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileToggle.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Set active class locally
            navLinks.forEach(n => n.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 2. Popular Search Badges Click Handler
    const popularTags = document.querySelectorAll('.tag-badge');
    popularTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const keywordInput = document.getElementById('search-keyword');
            if (keywordInput) {
                keywordInput.value = tag.textContent;
                keywordInput.focus();
            }
        });
    });

    // 3. Simple Form Submission Handlers
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keyword = document.getElementById('search-keyword').value;
            const location = document.getElementById('search-location').value;
            window.location.href = `resources/index.html?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            alert(`Thank you! "${emailInput.value}" has been subscribed to our newsletter.`);
            emailInput.value = '';
        });
    }

    // Add Listing CTAs Click Handler
    const addListingBtns = document.querySelectorAll('#btn-add-listing-cta, #f-link-add-listing, .btn-cta');
    addListingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Thank you for your interest! The provider listing application flow is coming soon.");
        });
    });

    // 4. Resources Cards Data & Rendering
    const resources = window.RECOVERY_RESOURCES;

    const listingsGrid = document.getElementById('listings-grid');

    function getCategoryIcon(category) {
        const cat = category.toLowerCase();
        if (cat.includes('counseling') || cat.includes('therapy')) return 'fa-user-doctor';
        if (cat.includes('support')) return 'fa-users';
        if (cat.includes('holistic') || cat.includes('wellness') || cat.includes('clinic')) return 'fa-leaf';
        if (cat.includes('treatment') || cat.includes('rehab')) return 'fa-house-medical';
        return 'fa-heart-pulse';
    }

    function renderCards() {
        if (!listingsGrid) return;
        listingsGrid.innerHTML = '';
        
        resources.forEach(resource => {
            const card = document.createElement('article');
            card.className = 'listing-card';
            
            // Link overlay to make entire card clickable
            const linkOverlay = document.createElement('a');
            linkOverlay.href = `resources/detail.html?slug=${resource.slug}`;
            linkOverlay.className = 'card-link-overlay';
            linkOverlay.ariaLabel = `View details for ${resource.name}`;
            card.appendChild(linkOverlay);

            // Visual container
            const visualArea = document.createElement('div');
            visualArea.className = 'listing-img-container';
            
            if (resource.image) {
                const img = document.createElement('img');
                img.src = resource.image;
                img.alt = resource.name;
                img.loading = 'lazy';
                visualArea.appendChild(img);
            } else {
                const fallback = document.createElement('div');
                fallback.className = 'listing-icon-fallback';
                fallback.innerHTML = `<i class="fa-solid ${getCategoryIcon(resource.category)}"></i>`;
                visualArea.appendChild(fallback);
            }

            // Category badge overlaid on top-left of image
            const badge = document.createElement('span');
            badge.className = 'listing-badge bg-teal';
            badge.textContent = resource.category;
            visualArea.appendChild(badge);

            card.appendChild(visualArea);

            // Card content container
            const content = document.createElement('div');
            content.className = 'listing-content';

            // 1. Location first
            const location = document.createElement('p');
            location.className = 'listing-location';
            location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${resource.city}, ${resource.state}`;
            content.appendChild(location);

            // 2. Name second
            const title = document.createElement('h3');
            title.className = 'listing-title';
            title.textContent = resource.name;
            title.title = resource.name;
            content.appendChild(title);

            // 3. Rating & review count third
            const ratingContainer = document.createElement('div');
            ratingContainer.className = 'listing-rating';
            ratingContainer.innerHTML = `
                <span class="rating-stars"><i class="fa-solid fa-star"></i> ${resource.rating.toFixed(1)}</span>
                <span class="rating-count">(${resource.reviewCount} reviews)</span>
            `;
            content.appendChild(ratingContainer);

            // 4. Status/Pricing line fourth
            const statusContainer = document.createElement('div');
            statusContainer.className = 'listing-status';
            
            let statusIcon = 'fa-circle-check';
            if (resource.statusText.toLowerCase().includes('insurance')) statusIcon = 'fa-file-invoice-dollar';
            if (resource.statusText.toLowerCase().includes('consult') || resource.statusText.toLowerCase().includes('free')) statusIcon = 'fa-comments';
            if (resource.statusText.toLowerCase().includes('start') || resource.statusText.toLowerCase().includes('$')) statusIcon = 'fa-tag';
            
            statusContainer.innerHTML = `<i class="fa-solid ${statusIcon}"></i> ${resource.statusText}`;
            content.appendChild(statusContainer);

            card.appendChild(content);
            listingsGrid.appendChild(card);
        });
    }

    // 5. Category Data & Rendering
    const categories = window.RECOVERY_CATEGORIES;

    const categoriesGrid = document.getElementById('categories-grid');

    function renderCategories() {
        if (!categoriesGrid) return;
        categoriesGrid.innerHTML = '';
        
        categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.id = `cat-card-${cat.slug}`;
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Explore ${cat.name}`);
            
            const selectCategory = () => {
                window.location.href = `categories/index.html?slug=${cat.slug}`;
            };
            
            card.addEventListener('click', selectCategory);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectCategory();
                }
            });
            
            card.innerHTML = `
                <div class="cat-icon-wrapper"><i class="fa-solid ${cat.icon}"></i></div>
                <h3 class="cat-title">${cat.name}</h3>
                <span class="cat-count">${cat.countText}</span>
            `;
            categoriesGrid.appendChild(card);
        });
    }

    // 6. States Data & Rendering
    const states = window.RECOVERY_STATES;

    const statesGrid = document.getElementById('states-grid');
    const popularStatesRow = document.getElementById('popular-states-row');

    function renderStates() {
        if (!statesGrid) return;
        statesGrid.innerHTML = '';
        if (popularStatesRow) popularStatesRow.innerHTML = '';
        
        const popularAbbrs = ["CA", "TX", "FL", "NY", "IL"];
        
        states.forEach(state => {
            const slug = state.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            // Build the state list item
            const stateLink = document.createElement('a');
            stateLink.href = `states/index.html?slug=${state.abbr.toLowerCase()}`;
            stateLink.className = 'state-link';
            stateLink.id = `state-link-${slug}`;
            stateLink.innerHTML = `${state.name} <span class="state-count">(${state.count})</span>`;
            
            statesGrid.appendChild(stateLink);
            
            // Inject pill for popular state
            if (popularAbbrs.includes(state.abbr) && popularStatesRow) {
                const popularPill = document.createElement('a');
                popularPill.href = `states/index.html?slug=${state.abbr.toLowerCase()}`;
                popularPill.className = 'popular-state-pill';
                popularPill.id = `popular-pill-${slug}`;
                popularPill.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${state.name} <span class="pill-count">${state.count}</span>`;
                
                popularStatesRow.appendChild(popularPill);
            }
        });
    }

    // 7. FAQs Data & Rendering
    const faqs = [
        {
            question: "What is RecoveryOn?",
            answer: "RecoveryOn is a comprehensive, nationwide directory designed to connect individuals with trusted local recovery centers, therapists, support groups, and wellness services. We are an informational platform and directory, not a direct treatment provider."
        },
        {
            question: "How do I search for recovery resources near me?",
            answer: "You can use the search tool at the top of the page. Simply enter a keyword (such as a specialty, therapy, or center name) and input your city or ZIP code. Click 'Search Directory' to view localized listings matching your criteria."
        },
        {
            question: "Does RecoveryOn directly provide medical treatment?",
            answer: "No, RecoveryOn does not directly provide medical treatment, clinical advice, or emergency services. We host directory listings to help you discover third-party organizations. If you are experiencing a medical or mental health emergency, please call 911 or call/text the Suicide & Crisis Lifeline at 988 immediately."
        },
        {
            question: "How can I add my organization to the directory?",
            answer: "Recovery or wellness providers, therapists, support groups, and other eligible organizations can submit their listing by clicking the 'Add Your Listing' button. Once verified for basic listing requirements, your organization will become visible to searchers nationwide."
        },
        {
            question: "Is resource information independently verified?",
            answer: "We verify basic licensing, contact details, and provider status to ensure listings are authentic. However, we recommend that users independently contact providers to verify insurance acceptance, current rates, and program details before committing to services."
        },
        {
            question: "How does the location search work?",
            answer: "Our search matches location queries against a database of cities and ZIP codes across the United States. It filters search results to show active listings within or closest to the specified city or postal code boundary."
        }
    ];

    const faqAccordion = document.getElementById('faq-accordion');

    function renderFAQs() {
        if (!faqAccordion) return;
        faqAccordion.innerHTML = '';
        
        faqs.forEach((faq, index) => {
            const item = document.createElement('div');
            item.className = 'faq-item';
            
            const header = document.createElement('button');
            header.className = 'faq-header';
            header.id = `faq-header-${index}`;
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', `faq-content-${index}`);
            header.innerHTML = `
                <span class="faq-question">${faq.question}</span>
                <span class="faq-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span>
            `;
            
            const content = document.createElement('div');
            content.className = 'faq-content';
            content.id = `faq-content-${index}`;
            content.setAttribute('aria-labelledby', `faq-header-${index}`);
            content.innerHTML = `
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            `;
            
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQ items for a clean accordion behavior
                const allHeaders = faqAccordion.querySelectorAll('.faq-header');
                const allContents = faqAccordion.querySelectorAll('.faq-content');
                
                allHeaders.forEach(h => {
                    h.setAttribute('aria-expanded', 'false');
                    h.classList.remove('active');
                });
                allContents.forEach(c => {
                    c.style.maxHeight = null;
                    c.classList.remove('active');
                });
                
                if (!isExpanded) {
                    header.setAttribute('aria-expanded', 'true');
                    header.classList.add('active');
                    content.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
            
            item.appendChild(header);
            item.appendChild(content);
            faqAccordion.appendChild(item);
        });
    }

    // 8. Carousel Scroll Control
    const trackWrapper = document.querySelector('.carousel-track-wrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (trackWrapper && prevBtn && nextBtn) {
        function updateCarouselArrows() {
            const scrollLeft = trackWrapper.scrollLeft;
            const scrollWidth = trackWrapper.scrollWidth;
            const clientWidth = trackWrapper.clientWidth;
            
            // Hide left button at initial scroll position
            if (scrollLeft <= 5) {
                prevBtn.style.opacity = '0';
                prevBtn.style.pointerEvents = 'none';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.pointerEvents = 'auto';
            }

            // Hide right button at end of scroll
            if (scrollLeft + clientWidth >= scrollWidth - 5) {
                nextBtn.style.opacity = '0';
                nextBtn.style.pointerEvents = 'none';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.pointerEvents = 'auto';
            }
        }

        trackWrapper.addEventListener('scroll', updateCarouselArrows);
        window.addEventListener('resize', updateCarouselArrows);

        // Initial trigger
        setTimeout(updateCarouselArrows, 100);

        prevBtn.addEventListener('click', () => {
            const card = trackWrapper.querySelector('.listing-card');
            if (card) {
                const cardWidth = card.offsetWidth;
                const gap = window.innerWidth <= 768 ? 16 : 24;
                const multiplier = window.innerWidth <= 768 ? 1 : 2;
                trackWrapper.scrollBy({ left: -(cardWidth + gap) * multiplier, behavior: 'smooth' });
            }
        });

        nextBtn.addEventListener('click', () => {
            const card = trackWrapper.querySelector('.listing-card');
            if (card) {
                const cardWidth = card.offsetWidth;
                const gap = window.innerWidth <= 768 ? 16 : 24;
                const multiplier = window.innerWidth <= 768 ? 1 : 2;
                trackWrapper.scrollBy({ left: (cardWidth + gap) * multiplier, behavior: 'smooth' });
            }
        });
    }

    // Render all elements
    renderCards();
    renderCategories();
    renderStates();
    renderFAQs();
});
