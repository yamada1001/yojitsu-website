/**
 * Common Components Loader
 * Generates and inserts common HTML components (Footer, Share Buttons, etc.)
 */

(function() {
    'use strict';

    /**
     * Generate Footer HTML
     */
    function generateFooter() {
        return `
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
                        <li><a href="blog/categories/ai.html">AI</a></li>
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
</footer>`;
    }

    /**
     * Generate Share Buttons HTML
     */
    function generateShareButtons() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);

        return `
<div class="article__share">
    <h3 class="article__share-title">この記事をシェア</h3>
    <div class="article__share-buttons">
        <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}"
           class="share-btn" target="_blank" rel="noopener" aria-label="Twitterでシェア">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
            Twitter
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}"
           class="share-btn" target="_blank" rel="noopener" aria-label="Facebookでシェア">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
            Facebook
        </a>
        <a href="https://social-plugins.line.me/lineit/share?url=${url}"
           class="share-btn" target="_blank" rel="noopener" aria-label="LINEでシェア">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            LINE
        </a>
        <button class="share-btn" onclick="navigator.clipboard.writeText('${decodeURIComponent(url)}')" aria-label="URLをコピー">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
            URLをコピー
        </button>
    </div>
</div>`;
    }

    /**
     * Generate Mobile TOC Modal HTML
     */
    function generateMobileTocModal() {
        return `
<button class="floating-toc-btn" id="floatingTocBtn" aria-label="目次を開く">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
</button>

<div class="mobile-toc-modal" id="mobileTocModal">
    <div class="mobile-toc-modal__content">
        <div class="mobile-toc-modal__header">
            <h3 class="mobile-toc-modal__title">目次</h3>
            <button class="mobile-toc-modal__close" id="closeMobileToc" aria-label="閉じる">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <ul class="mobile-toc-modal__list" id="mobileTocList">
            <!-- JavaScriptで自動生成 -->
        </ul>
    </div>
</div>`;
    }

    /**
     * Insert components into the page
     */
    function insertComponents() {
        // Insert Footer (replace existing footer if present)
        let footer = document.querySelector('.footer');
        if (footer) {
            footer.outerHTML = generateFooter();
        } else {
            document.body.insertAdjacentHTML('beforeend', generateFooter());
        }

        // Insert Share Buttons (if article__share doesn't exist)
        const relatedPosts = document.querySelector('.related-posts');
        if (relatedPosts && !document.querySelector('.article__share')) {
            relatedPosts.insertAdjacentHTML('beforebegin', generateShareButtons());
        }

        // Insert Mobile TOC Modal (if not exists)
        if (!document.querySelector('.mobile-toc-modal') && document.querySelector('.article__toc')) {
            document.body.insertAdjacentHTML('beforeend', generateMobileTocModal());
        }
    }

    /**
     * Initialize on DOM ready
     */
    function init() {
        insertComponents();
    }

    // Execute on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
