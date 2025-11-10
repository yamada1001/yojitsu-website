/**
 * 新しく生成した10記事をarticles.jsonに追加し、日付順にソート
 */

const fs = require('fs');
const path = require('path');

// articles.jsonを読み込み
const articlesPath = path.join(__dirname, '../blog/articles.json');
const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

// 新しく生成した10記事のデータ
const newArticles = [
    {
        id: 'tiktok-ads-guide-2025',
        title: 'TikTok広告完全ガイド2025｜始め方から成果を出す運用方法まで',
        category: 'sns',
        categoryLabel: 'SNS',
        date: '2025-01-19',
        excerpt: 'TikTok広告の始め方から成果を出す運用方法まで完全解説。広告種類、ターゲティング、クリエイティブ制作、効果測定まで2025年最新情報をお届けします。',
        path: 'blog/posts/tiktok-ads-guide-2025.html',
        featured: true
    },
    {
        id: 'x-twitter-marketing-strategy-2025',
        title: 'X（Twitter）マーケティング戦略｜フォロワー増加とエンゲージメント向上の実践テクニック【2025年版】',
        category: 'sns',
        categoryLabel: 'SNS',
        date: '2025-01-19',
        excerpt: 'X（旧Twitter）マーケティングの最新戦略を徹底解説。フォロワー増加、エンゲージメント向上、X広告、アナリティクス分析まで実践的なテクニックを紹介します。',
        path: 'blog/posts/x-twitter-marketing-strategy-2025.html',
        featured: true
    },
    {
        id: 'linkedin-btob-marketing-lead-generation',
        title: 'LinkedIn BtoBマーケティング｜リード獲得に効果的な7つの施策【2025年版】',
        category: 'marketing',
        categoryLabel: 'マーケティング',
        date: '2025-01-19',
        excerpt: 'LinkedInでBtoBリード獲得を実現する7つの施策を徹底解説。プロフィール最適化、コンテンツ戦略、LinkedIn広告、Sales Navigatorまで詳しく紹介します。',
        path: 'blog/posts/linkedin-btob-marketing-lead-generation.html',
        featured: true
    },
    {
        id: 'email-marketing-complete-guide-2025',
        title: 'メールマーケティング完全ガイド｜開封率・クリック率を上げる実践テクニック【2025年版】',
        category: 'marketing',
        categoryLabel: 'マーケティング',
        date: '2025-01-19',
        excerpt: 'メールマーケティングの基礎から応用まで完全解説。開封率・クリック率を上げる件名・本文・CTA設計、セグメント配信、効果測定まで実践的なテクニックを紹介します。',
        path: 'blog/posts/email-marketing-complete-guide-2025.html',
        featured: true
    },
    {
        id: 'instagram-reels-strategy-2025',
        title: 'Instagramリール活用法｜再生数を10倍にする投稿戦略【2025年版】',
        category: 'sns',
        categoryLabel: 'SNS',
        date: '2025-01-19',
        excerpt: 'Instagramリールで再生数を劇的に増やす方法を徹底解説。アルゴリズム、投稿時間、ハッシュタグ、音源選び、編集テクニックまで実践的な戦略を紹介します。',
        path: 'blog/posts/instagram-reels-strategy-2025.html',
        featured: true
    },
    {
        id: 'youtube-seo-complete-guide-2025',
        title: 'YouTube SEO完全ガイド｜検索上位表示とチャンネル登録者増加の秘訣【2025年版】',
        category: 'seo',
        categoryLabel: 'SEO',
        date: '2025-01-19',
        excerpt: 'YouTube SEOを徹底解説。タイトル・説明文最適化、タグ・ハッシュタグ戦略、サムネイル、再生時間、エンゲージメント向上まで検索上位表示の秘訣を紹介します。',
        path: 'blog/posts/youtube-seo-complete-guide-2025.html',
        featured: true
    },
    {
        id: 'seo-tools-comparison-ahrefs-semrush-moz',
        title: 'SEOツール比較2025｜Ahrefs vs SEMrush vs Moz Pro 徹底比較',
        category: 'seo',
        categoryLabel: 'SEO',
        date: '2025-01-19',
        excerpt: '主要SEOツールAhrefs、SEMrush、Moz Proを徹底比較。機能、料金、使いやすさ、データ精度を比較し、あなたに最適なツールを紹介します。',
        path: 'blog/posts/seo-tools-comparison-ahrefs-semrush-moz.html',
        featured: true
    },
    {
        id: 'video-marketing-strategy-2025',
        title: '動画マーケティング戦略2025｜YouTube・TikTok・Instagram活用の全体像',
        category: 'marketing',
        categoryLabel: 'マーケティング',
        date: '2025-01-19',
        excerpt: '2025年最新の動画マーケティング戦略を徹底解説。YouTube、TikTok、Instagram Reelsの特徴、制作方法、広告活用、効果測定まで包括的に紹介します。',
        path: 'blog/posts/video-marketing-strategy-2025.html',
        featured: true
    },
    {
        id: 'influencer-marketing-guide-2025',
        title: 'インフルエンサーマーケティングの始め方｜費用相場から依頼方法まで徹底解説【2025年版】',
        category: 'sns',
        categoryLabel: 'SNS',
        date: '2025-01-19',
        excerpt: 'インフルエンサーマーケティングの始め方を完全解説。ナノ・マイクロ・ミドル・メガインフルエンサー別の費用相場、依頼方法、効果測定まで詳しく紹介します。',
        path: 'blog/posts/influencer-marketing-guide-2025.html',
        featured: true
    },
    {
        id: 'ecommerce-seo-product-page-optimization',
        title: 'ECサイトSEO対策｜商品ページを検索上位表示させる10の施策【2025年版】',
        category: 'seo',
        categoryLabel: 'SEO',
        date: '2025-01-19',
        excerpt: 'ECサイトの商品ページを検索上位表示させるSEO対策を徹底解説。商品タイトル最適化、構造化データ実装、画像SEO、表示速度改善など10の実践的施策を紹介します。',
        path: 'blog/posts/ecommerce-seo-product-page-optimization.html',
        featured: true
    }
];

console.log(`📝 既存記事数: ${articlesData.articles.length}`);
console.log(`➕ 追加する記事数: ${newArticles.length}`);

// 新しい記事を追加（重複チェック）
newArticles.forEach(newArticle => {
    const exists = articlesData.articles.find(a => a.id === newArticle.id);
    if (!exists) {
        articlesData.articles.push(newArticle);
        console.log(`✅ 追加: ${newArticle.title}`);
    } else {
        console.log(`⚠️  スキップ（既存）: ${newArticle.title}`);
    }
});

// 日付順（新しい順）にソート
articlesData.articles.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // 新しい順
});

console.log(`\n📊 ソート後の記事数: ${articlesData.articles.length}`);
console.log('\n最新5記事:');
articlesData.articles.slice(0, 5).forEach((a, i) => {
    console.log(`${i + 1}. ${a.date} - ${a.title.substring(0, 60)}...`);
});

// articles.jsonに書き込み
fs.writeFileSync(articlesPath, JSON.stringify(articlesData, null, 2), 'utf-8');

console.log(`\n✅ ${articlesPath} を更新しました。`);
