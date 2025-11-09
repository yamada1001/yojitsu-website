const fs = require('fs');
const path = require('path');

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

const shareButtonsTemplate = (articleName) => `
                <!-- Share Buttons -->
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
                </div>`;

const relatedPostsTemplate = `
                <!-- Related Posts -->
                <aside class="related-posts">
                    <h2 class="related-posts__title">関連記事</h2>
                    <div class="related-posts__grid" id="relatedArticles">
                        <!-- JavaScriptで自動生成 -->
                    </div>
                </aside>`;

const sidebarTocTemplate = `
            <!-- Sidebar TOC -->
            <aside class="article__sidebar">
                <nav class="sidebar-toc" id="sidebarToc">
                    <!-- JavaScriptで自動生成 -->
                </nav>
            </aside>`;

const floatingTocButtonTemplate = `
    <!-- Floating TOC Button (Mobile) -->
    <button class="floating-toc-btn" id="floatingTocBtn" aria-label="目次を開く">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
    </button>`;

const mobileTocModalTemplate = `
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

const scriptsTemplate = `
    <!-- Scripts -->
    <script src="src/js/blog-loader.js"></script>
    <script src="src/js/main.js"></script>
    <script src="src/js/blog.js"></script>
    <script src="src/js/article-template.js"></script>`;

function fixArticle(articlePath, articleName) {
    let content = fs.readFileSync(articlePath, 'utf-8');
    let modified = false;

    // 1. base hrefの追加
    if (!content.includes('<base href="/yojitsu-website/">')) {
        content = content.replace('</head>', '    <base href="/yojitsu-website/">\n</head>');
        modified = true;
    }

    // 2. CSSの統一
    if (!content.includes('src/css/styles.css')) {
        content = content.replace(
            /<link rel="stylesheet" href=".*?common\.css">.*?<link rel="stylesheet" href=".*?article\.css">/s,
            '<link rel="stylesheet" href="src/css/styles.css">\n    <link rel="stylesheet" href="src/css/blog.css">'
        );
        modified = true;
    }

    // 3. Share Buttonsの追加
    if (!content.includes('article__share')) {
        const insertPoint = content.lastIndexOf('</article>');
        if (insertPoint !== -1) {
            content = content.slice(0, insertPoint) + shareButtonsTemplate(articleName) + '\n' + content.slice(insertPoint);
            modified = true;
        }
    }

    // 4. Related Postsの追加
    if (!content.includes('related-posts')) {
        if (content.includes('article__share')) {
            content = content.replace(
                '</div>\n                <!-- Share Buttons -->',
                '</div>\n' + relatedPostsTemplate + '\n                <!-- Share Buttons -->'
            );
        } else {
            const insertPoint = content.lastIndexOf('</article>');
            if (insertPoint !== -1) {
                content = content.slice(0, insertPoint) + relatedPostsTemplate + '\n' + content.slice(insertPoint);
            }
        }
        modified = true;
    }

    // 5. Sidebar TOCの追加
    if (!content.includes('sidebar-toc')) {
        content = content.replace(
            '</div><!-- /.article__container -->',
            sidebarTocTemplate + '\n        </div><!-- /.article__container -->'
        );
        modified = true;
    }

    // 6. Floating TOC Buttonの追加
    if (!content.includes('floating-toc-btn')) {
        content = content.replace(
            '</article>',
            '</article>\n' + floatingTocButtonTemplate
        );
        modified = true;
    }

    // 7. Mobile TOC Modalの追加
    if (!content.includes('mobile-toc-modal')) {
        content = content.replace(
            floatingTocButtonTemplate,
            floatingTocButtonTemplate + '\n' + mobileTocModalTemplate
        );
        modified = true;
    }

    // 8. Scriptsの追加
    const hasAllScripts = content.includes('blog-loader.js') &&
                          content.includes('main.js') &&
                          content.includes('blog.js') &&
                          content.includes('article-template.js');

    if (!hasAllScripts) {
        content = content.replace(
            '</body>',
            scriptsTemplate + '\n</body>'
        );
        modified = true;
    }

    return { content, modified };
}

// すべての記事を修正
let fixedCount = 0;
let skippedCount = 0;
let errorCount = 0;

console.log('🔧 Starting to fix all articles...\n');

articlesToFix.forEach(articleName => {
    const articlePath = path.join(__dirname, '../blog/posts/', articleName);

    if (!fs.existsSync(articlePath)) {
        console.log(`⚠️  ${articleName} not found, skipping...`);
        skippedCount++;
        return;
    }

    try {
        const { content, modified } = fixArticle(articlePath, articleName);

        if (modified) {
            fs.writeFileSync(articlePath, content, 'utf-8');
            console.log(`✅ Fixed: ${articleName}`);
            fixedCount++;
        } else {
            console.log(`✓  ${articleName} (no changes needed)`);
            skippedCount++;
        }
    } catch (error) {
        console.error(`❌ Error processing ${articleName}:`, error.message);
        errorCount++;
    }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Fixed: ${fixedCount}`);
console.log(`   ✓  Skipped: ${skippedCount}`);
console.log(`   ❌ Errors: ${errorCount}`);
console.log(`\n🎉 Complete!`);
