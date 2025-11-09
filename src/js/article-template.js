/**
 * ブログ記事の共通テンプレート生成
 * フッター、モバイルTOC、関連記事などを自動挿入
 */

(function() {
    'use strict';

    // ==========================================
    // モバイルTOCボタンとモーダルを挿入
    // ==========================================
    function insertMobileTOC() {
        const tocHTML = `
            <!-- Floating TOC Button (Mobile) -->
            <button class="floating-toc-btn" id="floatingTocBtn" aria-label="目次を開く">
                <i class="fas fa-list"></i>
            </button>

            <!-- Mobile TOC Modal -->
            <div class="mobile-toc-modal" id="mobileTocModal">
                <div class="mobile-toc-modal__content">
                    <div class="mobile-toc-modal__header">
                        <h2 class="mobile-toc-modal__title">目次</h2>
                        <button class="mobile-toc-modal__close" id="closeMobileToc" aria-label="目次を閉じる">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <ul class="mobile-toc-modal__list" id="mobileTocList">
                        <!-- JavaScriptで自動生成されます -->
                    </ul>
                </div>
            </div>
        `;

        // articleタグの後に挿入
        const article = document.querySelector('.article');
        if (article) {
            article.insertAdjacentHTML('afterend', tocHTML);
        }
    }

    // ==========================================
    // フッターを挿入
    // ==========================================
    function insertFooter() {
        const footerHTML = `
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
                                    <li><a href="blog/index.html#seo">SEO</a></li>
                                    <li><a href="blog/index.html#ads">広告運用</a></li>
                                    <li><a href="blog/index.html#sns">SNS</a></li>
                                    <li><a href="blog/index.html#marketing">マーケティング</a></li>
                                    <li><a href="blog/index.html#web">Web制作</a></li>
                                    <li><a href="blog/index.html#misc">雑記</a></li>
                                </ul>
                            </div>
                            <div class="footer__nav-column">
                                <h4 class="footer__nav-title">企業情報</h4>
                                <ul class="footer__nav-list">
                                    <li><a href="index.html#about">プロフィール</a></li>
                                    <li><a href="index.html#contact">お問い合わせ</a></li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div class="footer__bottom">
                        <p class="footer__copyright">&copy; 2025 余日（ヨジツ）All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;

        // 既存のフッター（article__footer）を削除
        const oldFooter = document.querySelector('.article__footer');
        if (oldFooter) {
            oldFooter.remove();
        }

        // bodyの最後に挿入
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // ==========================================
    // サイドバーTOCを挿入
    // ==========================================
    function insertSidebarTOC() {
        const article = document.querySelector('.article');
        const articleMain = document.querySelector('.article__main');

        if (!article || !articleMain) return;

        // すでにサイドバーが存在する場合はスキップ
        if (document.querySelector('.article__sidebar')) return;

        // article__containerが存在するか確認
        let container = document.querySelector('.article__container');
        if (!container) {
            // なければ作成
            container = document.createElement('div');
            container.className = 'article__container';
            articleMain.parentNode.insertBefore(container, articleMain);
            container.appendChild(articleMain);
        }

        // サイドバーTOCを挿入
        const sidebarHTML = `
            <aside class="article__sidebar">
                <div class="sidebar-toc" id="sidebarToc">
                    <!-- 目次はJavaScriptで自動生成されます -->
                </div>
            </aside>
        `;

        container.insertAdjacentHTML('beforeend', sidebarHTML);
    }

    // ==========================================
    // 関連記事セクションを挿入/更新
    // ==========================================
    function insertRelatedArticles() {
        // すでに正しい形式の関連記事セクションが存在するかチェック
        const existingRelated = document.querySelector('.article__related');
        if (existingRelated) return; // すでにあればスキップ

        // 古い形式の関連記事リンクを削除
        const oldRelatedLinks = document.querySelector('.article__related-links');
        if (oldRelatedLinks) {
            oldRelatedLinks.remove();
        }

        // article__contentの最後に関連記事セクションを挿入
        const articleContent = document.querySelector('.article__content');
        if (!articleContent) return;

        const relatedHTML = `
            <!-- Related Articles -->
            <aside class="article__related">
                <h2 class="article__related-title"><i class="fas fa-link" style="margin-right: 0.5rem;"></i>関連記事</h2>
                <div class="article__related-grid" id="relatedArticles">
                    <!-- JavaScriptで自動生成されます -->
                </div>
            </aside>
        `;

        articleContent.insertAdjacentHTML('afterend', relatedHTML);
    }

    // ==========================================
    // 記事IDとカテゴリを取得
    // ==========================================
    function getArticleInfo() {
        // URLから記事IDを取得
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        const articleId = filename.replace('.html', '');

        // カテゴリはmeta情報またはStructured Dataから取得
        let category = 'marketing'; // デフォルト

        // Structured Dataから取得を試みる
        const structuredData = document.querySelector('script[type="application/ld+json"]');
        if (structuredData) {
            try {
                const data = JSON.parse(structuredData.textContent);
                // カテゴリ情報があれば使用（ここでは簡易的に記事タイトルやメタ情報から判定）
            } catch (e) {
                console.error('Failed to parse structured data:', e);
            }
        }

        // article__categoryからカテゴリを取得
        const categoryElement = document.querySelector('.article__category');
        if (categoryElement) {
            const categoryText = categoryElement.textContent.trim();
            const categoryMap = {
                'AI': 'ai',
                'SEO': 'seo',
                '広告運用': 'ads',
                'SNS': 'sns',
                'マーケティング': 'marketing',
                'Web制作': 'web-production',
                '雑記': 'misc'
            };
            category = categoryMap[categoryText] || 'marketing';
        }

        return { articleId, category };
    }

    // ==========================================
    // 関連記事を読み込んで表示
    // ==========================================
    function loadRelatedArticles() {
        const relatedContainer = document.getElementById('relatedArticles');
        if (!relatedContainer) return;

        const { articleId, category } = getArticleInfo();

        // blogLoaderが利用可能になるまで待つ
        const checkBlogLoader = setInterval(() => {
            if (window.blogLoader && window.blogLoader.articlesData) {
                clearInterval(checkBlogLoader);

                window.blogLoader.loadArticles().then(() => {
                    const relatedArticles = window.blogLoader.getRelatedArticles(articleId, category, 3);
                    if (relatedArticles && relatedArticles.length > 0) {
                        relatedContainer.innerHTML = relatedArticles.map(article =>
                            window.blogLoader.generateBlogCard(article, false)
                        ).join('');
                    } else {
                        // 関連記事がない場合は非表示
                        const relatedSection = document.querySelector('.article__related');
                        if (relatedSection) {
                            relatedSection.style.display = 'none';
                        }
                    }
                });
            }
        }, 100);

        // 10秒後にタイムアウト
        setTimeout(() => {
            clearInterval(checkBlogLoader);
        }, 10000);
    }

    // ==========================================
    // サイドバーTOCのスクロール連動機能
    // ==========================================
    function initTOCScrollSync() {
        const sidebarToc = document.getElementById('sidebarToc');
        if (!sidebarToc) return;

        // 記事内のh2要素を取得
        const headings = document.querySelectorAll('.article__content h2[id]');
        if (headings.length === 0) return;

        // サイドバーTOCを生成
        const tocList = document.createElement('ul');
        tocList.className = 'sidebar-toc__list';

        headings.forEach(heading => {
            const li = document.createElement('li');
            li.className = 'sidebar-toc__item';

            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.className = 'sidebar-toc__link';
            a.textContent = heading.textContent.replace(/^[0-9]+\.\s*/, ''); // 番号を削除
            a.dataset.target = heading.id;

            li.appendChild(a);
            tocList.appendChild(li);
        });

        sidebarToc.appendChild(tocList);

        // スクロール時にアクティブなセクションをハイライト
        let ticking = false;

        function updateActiveTOC() {
            const scrollPosition = window.scrollY + 100; // ヘッダーオフセット

            let activeHeading = null;
            headings.forEach(heading => {
                const headingTop = heading.offsetTop;
                if (scrollPosition >= headingTop) {
                    activeHeading = heading;
                }
            });

            // すべてのリンクからactiveクラスを削除
            const tocLinks = sidebarToc.querySelectorAll('.sidebar-toc__link');
            tocLinks.forEach(link => link.classList.remove('active'));

            // 現在のセクションのリンクにactiveクラスを追加
            if (activeHeading) {
                const activeLink = sidebarToc.querySelector(`[data-target="${activeHeading.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateActiveTOC);
                ticking = true;
            }
        }

        // スクロールイベントリスナー
        window.addEventListener('scroll', requestTick);

        // 初期状態を設定
        updateActiveTOC();

        // TOCリンククリック時のスムーズスクロール
        sidebarToc.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-toc__link')) {
                e.preventDefault();
                const targetId = e.target.dataset.target;
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // ==========================================
    // 初期化
    // ==========================================
    function init() {
        // DOMの読み込み完了を待つ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                insertSidebarTOC();
                insertMobileTOC();
                insertRelatedArticles();
                insertFooter();
                loadRelatedArticles();

                // TOCスクロール連動を初期化（少し遅延させる）
                setTimeout(initTOCScrollSync, 500);
            });
        } else {
            insertSidebarTOC();
            insertMobileTOC();
            insertRelatedArticles();
            insertFooter();
            loadRelatedArticles();

            // TOCスクロール連動を初期化（少し遅延させる）
            setTimeout(initTOCScrollSync, 500);
        }
    }

    init();
})();
