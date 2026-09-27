/**
 * TreatmentLane Directory - Blog Detail Page Controller
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

    // 2. Fetch slug from URL query
    const getQueryParam = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    };

    const postSlug = getQueryParam('slug') || 'instagram-algorithm-2026';
    const post = window.RECOVERY_BLOG_POSTS.find(p => p.slug === postSlug);

    const errorSection = document.getElementById('error-section');
    const articleSection = document.getElementById('article-section');

    if (!post) {
        if (errorSection) errorSection.style.display = 'flex';
        if (articleSection) articleSection.style.display = 'none';
        return;
    }

    // 3. Populate Page Meta
    document.title = `${post.title} | TreatmentLane Blog`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', post.excerpt);
    }

    // 4. Render Article Content
    const breadcrumbTitle = document.getElementById('breadcrumb-article-title');
    const articleCategory = document.getElementById('article-category');
    const articleTitle = document.getElementById('article-title');
    const articleAuthor = document.getElementById('article-author');
    const articleDate = document.getElementById('article-date');
    const articleImage = document.getElementById('article-image');
    const articleContentBody = document.getElementById('article-content-body');
    const articleAvatar = document.getElementById('article-avatar');

    if (breadcrumbTitle) breadcrumbTitle.textContent = post.title;
    if (articleCategory) {
        articleCategory.textContent = post.category;
    }
    if (articleTitle) articleTitle.textContent = post.title;
    if (articleAuthor) articleAuthor.textContent = post.author;
    if (articleDate) articleDate.textContent = post.date;
    
    if (articleImage) {
        articleImage.src = post.image;
        articleImage.alt = post.title;
    }
    if (articleContentBody) {
        articleContentBody.innerHTML = post.content;
    }

    // Generate avatar initials
    if (articleAvatar) {
        articleAvatar.textContent = post.author.substring(0, 1).toUpperCase();
        // Give a beautiful matching background
        articleAvatar.style.backgroundColor = 'var(--primary-color)';
        articleAvatar.style.color = '#ffffff';
    }

    // 5. Render Related Posts
    const relatedGrid = document.getElementById('related-posts-grid');
    if (relatedGrid) {
        relatedGrid.innerHTML = '';
        const otherPosts = window.RECOVERY_BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

        otherPosts.forEach(p => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            
            card.innerHTML = `
                <a href="detail.html?slug=${p.slug}" class="blog-img-wrapper">
                    <img src="${p.image}" alt="${p.title}" loading="lazy">
                </a>
                <div class="blog-meta-line">
                    <span>${p.date}</span>
                    <span class="blog-category-tag">${p.category}</span>
                </div>
                <a href="detail.html?slug=${p.slug}" class="blog-card-title">${p.title}</a>
                <p class="blog-card-desc">${p.excerpt}</p>
                <a href="detail.html?slug=${p.slug}" class="blog-readmore-link">
                    Read more <i class="fa-solid fa-arrow-right"></i>
                </a>
            `;
            relatedGrid.appendChild(card);
        });
    }
});
