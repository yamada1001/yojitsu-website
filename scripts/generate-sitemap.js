#!/usr/bin/env node

/**
 * Sitemap Auto-Generator
 *
 * blog/articles.jsonを読み込んで、sitemap.xmlを自動生成します。
 *
 * 使い方:
 *   node scripts/generate-sitemap.js
 *
 * または package.json に追加して:
 *   npm run generate-sitemap
 */

const fs = require('fs');
const path = require('path');

// 設定
const CONFIG = {
    baseUrl: 'https://yojitsu.com',
    articlesJsonPath: path.join(__dirname, '../blog/articles.json'),
    sitemapPath: path.join(__dirname, '../sitemap.xml'),
    staticPages: [
        { loc: '/', lastmod: getTodayDate(), changefreq: 'weekly', priority: '1.0' },
        { loc: '/blog/index.html', lastmod: getTodayDate(), changefreq: 'daily', priority: '0.9' }
    ],
    categoryPages: [
        { id: 'ai', lastmod: '2025-01-22' },
        { id: 'seo', lastmod: '2025-01-15' },
        { id: 'ads', lastmod: '2025-01-10' },
        { id: 'sns', lastmod: '2025-01-09' },
        { id: 'marketing', lastmod: '2025-01-09' },
        { id: 'web-production', lastmod: '2025-01-09' },
        { id: 'misc', lastmod: '2024-12-25' }
    ],
    legalPages: [
        { loc: '/privacy-policy.html', lastmod: '2025-01-01', changefreq: 'monthly', priority: '0.3' },
        { loc: '/tokushoho.html', lastmod: '2025-01-01', changefreq: 'monthly', priority: '0.3' },
        { loc: '/disclaimer.html', lastmod: '2025-01-01', changefreq: 'monthly', priority: '0.3' }
    ]
};

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function loadArticles() {
    try {
        const articlesData = fs.readFileSync(CONFIG.articlesJsonPath, 'utf-8');
        const { articles } = JSON.parse(articlesData);
        return articles;
    } catch (error) {
        console.error('Error loading articles.json:', error.message);
        process.exit(1);
    }
}

function generateSitemapXML(articles) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
    xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n';

    // Static pages
    xml += '    <!-- Top Page -->\n';
    CONFIG.staticPages.forEach(page => {
        xml += generateUrlEntry(page);
    });

    // Category pages
    xml += '\n    <!-- Blog Categories -->\n';
    CONFIG.categoryPages.forEach(category => {
        xml += generateUrlEntry({
            loc: `/blog/categories/${category.id}.html`,
            lastmod: category.lastmod,
            changefreq: 'weekly',
            priority: '0.8'
        });
    });

    // Blog articles
    xml += '\n    <!-- Blog Articles -->\n';
    articles
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // 日付降順
        .forEach(article => {
            xml += generateUrlEntry({
                loc: `/${article.path}`,
                lastmod: article.date,
                changefreq: 'monthly',
                priority: article.featured ? '0.8' : '0.7'
            });
        });

    // Legal pages
    xml += '\n    <!-- Legal Pages (lower priority) -->\n';
    CONFIG.legalPages.forEach(page => {
        xml += generateUrlEntry(page);
    });

    xml += '\n</urlset>\n';
    return xml;
}

function generateUrlEntry({ loc, lastmod, changefreq, priority }) {
    let entry = '    <url>\n';
    entry += `        <loc>${CONFIG.baseUrl}${loc}</loc>\n`;
    entry += `        <lastmod>${lastmod}</lastmod>\n`;
    entry += `        <changefreq>${changefreq}</changefreq>\n`;
    entry += `        <priority>${priority}</priority>\n`;
    entry += '    </url>\n';
    return entry;
}

function saveSitemap(xml) {
    try {
        fs.writeFileSync(CONFIG.sitemapPath, xml, 'utf-8');
        console.log('✅ Sitemap generated successfully!');
        console.log(`📄 Location: ${CONFIG.sitemapPath}`);
    } catch (error) {
        console.error('❌ Error saving sitemap:', error.message);
        process.exit(1);
    }
}

function main() {
    console.log('🚀 Generating sitemap...\n');

    const articles = loadArticles();
    console.log(`📝 Found ${articles.length} articles`);

    const sitemapXML = generateSitemapXML(articles);
    saveSitemap(sitemapXML);

    console.log('\n📊 Summary:');
    console.log(`   - Static pages: ${CONFIG.staticPages.length}`);
    console.log(`   - Category pages: ${CONFIG.categoryPages.length}`);
    console.log(`   - Blog articles: ${articles.length}`);
    console.log(`   - Legal pages: ${CONFIG.legalPages.length}`);
    console.log(`   - Total URLs: ${CONFIG.staticPages.length + CONFIG.categoryPages.length + articles.length + CONFIG.legalPages.length}`);
}

// Run the script
main();
