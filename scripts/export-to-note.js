#!/usr/bin/env node

/**
 * ブログ記事をnote用のMarkdown形式にエクスポート
 * 各記事を個別のMarkdownファイルとして出力
 */

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'blog', 'posts');
const outputDir = path.join(__dirname, '..', 'note-export');

console.log('📝 note用Markdownファイルをエクスポート中...\n');

// 出力ディレクトリを作成
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// HTMLをMarkdownに変換
function htmlToMarkdown(html) {
    let md = html;

    // h2タグをMarkdownに変換
    md = md.replace(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g, (match, id, content) => {
        // アイコンを削除
        content = content.replace(/<i[^>]*><\/i>/g, '').trim();
        return `\n## ${content}\n`;
    });

    // h3タグをMarkdownに変換
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/g, (match, content) => {
        content = content.replace(/<i[^>]*><\/i>/g, '').trim();
        return `\n### ${content}\n`;
    });

    // h4タグをMarkdownに変換
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/g, (match, content) => {
        content = content.replace(/<i[^>]*><\/i>/g, '').trim();
        return `\n#### ${content}\n`;
    });

    // pタグを変換
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gs, '$1\n\n');

    // strongタグを太字に
    md = md.replace(/<strong>(.*?)<\/strong>/g, '**$1**');

    // リンクをMarkdown形式に
    md = md.replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');

    // リストをMarkdown形式に
    md = md.replace(/<ul[^>]*>/g, '\n');
    md = md.replace(/<\/ul>/g, '\n');
    md = md.replace(/<ol[^>]*>/g, '\n');
    md = md.replace(/<\/ol>/g, '\n');
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gs, '- $1\n');

    // blockquoteを変換
    md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gs, (match, content) => {
        content = content.replace(/<i[^>]*><\/i>/g, '').trim();
        return `\n> ${content}\n`;
    });

    // divタグを削除
    md = md.replace(/<div[^>]*>/g, '\n');
    md = md.replace(/<\/div>/g, '\n');

    // tableをMarkdown形式に（簡易版）
    md = md.replace(/<table[^>]*>(.*?)<\/table>/gs, (match, content) => {
        // 簡易的な変換（完全な変換は複雑なので基本形のみ）
        return '\n' + content.replace(/<[^>]+>/g, ' | ').replace(/\s+/g, ' ') + '\n';
    });

    // SVG、img、スタイル付きdivなどを削除
    md = md.replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, '');
    md = md.replace(/<img[^>]*>/g, '');

    // その他のHTMLタグを削除
    md = md.replace(/<[^>]+>/g, '');

    // HTMLエンティティをデコード
    md = md.replace(/&nbsp;/g, ' ');
    md = md.replace(/&lt;/g, '<');
    md = md.replace(/&gt;/g, '>');
    md = md.replace(/&amp;/g, '&');
    md = md.replace(/&quot;/g, '"');

    // 余分な空白行を削除
    md = md.replace(/\n\s*\n\s*\n/g, '\n\n');
    md = md.trim();

    return md;
}

// HTMLファイルから記事データを抽出
function extractArticleData(htmlContent, filename) {
    const id = filename.replace('.html', '');

    // titleタグから記事タイトルを抽出
    const titleMatch = htmlContent.match(/<title>(.*?)\s*\|/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // meta descriptionから抜粋を抽出
    const descMatch = htmlContent.match(/<meta\s+name="description"\s+content="([^"]*)"/);
    const excerpt = descMatch ? descMatch[1].trim() : '';

    // meta keywordsからタグを抽出
    const keywordsMatch = htmlContent.match(/<meta\s+name="keywords"\s+content="([^"]*)"/);
    const tags = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [];

    // datePublishedから日付を抽出
    const dateMatch = htmlContent.match(/"datePublished":\s*"([^"]*)"/);
    let pubDate = new Date();
    if (dateMatch) {
        pubDate = new Date(dateMatch[1]);
    }

    // article__categoryからカテゴリを抽出
    const categoryMatch = htmlContent.match(/<span class="article__category"[^>]*>([^<]+)<\/span>/);
    const category = categoryMatch ? categoryMatch[1].trim() : 'マーケティング';

    // article__contentからコンテンツを抽出
    const contentStart = htmlContent.indexOf('<div class="article__content">');
    let content = '';

    if (contentStart !== -1) {
        // article__contentの終わりを見つける（シェアボタンの前まで）
        const shareButtonStart = htmlContent.indexOf('<div class="article__share">', contentStart);
        const contentEnd = shareButtonStart !== -1 ? shareButtonStart : htmlContent.indexOf('</div>', contentStart + 5000);

        if (contentEnd !== -1) {
            const htmlContent2 = htmlContent.substring(contentStart + '<div class="article__content">'.length, contentEnd);
            content = htmlToMarkdown(htmlContent2);
        }
    }

    return {
        id,
        title,
        excerpt,
        tags,
        pubDate,
        category,
        content,
        filename
    };
}

// CSVインデックスファイルを生成
function generateCSVIndex(articles) {
    const header = 'ID,タイトル,カテゴリ,公開日,ファイル名,抜粋\n';
    const rows = articles.map(article => {
        const date = article.pubDate.toISOString().split('T')[0];
        return `"${article.id}","${article.title.replace(/"/g, '""')}","${article.category}","${date}","${article.id}.md","${article.excerpt.replace(/"/g, '""')}"`;
    }).join('\n');

    return header + rows;
}

// メイン処理
function main() {
    const files = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.html'))
        .sort();

    console.log(`📄 ${files.length}件の記事を処理中...\n`);

    const articles = [];

    files.forEach((file, index) => {
        const filePath = path.join(postsDir, file);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const article = extractArticleData(htmlContent, file);
        articles.push(article);

        // Markdownファイルを生成
        const mdContent = `---
title: ${article.title}
category: ${article.category}
tags: ${article.tags.join(', ')}
published: ${article.pubDate.toISOString().split('T')[0]}
excerpt: ${article.excerpt}
---

# ${article.title}

${article.excerpt}

---

${article.content}

---

**カテゴリ**: ${article.category}
**タグ**: ${article.tags.join(', ')}
**公開日**: ${article.pubDate.toISOString().split('T')[0]}
`;

        const mdFilePath = path.join(outputDir, `${article.id}.md`);
        fs.writeFileSync(mdFilePath, mdContent, 'utf-8');

        console.log(`✅ ${index + 1}. ${article.title}`);
    });

    // CSVインデックスを生成
    const csvContent = generateCSVIndex(articles);
    const csvPath = path.join(outputDir, '_index.csv');
    fs.writeFileSync(csvPath, csvContent, 'utf-8');

    // READMEを生成
    const readmeContent = `# note用エクスポートファイル

このディレクトリには、全${articles.length}件のブログ記事がMarkdown形式で保存されています。

## ファイル構成

- \`_index.csv\`: 全記事の一覧（スプレッドシートで開けます）
- \`*.md\`: 各記事のMarkdownファイル

## noteへの投稿方法

### 方法1: 手動コピー&ペースト（推奨）

1. 各Markdownファイルを開く
2. 内容をコピー
3. noteの新規投稿画面に貼り付け
4. タイトル、カテゴリ、タグを設定
5. 公開

### 方法2: 一括インポート

1. _index.csvをExcelまたはGoogleスプレッドシートで開く
2. 記事ごとに順次noteに投稿
3. Markdownファイルの内容をコピー&ペースト

## 注意事項

- **画像**: SVG画像は削除されています。必要に応じて再アップロードしてください
- **リンク**: 内部リンクは絶対URLに変換されています
- **スタイル**: 装飾は基本的なMarkdown形式に変換されています
- **表**: 簡易的な変換のため、複雑な表は手動調整が必要です

## カテゴリ別記事数

${Object.entries(articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
}, {})).map(([cat, count]) => `- ${cat}: ${count}件`).join('\n')}

## タグ一覧

${[...new Set(articles.flatMap(a => a.tags))].slice(0, 30).join(', ')}

---

生成日時: ${new Date().toISOString()}
記事数: ${articles.length}件
`;

    const readmePath = path.join(outputDir, 'README.md');
    fs.writeFileSync(readmePath, readmeContent, 'utf-8');

    console.log(`\n✨ エクスポート完了！`);
    console.log(`📦 出力ディレクトリ: ${outputDir}`);
    console.log(`📊 記事数: ${articles.length}件`);
    console.log(`📄 Markdownファイル: ${articles.length}件`);
    console.log(`📋 CSVインデックス: _index.csv`);
    console.log(`📖 README: README.md`);
    console.log(`\n💡 次のステップ:`);
    console.log(`   1. note-exportフォルダを確認`);
    console.log(`   2. _index.csvで記事一覧を確認`);
    console.log(`   3. 各.mdファイルをnoteに投稿`);
    console.log(`   4. 画像やリンクを確認・調整`);
}

main();
