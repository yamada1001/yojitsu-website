/**
 * Blog Page JavaScript - Category-First Design
 * Category filtering and URL hash handling
 */

(function() {
    'use strict';

    // ==========================================
    // Category Name Mapping
    // ==========================================
    const CATEGORY_NAMES = {
        'ai': 'AI',
        'seo': 'SEO',
        'ads': '広告運用',
        'sns': 'SNS',
        'marketing': 'マーケティング',
        'web-production': 'Web制作',
        'web': 'Web制作',
        'misc': '雑記'
    };

    // ==========================================
    // DOM Elements
    // ==========================================
    const blogListTitle = document.getElementById('blogListTitle');
    const resetFilterBtn = document.getElementById('resetFilter');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const blogListSection = document.querySelector('.blog-list');
    const categoryGrid = document.querySelector('.category-cards__grid');

    // Current active category
    let activeCategory = null;

    console.log('Blog JavaScript initialized');

    // ==========================================
    // Filter Blog Cards by Category
    // ==========================================
    function filterBlogCards(category) {
        // 動的に生成された要素を毎回取得
        const blogCards = document.querySelectorAll('.blog-card');
        const categoryCards = document.querySelectorAll('.category-card');
        let visibleCount = 0;

        blogCards.forEach(card => {
            const cardCategory = card.dataset.category;

            if (!category || cardCategory === category) {
                card.classList.remove('hidden');
                card.style.display = '';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        console.log('Filtered to category:', category, '- Visible cards:', visibleCount);

        // Update title
        if (category && CATEGORY_NAMES[category]) {
            blogListTitle.textContent = `${CATEGORY_NAMES[category]}の記事`;
        } else {
            blogListTitle.textContent = 'すべての記事';
        }

        // Show/hide no results message
        if (noResultsMessage) {
            if (visibleCount === 0) {
                noResultsMessage.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'none';
            }
        }

        // Show/hide reset button
        if (resetFilterBtn) {
            if (category) {
                resetFilterBtn.style.display = 'inline-flex';
            } else {
                resetFilterBtn.style.display = 'none';
            }
        }

        // Update active category card
        categoryCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category && cardCategory === category) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        activeCategory = category;
    }

    // ==========================================
    // Scroll to Blog List with Smooth Animation
    // ==========================================
    function scrollToBlogList() {
        if (blogListSection) {
            const headerOffset = 100;
            const elementPosition = blogListSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ==========================================
    // Category Card Click Event (イベント委譲を使用)
    // ==========================================
    if (categoryGrid) {
        categoryGrid.addEventListener('click', (e) => {
            // クリックされた要素がカテゴリカードまたはその子要素か確認
            const categoryCard = e.target.closest('.category-card');

            if (categoryCard) {
                const category = categoryCard.dataset.category;
                console.log('Category card clicked:', category);

                // Update URL hash
                window.location.hash = category;

                // Filter cards
                filterBlogCards(category);

                // Scroll to blog list
                setTimeout(() => {
                    scrollToBlogList();
                }, 100);
            }
        });
    }

    // ==========================================
    // Reset Filter Button Click Event
    // ==========================================
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            console.log('Reset filter clicked');

            // Clear URL hash
            history.pushState('', document.title, window.location.pathname + window.location.search);

            // Show all cards
            filterBlogCards(null);

            // Scroll to blog list
            setTimeout(() => {
                scrollToBlogList();
            }, 100);
        });
    }

    // ==========================================
    // URL Hash Handling (for direct links)
    // ==========================================
    function handleUrlHash() {
        const hash = window.location.hash.substring(1); // Remove '#'

        if (hash && CATEGORY_NAMES[hash]) {
            console.log('URL hash detected:', hash);
            filterBlogCards(hash);

            // Scroll to blog list after a short delay
            setTimeout(() => {
                scrollToBlogList();
            }, 300);
        } else if (hash) {
            console.warn('Invalid category hash:', hash);
            // Clear invalid hash
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
    }

    // Handle hash on page load
    handleUrlHash();

    // Handle hash changes (browser back/forward)
    window.addEventListener('hashchange', handleUrlHash);

    // ==========================================
    // Article Page Features (TOC, Progress Bar, etc.)
    // ==========================================
    const articleContent = document.querySelector('.article__content');

    console.log('[DEBUG] Article content:', articleContent ? 'Found' : 'Not found');

    if (articleContent) {
        // ==========================================
        // Sidebar TOC Generation
        // ==========================================
        const sidebarToc = document.getElementById('sidebarToc');
        const headings = articleContent.querySelectorAll('h2, h3');

        console.log('[DEBUG] Sidebar TOC element:', sidebarToc ? 'Found' : 'Not found');
        console.log('[DEBUG] Headings count:', headings.length);

        if (sidebarToc && headings.length > 0) {
            console.log('✅ Generating sidebar TOC with', headings.length, 'headings');

            // サイドバー目次のタイトル
            const tocTitle = document.createElement('h2');
            tocTitle.className = 'sidebar-toc__title';
            tocTitle.textContent = '目次';

            // 目次リスト
            const tocList = document.createElement('ul');
            tocList.className = 'sidebar-toc__list';

            headings.forEach((heading, index) => {
                // 見出しにIDを追加
                if (!heading.id) {
                    heading.id = `section-${index}`;
                }

                const tocItem = document.createElement('li');
                tocItem.className = 'sidebar-toc__item';

                // h3の場合はインデント
                if (heading.tagName.toLowerCase() === 'h3') {
                    tocItem.classList.add('sidebar-toc__item--h3');
                }

                const tocLink = document.createElement('a');
                tocLink.href = `#${heading.id}`;
                tocLink.className = 'sidebar-toc__link';
                tocLink.textContent = heading.textContent;
                tocLink.dataset.target = heading.id;

                // スムーズスクロール
                tocLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.getElementById(heading.id);
                    if (target) {
                        const headerOffset = 120;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // URLを更新
                        history.pushState(null, null, `#${heading.id}`);
                    }
                });

                tocItem.appendChild(tocLink);
                tocList.appendChild(tocItem);
            });

            sidebarToc.appendChild(tocTitle);
            sidebarToc.appendChild(tocList);

            // ==========================================
            // Intersection Observer - アクティブ項目のハイライト
            // ==========================================
            const observerOptions = {
                rootMargin: '-120px 0px -60% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = entry.target.id;
                    const tocLink = sidebarToc.querySelector(`a[data-target="${id}"]`);

                    if (entry.isIntersecting) {
                        // すべてのアクティブクラスを削除
                        sidebarToc.querySelectorAll('.sidebar-toc__link').forEach(link => {
                            link.classList.remove('active');
                        });
                        // 現在の項目をアクティブに
                        if (tocLink) {
                            tocLink.classList.add('active');
                        }
                    }
                });
            }, observerOptions);

            // すべての見出しを監視
            headings.forEach(heading => {
                observer.observe(heading);
            });
        }

        // ==========================================
        // Mobile TOC (Floating Button & Modal)
        // ==========================================
        function initMobileTOC() {
            const floatingTocBtn = document.getElementById('floatingTocBtn');
            const mobileTocModal = document.getElementById('mobileTocModal');
            const closeMobileToc = document.getElementById('closeMobileToc');
            const mobileTocList = document.getElementById('mobileTocList');

            if (floatingTocBtn && mobileTocModal && headings.length > 0) {
            // モバイル目次リストを生成
            headings.forEach((heading, index) => {
                if (!heading.id) {
                    heading.id = `section-${index}`;
                }

                const tocItem = document.createElement('li');
                tocItem.className = 'mobile-toc-modal__item';

                if (heading.tagName.toLowerCase() === 'h3') {
                    tocItem.classList.add('mobile-toc-modal__item--h3');
                }

                const tocLink = document.createElement('a');
                tocLink.href = `#${heading.id}`;
                tocLink.className = 'mobile-toc-modal__link';
                tocLink.textContent = heading.textContent;

                // クリックでスムーズスクロール & モーダルを閉じる
                tocLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.getElementById(heading.id);
                    if (target) {
                        const headerOffset = 120;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // モーダルを閉じる
                        mobileTocModal.classList.remove('visible');
                        history.pushState(null, null, `#${heading.id}`);
                    }
                });

                tocItem.appendChild(tocLink);
                mobileTocList.appendChild(tocItem);
            });

            // スクロール停止検知（デバウンス）
            let scrollTimeout;
            let lastScrollPosition = window.pageYOffset;

            window.addEventListener('scroll', () => {
                // スクロール中はボタンを非表示
                floatingTocBtn.classList.remove('visible');

                // タイムアウトをクリア
                clearTimeout(scrollTimeout);

                // スクロール停止後2秒でボタンを表示
                scrollTimeout = setTimeout(() => {
                    const currentScrollPosition = window.pageYOffset;
                    // 100px以上スクロールしている場合のみ表示
                    if (currentScrollPosition > 100) {
                        floatingTocBtn.classList.add('visible');
                    }
                    lastScrollPosition = currentScrollPosition;
                }, 2000);
            });

            // ボタンクリックでモーダルを開く
            floatingTocBtn.addEventListener('click', () => {
                mobileTocModal.classList.add('visible');
            });

            // 閉じるボタン
            closeMobileToc.addEventListener('click', () => {
                mobileTocModal.classList.remove('visible');
            });

            // 背景クリックで閉じる
            mobileTocModal.addEventListener('click', (e) => {
                if (e.target === mobileTocModal) {
                    mobileTocModal.classList.remove('visible');
                }
            });
            }
        }

        // Wait for article-template.js to insert mobile TOC elements
        window.addEventListener('mobileTOCReady', initMobileTOC);

        // ==========================================
        // Reading Progress Bar
        // ==========================================
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background-color: var(--color-primary);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
        });

        // ==========================================
        // Copy Code Button
        // ==========================================
        const codeBlocks = document.querySelectorAll('pre code');

        codeBlocks.forEach(codeBlock => {
            const pre = codeBlock.parentElement;

            const copyButton = document.createElement('button');
            copyButton.textContent = 'コピー';
            copyButton.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 4px 12px;
                font-size: 12px;
                background-color: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            `;

            copyButton.addEventListener('mouseenter', () => {
                copyButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            });

            copyButton.addEventListener('mouseleave', () => {
                copyButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });

            copyButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(codeBlock.textContent);
                    copyButton.textContent = 'コピー完了！';

                    setTimeout(() => {
                        copyButton.textContent = 'コピー';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                    copyButton.textContent = 'エラー';

                    setTimeout(() => {
                        copyButton.textContent = 'コピー';
                    }, 2000);
                }
            });

            pre.style.position = 'relative';
            pre.appendChild(copyButton);
        });

        // ==========================================
        // External Link Icons
        // ==========================================
        const links = articleContent.querySelectorAll('a[href^="http"]');

        links.forEach(link => {
            // yamada1001.github.io/yojitsu-website 以外のドメインを外部リンクとして扱う
            const isExternal = !link.href.includes('yamada1001.github.io/yojitsu-website');

            if (isExternal) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');

                const icon = document.createElement('span');
                icon.innerHTML = ' ↗';
                icon.style.fontSize = '0.8em';
                link.appendChild(icon);
            }
        });
    }

    // ==========================================
    // 全体の外部リンク制御（記事ページ以外でも機能）
    // ==========================================
    function setupExternalLinks() {
        // すべての記事コンテンツ内のリンクを対象にする
        const contentSelectors = ['.article__content', '.blog-card__excerpt', '.article__excerpt'];

        contentSelectors.forEach(selector => {
            const containers = document.querySelectorAll(selector);

            containers.forEach(container => {
                const links = container.querySelectorAll('a[href^="http"]');

                links.forEach(link => {
                    // yamada1001.github.io/yojitsu-website 以外のドメインを外部リンクとして扱う
                    const isExternal = !link.href.includes('yamada1001.github.io/yojitsu-website');

                    if (isExternal && !link.hasAttribute('data-external-processed')) {
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                        link.setAttribute('data-external-processed', 'true');
                    }
                });
            });
        });
    }

    // 初回実行
    setupExternalLinks();

    // DOMの変更を監視して新しく追加されたリンクにも適用
    const observer = new MutationObserver(() => {
        setupExternalLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ==========================================
    // Lazy Load Images with Fade-in Effect
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';

                    img.onload = () => {
                        img.style.opacity = '1';
                    };

                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    } else {
                        img.style.opacity = '1';
                    }

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        const lazyImages = document.querySelectorAll('.blog-card__image img[data-src], .article__content img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ==========================================
    // 日付の自動フォーマット
    // ==========================================
    const articleDates = document.querySelectorAll('.article__date');

    articleDates.forEach(dateElement => {
        const datetime = dateElement.getAttribute('datetime');

        if (datetime) {
            // datetime属性から日付を取得してフォーマット
            const date = new Date(datetime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            // YYYY.MM.DD形式で表示
            dateElement.textContent = `${year}.${month}.${day}`;

            console.log('Date formatted:', datetime, '->', dateElement.textContent);
        }
    });

    // ==========================================
    // 更新日の自動表示
    // ==========================================
    const articleMeta = document.querySelector('.article__meta');

    if (articleMeta) {
        // Structured Dataから更新日を取得
        const structuredData = document.querySelector('script[type="application/ld+json"]');

        if (structuredData) {
            try {
                const data = JSON.parse(structuredData.textContent);
                const publishedDate = data.datePublished;
                const modifiedDate = data.dateModified;

                // 投稿日と更新日が異なる場合のみ更新日を表示
                if (publishedDate && modifiedDate && publishedDate !== modifiedDate) {
                    const modDate = new Date(modifiedDate);
                    const year = modDate.getFullYear();
                    const month = String(modDate.getMonth() + 1).padStart(2, '0');
                    const day = String(modDate.getDate()).padStart(2, '0');

                    // 更新日を追加
                    const updateInfo = document.createElement('span');
                    updateInfo.className = 'article__updated';
                    updateInfo.innerHTML = `<i class="fas fa-sync-alt" style="margin-right: 0.3rem;"></i>更新: ${year}.${month}.${day}`;
                    updateInfo.style.marginLeft = '1rem';
                    updateInfo.style.fontSize = '0.875rem';
                    updateInfo.style.color = 'var(--color-text-light)';

                    articleMeta.appendChild(updateInfo);

                    console.log('Update date displayed:', modifiedDate);
                }
            } catch (error) {
                console.error('Failed to parse structured data:', error);
            }
        }
    }

    // ==========================================
    // ブログ記事検索機能
    // ==========================================
    const searchInput = document.getElementById('blogSearchInput');
    const searchClear = document.getElementById('blogSearchClear');
    const searchResults = document.getElementById('blogSearchResults');

    if (searchInput && window.blogLoader) {
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            // クリアボタンの表示/非表示
            if (query.length > 0) {
                searchClear.style.display = 'flex';
            } else {
                searchClear.style.display = 'none';
                searchResults.style.display = 'none';
                return;
            }

            // デバウンス処理
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });

        // クリアボタン
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.style.display = 'none';
                searchResults.style.display = 'none';
                searchInput.focus();
            });
        }

        // 検索実行
        function performSearch(query) {
            if (!query || query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            window.blogLoader.loadArticles().then(() => {
                const articles = window.blogLoader.articlesData;
                const queryLower = query.toLowerCase();

                // タイトル、抜粋、カテゴリで検索
                const results = articles.filter(article => {
                    return (
                        article.title.toLowerCase().includes(queryLower) ||
                        article.excerpt.toLowerCase().includes(queryLower) ||
                        article.categoryLabel.toLowerCase().includes(queryLower)
                    );
                });

                displaySearchResults(results, query);
            });
        }

        // 検索結果表示
        function displaySearchResults(results, query) {
            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="blog-search__no-results">
                        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.3;"></i>
                        <p>「${query}」に一致する記事が見つかりませんでした</p>
                    </div>
                `;
                searchResults.style.display = 'block';
                return;
            }

            const categoryColors = {
                'ai': '#8B5CF6',
                'seo': '#10B981',
                'ads': '#F59E0B',
                'sns': '#06B6D4',
                'marketing': '#EC4899',
                'web-production': '#6366F1',
                'misc': '#8B7355'
            };

            const resultsHTML = `
                <div class="blog-search__results-count">
                    ${results.length}件の記事が見つかりました
                </div>
                ${results.map(article => {
                    const categoryColor = categoryColors[article.category] || '#8B7355';
                    return `
                        <div class="blog-search__result-item">
                            <a href="${article.path}" class="blog-search__result-link">
                                <div class="blog-search__result-title">${article.title}</div>
                                <div class="blog-search__result-excerpt">${article.excerpt}</div>
                                <div class="blog-search__result-meta">
                                    <span class="blog-search__result-category" style="background: ${categoryColor}20; color: ${categoryColor};">
                                        ${article.categoryLabel}
                                    </span>
                                    <span class="blog-search__result-date">${article.date}</span>
                                </div>
                            </a>
                        </div>
                    `;
                }).join('')}
            `;

            searchResults.innerHTML = resultsHTML;
            searchResults.style.display = 'block';
        }

        // ESCキーで検索結果を閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchResults.style.display === 'block') {
                searchInput.value = '';
                searchClear.style.display = 'none';
                searchResults.style.display = 'none';
            }
        });

        // 検索結果外をクリックで閉じる
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    console.log('Blog JavaScript setup complete');

})();
