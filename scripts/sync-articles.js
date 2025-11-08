#!/usr/bin/env node

/**
 * Blog Articles Sync Script
 *
 * blog/posts/配下のHTMLファイルを自動検出し、articles.jsonを生成します。
 * メタデータはHTMLファイルのmeta/titleタグから自動抽出します。
 *
 * 使い方:
 *   node scripts/sync-articles.js
 */

const fs = require('fs');
const path = require('path');

// HTMLファイルからメタデータを抽出する関数
function extractMetadata(htmlContent, filename) {
    const id = filename.replace('.html', '');

    // titleタグから記事タイトルを抽出
    const titleMatch = htmlContent.match(/<title>(.*?)\s*\|/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // meta descriptionから抜粋を抽出
    const descMatch = htmlContent.match(/<meta\s+name="description"\s+content="([^"]*)"/);
    const excerpt = descMatch ? descMatch[1].trim() : '';

    // meta keywordsからカテゴリーを推測
    const keywordsMatch = htmlContent.match(/<meta\s+name="keywords"\s+content="([^"]*)"/);
    const keywords = keywordsMatch ? keywordsMatch[1].toLowerCase() : '';

    // datePublishedまたはdateModifiedから日付を抽出
    const dateMatch = htmlContent.match(/"datePublished":\s*"([^"]*)"/);
    const date = dateMatch ? dateMatch[1].split('T')[0] : new Date().toISOString().split('T')[0];

    // カテゴリーを判定
    const category = detectCategory(keywords, title, htmlContent);

    return {
        id,
        title,
        category: category.id,
        categoryLabel: category.label,
        date,
        excerpt,
        path: `blog/posts/${filename}`,
        featured: true
    };
}

// キーワードからカテゴリーを検出
function detectCategory(keywords, title, content) {
    const categories = {
        seo: { id: 'seo', label: 'SEO', keywords: ['seo', '検索エンジン', '検索順位', 'google', 'ahrefs'] },
        ads: { id: 'ads', label: '広告運用', keywords: ['広告', 'google ads', 'meta広告', 'リスティング', 'ppc'] },
        sns: { id: 'sns', label: 'SNS', keywords: ['sns', 'instagram', 'facebook', 'twitter', 'x', 'ソーシャル'] },
        marketing: { id: 'marketing', label: 'マーケティング', keywords: ['マーケティング', 'webマーケ', 'crm', 'hubspot', 'コンテンツマーケ', 'プランナー', 'pm'] },
        'web-production': { id: 'web-production', label: 'Web制作', keywords: ['web制作', 'ディレクター', 'デザイン', 'ui', 'ux', 'vitals'] },
        ai: { id: 'ai', label: 'AI', keywords: ['ai', 'chatgpt', 'claude', '生成ai', '人工知能', 'ターミナル'] },
        misc: { id: 'misc', label: '雑記', keywords: [] }
    };

    const searchText = (keywords + ' ' + title + ' ' + content).toLowerCase();

    for (const [key, category] of Object.entries(categories)) {
        if (key === 'misc') continue; // 雑記は最後
        for (const keyword of category.keywords) {
            if (searchText.includes(keyword)) {
                return category;
            }
        }
    }

    return categories.misc; // デフォルトは雑記
}

// SVGアイコンをカテゴリーから生成（簡易版）
function generateSVGIcon(category) {
    const gradients = {
        seo: { id: 'seo-gradient', colors: ['#10B981', '#059669'] },
        ads: { id: 'ads-gradient', colors: ['#F59E0B', '#D97706'] },
        sns: { id: 'sns-gradient', colors: ['#06B6D4', '#0891B2'] },
        marketing: { id: 'marketing-gradient', colors: ['#EC4899', '#DB2777'] },
        'web-production': { id: 'web-gradient', colors: ['#6366F1', '#4F46E5'] },
        ai: { id: 'ai-gradient', colors: ['#8B5CF6', '#7C3AED'] },
        misc: { id: 'misc-gradient', colors: ['#8B7355', '#6B5844'] }
    };

    const svgElements = {
        seo: [
            { type: 'circle', cx: 150, cy: 125, r: 40, stroke: 'white', strokeWidth: 4, fill: 'none', opacity: 0.7 },
            { type: 'path', d: 'M180 150 L220 190', stroke: 'white', strokeWidth: 4, opacity: 0.7 }
        ],
        ads: [
            { type: 'rect', x: 100, y: 150, width: 40, height: 50, fill: 'white', opacity: 0.5 },
            { type: 'rect', x: 150, y: 120, width: 40, height: 80, fill: 'white', opacity: 0.6 },
            { type: 'rect', x: 200, y: 90, width: 40, height: 110, fill: 'white', opacity: 0.7 }
        ],
        sns: [
            { type: 'circle', cx: 120, cy: 125, r: 20, fill: 'white', opacity: 0.6 },
            { type: 'circle', cx: 200, cy: 125, r: 20, fill: 'white', opacity: 0.6 },
            { type: 'circle', cx: 280, cy: 125, r: 20, fill: 'white', opacity: 0.6 },
            { type: 'path', d: 'M140 125 L180 125 M220 125 L260 125', stroke: 'white', strokeWidth: 3, opacity: 0.5 }
        ],
        marketing: [
            { type: 'circle', cx: 200, cy: 100, r: 25, fill: 'white', opacity: 0.6 },
            { type: 'circle', cx: 150, cy: 150, r: 20, fill: 'white', opacity: 0.5 },
            { type: 'circle', cx: 250, cy: 150, r: 20, fill: 'white', opacity: 0.5 },
            { type: 'path', d: 'M200 125 L150 130 M200 125 L250 130', stroke: 'white', strokeWidth: 3, opacity: 0.6 }
        ],
        'web-production': [
            { type: 'rect', x: 120, y: 100, width: 160, height: 100, rx: 8, fill: 'white', opacity: 0.4 },
            { type: 'circle', cx: 200, cy: 130, r: 15, fill: 'white', opacity: 0.7 },
            { type: 'rect', x: 140, y: 160, width: 50, height: 8, rx: 2, fill: 'white', opacity: 0.6 }
        ],
        ai: [
            { type: 'circle', cx: 140, cy: 125, r: 35, fill: 'white', opacity: 0.3 },
            { type: 'circle', cx: 140, cy: 125, r: 25, fill: 'white', opacity: 0.5 },
            { type: 'circle', cx: 260, cy: 125, r: 35, fill: 'white', opacity: 0.3 },
            { type: 'path', d: 'M175 125h50', stroke: 'white', strokeWidth: 2, strokeDasharray: '8 4', opacity: 0.6 }
        ],
        misc: [
            { type: 'circle', cx: 200, cy: 125, r: 40, fill: 'white', opacity: 0.4 },
            { type: 'rect', x: 180, y: 110, width: 40, height: 30, rx: 4, fill: 'white', opacity: 0.6 }
        ]
    };

    return {
        svgGradient: gradients[category] || gradients.misc,
        svgIcon: {
            type: category,
            elements: svgElements[category] || svgElements.misc
        }
    };
}

// メイン処理
function main() {
    console.log('🔄 Syncing blog articles...\n');

    const postsDir = path.join(__dirname, '..', 'blog', 'posts');
    const outputPath = path.join(__dirname, '..', 'blog', 'articles.json');

    // HTMLファイルを取得
    const files = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.html'))
        .sort();

    console.log(`📄 Found ${files.length} HTML files\n`);

    // 各HTMLファイルからメタデータを抽出
    const articles = files.map(file => {
        const htmlPath = path.join(postsDir, file);
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        const metadata = extractMetadata(htmlContent, file);
        const svgData = generateSVGIcon(metadata.category);

        console.log(`✅ ${file} -> ${metadata.category} (${metadata.date})`);

        return {
            ...metadata,
            ...svgData
        };
    });

    // 日付でソート（新しい順）
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // カテゴリー情報
    const categories = [
        {
            id: 'ai',
            label: 'AI',
            description: 'AI活用に関する記事をまとめています。ChatGPT、Claudeなどの生成AIツールの使い方、プロンプトエンジニアリング、AIを活用したコンテンツマーケティング、業務効率化など、実践的なテクニックを紹介します。',
            color: '#8B5CF6',
            icon: 'robot'
        },
        {
            id: 'seo',
            label: 'SEO',
            description: '検索エンジン最適化に関する記事をまとめています。最新のアルゴリズム対応、内部対策、外部対策、コンテンツSEOなど、実践的なSEO対策を解説します。',
            color: '#10B981',
            icon: 'search'
        },
        {
            id: 'ads',
            label: '広告運用',
            description: 'Web広告運用に関する記事をまとめています。Google広告、Meta広告などの運用テクニック、費用対効果の最大化、広告戦略の立案方法を紹介します。',
            color: '#F59E0B',
            icon: 'bullhorn'
        },
        {
            id: 'sns',
            label: 'SNS',
            description: 'SNSマーケティングに関する記事をまとめています。Instagram、X、FacebookなどのSNS運用テクニック、エンゲージメント向上施策、コンテンツ戦略を解説します。',
            color: '#06B6D4',
            icon: 'share-nodes'
        },
        {
            id: 'marketing',
            label: 'マーケティング',
            description: 'デジタルマーケティング全般に関する記事をまとめています。戦略立案、データ分析、カスタマージャーニー設計など、実践的なマーケティング手法を紹介します。',
            color: '#EC4899',
            icon: 'chart-line'
        },
        {
            id: 'web-production',
            label: 'Web制作',
            description: 'Webサイト制作に関する記事をまとめています。UI/UXデザイン、フロントエンド開発、サイト改善など、実践的なWeb制作のテクニックを解説します。',
            color: '#6366F1',
            icon: 'code'
        },
        {
            id: 'misc',
            label: '雑記',
            description: '日々の気づきや考え、業界トレンドなど、様々なトピックを自由に綴っています。',
            color: '#8B7355',
            icon: 'pen'
        }
    ];

    // JSONファイルを生成
    const output = {
        articles,
        categories
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

    console.log(`\n✅ Successfully synced ${articles.length} articles to articles.json`);
    console.log(`\n📊 Category breakdown:`);

    categories.forEach(cat => {
        const count = articles.filter(a => a.category === cat.id).length;
        console.log(`   ${cat.label}: ${count}件`);
    });

    console.log('\n✨ Sync completed!');
}

// Run
main();
