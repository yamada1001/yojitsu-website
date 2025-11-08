/**
 * Yojitsu Modern Website - Main JavaScript
 * Features: Loading animation, custom cursor, scroll animations, smooth interactions
 */

(function() {
    'use strict';

    // ==========================================
    // Loading Animation
    // ==========================================
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 2000);
    });

    // ==========================================
    // Custom Cursor (Desktop only)
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.getElementById('cursor');
        const cursorFollower = document.getElementById('cursorFollower');

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Smooth cursor movement
            cursorX += (mouseX - cursorX) * 0.5;
            cursorY += (mouseY - cursorY) * 0.5;

            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                cursorFollower.classList.remove('active');
            });
        });
    }

    // ==========================================
    // Header Scroll Effect - Show on Scroll Stop
    // ==========================================
    const header = document.getElementById('header');
    let lastScroll = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // スクロール中はヘッダーを非表示
        header.classList.remove('visible');

        // スクロールが一定以上の場合のみ表示対象
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // スクロール停止検知（デバウンス）
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // スクロール停止後2秒でヘッダーを表示
            if (currentScroll > 50) {
                header.classList.add('visible');
            }
        }, 2000);

        lastScroll = currentScroll;
    });

    // ==========================================
    // Mobile Navigation
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================
    // Smooth Scroll
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // Scroll Reveal Animation
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('[data-scroll-reveal]');
    revealElements.forEach(el => scrollRevealObserver.observe(el));

    // ==========================================
    // Counter Animation for Stats
    // ==========================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueElement = entry.target;
                const target = parseInt(valueElement.getAttribute('data-count'));
                animateCounter(valueElement, target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        statObserver.observe(el);
    });

    // ==========================================
    // Form Validation
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const formFields = {
            name: {
                element: document.getElementById('name'),
                error: document.getElementById('nameError'),
                validate: (value) => {
                    if (!value.trim()) return 'お名前を入力してください';
                    if (value.trim().length < 2) return 'お名前は2文字以上で入力してください';
                    return '';
                }
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('emailError'),
                validate: (value) => {
                    if (!value.trim()) return 'メールアドレスを入力してください';
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) return '正しいメールアドレスを入力してください';
                    return '';
                }
            },
            service: {
                element: document.getElementById('service'),
                error: document.getElementById('serviceError'),
                validate: (value) => {
                    if (!value) return 'ご相談内容を選択してください';
                    return '';
                }
            },
            message: {
                element: document.getElementById('message'),
                error: document.getElementById('messageError'),
                validate: (value) => {
                    if (!value.trim()) return 'メッセージを入力してください';
                    if (value.trim().length < 10) return 'メッセージは10文字以上で入力してください';
                    return '';
                }
            },
            privacy: {
                element: document.getElementById('privacy'),
                error: document.getElementById('privacyError'),
                validate: (checked) => {
                    if (!checked) return 'プライバシーポリシーに同意してください';
                    return '';
                }
            }
        };

        const clearError = (field) => {
            if (formFields[field]?.error) {
                formFields[field].error.textContent = '';
                formFields[field].element.classList.remove('error');
            }
        };

        const showError = (field, message) => {
            if (formFields[field]?.error) {
                formFields[field].error.textContent = message;
                formFields[field].element.classList.add('error');
            }
        };

        const validateField = (field) => {
            const fieldData = formFields[field];
            if (!fieldData) return true;

            const value = field === 'privacy'
                ? fieldData.element.checked
                : fieldData.element.value;

            const errorMessage = fieldData.validate(value);

            if (errorMessage) {
                showError(field, errorMessage);
                return false;
            } else {
                clearError(field);
                return true;
            }
        };

        // Real-time validation
        Object.keys(formFields).forEach(field => {
            const element = formFields[field].element;

            if (field === 'privacy') {
                element.addEventListener('change', () => validateField(field));
            } else {
                element.addEventListener('blur', () => validateField(field));
                element.addEventListener('input', () => {
                    if (formFields[field].error.textContent) {
                        clearError(field);
                    }
                });
            }
        });

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            Object.keys(formFields).forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                const firstError = contactForm.querySelector('.form-error:not(:empty)');
                if (firstError) {
                    const errorField = firstError.previousElementSibling;
                    if (errorField) {
                        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        errorField.focus();
                    }
                }
                return;
            }

            // Collect form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.querySelector('.btn__text').textContent;
            submitButton.querySelector('.btn__text').textContent = '送信中...';
            submitButton.disabled = true;

            try {
                // TODO: Replace with your actual form submission endpoint
                // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });

                // Simulating API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Success message
                showSuccessMessage();
                contactForm.reset();

            } catch (error) {
                alert('送信中にエラーが発生しました。\nお手数ですが、時間をおいて再度お試しください。');
                console.error('Form submission error:', error);
            } finally {
                submitButton.querySelector('.btn__text').textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    function showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            text-align: center;
            animation: fadeInUp 0.5s ease;
        `;
        message.innerHTML = `
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 700;">送信完了</h3>
            <p>お問い合わせありがとうございます。<br>1〜2営業日以内にご返信いたします。</p>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) translateY(-20px)';
            message.style.transition = 'all 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // Parallax Effect for Hero Background
    // ==========================================
    const heroGraphic = document.querySelector('.hero__graphic');
    if (heroGraphic) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroGraphic.style.transform = `translateY(${rate}px)`;
        });
    }

    // ==========================================
    // Service Modal
    // ==========================================
    const serviceItems = document.querySelectorAll('.service-item[data-service]');
    const serviceModal = document.getElementById('serviceModal');
    const serviceModalBody = document.getElementById('serviceModalBody');
    const serviceModalClose = serviceModal?.querySelector('.service-modal__close');
    const serviceModalOverlay = serviceModal?.querySelector('.service-modal__overlay');

    const serviceData = {
        seo: {
            title: 'SEO対策',
            description: 'Googleなどの検索エンジンで上位表示を実現し、質の高いオーガニックトラフィックを獲得します。',
            services: [
                'キーワード調査・戦略立案',
                'テクニカルSEO（サイト構造最適化）',
                'コンテンツSEO（記事制作・最適化）',
                '内部リンク設計',
                '競合分析・改善提案'
            ],
            note: '中長期的な視点で、持続可能な集客基盤を構築します。',
            relatedArticles: [
                { title: 'SEOは終わった？AI時代の検索市場の真実', url: 'blog/posts/seo-future-2025.html' },
                { title: 'SEO対策の基本：検索順位を上げるための5つのポイント', url: 'blog/posts/seo-basics.html' },
                { title: 'メディアミックス×エンティティ×セブンヒッツ理論で実現する統合マーケティング戦略', url: 'blog/posts/media-mix-seven-hits.html' }
            ]
        },
        ads: {
            title: '広告運用代行',
            description: 'Google広告、Meta広告（Facebook/Instagram）など、各種Web広告の戦略設計から運用まで一貫してサポートします。',
            services: [
                'Google広告（検索・ディスプレイ・YouTube）',
                'Meta広告（Facebook・Instagram）',
                'Yahoo!広告',
                '広告クリエイティブ制作',
                'A/Bテスト・分析・改善'
            ],
            note: 'ROI（投資対効果）を重視した、無駄のない広告運用を実現します。'
        },
        planning: {
            title: 'プランニング',
            description: 'ビジネス目標達成のための包括的なWebマーケティング戦略を立案します。',
            services: [
                '市場調査・競合分析',
                'ターゲット顧客分析',
                'KPI設計・目標設定',
                '施策ロードマップ作成',
                '予算配分の最適化提案'
            ],
            note: 'データに基づいた戦略で、確実に成果を出すための道筋を描きます。',
            relatedArticles: [
                { title: 'プランナーとは？提案活動の全貌', url: 'blog/posts/what-is-planner.html' },
                { title: 'Webマーケターとは？仕事内容をわかりやすく解説', url: 'blog/posts/what-is-web-marketer.html' }
            ]
        },
        sns: {
            title: 'SNS運用代行',
            description: 'Instagram、X（Twitter）、FacebookなどのSNSアカウントの運用代行を行い、ブランド認知とファンエンゲージメントを向上させます。',
            services: [
                'コンテンツ企画・制作',
                '投稿スケジュール管理',
                'コメント対応・コミュニケーション',
                'インフルエンサーマーケティング',
                '分析レポート・改善提案'
            ],
            note: 'ブランドの世界観を大切にしながら、フォロワーとの関係性を深めます。'
        },
        crm: {
            title: 'CRM導入支援',
            description: '顧客情報を一元管理し、営業・マーケティング活動を効率化するCRMシステムの導入をサポートします。',
            services: [
                'CRMツール選定支援',
                '初期設定・カスタマイズ',
                'データ移行サポート',
                '運用トレーニング',
                '活用方法のコンサルティング'
            ],
            note: 'HubSpot、Salesforceなど、各種CRMツールに対応しています。'
        },
        website: {
            title: 'サイト制作/ディレクション',
            description: 'コーポレートサイト、LP（ランディングページ）、ECサイトなど、目的に応じたWebサイトを制作します。',
            services: [
                '要件定義・戦略設計',
                'デザイン・UI/UX設計',
                'コーディング・実装',
                'CMS導入（WordPress等）',
                '公開後の運用・保守サポート'
            ],
            note: 'マーケティング視点を取り入れた、成果の出るWebサイトを制作します。'
        },
        pm: {
            title: 'PM/ディレクション',
            description: 'Webプロジェクト全体のプロジェクトマネジメントとディレクションを行い、品質・納期・予算の最適化を実現します。',
            services: [
                'プロジェクト計画立案',
                'チーム管理・リソース最適化',
                '進捗管理・品質管理',
                'ステークホルダー調整',
                'リスク管理・課題解決'
            ],
            note: '複数のプロジェクトや大規模案件において、円滑な進行と高品質な成果物を保証します。',
            relatedArticles: [
                { title: 'PMって何してくれるの？プロジェクト管理の役割', url: 'blog/posts/what-is-pm.html' }
            ]
        }
    };

    function openServiceModal(serviceKey) {
        const service = serviceData[serviceKey];
        if (!service) return;

        const servicesHTML = service.services.map(s => `<li>${s}</li>`).join('');

        let relatedArticlesHTML = '';
        if (service.relatedArticles && service.relatedArticles.length > 0) {
            const articlesListHTML = service.relatedArticles.map(article =>
                `<li><a href="${article.url}" style="color: var(--color-primary); text-decoration: underline;">→ ${article.title}</a></li>`
            ).join('');

            relatedArticlesHTML = `
                <div style="background: var(--color-bg-alt); padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.125rem;">関連記事</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${articlesListHTML}
                    </ul>
                </div>
            `;
        }

        serviceModalBody.innerHTML = `
            <h2>${service.title}</h2>
            <p>${service.description}</p>
            <ul class="service-list">
                ${servicesHTML}
            </ul>
            <p class="service-note">${service.note}</p>
            ${relatedArticlesHTML}
        `;

        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeServiceModal() {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const serviceKey = item.dataset.service;
            openServiceModal(serviceKey);
        });
    });

    if (serviceModalClose) {
        serviceModalClose.addEventListener('click', closeServiceModal);
    }

    if (serviceModalOverlay) {
        serviceModalOverlay.addEventListener('click', closeServiceModal);
    }

    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
            closeServiceModal();
        }
    });

    // ==========================================
    // Performance: Debounce Function
    // ==========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll events
    window.addEventListener('scroll', debounce(() => {
        // Additional scroll-based logic can go here
    }, 10));

    // ==========================================
    // Accessibility: Skip to Main Content
    // ==========================================
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: fixed;
        top: -100px;
        left: 0;
        background: var(--color-primary);
        color: white;
        padding: 1rem;
        z-index: 10000;
        transition: top 0.3s ease;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ==========================================
    // Blog Category Filter
    // ==========================================
    const blogCategoryTabs = document.querySelectorAll('.blog-category-tab');
    const blogCards = document.querySelectorAll('.blog-card');

    // Blog post data with categories - 実際の記事に合わせて設定
    const blogPosts = [
        { element: blogCards[0], category: 'ai', date: new Date('2025-01-22'), title: 'AIで変わるコンテンツマーケティング' },
        { element: blogCards[1], category: 'ai', date: new Date('2025-01-20'), title: 'ChatGPT・Claude活用術' },
        { element: blogCards[2], category: 'seo', date: new Date('2025-01-15'), title: 'SEO対策の基本' },
        { element: blogCards[3], category: 'ads', date: new Date('2025-01-10'), title: 'Google広告の費用対効果' },
        { element: blogCards[4], category: 'sns', date: new Date('2025-01-05'), title: 'SNS運用で成果を出す' }
    ];

    if (blogCategoryTabs.length > 0 && blogCards.length > 0) {
        blogCategoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const selectedCategory = tab.dataset.category;

                // Update active tab
                blogCategoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Filter blog cards - 最大3つまで表示
                let visibleCount = 0;
                blogCards.forEach((card, index) => {
                    const post = blogPosts[index];

                    // カテゴリが一致するか、すべてを選択している場合
                    if ((selectedCategory === 'all' || post.category === selectedCategory) && visibleCount < 3) {
                        card.style.display = 'block';
                        visibleCount++;
                        // Re-trigger animation
                        card.style.animation = 'none';
                        setTimeout(() => {
                            card.style.animation = '';
                        }, 10);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // Console Easter Egg
    // ==========================================
    console.log(
        '%c余日（ヨジツ）',
        'font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
    );
    console.log('%cビジネスに余白を生む', 'font-size: 14px; color: #a0aec0;');
    console.log('%cWebサイトに興味を持っていただきありがとうございます！', 'font-size: 12px; color: #667eea;');

})();
