# 余日（ヨジツ）Webマーケターサイト

Webマーケティングサービスを提供する「余日（ヨジツ）」の公式サイトです。

## プロジェクト概要

- **目的**: 業務委託採用とリード獲得
- **デザインコンセプト**: ミニマル、プロフェッショナル（無印良品・ユニクロ的）
- **SEO重視**: セマンティックHTML、構造化データ、Core Web Vitals対応

## 提供サービス

1. SEO対策
2. 広告運用代行
3. プランニング
4. SNS運用代行
5. CRM導入支援
6. サイト制作/PM・ディレクション

## ディレクトリ構造

```
yojitsu-website/
├── public/                      # 公開ディレクトリ
│   ├── index.html              # トップページ（LP型・1ページ完結）
│   ├── privacy-policy.html     # プライバシーポリシー
│   ├── tokushoho.html          # 特定商取引法に基づく表記
│   ├── disclaimer.html         # 免責事項
│   ├── robots.txt              # クローラー制御
│   └── sitemap.xml             # サイトマップ
├── src/                         # ソースファイル
│   ├── assets/images/          # 画像ファイル（要追加）
│   ├── css/
│   │   ├── styles.css          # メインスタイルシート
│   │   └── blog.css            # ブログ専用スタイル
│   └── js/
│       ├── main.js             # メインJavaScript（ナビ、フォーム等）
│       └── blog.js             # ブログ専用JavaScript（フィルター等）
├── blog/                        # ブログセクション
│   ├── index.html              # ブログトップページ
│   ├── categories/             # カテゴリーページ
│   │   ├── seo.html
│   │   ├── ads.html
│   │   ├── sns.html
│   │   ├── marketing.html
│   │   ├── web-production.html
│   │   └── misc.html
│   └── posts/                  # 記事ページ（今後追加）
└── docs/                        # ドキュメント
```

## 主な機能

### トップページ
- **Hero**: キャッチコピーとCTA
- **Services**: 6つのサービス紹介カード
- **About/Profile**: 自己紹介・プロフィール
- **Blog Preview**: 最新記事3件プレビュー
- **Contact Form**: お問い合わせフォーム（バリデーション付き）

### ブログ機能
- カテゴリーフィルタリング（JavaScript）
- レスポンシブデザイン
- SEO最適化済み

### SEO対策
- セマンティックHTML5
- 構造化データ（JSON-LD）
- メタタグ・OGP完備
- robots.txt・sitemap.xml

## セットアップ手順

### 1. 画像ファイルの準備

以下のディレクトリに画像を配置してください：

```
src/assets/images/
├── logo.png                    # ロゴ画像
├── apple-touch-icon.png        # Appleタッチアイコン
├── ogp.jpg                     # OGP画像（1200x630px推奨）
├── ogp-blog.jpg                # ブログOGP画像
├── profile.jpg                 # プロフィール画像
└── blog/
    ├── placeholder-1.jpg       # ブログサムネイル1
    ├── placeholder-2.jpg       # ブログサムネイル2
    ├── placeholder-3.jpg       # ブログサムネイル3
    ├── placeholder-4.jpg       # ブログサムネイル4
    ├── placeholder-5.jpg       # ブログサムネイル5
    └── placeholder-6.jpg       # ブログサムネイル6
```

**画像最適化のポイント:**
- WebP形式の使用を推奨
- 適切なサイズにリサイズ（不要に大きくしない）
- 画像圧縮ツールで最適化（TinyPNG、ImageOptim等）

### 2. ファビコンの追加

`public/`ディレクトリに以下を配置：
- `favicon.ico` (32x32px)

### 3. 情報の更新

以下のファイルで、実際の情報に置き換えてください：

**public/tokushoho.html**
- 代表者名
- 所在地
- 連絡先メールアドレス

**全ページのURL**
- `https://yojitsu.com` を実際のドメインに置き換え

### 4. フォーム送信機能の実装

`src/js/main.js` の contactForm セクション（TODO箇所）で、実際のフォーム送信APIを設定してください。

```javascript
// 例：FormspreeやNetlify Formsを使用
await fetch('YOUR_FORM_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

## ビルドコマンド

デプロイ前に必ず以下のコマンドを実行してください：

```bash
npm run build
```

このコマンドは以下の処理を自動実行します：
1. **GTMコードの自動挿入**: 全HTMLファイルにGoogle Tag Manager（GTM-T7NGQDC2）を自動挿入
2. **サイトマップの生成**: 最新のサイトマップを自動生成

### その他の利用可能なコマンド

```bash
# ローカルサーバーで確認（ポート8000）
npm run serve

# GTMコードのみ挿入
npm run add-gtm

# サイトマップのみ生成
npm run generate-sitemap
```

### 新規ページ作成時の注意

新しいHTMLページを作成する場合は、`templates/`ディレクトリのテンプレートを使用してください：

```bash
# 通常ページの作成
cp templates/page-template.html 新しいページ.html

# ブログ記事の作成
cp templates/blog-post-template.html blog/posts/新しい記事.html
```

テンプレートには既にGTMコードが含まれているため、追加作業は不要です。
詳細は `templates/README.md` を参照してください。

## デプロイ方法

### 推奨ホスティング

1. **Netlify** (推奨)
   - ドラッグ&ドロップで簡単デプロイ
   - 無料SSL証明書
   - CDN自動配信
   - フォーム機能あり

2. **Vercel**
   - Next.js以外の静的サイトも対応
   - 高速CDN
   - 無料SSL

3. **GitHub Pages**
   - 無料ホスティング
   - カスタムドメイン対応

### デプロイ手順（Netlify例）

1. Netlifyアカウント作成
2. `public/`フォルダをドラッグ&ドロップ
3. カスタムドメイン設定
4. SSL証明書の自動発行

## カスタマイズガイド

### カラーテーマの変更

`src/css/styles.css` の `:root` セクションでCSS変数を編集：

```css
:root {
    --color-primary: #2c2c2c;
    --color-accent: #000000;
    /* 他の色も変更可能 */
}
```

### フォントの変更

`src/css/styles.css` の `--font-family-base` を編集してWebフォントを追加できます。

## パフォーマンス最適化

### Core Web Vitals改善のために

1. **画像最適化**
   - WebP形式の使用
   - lazyloading属性の活用（実装済み）
   - 適切なサイズへのリサイズ

2. **CSS/JSの最適化**
   - 不要なコードの削除
   - ミニファイ（本番環境）
   - Critical CSSのインライン化（必要に応じて）

3. **キャッシュ戦略**
   - ホスティング側でキャッシュヘッダーを設定
   - Service Workerの導入（PWA化する場合）

## ブログ記事の追加方法

1. `blog/posts/`に新しいHTMLファイルを作成
2. `blog/index.html`に記事カードを追加
3. 該当カテゴリーページにも追加
4. `sitemap.xml`に新しいURLを追加

## 今後の拡張案

- [ ] お問い合わせフォームのバックエンド統合
- [ ] ブログ記事の追加
- [ ] 実績・ポートフォリオセクション
- [ ] お客様の声・レビューセクション
- [ ] FAQ（よくある質問）ページ
- [ ] 多言語対応（英語版等）
- [ ] ダークモード対応
- [ ] PWA化
- [x] Google Tag Manager設定（完了）
- [ ] Google Search Console登録

## ライセンス

All rights reserved. © 2025 余日（ヨジツ）

## サポート

質問や問題がある場合は、お問い合わせフォームからご連絡ください。
