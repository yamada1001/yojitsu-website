#!/usr/bin/env node

/**
 * 包括的な記事品質チェック
 */

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'blog', 'posts');
const files = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.html'))
    .sort();

console.log('🔍 包括的な記事品質チェックを開始...\n');
console.log(`📄 対象ファイル数: ${files.length}\n`);

const issues = [];

files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileIssues = [];

    // 1. base hrefチェック
    if (!content.includes('<base href="/yojitsu-website/">')) {
        fileIssues.push('❌ Missing <base href="/yojitsu-website/">');
    }

    // 2. 正しいCSSパスチェック
    if (!content.includes('href="src/css/styles.css"') || !content.includes('href="src/css/blog.css"')) {
        if (content.includes('../../assets/css/') || content.includes('../css/')) {
            fileIssues.push('❌ Incorrect CSS paths (should be src/css/...)');
        }
    }

    // 3. フッター重複チェック（JavaScriptで生成すべき）
    const footerCount = (content.match(/<footer class="footer">/g) || []).length;
    if (footerCount > 0) {
        fileIssues.push(`❌ Footer found in HTML (should be JS-generated, found ${footerCount})`);
    }

    // 4. 関連記事セクション重複チェック
    const relatedPostsCount = (content.match(/<aside class="related-posts">/g) || []).length;
    if (relatedPostsCount > 1) {
        fileIssues.push(`❌ Duplicate related-posts sections (${relatedPostsCount} found)`);
    } else if (relatedPostsCount === 0) {
        fileIssues.push('❌ Missing related-posts section');
    }

    // 5. 静的な関連記事HTMLチェック（JavaScriptで生成すべき）
    if (content.includes('<article class="blog-card">') && content.includes('related-posts__grid')) {
        fileIssues.push('⚠️  Static related posts HTML found (should be JS-generated)');
    }

    // 5a. article__relatedセクションチェック（不要）
    if (content.includes('article__related')) {
        fileIssues.push('❌ article__related section found (should be removed)');
    }

    // 5b. シェアボタンチェック（JavaScriptで生成すべき）
    if (content.includes('article__share')) {
        fileIssues.push('❌ Share buttons found in HTML (should be JS-generated)');
    }

    // 6. Sidebar TOCチェック
    if (!content.includes('<aside class="article__sidebar">')) {
        fileIssues.push('❌ Missing article__sidebar');
    }

    // 7. 必須スクリプトチェック
    const requiredScripts = [
        'src/js/blog-loader.js',
        'src/js/main.js',
        'src/js/blog.js',
        'src/js/article-template.js'
    ];
    requiredScripts.forEach(script => {
        if (!content.includes(`src="${script}"`)) {
            fileIssues.push(`❌ Missing script: ${script}`);
        }
    });

    if (fileIssues.length > 0) {
        issues.push({ file, issues: fileIssues });
        console.log(`\n❌ ${file}`);
        fileIssues.forEach(issue => console.log(`   ${issue}`));
    } else {
        console.log(`✅ ${file}`);
    }
});

console.log('\n\n📊 チェック結果サマリー:');
console.log(`   ✅ 問題なし: ${files.length - issues.length}件`);
console.log(`   ❌ 問題あり: ${issues.length}件`);

if (issues.length > 0) {
    console.log('\n⚠️  修正が必要なファイル:');
    issues.forEach(({ file, issues }) => {
        console.log(`\n   ${file}:`);
        issues.forEach(issue => console.log(`      ${issue}`));
    });
    process.exit(1);
} else {
    console.log('\n🎉 すべての記事が品質基準を満たしています！');
}
