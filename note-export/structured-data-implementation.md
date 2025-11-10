---
title: 構造化データ実装ガイド｜SEOに効くSchema.orgとJSON-LDの完全解説
category: テクニカル
tags: 構造化データ, Schema.org, JSON-LD, SEO, リッチリザルト, Googlebot, 技術SEO, マークアップ
published: 2025-01-19
excerpt: 構造化データの実装方法を完全解説。Schema.org、JSON-LD、パンくずリスト、FAQ、記事、商品など、SEOに効く構造化データの種類と実装コードを実例付きで紹介します。
---

# 構造化データ実装ガイド｜SEOに効くSchema.orgとJSON-LDの完全解説

構造化データの実装方法を完全解説。Schema.org、JSON-LD、パンくずリスト、FAQ、記事、商品など、SEOに効く構造化データの種類と実装コードを実例付きで紹介します。

---

構造化データは、Googleにページの内容を正確に伝え、検索結果でリッチリザルトとして表示されるための重要な技術です。しかし、「構造化データって何？」「どうやって実装するの？」と悩む方も多いはず。本記事では、構造化データの基礎から、Schema.org、JSON-LDを使った実装方法、実際のコード例まで、実務で使える知識を完全網羅して解説します。

                        構造化データとは

### 構造化データの定義

                            構造化データとは、Webページの内容を機械（検索エンジン）が理解しやすい形式でマークアップしたデータのことです。

                            例えば、「記事のタイトル」「著者」「公開日」といった情報を、人間が読むためのHTMLとは別に、検索エンジンが明確に理解できる形式で提供します。

### 構造化データのメリット

#### 1. リッチリザルトで目立つ

                            構造化データを実装すると、検索結果にリッチリザルト（拡張表示）として表示されます：

                            - **記事：**画像・公開日・著者が表示

                            - **FAQ：**質問と回答が折りたたみ表示

                            - **商品：**価格・在庫状況・レビュー星評価

                            - **レシピ：**調理時間・カロリー・画像

                            - **イベント：**日時・場所・チケット価格

                            リッチリザルトは通常の検索結果より目立つため、CTR（クリック率）が1.5〜3倍向上すると言われています。

#### 2. 検索エンジンの理解が深まる

                            構造化データにより、Googleはページの内容をより正確に理解できます。結果として：

                            - 適切な検索クエリでの表示

                            - 音声検索での回答ソースになりやすい

                            - Googleアシスタント・スマートスピーカーでの活用

#### 3. SEOランキングへの間接的効果

                            構造化データ自体はランキング要因ではありませんが、CTRの向上やユーザーエンゲージメントの改善を通じて、間接的にSEO効果をもたらします。

### 主要な構造化データの種類

 | | | タイプ | | 用途 | | リッチリザルト | | | | | | Article | | ニュース・ブログ記事 | | 画像・公開日・著者 | | | | BreadcrumbList | | パンくずリスト | | 階層構造のリンク | | | | FAQPage | | よくある質問 | | 折りたたみQ&A | | | | Product | | 商品ページ | | 価格・在庫・レビュー | | | | Organization | | 企業情報 | | ナレッジパネル | | | | LocalBusiness | | 店舗情報 | | 営業時間・所在地 | | | 

                            本記事では、[BtoBマーケティング](btob-marketing-strategy.html)や[オウンドメディア運用](owned-media-operation-service.html)で特に重要な、Article、BreadcrumbList、FAQPageを中心に解説します。

                        実装方法の選択：JSON-LD、Microdata、RDFa
                        
                            構造化データには3つの実装方法があります。

### 1. JSON-LD（推奨）

                        **おすすめ度：★★★★★**

#### 特徴

                            - JavaScriptオブジェクト形式

                            - HTMLとは別に<script>タグ内に記述

                            - Googleが公式に推奨

#### メリット

                            - HTMLとの分離で管理しやすい

                            - 既存HTMLを変更不要

                            - 可読性が高い

                            - 動的生成が容易

#### デメリット

                            - 特になし（ほぼ完璧）

                        **結論：JSON-LDを使いましょう。**以降、本記事ではJSON-LDでの実装を解説します。

### 2. Microdata

                        **おすすめ度：★★☆☆☆**

#### 特徴

                            - HTML要素に直接属性を追加

                            - itemscope、itempropなどの属性を使用

#### メリット

                            - HTMLと密結合で同期がズレない

#### デメリット

                            - HTMLが煩雑になる

                            - 保守性が低い

                            - 動的生成が面倒

### 3. RDFa

                        **おすすめ度：★☆☆☆☆**

                            Microdataに似た方式。Googleのサポートは限定的で、推奨されていません。

                        Article（記事）の構造化データ
                        
                            ブログ記事やニュース記事に実装する、最も一般的な構造化データです。

### 実装例

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "構造化データ実装ガイド",
  "description": "構造化データの実装方法を完全解説",
  "image": "https://example.com/images/article-image.jpg",
  "author": {
    "@type": "Organization",
    "name": "株式会社Yojitsu"
  },
  "publisher": {
    "@type": "Organization",
    "name": "株式会社Yojitsu",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2025-01-19",
  "dateModified": "2025-01-19"
}
</script>

### 主要プロパティの解説

#### 必須項目

                            - headline：記事のタイトル（110文字以内推奨）

                            - image：記事の画像URL（複数指定可能）

                            - datePublished：公開日（ISO 8601形式）

                            - author：著者情報（Person or Organization）

                            - publisher：発行者情報

#### 推奨項目

                            - dateModified：更新日

                            - description：記事の要約

                            - mainEntityOfPage：記事のURL

### Articleの種類

                            用途に応じて@typeを使い分けます：

                            - Article：一般的な記事

                            - NewsArticle：ニュース記事

                            - BlogPosting：ブログ投稿

                            - TechArticle：技術記事

                            通常はArticleで問題ありません。[オウンドメディア](owned-media-operation-service.html)のブログ記事にはBlogPostingを使うこともあります。

### 画像の指定

                            画像は重要です。Googleは以下を推奨しています：

                            - **解像度：**1200px × 675px以上

                            - **アスペクト比：**16:9、4:3、1:1のいずれか

                            - **フォーマット：**JPG、PNG、WebP

                            - **複数指定：**異なるアスペクト比の画像を複数指定可能

"image": [
  "https://example.com/image-16x9.jpg",
  "https://example.com/image-4x3.jpg",
  "https://example.com/image-1x1.jpg"
]

### authorとpublisherの違い

                            - author：記事を書いた人or組織

                            - publisher：サイトを運営する組織（必須）

                            企業サイトの場合、両方とも組織にすることが多いです。個人ブログならauthorをPerson型にします。

                        BreadcrumbList（パンくずリスト）
                        
                            パンくずリストは、サイト構造をGoogleに伝え、検索結果にも表示されます。

### 実装例

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "ブログ",
      "item": "https://example.com/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "構造化データ実装ガイド",
      "item": "https://example.com/blog/structured-data.html"
    }
  ]
}
</script>

### プロパティの解説

                            - itemListElement：パンくずの各項目の配列

                            - position：階層の位置（1から始まる）

                            - name：リンクテキスト

                            - item：リンク先URL（最後の項目は現在ページなので省略可）

### 実装のポイント

                            - HTMLのパンくずリストと一致させる

                            - 最後の項目（現在ページ）はitemを省略するか、含める

                            - トップページは必ず含める

                            - 各階層のURLは絶対URLで指定

                            パンくずリストの構造化データは、[LP](landing-page-cost.html)やブログ記事など、全ページに実装すべきです。

                        FAQPage（よくある質問）
                        
                            FAQ（よくある質問）を構造化データ化すると、検索結果に折りたたみ形式で表示され、CTRが大幅に向上します。

### 実装例

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "構造化データとは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "構造化データとは、Webページの内容を検索エンジンが理解しやすい形式でマークアップしたデータのことです。Schema.orgの語彙を使ってJSON-LD形式で記述するのが一般的です。"
      }
    },
    {
      "@type": "Question",
      "name": "JSON-LDはどこに記述しますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JSON-LDは、HTMLの<head>タグ内または<body>タグ内の<script type=\"application/ld+json\">タグの中に記述します。<head>内に記述するのが一般的です。"
      }
    }
  ]
}
</script>

### プロパティの解説

                            - @type：FAQPage（ページ全体がFAQの場合）

                            - mainEntity：Questionオブジェクトの配列

                            - name：質問文

                            - acceptedAnswer：回答オブジェクト

                            - text：回答文（HTMLタグも使用可能）

### FAQPageとQAPageの違い

                            - FAQPage：1つのページに複数のQ&A（公式FAQ）

                            - QAPage：1つのQ&Aページ（質問サイトのような形式）

                            企業サイトのFAQページにはFAQPageを使います。

### 実装時の注意点

#### Googleのガイドライン

                                - FAQページ全体が1つのトピックに関するものであること

                                - 広告目的のQ&Aは含めない

                                - 質問と回答はHTMLにも表示する（構造化データだけではダメ）

                                - 各質問には1つの回答のみ

### HTMLに改行を含める方法

                            回答文に改行やHTMLタグを含めたい場合：

"text": "<p>構造化データとは、Webページの内容を検索エンジンが理解しやすい形式でマークアップしたデータのことです。</p><p>JSON-LD形式で記述するのが一般的です。</p>"

                            <p>、<br>、<ul>、<ol>、<li>などの基本的なHTMLタグが使用できます。

                        その他の重要な構造化データ
                        
                            ビジネスの種類に応じて、以下の構造化データも活用しましょう。

### 1. Organization（組織情報）

                            企業情報をGoogleに伝えます。トップページに設置します。

{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "株式会社Yojitsu",
  "url": "https://yojitsu.co.jp",
  "logo": "https://yojitsu.co.jp/logo.png",
  "sameAs": [
    "https://twitter.com/yojitsu",
    "https://www.facebook.com/yojitsu",
    "https://www.linkedin.com/company/yojitsu"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+81-3-1234-5678",
    "contactType": "customer service",
    "areaServed": "JP",
    "availableLanguage": "Japanese"
  }
}

### 2. LocalBusiness（地域ビジネス）

                            実店舗がある場合に使用します。[MEO対策](meo-local-seo-guide.html)にも有効です。

{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "カフェ Example",
  "image": "https://example.com/cafe.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "道玄坂1-2-3",
    "addressLocality": "渋谷区",
    "addressRegion": "東京都",
    "postalCode": "150-0043",
    "addressCountry": "JP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 35.6595,
    "longitude": 139.7007
  },
  "telephone": "+81-3-1234-5678",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ]
}

### 3. Product（商品）

                            ECサイトの商品ページに実装します。

{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "商品名",
  "image": "https://example.com/product.jpg",
  "description": "商品の説明",
  "sku": "12345",
  "brand": {
    "@type": "Brand",
    "name": "ブランド名"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product.html",
    "priceCurrency": "JPY",
    "price": "19800",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "24"
  }
}

### 4. HowTo（ハウツー）

                            手順を解説する記事に使用します。

{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "構造化データの実装方法",
  "description": "JSON-LDで構造化データを実装する手順",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Schema.orgで適切な型を選ぶ",
      "text": "まず、Schema.orgのドキュメントから適切な型を選びます。"
    },
    {
      "@type": "HowToStep",
      "name": "JSON-LDコードを作成",
      "text": "選んだ型に基づいてJSON-LDコードを作成します。"
    },
    {
      "@type": "HowToStep",
      "name": "HTMLに埋め込む",
      "text": "<script type=\"application/ld+json\">タグでHTMLに埋め込みます。"
    }
  ]
}

### 5. VideoObject（動画）

                            動画コンテンツがある場合に実装します。

{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "構造化データ実装チュートリアル",
  "description": "構造化データの実装方法を動画で解説",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "uploadDate": "2025-01-19",
  "duration": "PT10M30S",
  "contentUrl": "https://example.com/video.mp4",
  "embedUrl": "https://www.youtube.com/embed/xxxxx"
}

                        テスト・検証方法
                        
                            構造化データを実装したら、必ずテストしましょう。

### 1. リッチリザルトテスト

                            Googleが提供する公式ツールです。

                        **URL：**[https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)

#### 使い方

                            - URLまたはコードを入力

                            - 「URLをテスト」をクリック

                            - 結果を確認：エラーや警告がないかチェック

#### 確認項目

                            - エラーがないか（赤色表示）

                            - 警告がないか（黄色表示）

                            - 検出された項目が正しいか

                            - リッチリザルトのプレビュー

### 2. Schema Markup Validator

                            Schema.org公式のバリデーター。

                        **URL：**[https://validator.schema.org/](https://validator.schema.org/)

                            リッチリザルトテストよりも詳細な検証が可能です。JSONの構文エラーなども検出してくれます。

### 3. Google Search Console

                            [GA4](ga4-setup-guide.html)と並んで重要な、Googleの公式ツールです。

#### 確認手順

                            - Search Consoleにログイン

                            - 左メニューから「拡張」セクションを選択

                            - 各項目（記事、FAQなど）のレポートを確認

                            - エラーや警告があれば修正

#### レポートで確認できること

                            - 有効なページ数

                            - エラーのあるページ

                            - 警告のあるページ

                            - リッチリザルトとして認識されているか

#### よくあるエラーと対処法

                            **エラー1：「datePublishedが無効です」**

                            原因：日付形式が間違っている

                            対処法：ISO 8601形式（YYYY-MM-DD）で記述

                            **エラー2：「imageが必須です」**

                            原因：image プロパティが欠落

                            対処法：高解像度の画像URLを追加

                            **エラー3：「publisherのlogoが必要です」**

                            原因：publisher オブジェクトにlogoがない

                            対処法：企業ロゴのURLを追加

### 実装後の確認

#### 1. クロール・インデックス

                            構造化データを実装したら、Search Consoleの「URL検査」でクロールをリクエストしましょう。

#### 2. リッチリザルトの表示確認

                            実際の検索結果でリッチリザルトとして表示されるまで、数日〜数週間かかります。気長に待ちましょう。

#### 3. 継続的なモニタリング

                            Search Consoleで定期的にエラーをチェックします。サイト更新時に構造化データが壊れていないか確認しましょう。

                        まとめ
                        
                            構造化データは、SEOにおいて無視できない重要な要素です。適切に実装することで、検索結果での視認性が大幅に向上します。

### 構造化データ実装のチェックリスト

#### 基本

                                - JSON-LD形式で実装する

                                - <script type="application/ld+json">タグ内に記述

                                - Schema.orgの語彙を使用

#### 必須実装

                                - **全ページ：**BreadcrumbList（パンくずリスト）

                                - **記事ページ：**Article

                                - **FAQページ：**FAQPage

                                - **トップページ：**Organization

#### 業種別

                                - **実店舗：**LocalBusiness

                                - **EC：**Product

                                - **ハウツー記事：**HowTo

                                - **動画コンテンツ：**VideoObject

#### テスト

                                - リッチリザルトテストでエラーチェック

                                - Search Consoleで継続モニタリング

                                - 実際の検索結果で表示確認

                            構造化データの実装は、一度設定すれば長期的に効果が持続します。[リード獲得](website-lead-generation-methods.html)を強化するため、[BtoBマーケティング施策](btob-marketing-strategy.html)の一環として、ぜひ実装しましょう。

                            技術的な実装が難しい場合は、[Web制作会社](web-marketing-cost.html)に依頼することも検討してください。初期投資は必要ですが、長期的なSEO効果を考えればROIの高い投資です。

#### まず今日から始めること

                                - 自社サイトに Article と BreadcrumbList を実装

                                - リッチリザルトテストで検証

                                - エラーがあれば修正

                                - Search Consoleで継続モニタリング

                                これだけで、検索結果でのCTRが大きく改善します。今日から始めましょう！

---

**カテゴリ**: テクニカル
**タグ**: 構造化データ, Schema.org, JSON-LD, SEO, リッチリザルト, Googlebot, 技術SEO, マークアップ
**公開日**: 2025-01-19
