#!/usr/bin/env node

/**
 * Blog Article Structure Checker
 *
 * すべての記事が統一されたテンプレート構造を持っているかチェック
 */

const fs = require('fs');
const path = require('path');

// 必須要素のチェックリスト
const REQUIRED_ELEMENTS = [
    { name: 'GTM Script', pattern: /GTM-T7NGQDC2/ },
    { name: 'Breadcrumb', pattern: /<nav class="breadcrumb"/ },
    { name: 'Article Container', pattern: /<article class="article">/ },
    { name: 'Article Main', pattern: /<div class="article__main">/ },
    { name: 'Article Header', pattern: /<header class="article__header">/ },
    { name: 'Article Meta', pattern: /<div class="article__meta">/ },
    { name: 'Article Title (H1)', pattern: /<h1 class="article__title">/ },
    { name: 'Article Excerpt', pattern: /<p class="article__excerpt">/ },
    { name: 'Featured Image', pattern: /<div class="article__featured-image">/ },
    { name: 'Table of Contents', pattern: /<nav class="article__toc">/ },
    { name: 'Article Content', pattern: /<div class="article__content">/ },
    { name: 'Share Buttons', pattern: /<div class="article__share">/ },
    { name: 'Related Posts', pattern: /<aside class="related-posts">/ },
    { name: 'Sidebar TOC', pattern: /<aside class="article__sidebar">/ },
    { name: 'Floating TOC Button', pattern: /<button class="floating-toc-btn"/ },
    { name: 'Mobile TOC Modal', pattern: /<div class="mobile-toc-modal"/ },
    { name: 'Footer', pattern: /<footer class="footer">/ },
    { name: 'Scripts (blog-loader.js)', pattern: /<script src="src\/js\/blog-loader\.js">/ },
    { name: 'Scripts (main.js)', pattern: /<script src="src\/js\/main\.js">/ },
    { name: 'Scripts (blog.js)', pattern: /<script src="src\/js\/blog\.js">/ },
    { name: 'Scripts (article-template.js)', pattern: /<script src="src\/js\/article-template\.js">/ }
];

function checkArticle(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const results = [];

    for (const element of REQUIRED_ELEMENTS) {
        const found = element.pattern.test(content);
        results.push({
            name: element.name,
            found
        });
    }

    return results;
}

function main() {
    console.log('🔍 Checking blog article structures...\n');

    const postsDir = path.join(__dirname, '..', 'blog', 'posts');
    const files = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.html'))
        .sort();

    console.log(`📄 Found ${files.length} HTML files\n`);

    const issues = [];

    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const results = checkArticle(filePath);

        const missing = results.filter(r => !r.found);

        if (missing.length > 0) {
            issues.push({
                file,
                missing: missing.map(m => m.name)
            });
            console.log(`❌ ${file}`);
            missing.forEach(m => {
                console.log(`   ⚠️  Missing: ${m.name}`);
            });
            console.log('');
        } else {
            console.log(`✅ ${file}`);
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Valid: ${files.length - issues.length}`);
    console.log(`   ❌ Issues: ${issues.length}`);

    if (issues.length > 0) {
        console.log('\n⚠️  Articles with issues:');
        issues.forEach(issue => {
            console.log(`   - ${issue.file}: ${issue.missing.length} missing elements`);
        });
        process.exit(1);
    } else {
        console.log('\n🎉 All articles have consistent structure!');
    }
}

main();
