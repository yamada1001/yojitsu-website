#!/usr/bin/env node

/**
 * 静的な関連記事HTMLを削除し、JavaScriptで動的生成する形式に統一
 */

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'blog', 'posts');

// 静的関連記事HTMLがあるファイル
const filesToFix = [
    'ai-content-marketing-efficiency.html',
    'ai-marketing-chatgpt-claude.html',
    'btob-marketing-guide.html',
    'claude-code-terminal-guide.html',
    'content-marketing.html',
    'google-ads-tips.html',
    'landing-page-cost-guide.html',
    'media-mix-seven-hits.html',
    'seo-basics.html',
    'web-vitals-guide.html',
    'what-is-web-marketer.html'
];

console.log('🔄 静的な関連記事HTMLを削除中...\n');

filesToFix.forEach(file => {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 関連記事セクションの開始位置を見つける
    const relatedPostsStart = content.indexOf('<aside class="related-posts">');
    if (relatedPostsStart === -1) {
        console.log(`⏭️  ${file}: related-posts section not found, skipping`);
        return;
    }

    // 関連記事セクションの終了位置を見つける
    const relatedPostsEnd = content.indexOf('</aside>', relatedPostsStart);
    if (relatedPostsEnd === -1) {
        console.log(`❌ ${file}: Cannot find closing tag for related-posts`);
        return;
    }

    // 関連記事セクション全体を抽出
    const relatedPostsSection = content.substring(relatedPostsStart, relatedPostsEnd + '</aside>'.length);

    // blog-cardが含まれているかチェック
    if (!relatedPostsSection.includes('<article class="blog-card">')) {
        console.log(`⏭️  ${file}: No static blog-card found, skipping`);
        return;
    }

    // 新しい関連記事セクションに置き換え
    const newRelatedPostsSection = `<aside class="related-posts">
                <h2 class="related-posts__title">関連記事</h2>
                <div class="related-posts__grid" id="relatedArticles">
                    <!-- JavaScriptで自動生成 -->
                </div>
            </aside>`;

    // 置き換え
    content = content.substring(0, relatedPostsStart) + newRelatedPostsSection + content.substring(relatedPostsEnd + '</aside>'.length);

    // ファイルに書き込み
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${file}: Static related posts removed`);
});

console.log('\n✨ すべての静的関連記事HTMLを削除しました！');
