const fs = require('fs');
const path = require('path');

const articles = [
    'how-to-choose-advertising-agency.html',
    'landing-page-cost.html',
    'meo-local-seo-guide.html',
    'structured-data-implementation.html',
    'web-marketing-cost.html',
    'what-is-planner.html',
    'what-is-pm.html',
    'whitepaper-creation-guide.html'
];

function extractTocFromSidebar(content) {
    const sidebarTocMatch = content.match(/<nav class="article__toc-nav">(.*?)<\/nav>/s);
    if (!sidebarTocMatch) return null;

    const tocContent = sidebarTocMatch[1];
    return tocContent;
}

function addMainToc(content) {
    // 既にメインTOCがある場合はスキップ
    if (content.includes('<nav class="article__toc">')) {
        return content;
    }

    // サイドバーからTOC内容を抽出
    const tocContent = extractTocFromSidebar(content);
    if (!tocContent) {
        console.log('    No sidebar TOC found to extract');
        return content;
    }

    const mainToc = `
                <!-- Table of Contents -->
                <nav class="article__toc">
                    <h2 class="article__toc-title">目次</h2>
                    ${tocContent}
                </nav>
`;

    // Featured Imageの後に挿入
    if (content.includes('<div class="article__featured-image">')) {
        return content.replace(
            /(<div class="article__featured-image">.*?<\/div>)/s,
            '$1\n' + mainToc
        );
    }

    // article__contentの前に挿入
    if (content.includes('<div class="article__content">') || content.includes('<div class="article__body">')) {
        return content.replace(
            /(<div class="article__(?:content|body)">)/,
            mainToc + '\n                $1'
        );
    }

    return content;
}

// 各記事を修正
let fixedCount = 0;

console.log('🔧 Fixing TOC structure...\n');

articles.forEach(articleName => {
    const articlePath = path.join(__dirname, '../blog/posts/', articleName);

    if (!fs.existsSync(articlePath)) {
        console.log(`⚠️  ${articleName} not found`);
        return;
    }

    try {
        const original = fs.readFileSync(articlePath, 'utf-8');
        const fixed = addMainToc(original);

        if (fixed !== original) {
            fs.writeFileSync(articlePath, fixed, 'utf-8');
            console.log(`✅ Fixed: ${articleName}`);
            fixedCount++;
        } else {
            console.log(`✓  ${articleName} (already has TOC or no sidebar TOC)`);
        }
    } catch (error) {
        console.error(`❌ Error: ${articleName}`, error.message);
    }
});

console.log(`\n📊 Fixed ${fixedCount} articles`);
