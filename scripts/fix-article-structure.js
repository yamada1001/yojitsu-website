const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 修正対象の記事リスト
const articlesToFix = [
    'how-to-choose-advertising-agency.html',
    'landing-page-cost.html',
    'meo-local-seo-guide.html',
    'structured-data-implementation.html',
    'web-marketing-cost.html',
    'whitepaper-creation-guide.html',
    'ahrefs-seo-guide.html',
    'hubspot-crm-guide.html',
    'instagram-algorithm-meta-ads.html',
    'web-director-role.html',
    'sns-strategy.html',
    'seo-future-2025.html',
    'what-is-planner.html',
    'what-is-pm.html'
];

// テンプレートとなる正しい記事を読み込む
const templatePath = path.join(__dirname, '../blog/posts/btob-marketing-strategy.html');
const templateContent = fs.readFileSync(templatePath, 'utf-8');
const $template = cheerio.load(templateContent);

function addMissingElements(htmlContent, articleName) {
    const $ = cheerio.load(htmlContent);
    let modified = false;

    // 1. base href の追加
    if ($('base').length === 0) {
        $('head').prepend('<base href="/yojitsu-website/">');
        modified = true;
    }

    // 2. CSS の統一
    if ($('link[href="src/css/styles.css"]').length === 0) {
        $('link[rel="stylesheet"]').remove();
        $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">');
        $('head').append('<link rel="stylesheet" href="src/css/styles.css">');
        $('head').append('<link rel="stylesheet" href="src/css/blog.css">');
        modified = true;
    }

    // 3. パンくずリストの構造統一
    const breadcrumb = $('nav.breadcrumb');
    if (breadcrumb.length > 0) {
        const currentBreadcrumbHTML = breadcrumb.html();
        if (!currentBreadcrumbHTML.includes('breadcrumb__list')) {
            const breadcrumbTitle = breadcrumb.find('li').last().text().trim() || 'ブログ記事';
            breadcrumb.html(`
                <ul class="breadcrumb__list">
                    <li class="breadcrumb__item">
                        <a href="index.html" class="breadcrumb__link">ホーム</a>
                    </li>
                    <li class="breadcrumb__item">
                        <a href="blog/index.html" class="breadcrumb__link">ブログ</a>
                    </li>
                    <li class="breadcrumb__item">
                        <span class="breadcrumb__current">${breadcrumbTitle}</span>
                    </li>
                </ul>
            `);
            modified = true;
        }
    }

    // 4. Article Container の追加
    if ($('article.article').length === 0) {
        $('main, .article').first().replaceWith(function() {
            const content = $(this).html();
            return `<article class="article"><div class="article__container"><div class="article__main">${content}</div></div></article>`;
        });
        modified = true;
    }

    // 5. Article Header の統一
    const articleHeader = $('header.article__header');
    if (articleHeader.length > 0 && articleHeader.find('.article__meta').length === 0) {
        const title = $('h1.article__title').text() || $('h1').first().text();
        const category = $('span.article__category').text() || 'マーケティング';
        const date = $('time.article__date').attr('datetime') || '2025-01-27';

        articleHeader.html(`
            <div class="article__meta">
                <span class="article__category">${category}</span>
                <time class="article__date" datetime="${date}"></time>
            </div>
            <h1 class="article__title">${title}</h1>
            <p class="article__excerpt">
                ${$('.article__excerpt').text() || $('meta[name="description"]').attr('content') || ''}
            </p>
        `);
        modified = true;
    }

    // 6. Featured Image の追加
    if ($('.article__featured-image').length === 0) {
        const toc = $('nav.article__toc');
        if (toc.length > 0) {
            toc.before(`
                <div class="article__featured-image">
                    <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="800" height="450" fill="#F5F5F5"/>
                        <circle cx="400" cy="225" r="80" stroke="#EC4899" stroke-width="4" fill="none"/>
                        <path d="M340 225 L460 225 M400 165 L400 285" stroke="#EC4899" stroke-width="4"/>
                        <text x="400" y="350" text-anchor="middle" fill="#EC4899" font-size="24" font-weight="bold">Article</text>
                    </svg>
                </div>
            `);
            modified = true;
        }
    }

    // 7. Share Buttons の追加
    if ($('.article__share').length === 0) {
        const articleContent = $('.article__content, .article__body').last();
        if (articleContent.length > 0) {
            articleContent.after(`
                <div class="article__share">
                    <h3 class="article__share-title">この記事をシェア</h3>
                    <div class="article__share-buttons">
                        <a href="https://twitter.com/intent/tweet?url=https://yamada1001.github.io/yojitsu-website/blog/posts/${articleName}&text=" class="share-btn" target="_blank" rel="noopener">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                            </svg>
                            Twitter
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=https://yamada1001.github.io/yojitsu-website/blog/posts/${articleName}" class="share-btn" target="_blank" rel="noopener">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                            </svg>
                            Facebook
                        </a>
                        <a href="https://social-plugins.line.me/lineit/share?url=https://yamada1001.github.io/yojitsu-website/blog/posts/${articleName}" class="share-btn" target="_blank" rel="noopener">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                            </svg>
                            LINE
                        </a>
                        <button class="share-btn" onclick="navigator.clipboard.writeText('https://yamada1001.github.io/yojitsu-website/blog/posts/${articleName}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                            </svg>
                            URLをコピー
                        </button>
                    </div>
                </div>
            `);
            modified = true;
        }
    }

    // 8. Related Posts の追加
    if ($('.related-posts').length === 0) {
        $('.article__share').after(`
            <aside class="related-posts">
                <h2 class="related-posts__title">関連記事</h2>
                <div class="related-posts__grid" id="relatedArticles">
                    <!-- JavaScriptで自動生成 -->
                </div>
            </aside>
        `);
        modified = true;
    }

    // 9. Sidebar TOC の追加
    if ($('.article__sidebar').length === 0 || $('.sidebar-toc').length === 0) {
        $('.article__main').after(`
            <aside class="article__sidebar">
                <nav class="sidebar-toc" id="sidebarToc">
                    <!-- JavaScriptで自動生成 -->
                </nav>
            </aside>
        `);
        modified = true;
    }

    // 10. Floating TOC Button の追加
    if ($('.floating-toc-btn').length === 0) {
        $('article.article').after(`
            <button class="floating-toc-btn" id="floatingTocBtn" aria-label="目次を開く">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
        `);
        modified = true;
    }

    // 11. Mobile TOC Modal の追加
    if ($('.mobile-toc-modal').length === 0) {
        $('.floating-toc-btn').after(`
            <div class="mobile-toc-modal" id="mobileTocModal">
                <div class="mobile-toc-modal__content">
                    <div class="mobile-toc-modal__header">
                        <h3 class="mobile-toc-modal__title">目次</h3>
                        <button class="mobile-toc-modal__close" id="closeMobileToc" aria-label="閉じる">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <ul class="mobile-toc-modal__list" id="mobileTocList">
                        <!-- JavaScriptで自動生成 -->
                    </ul>
                </div>
            </div>
        `);
        modified = true;
    }

    // 12. Scripts の追加
    const scriptsNeeded = ['blog-loader.js', 'main.js', 'blog.js', 'article-template.js'];
    const existingScripts = $('script[src]').map((i, el) => $(el).attr('src')).get();

    scriptsNeeded.forEach(script => {
        const scriptPath = `src/js/${script}`;
        if (!existingScripts.some(s => s && s.includes(script))) {
            $('body').append(`<script src="${scriptPath}"></script>`);
            modified = true;
        }
    });

    return { html: $.html(), modified };
}

// 各記事を修正
let fixedCount = 0;
let skippedCount = 0;

articlesToFix.forEach(articleName => {
    const articlePath = path.join(__dirname, '../blog/posts/', articleName);

    if (!fs.existsSync(articlePath)) {
        console.log(`⚠️  ${articleName} not found, skipping...`);
        skippedCount++;
        return;
    }

    try {
        const content = fs.readFileSync(articlePath, 'utf-8');
        const { html, modified } = addMissingElements(content, articleName);

        if (modified) {
            fs.writeFileSync(articlePath, html, 'utf-8');
            console.log(`✅ Fixed: ${articleName}`);
            fixedCount++;
        } else {
            console.log(`✓  ${articleName} (no changes needed)`);
            skippedCount++;
        }
    } catch (error) {
        console.error(`❌ Error processing ${articleName}:`, error.message);
    }
});

console.log(`\n🎉 Complete! Fixed: ${fixedCount}, Skipped: ${skippedCount}`);
