/**
 * Blog Article Loader
 * JSONファイルから記事データを読み込み、ブログカードを自動生成します
 * これにより、記事の追加時に各ページを個別に更新する必要がなくなります
 */

class BlogLoader {
    constructor() {
        this.articlesData = null;
        this.categories = null;
    }

    /**
     * articles.jsonを読み込む
     */
    async loadArticles() {
        try {
            const response = await fetch('blog/articles.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.articlesData = data.articles;
            this.categories = data.categories;
            return data;
        } catch (error) {
            console.error('Failed to load articles:', error);
            return null;
        }
    }

    /**
     * カテゴリー別の記事数を取得
     */
    getArticleCountByCategory(categoryId) {
        if (!this.articlesData) return 0;
        if (categoryId === 'all') return this.articlesData.length;
        return this.articlesData.filter(article => article.category === categoryId).length;
    }

    /**
     * カテゴリー別に記事を取得（日付順にソート）
     */
    getArticlesByCategory(categoryId) {
        if (!this.articlesData) return [];

        let filtered;
        if (categoryId === 'all') {
            filtered = [...this.articlesData];
        } else {
            filtered = this.articlesData.filter(article => article.category === categoryId);
        }

        // 日付順（新しい順）にソート
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * 最新記事を取得
     */
    getLatestArticles(limit = null) {
        if (!this.articlesData) return [];
        const sorted = [...this.articlesData].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );
        return limit ? sorted.slice(0, limit) : sorted;
    }

    /**
     * 特定のIDの記事を除外した関連記事を取得
     */
    getRelatedArticles(currentArticleId, categoryId, limit = 3) {
        if (!this.articlesData) return [];

        // 同じカテゴリーの記事を取得（現在の記事を除く）
        const relatedByCategory = this.articlesData.filter(article =>
            article.category === categoryId && article.id !== currentArticleId
        );

        // カテゴリー内の記事が少ない場合は他のカテゴリーからも取得
        if (relatedByCategory.length < limit) {
            const others = this.articlesData.filter(article =>
                article.id !== currentArticleId && !relatedByCategory.includes(article)
            );
            return [...relatedByCategory, ...others].slice(0, limit);
        }

        return relatedByCategory.slice(0, limit);
    }

    /**
     * SVGアイコンを生成
     */
    generateSVGIcon(article) {
        if (!article.svgIcon) return '';

        const elements = article.svgIcon.elements.map(element => {
            switch (element.type) {
                case 'circle':
                    return `<circle cx="${element.cx}" cy="${element.cy}" r="${element.r}"
                        fill="${element.fill || 'none'}"
                        stroke="${element.stroke || 'none'}"
                        stroke-width="${element.strokeWidth || 0}"
                        opacity="${element.opacity || 1}"/>`;

                case 'rect':
                    return `<rect x="${element.x}" y="${element.y}"
                        width="${element.width}" height="${element.height}"
                        rx="${element.rx || 0}"
                        fill="${element.fill || 'none'}"
                        opacity="${element.opacity || 1}"/>`;

                case 'path':
                    return `<path d="${element.d}"
                        stroke="${element.stroke || 'none'}"
                        stroke-width="${element.strokeWidth || 1}"
                        stroke-dasharray="${element.strokeDasharray || 'none'}"
                        fill="${element.fill || 'none'}"
                        opacity="${element.opacity || 1}"/>`;

                default:
                    return '';
            }
        }).join('\n');

        const gradient = article.svgGradient ? `
            <defs>
                <linearGradient id="${article.svgGradient.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${article.svgGradient.colors[0]};stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:${article.svgGradient.colors[1]};stop-opacity:0.6" />
                </linearGradient>
            </defs>
            <rect width="400" height="250" fill="url(#${article.svgGradient.id})"/>
        ` : '<rect width="400" height="250" fill="#E5E7EB"/>';

        return `
            <svg class="blog-card__placeholder" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${gradient}
                ${elements}
            </svg>
        `;
    }

    /**
     * ブログカードHTMLを生成
     */
    generateBlogCard(article, includeDataCategory = true) {
        const dataCategoryAttr = includeDataCategory ? `data-category="${article.category}"` : '';
        const svg = this.generateSVGIcon(article);

        return `
            <article class="blog-card" ${dataCategoryAttr}>
                <a href="${article.path}" class="blog-card__link">
                    <div class="blog-card__image">
                        ${svg}
                    </div>
                    <div class="blog-card__content">
                        <div class="blog-card__meta">
                            <span class="blog-card__category blog-card__category--${article.category}">${article.categoryLabel}</span>
                            <time class="blog-card__date" datetime="${article.date}">${this.formatDate(article.date)}</time>
                        </div>
                        <h3 class="blog-card__title">${article.title}</h3>
                        <p class="blog-card__excerpt">
                            ${article.excerpt}
                        </p>
                    </div>
                </a>
            </article>
        `;
    }

    /**
     * 日付をフォーマット (YYYY.MM.DD)
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    }

    /**
     * カテゴリーカードHTMLを生成（横並びピルスタイル）
     */
    generateCategoryCard(category) {
        const count = this.getArticleCountByCategory(category.id);
        return `
            <button class="category-card" data-category="${category.id}">
                <i class="fas fa-${category.icon} category-card__icon"></i>
                <span class="category-card__title">${category.label}</span>
                <span class="category-card__count">${count}</span>
            </button>
        `;
    }

    /**
     * ブログ一覧ページ用：記事グリッドを生成
     */
    async renderBlogIndex() {
        await this.loadArticles();

        // 記事グリッドを生成
        const gridContainer = document.querySelector('.blog-list__grid');
        if (gridContainer) {
            const articles = this.getArticlesByCategory('all');
            gridContainer.innerHTML = articles.map(article =>
                this.generateBlogCard(article, true)
            ).join('');
        }

        // カテゴリーグリッドを生成
        const categoryGrid = document.querySelector('.category-cards__grid');
        if (categoryGrid && this.categories) {
            categoryGrid.innerHTML = this.categories.map(category =>
                this.generateCategoryCard(category)
            ).join('');

            // カテゴリーカードのクリックイベントを設定
            this.setupCategoryCardFiltering();
        }

        // 記事数を更新
        const countElement = document.querySelector('.page-header__count');
        if (countElement) {
            const totalCount = this.articlesData.length;
            countElement.textContent = `全${totalCount}件の記事`;
        }

        // カテゴリーフィルタリングを設定
        this.setupCategoryFiltering();
    }

    /**
     * トップページ用：最新記事を表示
     */
    async renderTopPageBlog(limit = 6) {
        await this.loadArticles();

        const gridContainer = document.querySelector('.blog-grid');
        if (gridContainer) {
            // スマホ判定（768px以下）
            const isMobile = window.innerWidth <= 768;
            const displayLimit = isMobile ? 3 : limit;

            const articles = this.getLatestArticles(displayLimit);
            gridContainer.innerHTML = articles.map(article =>
                this.generateBlogCard(article, true)
            ).join('');
        }

        // カテゴリータブを生成
        const categoryTabs = document.querySelector('.blog-categories');
        if (categoryTabs && this.categories) {
            const totalCount = this.articlesData.length;
            const allButton = `<button class="blog-category-tab active" data-category="all">すべて <span class="category-count">${totalCount}</span></button>`;
            const categoryButtons = this.categories
                .filter(cat => this.getArticleCountByCategory(cat.id) > 0)
                .map(cat => {
                    const count = this.getArticleCountByCategory(cat.id);
                    return `<button class="blog-category-tab" data-category="${cat.id}">${cat.label} <span class="category-count">${count}</span></button>`;
                }).join('');
            categoryTabs.innerHTML = allButton + categoryButtons;
        }

        // カテゴリーフィルタリングを設定
        this.setupCategoryFiltering();
    }

    /**
     * カテゴリーページ用：特定カテゴリーの記事を表示
     */
    async renderCategoryPage(categoryId) {
        await this.loadArticles();

        const gridContainer = document.querySelector('.blog-list__grid');
        if (gridContainer) {
            const articles = this.getArticlesByCategory(categoryId);
            gridContainer.innerHTML = articles.map(article =>
                this.generateBlogCard(article, false)
            ).join('');
        }

        // カテゴリー情報を更新
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
            const titleElement = document.querySelector('.category-header__title');
            const descElement = document.querySelector('.category-header__description');

            if (titleElement) titleElement.textContent = category.label;
            if (descElement) descElement.textContent = category.description;
        }
    }

    /**
     * 記事詳細ページ用：関連記事を表示
     */
    async renderRelatedArticles(currentArticleId, categoryId) {
        await this.loadArticles();

        const relatedContainer = document.querySelector('.related-articles__grid');
        if (relatedContainer) {
            const articles = this.getRelatedArticles(currentArticleId, categoryId);
            relatedContainer.innerHTML = articles.map(article =>
                this.generateBlogCard(article, false)
            ).join('');
        }
    }

    /**
     * カテゴリーフィルタリング機能を設定（タブ用）
     */
    setupCategoryFiltering() {
        const categoryTabs = document.querySelectorAll('.blog-category-tab');
        const blogCards = document.querySelectorAll('.blog-card');

        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // クリックされた要素がspanの場合、親のbuttonを取得
                const targetButton = e.target.closest('.blog-category-tab');
                if (!targetButton) return;

                const category = targetButton.dataset.category;

                // アクティブタブを更新
                categoryTabs.forEach(t => t.classList.remove('active'));
                targetButton.classList.add('active');

                // 記事をフィルタリング
                blogCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /**
     * カテゴリーカードのフィルタリング機能を設定
     */
    setupCategoryCardFiltering() {
        const categoryCards = document.querySelectorAll('.category-card');
        const blogCards = document.querySelectorAll('.blog-card');
        const categoryTabs = document.querySelectorAll('.blog-category-tab');

        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const category = card.dataset.category;

                // カテゴリーカードのアクティブ状態を更新
                categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // カテゴリータブも同期
                categoryTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.dataset.category === category) {
                        tab.classList.add('active');
                    }
                });

                // 記事をフィルタリング
                blogCards.forEach(blogCard => {
                    if (category === 'all' || blogCard.dataset.category === category) {
                        blogCard.style.display = '';
                    } else {
                        blogCard.style.display = 'none';
                    }
                });

                // 記事一覧までスクロール
                const blogListSection = document.querySelector('.blog-list');
                if (blogListSection) {
                    blogListSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// グローバルインスタンスを作成
window.blogLoader = new BlogLoader();

// DOMContentLoaded時の自動初期化
document.addEventListener('DOMContentLoaded', () => {
    // ページタイプに応じて適切なレンダリングを実行
    const path = window.location.pathname;

    if (path.includes('/blog/index.html')) {
        // ブログ一覧ページ
        window.blogLoader.renderBlogIndex();
    } else if (path.includes('/blog/categories/')) {
        // カテゴリーページ
        const categoryId = path.split('/').pop().replace('.html', '');
        window.blogLoader.renderCategoryPage(categoryId);
    } else if (path === '/' || path.endsWith('/') || path.includes('/index.html') || path === '/yojitsu-website' || path === '/yojitsu-website/') {
        // トップページ
        window.blogLoader.renderTopPageBlog(6);
    }
});
