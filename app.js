/**
 * RecoveryOn Directory - Frontend Interactions
 * Controls mobile responsive menu, header scrolling state, and interactive effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mainHeader = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const searchForm = document.getElementById('search-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // 2. Mobile Menu Toggle
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

    // 3. Simple Form Submission Handlers
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keyword = document.getElementById('search-keyword').value;
            const location = document.getElementById('search-location').value;
            alert(`Searching directory for "${keyword}" in "${location}"...\n(Backend integration coming soon!)`);
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

    // 4. Resources Cards Data & Rendering
    const resources = [
        {
            name: "Serene Path Wellness Center",
            category: "Holistic Clinic",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
            city: "Boulder",
            state: "CO",
            rating: 4.9,
            reviewCount: 34,
            slug: "serene-path-wellness",
            statusText: "Verified Center"
        },
        {
            name: "Hope & Unity Fellowship",
            category: "Support Group",
            image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
            city: "Austin",
            state: "TX",
            rating: 4.8,
            reviewCount: 19,
            slug: "hope-unity-fellowship",
            statusText: "Free Consultations"
        },
        {
            name: "Apex Therapy Associates",
            category: "Counseling",
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
            city: "New York",
            state: "NY",
            rating: 5.0,
            reviewCount: 42,
            slug: "apex-therapy-associates",
            statusText: "Insurance Accepted"
        },
        {
            name: "Elysian Recovery Spa & Retreat",
            category: "Treatment Center",
            image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
            city: "San Diego",
            state: "CA",
            rating: 4.7,
            reviewCount: 28,
            slug: "elysian-recovery-retreat",
            statusText: "Starting at $150/day"
        },
        {
            name: "North Star Counseling Group",
            category: "Counseling",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
            city: "Seattle",
            state: "WA",
            rating: 4.9,
            reviewCount: 15,
            slug: "north-star-counseling",
            statusText: "Verified Center"
        },
        {
            name: "Cascade Recovery Clinic",
            category: "Treatment Center",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
            city: "Portland",
            state: "OR",
            rating: 4.6,
            reviewCount: 22,
            slug: "cascade-recovery-clinic",
            statusText: "Insurance Accepted"
        }
    ];

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
            linkOverlay.href = `#details-${resource.slug}`;
            linkOverlay.className = 'card-link-overlay';
            linkOverlay.ariaLabel = `View details for ${resource.name}`;
            linkOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`Viewing details for: ${resource.name} (${resource.category})\nLocation: ${resource.city}, ${resource.state}\nStatus: ${resource.statusText}`);
            });
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
            badge.className = `listing-badge ${resource.category.toLowerCase().includes('support') ? 'bg-navy' : 'bg-teal'}`;
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

    renderCards();

    // 5. Carousel Scroll Control
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

        // Add event listeners for scroll and resize
        trackWrapper.addEventListener('scroll', updateCarouselArrows);
        window.addEventListener('resize', updateCarouselArrows);

        // Initial trigger (wait slightly for image layouts)
        setTimeout(updateCarouselArrows, 100);

        prevBtn.addEventListener('click', () => {
            const card = trackWrapper.querySelector('.listing-card');
            if (card) {
                const cardWidth = card.offsetWidth;
                const gap = 24;
                trackWrapper.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
            }
        });

        nextBtn.addEventListener('click', () => {
            const card = trackWrapper.querySelector('.listing-card');
            if (card) {
                const cardWidth = card.offsetWidth;
                const gap = 24;
                trackWrapper.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
            }
        });
    }
});
