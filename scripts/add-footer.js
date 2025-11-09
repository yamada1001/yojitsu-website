#!/usr/bin/env node

/**
 * Footer Auto-Injector for Blog Posts
 *
 * ブログ記事にフッターとスクリプトタグがない場合、自動的に挿入します。
 */

const fs = require('fs');
const path = require('path');

const FOOTER_HTML = `
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer__content">
                <div class="footer__brand">
                    <a href="index.html" class="footer__logo">余日</a>
                    <p class="footer__tagline">本質に向き合い、成長を加速させる</p>
                </div>
                <nav class="footer__nav">
                    <div class="footer__nav-column">
                        <h4 class="footer__nav-title">サービス</h4>
                        <ul class="footer__nav-list">
                            <li><a href="index.html#services">SEO対策</a></li>
                            <li><a href="index.html#services">広告運用代行</a></li>
                            <li><a href="index.html#services">プランニング</a></li>
                            <li><a href="index.html#services">SNS運用代行</a></li>
                            <li><a href="index.html#services">CRM導入支援</a></li>
                            <li><a href="index.html#services">サイト制作/PM・ディレクション</a></li>
                        </ul>
                    </div>
                    <div class="footer__nav-column">
                        <h4 class="footer__nav-title">ブログ</h4>
                        <ul class="footer__nav-list">
                            <li><a href="blog/categories/seo.html">SEO</a></li>
                            <li><a href="blog/categories/ads.html">広告運用</a></li>
                            <li><a href="blog/categories/sns.html">SNS</a></li>
                            <li><a href="blog/categories/marketing.html">マーケティング</a></li>
                            <li><a href="blog/categories/web-production.html">Web制作</a></li>
                            <li><a href="blog/categories/misc.html">雑記</a></li>
                        </ul>
                    </div>
                    <div class="footer__nav-column">
                        <h4 class="footer__nav-title">企業情報</h4>
                        <ul class="footer__nav-list">
                            <li><a href="index.html#about">プロフィール</a></li>
                            <li><a href="index.html#contact">お問い合わせ</a></li>
                            <li><a href="/privacy-policy.html">プライバシーポリシー</a></li>
                            <li><a href="/tokushoho.html">特定商取引法に基づく表記</a></li>
                            <li><a href="/disclaimer.html">免責事項</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div class="footer__bottom">
                <p class="footer__copyright">&copy; 2025 余日（ヨジツ）All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="src/js/blog-loader.js"></script>
    <script src="src/js/main.js"></script>
    <script src="src/js/blog.js"></script>
    <script src="src/js/article-template.js"></script>
</body>
</html>`;

function injectFooter(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // 既にフッターがあるかチェック
    if (content.includes('<footer class="footer">')) {
        return { modified: false, reason: 'Footer already exists' };
    }

    // </body>の直前にフッターを挿入
    if (content.includes('</body>')) {
        // 既存の</body></html>を削除
        content = content.replace(/<\/body>\s*<\/html>\s*$/, '');

        // スクリプトタグがある場合は削除（重複を防ぐ）
        content = content.replace(/<script[^>]*src="[^"]*blog-loader\.js"[^>]*><\/script>/g, '');
        content = content.replace(/<script[^>]*src="[^"]*main\.js"[^>]*><\/script>/g, '');
        content = content.replace(/<script[^>]*src="[^"]*blog\.js"[^>]*><\/script>/g, '');
        content = content.replace(/<script[^>]*src="[^"]*article-template\.js"[^>]*><\/script>/g, '');

        // フッターとスクリプトを追加
        content = content.trimEnd() + '\n' + FOOTER_HTML;
        modified = true;
    } else {
        return { modified: false, reason: 'No </body> tag found' };
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { modified: true };
    }

    return { modified: false, reason: 'Unknown error' };
}

function main() {
    console.log('🚀 Adding footers to blog posts...\n');

    const postsDir = path.join(__dirname, '..', 'blog', 'posts');
    const htmlFiles = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(postsDir, file));

    console.log(`📄 Found ${htmlFiles.length} HTML files\n`);

    let successCount = 0;
    let skippedCount = 0;

    htmlFiles.forEach(file => {
        const relativePath = path.relative(path.join(__dirname, '..'), file);

        try {
            const result = injectFooter(file);

            if (result.modified) {
                console.log(`✅ ${relativePath}`);
                successCount++;
            } else {
                console.log(`⏭️  ${relativePath} - ${result.reason}`);
                skippedCount++;
            }
        } catch (error) {
            console.log(`❌ ${relativePath} - Error: ${error.message}`);
        }
    });

    console.log('\n📊 Summary:');
    console.log(`   ✅ Modified: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📝 Total: ${htmlFiles.length}`);

    if (successCount > 0) {
        console.log('\n🎉 Footer injection completed!');
    }
}

main();
