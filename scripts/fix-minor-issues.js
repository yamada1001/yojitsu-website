const fs = require('fs');
const path = require('path');

// 小さな問題のある記事
const articles = [
    'how-to-choose-advertising-agency.html',
    'landing-page-cost.html',
    'meo-local-seo-guide.html',
    'seo-future-2025.html',
    'structured-data-implementation.html',
    'web-marketing-cost.html',
    'what-is-planner.html',
    'what-is-pm.html',
    'whitepaper-creation-guide.html'
];

function addTableOfContents(content) {
    // 既に目次がある場合はスキップ
    if (content.includes('<nav class="article__toc">')) {
        return content;
    }

    // h2タグから目次を自動生成
    const h2Matches = [...content.matchAll(/<h2[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>/g)];

    if (h2Matches.length === 0) {
        // idがない場合は、h2タグだけマッチ
        const simpleH2 = [...content.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)];
        if (simpleH2.length > 0) {
            const tocItems = simpleH2.map((match, index) => {
                const text = match[1].replace(/<[^>]*>/g, '').trim();
                return `                        <li><a href="#section${index + 1}">${index + 1}. ${text}</a></li>`;
            }).join('\n');

            const toc = `
                <!-- Table of Contents -->
                <nav class="article__toc">
                    <h2 class="article__toc-title">目次</h2>
                    <ul class="article__toc-list">
${tocItems}
                    </ul>
                </nav>
`;

            // Featured Imageの後、またはarticle__contentの前に挿入
            if (content.includes('<div class="article__featured-image">')) {
                return content.replace(
                    /(<\/div>\s*<!--\s*Featured Image\s*-->)/,
                    '$1\n' + toc
                );
            } else if (content.includes('<div class="article__content">')) {
                return content.replace(
                    /(<div class="article__content">)/,
                    toc + '\n                $1'
                );
            }
        }
    } else {
        const tocItems = h2Matches.map((match, index) => {
            const id = match[1];
            const text = match[2].replace(/<[^>]*>/g, '').trim();
            return `                        <li><a href="#${id}">${index + 1}. ${text}</a></li>`;
        }).join('\n');

        const toc = `
                <!-- Table of Contents -->
                <nav class="article__toc">
                    <h2 class="article__toc-title">目次</h2>
                    <ul class="article__toc-list">
${tocItems}
                    </ul>
                </nav>
`;

        if (content.includes('<div class="article__featured-image">')) {
            return content.replace(
                /(<div class="article__featured-image">.*?<\/div>)/s,
                '$1\n' + toc
            );
        } else if (content.includes('<div class="article__content">')) {
            return content.replace(
                /(<div class="article__content">)/,
                toc + '\n                $1'
            );
        }
    }

    return content;
}

function addRelatedPosts(content) {
    if (content.includes('<aside class="related-posts">')) {
        return content;
    }

    const relatedPosts = `
                <!-- Related Posts -->
                <aside class="related-posts">
                    <h2 class="related-posts__title">関連記事</h2>
                    <div class="related-posts__grid" id="relatedArticles">
                        <!-- JavaScriptで自動生成 -->
                    </div>
                </aside>`;

    // Share Buttonsの後に挿入
    if (content.includes('<div class="article__share">')) {
        return content.replace(
            /(<div class="article__share">.*?<\/div>\s*<\/div>)/s,
            '$1\n' + relatedPosts
        );
    }

    return content;
}

function addSidebarToc(content) {
    if (content.includes('<aside class="article__sidebar">')) {
        return content;
    }

    const sidebar = `
            <!-- Sidebar TOC -->
            <aside class="article__sidebar">
                <nav class="sidebar-toc" id="sidebarToc">
                    <!-- JavaScriptで自動生成 -->
                </nav>
            </aside>`;

    // article__mainの閉じタグの後に挿入
    if (content.includes('</div><!-- /.article__main -->')) {
        return content.replace(
            /(<\/div><!--\s*\/.article__main\s*-->)/,
            '$1\n' + sidebar
        );
    } else if (content.includes('<div class="article__main">')) {
        // article__containerの閉じタグの前に挿入
        return content.replace(
            /(<\/div><!--\s*\/.article__container\s*-->)/,
            sidebar + '\n        $1'
        );
    }

    return content;
}

// 各記事を修正
let fixedCount = 0;

console.log('🔧 Fixing minor issues...\n');

articles.forEach(articleName => {
    const articlePath = path.join(__dirname, '../blog/posts/', articleName);

    if (!fs.existsSync(articlePath)) {
        console.log(`⚠️  ${articleName} not found`);
        return;
    }

    try {
        let content = fs.readFileSync(articlePath, 'utf-8');
        const original = content;

        content = addTableOfContents(content);
        content = addRelatedPosts(content);
        content = addSidebarToc(content);

        if (content !== original) {
            fs.writeFileSync(articlePath, content, 'utf-8');
            console.log(`✅ Fixed: ${articleName}`);
            fixedCount++;
        } else {
            console.log(`✓  ${articleName} (no changes)`);
        }
    } catch (error) {
        console.error(`❌ Error: ${articleName}`, error.message);
    }
});

console.log(`\n📊 Fixed ${fixedCount} articles`);
