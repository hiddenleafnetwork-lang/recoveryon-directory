/**
 * TreatmentLane Directory - Resource Detail Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Parse URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    // Error and main sections
    const errorSection = document.getElementById('error-section');
    const profileHeaderSection = document.getElementById('profile-header-section');
    const gallerySection = document.querySelector('.section[style*="padding: 24px 0 0 0"]');
    const mainProfileSection = document.querySelector('.section[style*="padding-top: 24px"]');

    async function loadResourceDetail() {
        if (!slug) {
            showErrorState();
            return;
        }

        const client = window.getSupabaseClient();
        if (client) {
            try {
                const { data: dbRes, error } = await client.from('resources').select('*').eq('slug', slug).single();
                
                if (!error && dbRes) {
                    const { data: mappings } = await client.from('resource_categories').select('categories(name)').eq('resource_id', dbRes.id);
                    const categories = mappings ? mappings.map(m => m.categories.name).filter(Boolean) : [];

                    const { data: terms } = await client.from('resource_taxonomy').select('taxonomy_terms(name, type)').eq('resource_id', dbRes.id);
                    
                    const treatmentTypes = [];
                    const services = [];
                    const amenities = [];

                    if (terms) {
                        terms.forEach(t => {
                            const term = t.taxonomy_terms;
                            if (term) {
                                if (term.type === 'treatment_type' || term.type === 'level_of_care') {
                                    treatmentTypes.push(term.name);
                                } else if (term.type === 'condition' || term.type === 'therapy') {
                                    services.push(term.name);
                                } else if (term.type === 'amenity') {
                                    amenities.push(term.name);
                                }
                            }
                        });
                    }

                    const resourceObj = {
                        ...dbRes,
                        categories: categories.length > 0 ? categories : ['Support Service'],
                        treatmentTypes: treatmentTypes.length > 0 ? treatmentTypes : ['Outpatient care'],
                        services: services.length > 0 ? services : ['Personal counseling'],
                        amenities: amenities.length > 0 ? amenities : ['Clean rooms'],
                        insuranceAccepted: dbRes.insurance_accepted || [],
                        paymentOptions: dbRes.payment_options || [],
                        gallery: dbRes.gallery || [],
                        reviewCount: dbRes.review_count,
                        statusText: dbRes.verification_status,
                        image: dbRes.featured_image || (dbRes.gallery && dbRes.gallery.length > 0 ? dbRes.gallery[0] : null)
                    };

                    populatePage(resourceObj);
                    return;
                }
            } catch (e) {
                console.warn("Database detail lookup failed, using static data:", e);
            }
        }

        if (!window.RECOVERY_RESOURCES) {
            showErrorState();
            return;
        }

        const resource = window.RECOVERY_RESOURCES.find(r => r.slug === slug);
        if (!resource) {
            showErrorState();
            return;
        }
        populatePage(resource);
    }

    loadResourceDetail();

    function showErrorState() {
        if (errorSection) errorSection.style.display = 'flex';
        if (profileHeaderSection) profileHeaderSection.style.display = 'none';
        if (gallerySection) gallerySection.style.display = 'none';
        if (mainProfileSection) mainProfileSection.style.display = 'none';
    }

    function populatePage(data) {
        // Update browser tab title
        document.title = `${data.name} | TreatmentLane Directory`;

        // 1. Breadcrumbs
        const breadcrumbsEl = document.getElementById('detail-breadcrumbs');
        if (breadcrumbsEl) {
            breadcrumbsEl.innerHTML = `
                <a href="../index.html">Home</a>
                <span>/</span>
                <a href="index.html">Resources</a>
                <span>/</span>
                <a href="index.html?location=${data.state}">${data.state}</a>
                <span>/</span>
                <a href="index.html?location=${data.city}">${data.city}</a>
                <span>/</span>
                <span>${data.name}</span>
            `;
        }

        // 2. Header
        const nameEl = document.getElementById('resource-name');
        if (nameEl) nameEl.textContent = data.name;

        // Badges
        const badgesEl = document.getElementById('resource-badges');
        if (badgesEl) {
            badgesEl.innerHTML = '';
            // Categories as badges
            data.categories.forEach((cat, index) => {
                const badge = document.createElement('span');
                badge.className = `detail-badge ${index === 0 ? 'primary-badge' : ''}`;
                badge.textContent = cat;
                badgesEl.appendChild(badge);
            });
            // Status/testing tag
            const statusBadge = document.createElement('span');
            statusBadge.className = 'detail-badge';
            statusBadge.style.backgroundColor = '#fef3c7';
            statusBadge.style.color = '#b45309';
            statusBadge.innerHTML = `<i class="fa-solid fa-flask"></i> Demo Profile`;
            badgesEl.appendChild(statusBadge);
        }

        // Meta Line (Category icon, Location, Insurance status)
        const metaLineEl = document.getElementById('resource-meta-line');
        if (metaLineEl) {
            let insuranceText = 'Private Pay Only';
            if (data.insuranceAccepted && data.insuranceAccepted.length > 0) {
                insuranceText = 'Insurance Accepted';
            }
            metaLineEl.innerHTML = `
                <span><i class="fa-solid fa-location-dot"></i> ${data.city}, ${data.state} (${data.area})</span>
                <span>•</span>
                <span><i class="fa-solid fa-file-invoice-dollar"></i> ${insuranceText}</span>
                <span>•</span>
                <span><i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${data.rating.toFixed(1)} (${data.reviewCount} reviews)</span>
            `;
        }

        // 3. Gallery
        const galleryEl = document.getElementById('resource-gallery');
        if (galleryEl && data.gallery && data.gallery.length > 0) {
            galleryEl.innerHTML = '';
            
            // Left main image container
            const mainImgContainer = document.createElement('div');
            mainImgContainer.className = 'gallery-main';
            const mainImg = document.createElement('img');
            mainImg.id = 'gallery-main-img';
            mainImg.className = 'main-gallery-img';
            mainImg.src = data.gallery[0];
            mainImg.alt = `${data.name} Main Image`;
            mainImgContainer.appendChild(mainImg);
            galleryEl.appendChild(mainImgContainer);

            // Right thumbnails grid
            const thumbsGrid = document.createElement('div');
            thumbsGrid.className = 'gallery-thumbs';
            
            // Use up to 3 gallery thumbnails
            const thumbnailsToShow = data.gallery.slice(0, 3);
            
            thumbnailsToShow.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.className = `thumb-img ${index === 0 ? 'active' : ''}`;
                thumb.src = imgSrc;
                thumb.alt = `${data.name} Gallery Thumbnail ${index + 1}`;
                
                thumb.addEventListener('click', () => {
                    // Update main image source
                    mainImg.src = imgSrc;
                    // Update active class
                    const activeThumbs = thumbsGrid.querySelectorAll('.thumb-img');
                    activeThumbs.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
                
                thumbsGrid.appendChild(thumb);
            });
            galleryEl.appendChild(thumbsGrid);
        }

        // 4. Center Overview / Glance Section
        const glanceGridEl = document.getElementById('glance-grid');
        if (glanceGridEl) {
            let primaryCategory = data.categories[0] || 'Recovery Support';
            let insuranceList = 'Private Pay';
            if (data.insuranceAccepted && data.insuranceAccepted.length > 0) {
                insuranceList = data.insuranceAccepted.slice(0, 2).join(', ');
                if (data.insuranceAccepted.length > 2) insuranceList += ' + More';
            }

            // Map location link scrolls to map section
            glanceGridEl.innerHTML = `
                <div class="glance-item">
                    <div class="glance-icon"><i class="fa-solid fa-location-dot"></i></div>
                    <div class="glance-text">
                        <h4>Location</h4>
                        <p>${data.address} <a href="#map-section" style="color: var(--primary-color); font-weight:600; text-decoration:none;">View Map</a></p>
                    </div>
                </div>
                <div class="glance-item">
                    <div class="glance-icon"><i class="fa-solid fa-house-medical"></i></div>
                    <div class="glance-text">
                        <h4>Primary Focus</h4>
                        <p>${primaryCategory} - Outpatient & Support Services</p>
                    </div>
                </div>
                <div class="glance-item">
                    <div class="glance-icon"><i class="fa-solid fa-calendar-day"></i></div>
                    <div class="glance-text">
                        <h4>Program Type</h4>
                        <p>${data.treatmentTypes && data.treatmentTypes.length > 0 ? data.treatmentTypes[0] : 'Support Program'}</p>
                    </div>
                </div>
                <div class="glance-item">
                    <div class="glance-icon"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                    <div class="glance-text">
                        <h4>Insurance Accepted</h4>
                        <p>${insuranceList}</p>
                    </div>
                </div>
            `;
        }

        // 5. About text
        const aboutTitleEl = document.getElementById('about-section-title');
        const aboutTextEl = document.getElementById('about-text');
        if (aboutTitleEl) aboutTitleEl.textContent = `About ${data.name}`;
        if (aboutTextEl) aboutTextEl.textContent = data.aboutLong;

        // 6. Services & Treatment Offered
        const servicesListEl = document.getElementById('services-list');
        if (servicesListEl && data.services) {
            servicesListEl.innerHTML = '';
            data.services.forEach(service => {
                const item = document.createElement('div');
                item.className = 'detail-list-item';
                item.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${service}</span>`;
                servicesListEl.appendChild(item);
            });
        }

        // 7. Amenities List
        const amenitiesSection = document.getElementById('amenities-section');
        const amenitiesListEl = document.getElementById('amenities-list');
        if (data.amenities && data.amenities.length > 0) {
            if (amenitiesSection) amenitiesSection.style.display = 'block';
            if (amenitiesListEl) {
                amenitiesListEl.innerHTML = '';
                data.amenities.forEach(amenity => {
                    const item = document.createElement('div');
                    item.className = 'detail-list-item';
                    item.innerHTML = `<i class="fa-solid fa-circle-nodes"></i> <span>${amenity}</span>`;
                    amenitiesListEl.appendChild(item);
                });
            }
        } else {
            if (amenitiesSection) amenitiesSection.style.display = 'none';
        }

        // 8. Insurance Accepted tags
        const insuranceSection = document.getElementById('insurance-section');
        const insuranceListEl = document.getElementById('insurance-list');
        if (data.insuranceAccepted && data.insuranceAccepted.length > 0) {
            if (insuranceSection) insuranceSection.style.display = 'block';
            if (insuranceListEl) {
                insuranceListEl.innerHTML = '';
                data.insuranceAccepted.forEach(ins => {
                    const tag = document.createElement('span');
                    tag.className = 'detail-badge';
                    tag.style.backgroundColor = '#EDE8F5';
                    tag.style.color = '#3D52A0';
                    tag.textContent = ins;
                    insuranceListEl.appendChild(tag);
                });
            }
        } else {
            if (insuranceSection) insuranceSection.style.display = 'none';
        }

        // 9. Sticky Sidebar
        const sidebarEl = document.getElementById('profile-sidebar');
        if (sidebarEl) {
            let logoHTML = '';
            if (data.logo) {
                logoHTML = `
                    <div class="sidebar-logo-container">
                        <img src="${data.logo}" alt="${data.name} Logo">
                    </div>
                `;
            } else {
                logoHTML = `
                    <div class="sidebar-logo-container">
                        <i class="fa-solid fa-circle-nodes" style="font-size: 2.5rem; color: var(--primary-color);"></i>
                    </div>
                `;
            }

            const phoneHTML = data.phone ? `
                <div class="sidebar-info-item">
                    <i class="fa-solid fa-phone"></i>
                    <div>
                        <strong style="display:block; color:var(--text-primary);">Phone Number</strong>
                        <a href="tel:${data.phone.replace(/\s+/g, '')}" style="color:var(--primary-color); text-decoration:none;">${data.phone}</a>
                    </div>
                </div>
            ` : '';

            const emailHTML = data.email ? `
                <div class="sidebar-info-item">
                    <i class="fa-solid fa-envelope"></i>
                    <div>
                        <strong style="display:block; color:var(--text-primary);">Email Address</strong>
                        <a href="mailto:${data.email}" style="color:var(--primary-color); text-decoration:none;">${data.email}</a>
                    </div>
                </div>
            ` : '';

            const websiteHTML = data.website ? `
                <div class="sidebar-info-item">
                    <i class="fa-solid fa-globe"></i>
                    <div>
                        <strong style="display:block; color:var(--text-primary);">Official Website</strong>
                        <a href="${data.website}" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color); text-decoration:none;">Visit Website <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem; margin-left:2px;"></i></a>
                    </div>
                </div>
            ` : '';

            const ctaHTML = data.website ? `
                <a href="${data.website}" target="_blank" rel="noopener noreferrer" class="btn btn-cta btn-sidebar-cta" style="background-color: var(--primary-color);">
                    <span>Visit Website</span>
                    <i class="fa-solid fa-arrow-up-right-from-square" style="margin-left:6px;"></i>
                </a>
            ` : '';

            sidebarEl.innerHTML = `
                ${logoHTML}
                <h3 class="sidebar-title">${data.name}</h3>
                <div class="sidebar-rating">
                    <span style="color:#f59e0b; font-weight:700;"><i class="fa-solid fa-star"></i> ${data.rating.toFixed(1)}</span>
                    <span style="color:var(--text-muted);">(${data.reviewCount} reviews)</span>
                </div>
                
                <div class="sidebar-info-list">
                    <div class="sidebar-info-item">
                        <i class="fa-solid fa-location-dot"></i>
                        <div>
                            <strong style="display:block; color:var(--text-primary);">Location</strong>
                            <span>${data.address}</span>
                        </div>
                    </div>
                    ${phoneHTML}
                    ${emailHTML}
                    ${websiteHTML}
                </div>
                
                ${ctaHTML}
            `;
        }

        // 10. Map initialization (Leaflet.js)
        if (data.latitude && data.longitude) {
            try {
                const map = L.map('detail-map', { scrollWheelZoom: false }).setView([data.latitude, data.longitude], 14);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Custom marker using standard leaflet icon
                const marker = L.marker([data.latitude, data.longitude]).addTo(map);
                marker.bindPopup(`
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem;">
                        <strong style="color: var(--text-primary);">${data.name}</strong><br>
                        <span style="color: var(--text-secondary);">${data.address}</span>
                    </div>
                `).openPopup();
            } catch (e) {
                console.error("Leaflet map initialization failed: ", e);
            }
        } else {
            const mapSection = document.getElementById('map-section');
            if (mapSection) mapSection.style.display = 'none';
        }

        // 11. Google Reviews rendering
        const reviewsSection = document.getElementById('reviews-section');
        const reviewsGrid = document.getElementById('reviews-grid');
        const loadMoreContainer = document.getElementById('load-more-container');
        const loadMoreBtn = document.getElementById('btn-load-more');

        if (reviewsSection && reviewsGrid && data.reviews && data.reviews.length > 0) {
            reviewsSection.style.display = 'block';
            reviewsGrid.innerHTML = '';
            
            let reviewsVisible = 3;
            
            function renderReviewsList() {
                reviewsGrid.innerHTML = '';
                const itemsToRender = data.reviews.slice(0, reviewsVisible);
                
                itemsToRender.forEach(rev => {
                    const card = document.createElement('div');
                    card.className = 'review-card';
                    
                    // Avatar calculation (Initials if no image)
                    let avatarContent = '';
                    if (rev.avatar) {
                        avatarContent = `<img src="${rev.avatar}" alt="${rev.author}">`;
                    } else {
                        const nameParts = rev.author.split(' ');
                        const initials = nameParts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
                        avatarContent = initials;
                    }
                    
                    // Stars HTML
                    let starsHTML = '';
                    for (let i = 0; i < 5; i++) {
                        starsHTML += `<i class="fa-solid fa-star"></i>`;
                    }
                    
                    card.innerHTML = `
                        <div>
                            <div class="reviewer-info-row">
                                <div class="reviewer-avatar">${avatarContent}</div>
                                <div class="reviewer-details">
                                    <span class="reviewer-name">${rev.author} <i class="fa-solid fa-circle-check verify-badge"></i></span>
                                    <span class="review-time">${rev.timeText}</span>
                                </div>
                            </div>
                            <div class="review-stars">${starsHTML}</div>
                            <p class="review-text">${rev.text}</p>
                        </div>
                        <button class="btn-read-more">Read more</button>
                    `;
                    
                    // Read More behavior
                    const readMoreBtn = card.querySelector('.btn-read-more');
                    const textEl = card.querySelector('.review-text');
                    readMoreBtn.addEventListener('click', () => {
                        if (textEl.style.display === 'block') {
                            textEl.style.display = '';
                            textEl.style.webkitLineClamp = '4';
                            readMoreBtn.textContent = 'Read more';
                        } else {
                            textEl.style.display = 'block';
                            textEl.style.webkitLineClamp = 'initial';
                            readMoreBtn.textContent = 'Read less';
                        }
                    });
                    
                    reviewsGrid.appendChild(card);
                });
                
                // Show/hide load more button
                if (loadMoreContainer) {
                    if (reviewsVisible >= data.reviews.length) {
                        loadMoreContainer.style.display = 'none';
                    } else {
                        loadMoreContainer.style.display = 'flex';
                    }
                }
            }
            
            // Initial render
            renderReviewsList();
            
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', () => {
                    reviewsVisible += 3;
                    renderReviewsList();
                });
            }
        } else {
            if (reviewsSection) reviewsSection.style.display = 'none';
        }
    }
});
