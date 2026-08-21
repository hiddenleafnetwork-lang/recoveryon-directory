/**
 * TreatmentLane Directory - Blog Index Controller
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
    }

    // 2. Render Blog Cards
    const blogGrid = document.getElementById('blog-grid');
    const searchForm = document.getElementById('blog-search-form');
    const searchInput = document.getElementById('blog-search-input');

    const posts = window.RECOVERY_BLOG_POSTS || [];

    function renderPosts(postsList) {
        if (!blogGrid) return;
        blogGrid.innerHTML = '';

        if (postsList.length === 0) {
            blogGrid.innerHTML = `
                <div style="grid-column: span 3; text-align: center; padding: 48px 24px; color: var(--text-muted);">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
                    <p>No blog posts found matching your search term.</p>
                </div>
            `;
            return;
        }

        postsList.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            
            card.innerHTML = `
                <a href="detail.html?slug=${post.slug}" class="blog-img-wrapper">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </a>
                <div class="blog-meta-line">
                    <span>${post.date}</span>
                    <span class="blog-category-tag">${post.category}</span>
                </div>
                <a href="detail.html?slug=${post.slug}" class="blog-card-title">${post.title}</a>
                <p class="blog-card-desc">${post.excerpt}</p>
                <a href="detail.html?slug=${post.slug}" class="blog-readmore-link">
                    Read more <i class="fa-solid fa-arrow-right"></i>
                </a>
            `;
            blogGrid.appendChild(card);
        });
    }

    // Initial render
    renderPosts(posts);

    // 3. Search Filter
    if (searchInput) {
        const handleSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            const filtered = posts.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.excerpt.toLowerCase().includes(query)
            );
            renderPosts(filtered);
        };

        searchInput.addEventListener('input', handleSearch);
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSearch();
            });
        }
    }
});
