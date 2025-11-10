#!/usr/bin/env node

/**
 * ブログ記事をWXR（WordPress eXtended RSS）形式にエクスポート
 * note等へのインポート用
 */

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'blog', 'posts');
const outputPath = path.join(__dirname, '..', 'blog-export.xml');

console.log('📝 WXR形式でブログ記事をエクスポート中...\n');

// HTMLファイルからメタデータとコンテンツを抽出
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
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [];

    // datePublishedまたはdateModifiedから日付を抽出
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
    const contentEnd = htmlContent.indexOf('</div>', contentStart + 100);
    let content = '';

    if (contentStart !== -1 && contentEnd !== -1) {
        content = htmlContent.substring(contentStart + '<div class="article__content">'.length, contentEnd);

        // note用にコンテンツをクリーンアップ
        content = cleanContentForNote(content);
    }

    return {
        id,
        title,
        excerpt,
        keywords,
        pubDate,
        category,
        content,
        filename
    };
}

// note用にコンテンツをクリーンアップ
function cleanContentForNote(content) {
    // 1. 内部リンクを絶対URLに変換
    content = content.replace(/href="blog\/posts\//g, 'href="https://yamada1001.github.io/yojitsu-website/blog/posts/');
    content = content.replace(/href="blog\//g, 'href="https://yamada1001.github.io/yojitsu-website/blog/');
    content = content.replace(/href="index\.html/g, 'href="https://yamada1001.github.io/yojitsu-website/index.html');

    // 2. インラインスタイルを簡素化（noteは一部のスタイルのみサポート）
    content = content.replace(/style="[^"]*background[^"]*"/g, '');
    content = content.replace(/style="[^"]*gradient[^"]*"/g, '');

    // 3. Font Awesomeアイコンをテキストに変換
    content = content.replace(/<i class="fas fa-[^"]*"[^>]*><\/i>/g, '');

    // 4. 複雑なdivスタイルを簡素化
    content = content.replace(/<div style="display:\s*grid[^"]*">/g, '<div>');

    // 5. SVG画像は削除（noteでサポートされない）
    content = content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, '');

    // 6. 余分な空白を削除
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    // 7. article__leadクラスの段落をそのまま保持
    // 8. テーブルはそのまま保持（noteは基本的なテーブルをサポート）

    return content.trim();
}

// WXR形式のXMLヘッダー
function generateWXRHeader() {
    const now = new Date();
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
    xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
    <title>余日（ヨジツ）ブログ</title>
    <link>https://yamada1001.github.io/yojitsu-website/</link>
    <description>Webマーケティングの本質に向き合うブログ</description>
    <pubDate>${now.toUTCString()}</pubDate>
    <language>ja</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>https://yamada1001.github.io/yojitsu-website/</wp:base_site_url>
    <wp:base_blog_url>https://yamada1001.github.io/yojitsu-website/</wp:base_blog_url>
    <wp:author>
        <wp:author_id>1</wp:author_id>
        <wp:author_login>yojitsu</wp:author_login>
        <wp:author_email>info@yojitsu.com</wp:author_email>
        <wp:author_display_name><![CDATA[余日編集部]]></wp:author_display_name>
        <wp:author_first_name><![CDATA[]]></wp:author_first_name>
        <wp:author_last_name><![CDATA[]]></wp:author_last_name>
    </wp:author>
`;
}

// カテゴリー定義
function generateCategories() {
    const categories = [
        { id: 1, slug: 'ai', name: 'AI' },
        { id: 2, slug: 'seo', name: 'SEO' },
        { id: 3, slug: 'ads', name: '広告運用' },
        { id: 4, slug: 'sns', name: 'SNS' },
        { id: 5, slug: 'marketing', name: 'マーケティング' },
        { id: 6, slug: 'web-production', name: 'Web制作' },
        { id: 7, slug: 'misc', name: '雑記' }
    ];

    return categories.map(cat => `    <wp:category>
        <wp:term_id>${cat.id}</wp:term_id>
        <wp:category_nicename>${cat.slug}</wp:category_nicename>
        <wp:category_parent></wp:category_parent>
        <wp:cat_name><![CDATA[${cat.name}]]></wp:cat_name>
    </wp:category>`).join('\n');
}

// 記事アイテムを生成
function generateArticleItem(article, index) {
    const postId = index + 1;
    const pubDate = article.pubDate.toUTCString();
    const pubDateLocal = article.pubDate.toISOString().replace('T', ' ').substring(0, 19);
    const pubDateGMT = article.pubDate.toISOString().replace('T', ' ').substring(0, 19);

    // カテゴリスラッグを取得
    const categoryMap = {
        'AI': 'ai',
        'SEO': 'seo',
        '広告運用': 'ads',
        'SNS': 'sns',
        'マーケティング': 'marketing',
        'Web制作': 'web-production',
        '雑記': 'misc'
    };
    const categorySlug = categoryMap[article.category] || 'marketing';

    return `
    <item>
        <title><![CDATA[${escapeXml(article.title)}]]></title>
        <link>https://yamada1001.github.io/yojitsu-website/blog/posts/${article.filename}</link>
        <pubDate>${pubDate}</pubDate>
        <dc:creator><![CDATA[余日編集部]]></dc:creator>
        <guid isPermaLink="false">https://yamada1001.github.io/yojitsu-website/blog/posts/${article.filename}</guid>
        <description><![CDATA[${escapeXml(article.excerpt)}]]></description>
        <content:encoded><![CDATA[${article.content}]]></content:encoded>
        <excerpt:encoded><![CDATA[${escapeXml(article.excerpt)}]]></excerpt:encoded>
        <wp:post_id>${postId}</wp:post_id>
        <wp:post_date>${pubDateLocal}</wp:post_date>
        <wp:post_date_gmt>${pubDateGMT}</wp:post_date_gmt>
        <wp:post_modified>${pubDateLocal}</wp:post_modified>
        <wp:post_modified_gmt>${pubDateGMT}</wp:post_modified_gmt>
        <wp:comment_status>open</wp:comment_status>
        <wp:ping_status>open</wp:ping_status>
        <wp:post_name>${article.id}</wp:post_name>
        <wp:status>publish</wp:status>
        <wp:post_parent>0</wp:post_parent>
        <wp:menu_order>0</wp:menu_order>
        <wp:post_type>post</wp:post_type>
        <wp:post_password></wp:post_password>
        <wp:is_sticky>0</wp:is_sticky>
        <category domain="category" nicename="${categorySlug}"><![CDATA[${article.category}]]></category>
${article.keywords.map(tag => `        <category domain="post_tag" nicename="${slugify(tag)}"><![CDATA[${tag}]]></category>`).join('\n')}
    </item>`;
}

// XMLエスケープ
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// スラッグ化
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-')
        .replace(/^-+|-+$/g, '');
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

        console.log(`✅ ${index + 1}. ${article.title}`);
    });

    // WXR XMLを生成
    let xml = generateWXRHeader();
    xml += generateCategories() + '\n';

    articles.forEach((article, index) => {
        xml += generateArticleItem(article, index);
    });

    xml += '\n</channel>\n</rss>';

    // ファイルに書き込み
    fs.writeFileSync(outputPath, xml, 'utf-8');

    console.log(`\n✨ エクスポート完了！`);
    console.log(`📦 ファイル: ${outputPath}`);
    console.log(`📊 記事数: ${articles.length}件`);
    console.log(`\n💡 次のステップ:`);
    console.log(`   1. blog-export.xml をダウンロード`);
    console.log(`   2. noteまたはWordPressにインポート`);
    console.log(`   3. 画像やリンクを確認・調整`);
}

main();
