/**
 * Structured Data Generator for Blog Articles
 * Generates JSON-LD structured data from article metadata
 */

(function() {
    'use strict';

    /**
     * Generate structured data from meta tags
     */
    function generateStructuredData() {
        // Get meta tags
        const getMetaContent = (property) => {
            const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
            return meta ? meta.getAttribute('content') : '';
        };

        // Get article data
        const title = getMetaContent('og:title') || document.title;
        const description = getMetaContent('og:description') || getMetaContent('description');
        const url = getMetaContent('og:url') || window.location.href;
        const image = getMetaContent('og:image');

        // Get date from article header
        const dateElement = document.querySelector('.article__date');
        const dateTime = dateElement ? dateElement.getAttribute('datetime') : '';
        const publishedDate = dateTime ? `${dateTime}T09:00:00+09:00` : '';

        // Create structured data object
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': title.replace(' | 余日（ヨジツ）', ''),
            'description': description,
            'url': url,
            'datePublished': publishedDate,
            'dateModified': publishedDate,
            'author': {
                '@type': 'Person',
                'name': '余日'
            },
            'publisher': {
                '@type': 'Organization',
                'name': '余日',
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://yamada1001.github.io/yojitsu-website/assets/images/logo.png'
                }
            }
        };

        // Add image if available
        if (image) {
            structuredData.image = image;
        }

        // Create script tag
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData, null, 2);

        // Insert into head
        document.head.appendChild(script);
    }

    // Execute on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', generateStructuredData);
    } else {
        generateStructuredData();
    }
})();
