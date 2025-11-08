#!/usr/bin/env node

/**
 * Google Tag Manager Auto-Injector
 *
 * 全HTMLファイルに自動的にGTMコードを挿入します。
 * 既にGTMコードがある場合はスキップします。
 *
 * 使い方:
 *   node scripts/add-gtm.js
 */

const fs = require('fs');
const path = require('path');

// GTM設定
const GTM_ID = 'GTM-T7NGQDC2';

const GTM_HEAD = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;

const GTM_BODY = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

// 除外するディレクトリ
const EXCLUDE_DIRS = ['node_modules', '.git', 'src', 'docs', 'scripts'];

/**
 * HTMLファイルを再帰的に検索
 */
function findHtmlFiles(dir) {
    const files = [];

    function searchDir(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        entries.forEach(entry => {
            const fullPath = path.join(currentDir, entry.name);

            // 除外ディレクトリをスキップ
            if (entry.isDirectory()) {
                if (!EXCLUDE_DIRS.includes(entry.name)) {
                    searchDir(fullPath);
                }
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                files.push(fullPath);
            }
        });
    }

    searchDir(dir);
    return files;
}

/**
 * HTMLファイルにGTMコードを挿入
 */
function injectGTM(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // 既にGTMコードがあるかチェック
    if (content.includes('googletagmanager.com/gtm.js') || content.includes(GTM_ID)) {
        return { modified: false, reason: 'Already has GTM' };
    }

    // <head>の直後にGTMコードを挿入
    if (content.includes('<head>')) {
        content = content.replace(
            /<head>/i,
            `<head>\n    ${GTM_HEAD}`
        );
        modified = true;
    } else if (content.match(/<head[^>]*>/i)) {
        // <head lang="ja">などの属性付きheadタグに対応
        content = content.replace(
            /(<head[^>]*>)/i,
            `$1\n    ${GTM_HEAD}`
        );
        modified = true;
    }

    // <body>の直後にGTMコードを挿入
    if (content.includes('<body>')) {
        content = content.replace(
            /<body>/i,
            `<body>\n    ${GTM_BODY}`
        );
        modified = true;
    } else if (content.match(/<body[^>]*>/i)) {
        // <body class="...">などの属性付きbodyタグに対応
        content = content.replace(
            /(<body[^>]*>)/i,
            `$1\n    ${GTM_BODY}`
        );
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { modified: true };
    }

    return { modified: false, reason: 'No <head> or <body> tag found' };
}

/**
 * メイン処理
 */
function main() {
    console.log('🚀 Starting GTM injection...\n');
    console.log(`📦 GTM Container ID: ${GTM_ID}\n`);

    const projectRoot = path.join(__dirname, '..');
    const htmlFiles = findHtmlFiles(projectRoot);

    console.log(`📄 Found ${htmlFiles.length} HTML files\n`);

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    htmlFiles.forEach(file => {
        const relativePath = path.relative(projectRoot, file);

        try {
            const result = injectGTM(file);

            if (result.modified) {
                console.log(`✅ ${relativePath}`);
                successCount++;
            } else {
                console.log(`⏭️  ${relativePath} - ${result.reason || 'Skipped'}`);
                skippedCount++;
            }
        } catch (error) {
            console.log(`❌ ${relativePath} - Error: ${error.message}`);
            errorCount++;
        }
    });

    console.log('\n📊 Summary:');
    console.log(`   ✅ Modified: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total: ${htmlFiles.length}`);

    if (successCount > 0) {
        console.log('\n🎉 GTM injection completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Verify the changes in a few HTML files');
        console.log('   2. Test GTM in preview mode');
        console.log('   3. Commit the changes');
    }
}

// Run the script
main();
