# HTMLテンプレート

このディレクトリには、新しいページを作成する際に使用するHTMLテンプレートが含まれています。

## テンプレートの種類

### 1. page-template.html
通常のページ用テンプレート（サービスページ、会社概要など）

### 2. blog-post-template.html
ブログ記事用テンプレート

## 使い方

### 新しい通常ページを作成する場合

```bash
# テンプレートをコピー
cp templates/page-template.html 新しいページ名.html

# ファイルを編集
# - <title>タグを更新
# - meta descriptionとkeywordsを更新
# - メインコンテンツを追加
```

### 新しいブログ記事を作成する場合

```bash
# テンプレートをコピー
cp templates/blog-post-template.html blog/posts/新しい記事名.html

# ファイルを編集
# - <title>タグを更新
# - meta descriptionとkeywordsを更新
# - 記事のタイトル、日付、カテゴリを更新
# - 記事本文を追加
```

## 重要な注意点

### GTMコードについて
- 全てのテンプレートには既にGTM（Google Tag Manager）コードが含まれています
- GTMコードは手動で追加・削除しないでください
- デプロイ前に `npm run build` を実行すると、GTMコードの有無が自動チェックされます

### デプロイ前の確認
新しいページを作成したら、デプロイ前に必ず以下を実行してください：

```bash
# ビルドコマンド（GTM挿入 + サイトマップ生成）
npm run build

# ローカルで確認
npm run serve
```

## テンプレートに含まれるもの

- Google Tag Manager（GTM）コード
- レスポンシブ対応のメタタグ
- 共通ヘッダー・フッター
- SEO対策の基本設定（meta description、keywords）
- 正しいファイルパス構造

## 自動化について

このプロジェクトでは、GTMの自動挿入が設定されています：

1. **テンプレート使用時**: 既にGTMコードが含まれているため、追加作業不要
2. **ビルド時**: `npm run build` でGTMコードの有無を自動チェック・挿入
3. **万が一忘れても**: デプロイ前のビルドで自動的に挿入されます

つまり、新規ページ作成時は基本的にテンプレートをコピーして編集するだけでOKです！
