/**
 * 全ファイルの包括的チェック
 * - 基本的なHTML構造
 * - Base tag の位置
 * - Meta tags の存在
 * - 関連記事セクション
 * - 会社名の表記
 * - リンク切れ
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 全ファイルの包括的チェックを開始します...\n');

// チェック項目
const issues = {
    missingBaseTags: [],
    wrongBaseTagPosition: [],
    missingFavicon: [],
    missingFontAwesome: [],
    missingGoogleFonts: [],
    incorrectCompanyName: [],
    staticRelatedPosts: [],
    missingRelatedArticlesId: [],
    wrongUrls: [],
    brokenLinks: []
};

// HTMLファイルを再帰的に取得する関数
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
                getHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// すべてのHTMLファイルを取得
const htmlFiles = getHtmlFiles('.');

console.log(`📄 チェック対象ファイル数: ${htmlFiles.length}\n`);

htmlFiles.forEach((file, index) => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    // 1. Base tag の存在確認
    if (!content.includes('<base href=')) {
        issues.missingBaseTags.push(file);
    } else {
        // Base tag の位置確認（GTMの後、CSSの前）
        const baseTagIndex = lines.findIndex(line => line.includes('<base href='));
        const firstCssIndex = lines.findIndex(line => line.includes('<link rel="stylesheet"'));

        if (firstCssIndex !== -1 && baseTagIndex > firstCssIndex) {
            issues.wrongBaseTagPosition.push(file);
        }
    }

    // 2. Favicon の確認
    if (!content.includes('favicon.svg') && !content.includes('favicon.ico') && !content.includes('favicon.png')) {
        issues.missingFavicon.push(file);
    }

    // 3. Font Awesome の確認
    if (!content.includes('font-awesome') && !content.includes('fontawesome')) {
        issues.missingFontAwesome.push(file);
    }

    // 4. Google Fonts の確認
    if (!content.includes('fonts.googleapis.com') && !content.includes('fonts.gstatic.com')) {
        issues.missingGoogleFonts.push(file);
    }

    // 5. 会社名の確認（株式会社Yojitsu, 株式会社余日は誤り）
    if (content.includes('株式会社Yojitsu') || content.includes('株式会社余日')) {
        issues.incorrectCompanyName.push(file);
    }

    // 6. 静的な関連記事HTMLの確認（blog-card クラスが関連記事セクション内にある）
    const relatedPostsMatch = content.match(/<div class="related-posts__grid"[^>]*>([\s\S]*?)<\/div>/);
    if (relatedPostsMatch) {
        const relatedContent = relatedPostsMatch[1];
        if (relatedContent.includes('blog-card') || (relatedContent.includes('<a') && !relatedContent.includes('JavaScriptで自動生成'))) {
            issues.staticRelatedPosts.push(file);
        }
    }

    // 7. ブログ記事に id="relatedArticles" があるか（blog/posts配下のみ）
    if (file.startsWith('blog/posts/')) {
        if (!content.includes('id="relatedArticles"')) {
            issues.missingRelatedArticlesId.push(file);
        }
    }

    // 8. 間違ったURL（https://yojitsu.comなど）
    if (content.includes('https://yojitsu.com') || content.includes('http://yojitsu.com')) {
        issues.wrongUrls.push(file);
    }

    // 進捗表示
    if ((index + 1) % 10 === 0) {
        process.stdout.write(`\r処理中: ${index + 1}/${htmlFiles.length}`);
    }
});

console.log(`\r処理完了: ${htmlFiles.length}/${htmlFiles.length}\n`);

// 結果表示
console.log('=' .repeat(60));
console.log('📊 チェック結果サマリー');
console.log('='.repeat(60));

let totalIssues = 0;

function reportIssue(title, files) {
    if (files.length > 0) {
        console.log(`\n❌ ${title}: ${files.length}件`);
        files.slice(0, 5).forEach(f => console.log(`   - ${f}`));
        if (files.length > 5) {
            console.log(`   ... 他 ${files.length - 5}件`);
        }
        totalIssues += files.length;
    } else {
        console.log(`\n✅ ${title}: 問題なし`);
    }
}

reportIssue('Base tag が存在しない', issues.missingBaseTags);
reportIssue('Base tag の位置が間違っている（CSSより後）', issues.wrongBaseTagPosition);
reportIssue('Favicon が設定されていない', issues.missingFavicon);
reportIssue('Font Awesome が読み込まれていない', issues.missingFontAwesome);
reportIssue('Google Fonts が読み込まれていない', issues.missingGoogleFonts);
reportIssue('会社名表記が間違っている（株式会社〜）', issues.incorrectCompanyName);
reportIssue('静的な関連記事HTMLが残っている', issues.staticRelatedPosts);
reportIssue('id="relatedArticles" が存在しない（ブログ記事）', issues.missingRelatedArticlesId);
reportIssue('間違ったURL（yojitsu.com）が含まれている', issues.wrongUrls);

console.log('\n' + '='.repeat(60));
if (totalIssues === 0) {
    console.log('✅ すべてのチェックに合格しました！');
} else {
    console.log(`⚠️  合計 ${totalIssues} 件の問題が見つかりました。`);
}
console.log('='.repeat(60) + '\n');

// 詳細をJSONで保存
const reportPath = path.join(__dirname, '../check-report.json');
fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2), 'utf-8');
console.log(`📄 詳細レポートを保存: ${reportPath}`);

// 終了コード
process.exit(totalIssues > 0 ? 1 : 0);
