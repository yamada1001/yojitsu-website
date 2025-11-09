const fs = require('fs');
const path = require('path');

const articlesToFix = [
    'ahrefs-seo-guide.html',
    'how-to-choose-advertising-agency.html',
    'hubspot-crm-guide.html',
    'instagram-algorithm-meta-ads.html',
    'landing-page-cost.html',
    'meo-local-seo-guide.html',
    'seo-future-2025.html',
    'sns-strategy.html',
    'structured-data-implementation.html',
    'web-director-role.html',
    'web-marketing-cost.html',
    'what-is-planner.html',
    'what-is-pm.html',
    'whitepaper-creation-guide.html'
];

function extractTitle(content) {
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/s);
    if (h1Match) return h1Match[1].replace(/<[^>]*>/g, '').trim();

    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch) return titleMatch[1].split('|')[0].trim();

    return 'ブログ記事';
}

function extractDescription(content) {
    const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
    return descMatch ? descMatch[1] : '';
}

function extractDate(content) {
    const dateMatch = content.match(/"datePublished":\s*"([^"]+)"/);
    return dateMatch ? dateMatch[1] : '2025-01-27';
}

function extractCategory(content) {
    const catMatch = content.match(/<span class="article__category[^"]*">([^<]+)<\/span>/);
    return catMatch ? catMatch[1] : 'マーケティング';
}

function wrapInArticleStructure(content, articleName) {
    const title = extractTitle(content);
    const description = extractDescription(content);
    const date = extractDate(content);
    const category = extractCategory(content);

    // コンテンツ部分を抽出
    let mainContent = content;

    // 既存のmainタグまたはarticleタグの中身を抽出
    const mainMatch = content.match(/<main[^>]*>(.*?)<\/main>/s) ||
                      content.match(/<article[^>]*class="article"[^>]*>(.*?)<\/article>/s);

    if (mainMatch) {
        mainContent = mainMatch[1];
    }

    // article__contentの中身を抽出（既にある場合）
    const contentMatch = mainContent.match(/<div class="article__(?:content|body)"[^>]*>(.*?)<\/div>\s*(?:<\/article>|<\/main>|$)/s);
    if (contentMatch) {
        mainContent = contentMatch[1];
    }

    // 目次を抽出
    const tocMatch = content.match(/<nav class="article__toc[^>]*>.*?<\/nav>/s);
    const tocSection = tocMatch ? tocMatch[0] : `
                <nav class="article__toc">
                    <h2 class="article__toc-title">目次</h2>
                    <ul class="article__toc-list">
                        <!-- 自動生成 -->
                    </ul>
                </nav>`;

    // 新しい構造を構築
    const newStructure = `
    <!-- Article -->
    <article class="article">
        <div class="article__container">
            <div class="article__main">
                <!-- Article Header -->
                <header class="article__header">
                    <div class="article__meta">
                        <span class="article__category">${category}</span>
                        <time class="article__date" datetime="${date}"></time>
                    </div>
                    <h1 class="article__title">${title}</h1>
                    <p class="article__excerpt">
                        ${description}
                    </p>
                </header>

                <!-- Featured Image -->
                <div class="article__featured-image">
                    <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="800" height="450" fill="#F5F5F5"/>
                        <circle cx="400" cy="225" r="80" stroke="#EC4899" stroke-width="4" fill="none"/>
                        <path d="M340 225 L460 225 M400 165 L400 285" stroke="#EC4899" stroke-width="4"/>
                        <text x="400" y="350" text-anchor="middle" fill="#EC4899" font-size="24" font-weight="bold">Article</text>
                    </svg>
                </div>

                <!-- Table of Contents -->
                ${tocSection}

                <!-- Article Content -->
                <div class="article__content">
                    ${mainContent}
                </div>

                <!-- Share Buttons -->
                <div class="article__share">
                    <h3 class="article__share-title">この記事をシェア</h3>
                    <div class="article__share-buttons">
                        <a href="https://twitter.com/intent/tweet?url=https://yamada1001.github.io/yojitsu-website/blog/posts/${articleName}&text=${encodeURIComponent(title)}" class="share-btn" target="_blank" rel="noopener">
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

                <!-- Related Posts -->
                <aside class="related-posts">
                    <h2 class="related-posts__title">関連記事</h2>
                    <div class="related-posts__grid" id="relatedArticles">
                        <!-- JavaScriptで自動生成 -->
                    </div>
                </aside>
            </div><!-- /.article__main -->

            <!-- Sidebar TOC -->
            <aside class="article__sidebar">
                <nav class="sidebar-toc" id="sidebarToc">
                    <!-- JavaScriptで自動生成 -->
                </nav>
            </aside>
        </div><!-- /.article__container -->
    </article>

    <!-- Floating TOC Button (Mobile) -->
    <button class="floating-toc-btn" id="floatingTocBtn" aria-label="目次を開く">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
    </button>

    <!-- Mobile TOC Modal -->
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
    </div>`;

    return newStructure;
}

function fixArticle(articlePath, articleName) {
    let content = fs.readFileSync(articlePath, 'utf-8');

    // base hrefの追加
    if (!content.includes('<base href="/yojitsu-website/">')) {
        content = content.replace('<meta charset="UTF-8">', '<base href="/yojitsu-website/">\n    <meta charset="UTF-8">');
    }

    // CSSの統一
    content = content.replace(
        /<link rel="stylesheet" href="\.\.\/\.\.\/src\/css\/common\.css">/,
        '<link rel="stylesheet" href="src/css/styles.css">'
    );
    content = content.replace(
        /<link rel="stylesheet" href="\.\.\/\.\.\/src\/css\/article\.css">/,
        '<link rel="stylesheet" href="src/css/blog.css">'
    );

    // パンくずリストの修正
    content = content.replace(
        /<nav class="breadcrumb"[^>]*>.*?<\/nav>/s,
        `<nav class="breadcrumb" aria-label="パンくずリスト">
        <ul class="breadcrumb__list">
            <li class="breadcrumb__item">
                <a href="index.html" class="breadcrumb__link">ホーム</a>
            </li>
            <li class="breadcrumb__item">
                <a href="blog/index.html" class="breadcrumb__link">ブログ</a>
            </li>
            <li class="breadcrumb__item">
                <span class="breadcrumb__current">${extractTitle(content)}</span>
            </li>
        </ul>
    </nav>`
    );

    // ヘッダーとメインコンテンツを削除して新しい構造に置き換え
    const headerMatch = content.match(/(<header class="header">.*?<\/header>)/s);
    const footerMatch = content.match(/(<footer class="footer">.*?<\/footer>)/s);
    const breadcrumbMatch = content.match(/(<nav class="breadcrumb".*?<\/nav>)/s);

    if (headerMatch && footerMatch) {
        const newArticleStructure = wrapInArticleStructure(content, articleName);

        // ヘッダー、パンくず、新しい記事構造、フッターの順に再構築
        const beforeHeader = content.substring(0, content.indexOf(headerMatch[0]));
        const afterBreadcrumb = breadcrumbMatch ? content.substring(content.indexOf(breadcrumbMatch[0]) + breadcrumbMatch[0].length) : '';
        const beforeFooter = afterBreadcrumb.substring(0, afterBreadcrumb.indexOf(footerMatch[0]));
        const footer = footerMatch[0];
        const afterFooter = content.substring(content.indexOf(footer) + footer.length);

        // 古いヘッダーとフッターを削除
        content = beforeHeader + (breadcrumbMatch ? breadcrumbMatch[0] : '') + '\n' + newArticleStructure + '\n\n    ' + footer + afterFooter;
    }

    // スクリプトの追加
    const scriptsTemplate = `
    <!-- Scripts -->
    <script src="src/js/blog-loader.js"></script>
    <script src="src/js/main.js"></script>
    <script src="src/js/blog.js"></script>
    <script src="src/js/article-template.js"></script>`;

    if (!content.includes('article-template.js')) {
        content = content.replace('</body>', scriptsTemplate + '\n</body>');
    }

    return content;
}

// すべての記事を修正
let fixedCount = 0;
let errorCount = 0;

console.log('🔧 Starting comprehensive article structure fix...\n');

articlesToFix.forEach(articleName => {
    const articlePath = path.join(__dirname, '../blog/posts/', articleName);

    if (!fs.existsSync(articlePath)) {
        console.log(`⚠️  ${articleName} not found, skipping...`);
        return;
    }

    try {
        const fixedContent = fixArticle(articlePath, articleName);
        fs.writeFileSync(articlePath, fixedContent, 'utf-8');
        console.log(`✅ Fixed: ${articleName}`);
        fixedCount++;
    } catch (error) {
        console.error(`❌ Error processing ${articleName}:`, error.message);
        errorCount++;
    }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Fixed: ${fixedCount}`);
console.log(`   ❌ Errors: ${errorCount}`);
console.log(`\n🎉 Complete!`);
