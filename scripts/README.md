# サイトマップ自動生成スクリプト

## 概要

`blog/articles.json`を元に、サイトマップ（`sitemap.xml`）を自動生成するスクリプトです。

## 使い方

### 方法1: npm scriptで実行（推奨）

```bash
npm run generate-sitemap
```

### 方法2: 直接実行

```bash
node scripts/generate-sitemap.js
```

## いつ実行するか

以下の場合にサイトマップを再生成してください：

1. **新しいブログ記事を追加したとき**
   - `blog/articles.json`に新しい記事を追加したら実行

2. **記事の日付を更新したとき**
   - `lastmod`を最新に保つため

3. **サイトにデプロイする前**
   - GitHub Pagesなどにデプロイする前に実行

## 自動化のヒント

### GitHub Actionsで自動化

`.github/workflows/generate-sitemap.yml`を作成：

```yaml
name: Generate Sitemap

on:
  push:
    paths:
      - 'blog/articles.json'
      - 'blog/posts/**'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run generate-sitemap
      - name: Commit sitemap
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add sitemap.xml
          git commit -m "Auto-generate sitemap" || echo "No changes"
          git push
```

### pre-commit hookで自動化

`.git/hooks/pre-commit`ファイルを作成：

```bash
#!/bin/sh
npm run generate-sitemap
git add sitemap.xml
```

## 設定

`scripts/generate-sitemap.js`の`CONFIG`オブジェクトで以下をカスタマイズできます：

- `baseUrl`: サイトのベースURL
- `staticPages`: 静的ページの設定
- `categoryPages`: カテゴリページの設定
- `legalPages`: 法的ページの設定

## 生成されるURL数

- 静的ページ: 2
- カテゴリページ: 7
- ブログ記事: articles.jsonの記事数
- 法的ページ: 3

合計: 12 + ブログ記事数

## トラブルシューティング

### エラー: `Cannot find module`

Node.jsがインストールされていることを確認してください：

```bash
node --version
```

### エラー: `ENOENT: no such file or directory`

プロジェクトのルートディレクトリで実行していることを確認してください。

### サイトマップが更新されない

キャッシュをクリアして再実行してください：

```bash
rm sitemap.xml
npm run generate-sitemap
```
