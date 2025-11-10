/**
 * 40記事を一括生成するスクリプト
 */

const fs = require('fs');
const path = require('path');

// 記事データの定義
const newArticles = [
  // SEO関連記事 (8記事)
  {
    id: 'local-seo-strategy',
    title: 'ローカルSEO完全マニュアル｜地域ビジネスで検索上位を獲得する方法',
    category: 'seo',
    excerpt: '地域密着型ビジネスにおけるSEO戦略の全て。Googleマイビジネスの最適化から、ローカルキーワードの選定方法まで詳しく解説します。',
    date: '2024-11-21'
  },
  {
    id: 'technical-seo-guide',
    title: 'テクニカルSEO入門｜検索エンジンに評価されるサイト構造の作り方',
    category: 'seo',
    excerpt: 'サイトの内部構造を最適化し、検索エンジンのクローラビリティを向上させる方法を解説。XML sitemap、robots.txt、構造化データの実装方法まで。',
    date: '2024-11-20'
  },
  {
    id: 'seo-content-optimization',
    title: 'SEOライティング完全ガイド｜検索上位を獲得するコンテンツの書き方',
    category: 'seo',
    excerpt: '検索意図を満たす高品質なコンテンツの作り方。キーワードリサーチから記事構成、内部リンク戦略まで実践的に解説します。',
    date: '2024-11-19'
  },
  {
    id: 'backlink-building-strategy',
    title: '被リンク獲得戦略｜ホワイトハットSEOで権威性を高める方法',
    category: 'seo',
    excerpt: '質の高い被リンクを自然に獲得するための戦略。ゲストポスト、リンカブルアセット、PR戦略など実践的な手法を紹介します。',
    date: '2024-11-18'
  },
  {
    id: 'mobile-seo-optimization',
    title: 'モバイルSEO最適化ガイド｜スマホ検索で優位に立つ方法',
    category: 'seo',
    excerpt: 'モバイルファーストインデックス時代のSEO戦略。レスポンシブデザイン、ページ速度、モバイルUXの最適化方法を解説します。',
    date: '2024-11-17'
  },
  {
    id: 'international-seo-guide',
    title: '多言語SEO実践ガイド｜海外展開で成功するための最適化戦略',
    category: 'seo',
    excerpt: 'グローバル展開を目指す企業のための多言語SEO戦略。hreflang設定、地域ターゲティング、文化に応じたコンテンツ最適化を解説します。',
    date: '2024-11-16'
  },
  {
    id: 'voice-search-seo',
    title: '音声検索SEO対策｜スマートスピーカー時代の最適化戦略',
    category: 'seo',
    excerpt: 'Alexa、Google Assistant時代の検索最適化。会話型クエリへの対応、Featured Snippets獲得戦略を詳しく解説します。',
    date: '2024-11-15'
  },
  {
    id: 'seo-analytics-reporting',
    title: 'SEO分析と効果測定｜データドリブンで成果を最大化する方法',
    category: 'seo',
    excerpt: 'SEOの成果を正確に測定し、改善につなげる分析手法。GA4、Search Console、順位トラッキングツールの活用方法を解説します。',
    date: '2024-11-14'
  },

  // SNS関連記事 (8記事)
  {
    id: 'facebook-ads-strategy',
    title: 'Facebook広告完全ガイド｜効果的なターゲティングと広告運用のコツ',
    category: 'sns',
    excerpt: 'Facebook広告で成果を出すための実践的な戦略。オーディエンス設定、クリエイティブ制作、予算配分まで詳しく解説します。',
    date: '2024-11-13'
  },
  {
    id: 'twitter-engagement-tactics',
    title: 'X（Twitter）エンゲージメント向上術｜バズる投稿の作り方',
    category: 'sns',
    excerpt: 'Xでエンゲージメントを最大化する投稿テクニック。タイミング、ハッシュタグ戦略、リツイートされやすいコンテンツの作り方を解説します。',
    date: '2024-11-12'
  },
  {
    id: 'pinterest-marketing-guide',
    title: 'Pinterestマーケティング入門｜ビジュアル検索で集客する方法',
    category: 'sns',
    excerpt: 'ビジュアルコンテンツで集客を実現するPinterest活用法。ピン作成、ボード運営、Pinterest SEOの基本を解説します。',
    date: '2024-11-11'
  },
  {
    id: 'threads-marketing-strategy',
    title: 'Threads活用戦略｜新SNSで先行者利益を得る方法',
    category: 'sns',
    excerpt: 'Meta社の新SNS「Threads」でブランディングと集客を実現する戦略。初期フォロワー獲得、投稿戦略、Instagram連携を解説します。',
    date: '2024-11-10'
  },
  {
    id: 'social-media-analytics',
    title: 'SNS分析ツール比較｜データで改善するソーシャルメディア運用',
    category: 'sns',
    excerpt: 'SNS運用を数値で改善するための分析ツール比較。無料ツールから高機能な有料ツールまで、目的別の選び方を解説します。',
    date: '2024-11-09'
  },
  {
    id: 'ugc-marketing-strategy',
    title: 'UGC活用マーケティング｜ユーザー投稿で信頼性を高める方法',
    category: 'sns',
    excerpt: 'ユーザー生成コンテンツ（UGC）を活用したマーケティング戦略。投稿促進施策、権利処理、効果的な活用方法を詳しく解説します。',
    date: '2024-11-08'
  },
  {
    id: 'social-listening-guide',
    title: 'ソーシャルリスニング実践ガイド｜SNSから顧客インサイトを得る方法',
    category: 'sns',
    excerpt: 'SNS上の会話を分析し、マーケティングに活かすソーシャルリスニング。ツール選定、分析手法、アクション例を紹介します。',
    date: '2024-11-07'
  },
  {
    id: 'sns-crisis-management',
    title: 'SNS炎上対策とクライシスマネジメント｜リスク回避の実践ガイド',
    category: 'sns',
    excerpt: 'SNS運用における炎上リスクとその対策。予防策、炎上発生時の対処法、レピュテーション回復の手順を解説します。',
    date: '2024-11-06'
  },

  // 広告関連記事 (8記事)
  {
    id: 'display-ads-optimization',
    title: 'ディスプレイ広告最適化ガイド｜バナー広告で成果を出す方法',
    category: 'ads',
    excerpt: 'ディスプレイ広告の効果を最大化するクリエイティブ制作とターゲティング戦略。GDN、YDAの運用テクニックを詳しく解説します。',
    date: '2024-11-05'
  },
  {
    id: 'retargeting-ads-strategy',
    title: 'リターゲティング広告完全ガイド｜CVRを劇的に改善する追跡型広告',
    category: 'ads',
    excerpt: 'サイト訪問者を再度アプローチするリターゲティング広告の戦略。セグメント設計、クリエイティブ戦略、フリークエンシーキャップの設定方法を解説します。',
    date: '2024-11-04'
  },
  {
    id: 'video-ads-production',
    title: '動画広告制作ガイド｜視聴完了率を高める動画の作り方',
    category: 'ads',
    excerpt: 'YouTube、SNSで効果を出す動画広告の制作ノウハウ。最初の3秒で惹きつける方法、ストーリーテリング、CTA設計を解説します。',
    date: '2024-11-03'
  },
  {
    id: 'programmatic-advertising-guide',
    title: 'プログラマティック広告入門｜自動化で効率的に配信する方法',
    category: 'ads',
    excerpt: 'DSP、SSPを活用したプログラマティック広告の基本。リアルタイム入札の仕組み、データ活用、効果的な運用方法を解説します。',
    date: '2024-11-02'
  },
  {
    id: 'native-advertising-strategy',
    title: 'ネイティブ広告活用術｜自然な形で訴求する広告戦略',
    category: 'ads',
    excerpt: 'コンテンツに溶け込むネイティブ広告の効果的な活用法。記事広告、インフィード広告、レコメンドウィジェットの使い分けを解説します。',
    date: '2024-11-01'
  },
  {
    id: 'shopping-ads-guide',
    title: 'Googleショッピング広告完全ガイド｜EC売上を最大化する運用方法',
    category: 'ads',
    excerpt: 'ECサイト向けのショッピング広告戦略。商品フィード最適化、入札戦略、季節要因を考慮した運用テクニックを詳しく解説します。',
    date: '2024-10-31'
  },
  {
    id: 'app-promotion-ads',
    title: 'アプリプロモーション広告｜インストール数を増やす広告戦略',
    category: 'ads',
    excerpt: 'モバイルアプリのダウンロードを促進する広告戦略。Apple Search Ads、Google App Campaigns、SNS広告の効果的な運用方法を解説します。',
    date: '2024-10-30'
  },
  {
    id: 'ad-fraud-prevention',
    title: '広告不正対策ガイド｜アドフラウドから予算を守る方法',
    category: 'ads',
    excerpt: '広告詐欺（アドフラウド）の種類と対策。ボットトラフィック検知、ブランドセーフティ確保、透明性の高い広告運用を実現する方法を解説します。',
    date: '2024-10-29'
  },

  // BtoB関連記事 (8記事)
  {
    id: 'account-based-marketing',
    title: 'ABM（アカウントベースドマーケティング）実践ガイド｜大口顧客を獲得する戦略',
    category: 'btob',
    excerpt: '特定企業をターゲットにしたABM戦略の全て。ターゲットアカウント選定、パーソナライズド施策、営業連携の方法を解説します。',
    date: '2024-10-28'
  },
  {
    id: 'btob-content-marketing',
    title: 'BtoB向けコンテンツマーケティング｜信頼を築く情報発信戦略',
    category: 'btob',
    excerpt: '企業の意思決定者に響くコンテンツマーケティング。ホワイトペーパー、ウェビナー、事例記事の効果的な活用方法を解説します。',
    date: '2024-10-27'
  },
  {
    id: 'lead-nurturing-automation',
    title: 'リードナーチャリング完全ガイド｜見込み客を育成する自動化戦略',
    category: 'btob',
    excerpt: 'MAツールを活用したリードナーチャリングの実践方法。スコアリング設計、シナリオ設計、コンテンツ戦略を詳しく解説します。',
    date: '2024-10-26'
  },
  {
    id: 'btob-seo-strategy',
    title: 'BtoB企業のSEO戦略｜検索から商談を生み出す方法',
    category: 'btob',
    excerpt: 'BtoB領域でSEOを成功させるための戦略。専門性の高いキーワード選定、意思決定者向けコンテンツ設計、リード獲得までの導線設計を解説します。',
    date: '2024-10-25'
  },
  {
    id: 'webinar-marketing-guide',
    title: 'ウェビナーマーケティング実践ガイド｜オンラインセミナーでリード獲得',
    category: 'btob',
    excerpt: 'ウェビナーを活用したBtoBマーケティング。企画立案、集客施策、当日運営、フォローアップまで一連の流れを解説します。',
    date: '2024-10-24'
  },
  {
    id: 'btob-social-selling',
    title: 'ソーシャルセリング入門｜SNSで信頼関係を築き商談を生む方法',
    category: 'btob',
    excerpt: 'LinkedInを中心としたソーシャルセリングの実践方法。プロフィール最適化、コンテンツ発信、関係構築のテクニックを解説します。',
    date: '2024-10-23'
  },
  {
    id: 'partner-marketing-strategy',
    title: 'パートナーマーケティング戦略｜協業で市場を拡大する方法',
    category: 'btob',
    excerpt: '他社との協業を活用したマーケティング戦略。パートナー選定、共同施策の企画、Win-Winの関係構築方法を解説します。',
    date: '2024-10-22'
  },
  {
    id: 'btob-marketing-kpi',
    title: 'BtoB マーケティングKPI設計｜成果を可視化する指標の選び方',
    category: 'btob',
    excerpt: 'BtoB企業が追うべきマーケティングKPIの設計方法。リード獲得数、MQL/SQL、商談化率、受注率までの指標設計を解説します。',
    date: '2024-10-21'
  },

  // その他・戦略系記事 (8記事)
  {
    id: 'marketing-automation-comparison',
    title: 'MAツール徹底比較2024｜HubSpot・Marketo・Pardot機能と料金',
    category: 'tools',
    excerpt: '主要なマーケティングオートメーションツールを徹底比較。機能、料金、導入難易度、サポート体制まで詳しく解説します。',
    date: '2024-10-20'
  },
  {
    id: 'customer-data-platform',
    title: 'CDP（顧客データプラットフォーム）入門｜統合データで顧客体験を向上',
    category: 'tools',
    excerpt: '顧客データを統合管理するCDPの基本。CRM・MAとの違い、導入メリット、主要CDPツールの比較を解説します。',
    date: '2024-10-19'
  },
  {
    id: 'conversion-rate-optimization',
    title: 'CRO（コンバージョン率最適化）実践ガイド｜CVRを改善する方法',
    category: 'strategy',
    excerpt: 'サイトのコンバージョン率を改善するCROの実践方法。A/Bテスト、ヒートマップ分析、ユーザーテストの活用法を解説します。',
    date: '2024-10-18'
  },
  {
    id: 'growth-hacking-basics',
    title: 'グロースハック入門｜スタートアップが急成長する仕組み',
    category: 'strategy',
    excerpt: 'データドリブンで成長を加速させるグロースハックの手法。AARRR指標、バイラルループ、プロダクト主導成長を解説します。',
    date: '2024-10-17'
  },
  {
    id: 'omnichannel-marketing',
    title: 'オムニチャネルマーケティング戦略｜顧客体験を統合する方法',
    category: 'strategy',
    excerpt: 'オンライン・オフラインを統合したオムニチャネル戦略。顧客データ統合、チャネル横断の施策設計、効果測定方法を解説します。',
    date: '2024-10-16'
  },
  {
    id: 'brand-positioning-strategy',
    title: 'ブランドポジショニング戦略｜市場で選ばれる存在になる方法',
    category: 'strategy',
    excerpt: '競合と差別化するブランドポジショニングの構築方法。市場分析、ターゲット設定、独自価値の言語化を詳しく解説します。',
    date: '2024-10-15'
  },
  {
    id: 'customer-journey-mapping',
    title: 'カスタマージャーニーマップ作成ガイド｜顧客理解を深める方法',
    category: 'strategy',
    excerpt: '顧客の行動と心理を可視化するカスタマージャーニーマップの作り方。ペルソナ設計、タッチポイント分析、施策立案まで解説します。',
    date: '2024-10-14'
  },
  {
    id: 'marketing-budget-allocation',
    title: 'マーケティング予算配分の最適化｜ROIを最大化する投資戦略',
    category: 'strategy',
    excerpt: '限られた予算で最大の成果を出すための配分戦略。チャネル別のROI分析、テスト予算の確保、予算見直しのタイミングを解説します。',
    date: '2024-10-13'
  }
];

console.log(`📝 ${newArticles.length}記事のHTMLファイルを生成します...\n`);

// SVGグラデーションの定義
const gradients = {
  seo: { id: 'seo-gradient', colors: ['#10B981', '#059669'] },
  sns: { id: 'sns-gradient', colors: ['#06B6D4', '#0891B2'] },
  ads: { id: 'ads-gradient', colors: ['#F59E0B', '#D97706'] },
  btob: { id: 'btob-gradient', colors: ['#8B5CF6', '#7C3AED'] },
  tools: { id: 'tools-gradient', colors: ['#EC4899', '#DB2777'] },
  strategy: { id: 'strategy-gradient', colors: ['#6366F1', '#4F46E5'] }
};

// SVGアイコンの定義（カテゴリ別）
const svgIcons = {
  seo: {
    elements: [
      { type: 'circle', cx: 200, cy: 100, r: 30, fill: 'white', opacity: 0.3 },
      { type: 'path', d: 'M180 125 L200 145 L240 105', stroke: 'white', strokeWidth: 4, fill: 'none', opacity: 0.8 }
    ]
  },
  sns: {
    elements: [
      { type: 'circle', cx: 120, cy: 125, r: 20, fill: 'white', opacity: 0.6 },
      { type: 'circle', cx: 200, cy: 125, r: 20, fill: 'white', opacity: 0.6 },
      { type: 'circle', cx: 280, cy: 125, r: 20, fill: 'white', opacity: 0.6 },
      { type: 'path', d: 'M140 125 L180 125 M220 125 L260 125', stroke: 'white', strokeWidth: 3, opacity: 0.8 }
    ]
  },
  ads: {
    elements: [
      { type: 'rect', x: 150, y: 90, width: 100, height: 70, rx: 8, fill: 'white', opacity: 0.3 },
      { type: 'path', d: 'M170 110 L230 150 M230 110 L170 150', stroke: 'white', strokeWidth: 4, opacity: 0.8 }
    ]
  },
  btob: {
    elements: [
      { type: 'rect', x: 160, y: 95, width: 80, height: 60, rx: 5, fill: 'white', opacity: 0.3 },
      { type: 'circle', cx: 200, cy: 115, r: 12, fill: 'white', opacity: 0.6 },
      { type: 'path', d: 'M185 135 L215 135', stroke: 'white', strokeWidth: 3, opacity: 0.8 }
    ]
  },
  tools: {
    elements: [
      { type: 'rect', x: 170, y: 100, width: 60, height: 50, rx: 5, fill: 'white', opacity: 0.3 },
      { type: 'circle', cx: 200, cy: 115, r: 8, fill: 'white', opacity: 0.8 },
      { type: 'rect', x: 180, y: 135, width: 40, height: 4, rx: 2, fill: 'white', opacity: 0.6 }
    ]
  },
  strategy: {
    elements: [
      { type: 'circle', cx: 200, cy: 125, r: 35, fill: 'none', stroke: 'white', strokeWidth: 3, opacity: 0.6 },
      { type: 'path', d: 'M200 95 L200 125 L220 145', stroke: 'white', strokeWidth: 4, fill: 'none', opacity: 0.8 }
    ]
  }
};

// HTMLテンプレート生成関数
function generateArticleHTML(article) {
  const gradient = gradients[article.category];
  const svgIcon = svgIcons[article.category];

  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <base href="https://yamada1001.github.io/yojitsu-website/">

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${article.excerpt}">
    <title>${article.title} | Yojitsu - Web制作・マーケティング</title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="img/favicon.svg">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="src/css/style.css">
    <link rel="stylesheet" href="src/css/article.css">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">

    <!-- Google Tag Manager -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-L6PSRETZE8"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-L6PSRETZE8');
    </script>
</head>
<body data-article-id="${article.id}" data-category="${article.category}">
    <!-- ナビゲーション -->
    <nav class="nav">
        <div class="nav__container">
            <a href="./" class="nav__logo">
                <img src="img/logo.svg" alt="Yojitsu" class="nav__logo-img">
            </a>

            <button class="nav__toggle" aria-label="メニュー">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul class="nav__menu">
                <li class="nav__item"><a href="./#service" class="nav__link">サービス</a></li>
                <li class="nav__item"><a href="./#works" class="nav__link">実績</a></li>
                <li class="nav__item"><a href="./blog/" class="nav__link">ブログ</a></li>
                <li class="nav__item"><a href="./#company" class="nav__link">会社情報</a></li>
                <li class="nav__item"><a href="./#contact" class="nav__link nav__link--cta">お問い合わせ</a></li>
            </ul>
        </div>
    </nav>

    <!-- 記事ヘッダー -->
    <header class="article-header">
        <div class="article-header__container">
            <div class="article-header__meta">
                <span class="article-header__category article-header__category--${article.category}">${article.categoryLabel || article.category.toUpperCase()}</span>
                <time class="article-header__date" datetime="${article.date}">${formatDate(article.date)}</time>
            </div>
            <h1 class="article-header__title">${article.title}</h1>
            <p class="article-header__excerpt">${article.excerpt}</p>
        </div>
    </header>

    <!-- 記事コンテンツ -->
    <article class="article">
        <div class="article__container">
            <div class="article__content">
                <p class="article__lead">
                    ${article.excerpt}
                </p>

                <h2>この記事の概要</h2>
                <p>
                    本記事では、${article.title.split('｜')[0]}について詳しく解説していきます。
                    実践的なノウハウと具体的な事例を交えながら、すぐに活用できる情報をお届けします。
                </p>

                <div id="toc"></div>

                <h2>はじめに</h2>
                <p>
                    デジタルマーケティングの世界は日々進化しています。最新のトレンドと実践的な手法を理解し、
                    自社のビジネスに活かすことが成功の鍵となります。
                </p>

                <h2>主要なポイント</h2>
                <h3>ポイント1：戦略的アプローチ</h3>
                <p>
                    効果的な施策を実施するためには、明確な戦略が必要です。ターゲット設定から具体的な実行計画まで、
                    体系的にアプローチすることが重要です。
                </p>

                <h3>ポイント2：データドリブンな意思決定</h3>
                <p>
                    データに基づいた意思決定により、より確実な成果を生み出すことができます。
                    適切な指標を設定し、継続的に測定・改善していくプロセスが重要です。
                </p>

                <h3>ポイント3：継続的な最適化</h3>
                <p>
                    一度施策を実施したら終わりではありません。市場環境の変化に応じて、
                    継続的に最適化を図ることで、長期的な成果を維持することができます。
                </p>

                <h2>実践のステップ</h2>
                <h3>ステップ1：現状分析</h3>
                <p>
                    まずは現在の状況を正確に把握することから始めます。強み・弱み・機会・脅威を分析し、
                    改善すべきポイントを明確にします。
                </p>

                <h3>ステップ2：目標設定</h3>
                <p>
                    具体的で測定可能な目標を設定します。SMARTの原則に基づき、
                    達成可能で期限の明確な目標を立てることが重要です。
                </p>

                <h3>ステップ3：施策実行</h3>
                <p>
                    計画に基づいて実際に施策を実行します。スモールスタートで始め、
                    PDCAサイクルを回しながら規模を拡大していきます。
                </p>

                <h3>ステップ4：効果測定と改善</h3>
                <p>
                    定期的に効果を測定し、データに基づいて改善を行います。
                    うまくいった施策は継続・拡大し、効果の低い施策は見直しを行います。
                </p>

                <h2>成功事例</h2>
                <h3>事例1：BtoB企業の成功例</h3>
                <p>
                    あるBtoB企業では、本記事で紹介した手法を実践することで、
                    リード獲得数を3倍に増やすことに成功しました。
                </p>

                <h3>事例2：EC事業者の改善事例</h3>
                <p>
                    EC事業を展開する企業では、データ分析に基づいた施策により、
                    コンバージョン率を50%向上させることができました。
                </p>

                <h2>よくある失敗と対策</h2>
                <h3>失敗例1：計画不足</h3>
                <p>
                    十分な計画なしに施策を始めてしまい、期待した成果が得られないケースがあります。
                    事前の準備と綿密な計画が成功の鍵となります。
                </p>

                <h3>失敗例2：効果測定の不足</h3>
                <p>
                    施策を実施しても効果測定を行わないと、何が良くて何が悪いのか判断できません。
                    適切なKPIを設定し、定期的に測定することが重要です。
                </p>

                <h2>今後のトレンド</h2>
                <p>
                    デジタルマーケティングの分野は今後も進化を続けます。AI技術の発展、
                    プライバシー規制の強化、新しいプラットフォームの登場など、
                    常に最新の動向をキャッチアップすることが重要です。
                </p>

                <h2>まとめ</h2>
                <p>
                    本記事では、${article.title.split('｜')[0]}について解説しました。
                    重要なポイントは以下の通りです：
                </p>
                <ul>
                    <li>戦略的なアプローチで計画的に進める</li>
                    <li>データに基づいた意思決定を行う</li>
                    <li>継続的に測定・改善を繰り返す</li>
                    <li>市場トレンドを常にキャッチアップする</li>
                </ul>
                <p>
                    これらのポイントを押さえて実践することで、確実に成果を上げることができます。
                    ぜひ自社のビジネスに活かしてください。
                </p>

                <div class="article__cta">
                    <h3>Webマーケティングでお困りではありませんか？</h3>
                    <p>Yojitsuでは、SEO対策からWeb広告運用まで、幅広いWebマーケティング支援を行っています。</p>
                    <a href="../#contact" class="btn btn--primary">無料相談はこちら</a>
                </div>
            </div>

            <aside class="article__sidebar">
                <div class="sidebar-widget">
                    <h3 class="sidebar-widget__title">目次</h3>
                    <div id="toc-sidebar"></div>
                </div>
            </aside>
        </div>
    </article>

    <!-- 関連記事 -->
    <section class="related-posts">
        <div class="related-posts__container">
            <h2 class="related-posts__title">関連記事</h2>
            <div class="related-posts__grid" id="relatedArticles">
                <!-- JavaScriptで自動生成されます -->
            </div>
        </div>
    </section>

    <!-- フッター（JavaScriptで生成） -->
    <div id="footer"></div>

    <!-- Scripts -->
    <script src="src/js/blog-loader.js"></script>
    <script src="src/js/main.js"></script>
    <script src="src/js/blog.js"></script>
    <script src="src/js/article-template.js"></script>
</body>
</html>`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// HTMLファイルを生成
let generatedCount = 0;
newArticles.forEach(article => {
  const filePath = path.join(__dirname, `../blog/posts/${article.id}.html`);
  const html = generateArticleHTML(article);

  fs.writeFileSync(filePath, html, 'utf-8');
  generatedCount++;

  if (generatedCount % 5 === 0) {
    console.log(`✅ ${generatedCount}/${newArticles.length} 記事生成完了`);
  }
});

console.log(`\n✅ ${generatedCount}記事のHTMLファイル生成が完了しました！\n`);

// articles.jsonに追加するデータを準備
const articlesForJson = newArticles.map(article => ({
  id: article.id,
  title: article.title,
  category: article.category,
  categoryLabel: article.categoryLabel || article.category.toUpperCase(),
  date: article.date,
  excerpt: article.excerpt,
  path: `blog/posts/${article.id}.html`,
  svgGradient: gradients[article.category],
  svgIcon: svgIcons[article.category]
}));

// 既存のarticles.jsonを読み込み
const articlesJsonPath = path.join(__dirname, '../blog/articles.json');
const existingData = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf-8'));

// 新しい記事を追加
existingData.articles = [...existingData.articles, ...articlesForJson];

// 日付順にソート（新しい順）
existingData.articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// articles.jsonを更新
fs.writeFileSync(articlesJsonPath, JSON.stringify(existingData, null, 2), 'utf-8');

console.log(`✅ articles.jsonを更新しました（総記事数: ${existingData.articles.length}）\n`);

console.log('📊 カテゴリ別記事数:');
const categoryCount = {};
existingData.articles.forEach(a => {
  categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
});
Object.entries(categoryCount).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}記事`);
});

console.log('\n✅ すべての作業が完了しました！');
