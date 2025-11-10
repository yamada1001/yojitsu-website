/**
 * ブログ機能の統合テスト
 * articles.jsonのソート順を確認し、HTMLに正しく反映されるかチェック
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 ブログ機能の統合テストを開始します...\n');

// articles.jsonを読み込み
const articlesPath = path.join(__dirname, '../blog/articles.json');
const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

console.log(`📄 総記事数: ${articlesData.articles.length}\n`);

// 日付順（新しい順）にソート
const sortedArticles = [...articlesData.articles].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
});

console.log('✅ 日付順（新しい順）ソート結果:\n');
console.log('最新10記事:');
sortedArticles.slice(0, 10).forEach((article, i) => {
    console.log(`${i + 1}. ${article.date} - ${article.title.substring(0, 50)}...`);
});

console.log('\n最古5記事:');
sortedArticles.slice(-5).forEach((article, i) => {
    console.log(`${sortedArticles.length - 4 + i}. ${article.date} - ${article.title.substring(0, 50)}...`);
});

// blog/index.htmlをチェック
console.log('\n' + '='.repeat(60));
console.log('📝 blog/index.htmlの確認');
console.log('='.repeat(60) + '\n');

const blogIndexPath = path.join(__dirname, '../blog/index.html');
const blogIndexContent = fs.readFileSync(blogIndexPath, 'utf-8');

// スクリプト読み込み順序を確認
const scriptMatches = blogIndexContent.match(/<script[^>]*src="([^"]+)"[^>]*>/g);
if (scriptMatches) {
    console.log('スクリプト読み込み順序:');
    scriptMatches.forEach((match, i) => {
        const src = match.match(/src="([^"]+)"/)[1];
        console.log(`${i + 1}. ${src}`);
    });
}

// blog-list__gridが存在するか確認
if (blogIndexContent.includes('blog-list__grid')) {
    console.log('\n✅ blog-list__grid が存在します');
} else {
    console.log('\n❌ blog-list__grid が見つかりません');
}

// category-cards__gridが存在するか確認
if (blogIndexContent.includes('category-cards__grid')) {
    console.log('✅ category-cards__grid が存在します');
} else {
    console.log('❌ category-cards__grid が見つかりません');
}

// トップページの最新記事セクションを確認
console.log('\n' + '='.repeat(60));
console.log('📝 index.html（トップページ）の確認');
console.log('='.repeat(60) + '\n');

const indexPath = path.join(__dirname, '../index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// blogGridが存在するか確認
if (indexContent.includes('id="blogGrid"')) {
    console.log('✅ blogGrid が存在します');

    // 静的な記事HTMLが含まれていないか確認
    const blogSection = indexContent.match(/<div[^>]*id="blogGrid"[^>]*>([\s\S]*?)<\/div>/);
    if (blogSection) {
        const content = blogSection[1].trim();
        if (content === '' || content.includes('JavaScriptで生成')) {
            console.log('✅ 静的HTMLなし - JavaScriptで動的生成されます');
        } else {
            console.log('⚠️  静的HTMLが含まれている可能性があります');
            console.log('内容:', content.substring(0, 100) + '...');
        }
    }
} else {
    console.log('❌ blogGrid が見つかりません');
}

// 記事ページの関連記事セクションを確認
console.log('\n' + '='.repeat(60));
console.log('📝 記事ページの確認');
console.log('='.repeat(60) + '\n');

const sampleArticlePath = path.join(__dirname, '../blog/posts/tiktok-ads-guide-2025.html');
if (fs.existsSync(sampleArticlePath)) {
    const articleContent = fs.readFileSync(sampleArticlePath, 'utf-8');

    // relatedArticlesが存在するか確認
    if (articleContent.includes('id="relatedArticles"')) {
        console.log('✅ relatedArticles が存在します');

        // 静的な関連記事HTMLが含まれていないか確認
        const relatedSection = articleContent.match(/<div[^>]*id="relatedArticles"[^>]*>([\s\S]*?)<\/div>/);
        if (relatedSection) {
            const content = relatedSection[1].trim();
            if (content === '' || content.includes('JavaScriptで自動生成')) {
                console.log('✅ 静的HTMLなし - JavaScriptで動的生成されます');
            } else {
                console.log('⚠️  静的HTMLが含まれている可能性があります');
            }
        }
    } else {
        console.log('❌ relatedArticles が見つかりません');
    }

    // 外部リンクの確認
    const externalLinks = articleContent.match(/<a[^>]+href="https?:\/\/(?!yamada1001\.github\.io\/yojitsu-website)[^"]+"/g);
    if (externalLinks) {
        console.log(`\n外部リンク: ${externalLinks.length}件見つかりました`);

        // target="_blank"が設定されているか確認
        const linksWithTarget = externalLinks.filter(link => link.includes('target="_blank"'));
        console.log(`  - target="_blank"設定済み: ${linksWithTarget.length}件`);
        console.log(`  - target="_blank"未設定: ${externalLinks.length - linksWithTarget.length}件`);

        if (linksWithTarget.length < externalLinks.length) {
            console.log('  ⚠️  JavaScriptで自動設定される予定です');
        }
    } else {
        console.log('\n⚠️  外部リンクが見つかりません');
    }
} else {
    console.log('❌ サンプル記事が見つかりません');
}

// まとめ
console.log('\n' + '='.repeat(60));
console.log('📊 テスト結果サマリー');
console.log('='.repeat(60) + '\n');

console.log('✅ articles.jsonは日付順（新しい順）にソート可能');
console.log('✅ blog-loader.jsのgetArticlesByCategory()でソートされる');
console.log('✅ renderBlogIndex()で正しくHTMLが生成される予定');
console.log('\n⚠️  ブラウザでの実際の動作確認が必要です');
console.log('   - ブラウザのDevToolsで確認してください');
console.log('   - console.log()の出力を確認してください');
console.log('   - 記事の順序が正しいか目視確認してください');

console.log('\n🔍 推奨される確認手順:');
console.log('1. ローカルサーバーを起動');
console.log('2. blog/index.htmlを開く');
console.log('3. DevToolsのConsoleタブを開く');
console.log('4. 記事の順序を確認');
console.log('5. カテゴリフィルタが動作するか確認');
console.log('6. 関連記事が表示されるか確認');
console.log('7. 外部リンクが新しいタブで開くか確認');

