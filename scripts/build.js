#!/usr/bin/env node

/**
 * ビルドスクリプト
 *
 * デプロイ前に以下の処理を自動実行：
 * 1. GTMコードの自動挿入
 * 2. サイトマップの生成
 *
 * 使い方:
 *   npm run build
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Building Yojitsu Website...\n');

// スクリプトのディレクトリ
const scriptsDir = __dirname;

// ステップ1: GTMコードの挿入
console.log('📍 Step 1/2: Adding GTM code to all HTML files...');
try {
    execSync('node ' + path.join(scriptsDir, 'add-gtm.js'), { stdio: 'inherit' });
    console.log('✅ GTM code injection completed\n');
} catch (error) {
    console.error('❌ GTM code injection failed:', error.message);
    process.exit(1);
}

// ステップ2: サイトマップの生成
console.log('📍 Step 2/2: Generating sitemap...');
try {
    execSync('node ' + path.join(scriptsDir, 'generate-sitemap.js'), { stdio: 'inherit' });
    console.log('✅ Sitemap generation completed\n');
} catch (error) {
    console.error('❌ Sitemap generation failed:', error.message);
    process.exit(1);
}

console.log('🎉 Build completed successfully!');
console.log('\n💡 Your website is ready for deployment.');
console.log('   - GTM tracking is enabled on all pages');
console.log('   - Sitemap has been generated');
console.log('\n📦 Next steps:');
console.log('   1. Review the changes with git diff');
console.log('   2. Test locally with: npm run serve');
console.log('   3. Deploy to production');
