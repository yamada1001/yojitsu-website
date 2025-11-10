/**
 * Blog Posts Refactoring Script
 * Removes inline code and replaces with external references
 */

const fs = require('fs');
const path = require('path');

// Configuration
const POSTS_DIR = path.join(__dirname, '../blog/posts');
const BACKUP_DIR = path.join(__dirname, '../blog/posts-backup');

/**
 * Get all HTML files in directory
 */
function getHtmlFiles(dir) {
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(dir, file));
}

/**
 * Create backup of all files
 */
function createBackup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const files = getHtmlFiles(POSTS_DIR);
    files.forEach(file => {
        const filename = path.basename(file);
        fs.copyFileSync(file, path.join(BACKUP_DIR, filename));
    });

    console.log(`✓ Backed up ${files.length} files to ${BACKUP_DIR}`);
}

/**
 * Refactor HTML content
 */
function refactorHTML(html) {
    let refactored = html;

    // 1. Remove GTM script from head
    refactored = refactored.replace(
        /<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\n/,
        ''
    );

    // 2. Remove GTM noscript from body
    refactored = refactored.replace(
        /<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\n/,
        ''
    );

    // 3. Remove inline structured data script
    refactored = refactored.replace(
        /<!-- Structured Data -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>\n/,
        ''
    );

    // 4. Add new CSS reference after blog.css
    if (!refactored.includes('blog-common.css')) {
        refactored = refactored.replace(
            /<link rel="stylesheet" href="src\/css\/blog\.css">/,
            '<link rel="stylesheet" href="src/css/blog.css">\n    <link rel="stylesheet" href="src/css/blog-common.css">'
        );
    }

    // 5. Replace inline styles with classes
    // Pink highlight box
    refactored = refactored.replace(
        /style="background: #fdf2f8; padding: 1\.5rem; border-radius: 8px; border-left: 4px solid #EC4899; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--pink"'
    );

    // Green highlight box
    refactored = refactored.replace(
        /style="background: #ecfdf5; padding: 1\.5rem; border-radius: 8px; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--green"'
    );

    // Gray info box
    refactored = refactored.replace(
        /style="background: #f8f8f8; padding: 1\.5rem; border-radius: 8px; border-left: 4px solid #8B7355; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--gray"'
    );

    // Plain gray box
    refactored = refactored.replace(
        /style="background: #f8f8f8; padding: 1\.5rem; border-radius: 8px; margin: 1\.5rem 0;"/g,
        'class="info-box"'
    );

    // Yellow warning box
    refactored = refactored.replace(
        /style="background: #FFF3CD; padding: 1\.5rem; border-radius: 8px; border-left: 4px solid #FFC107; margin: 1\.5rem 0;"/g,
        'class="warning-box"'
    );

    // Green success box
    refactored = refactored.replace(
        /style="background: #E8F5E9; padding: 1\.5rem; border-radius: 8px; margin: 1\.5rem 0;"/g,
        'class="success-box"'
    );

    refactored = refactored.replace(
        /style="background: #E8F5E9; padding: 1\.5rem; border-radius: 8px; border-left: 4px solid #4CAF50; margin: 1\.5rem 0;"/g,
        'class="success-box success-box--with-border"'
    );

    // Blue info box
    refactored = refactored.replace(
        /style="background: #f0f7ff; padding: 1\.5rem; border-radius: 8px; border-left: 4px solid #2196F3; margin-top: 2rem;"/g,
        'class="reference-box"'
    );

    refactored = refactored.replace(
        /style="padding: 1\.5rem; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #2196F3; margin-top: 2rem;"/g,
        'class="reference-box"'
    );

    // Light blue box
    refactored = refactored.replace(
        /style="background: #E3F2FD; padding: 1\.5rem; border-radius: 8px; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--light-blue"'
    );

    // Purple box
    refactored = refactored.replace(
        /style="background: #F3E5F5; padding: 1\.5rem; border-radius: 8px; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--purple"'
    );

    // Orange box
    refactored = refactored.replace(
        /style="background: #FFF3E0; padding: 1\.5rem; border-radius: 8px; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--orange"'
    );

    // Yellow box (different shade)
    refactored = refactored.replace(
        /style="background: #fef3c7; padding: 1\.5rem; border-radius: 8px; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--yellow"'
    );

    // Cyan box
    refactored = refactored.replace(
        /style="background: #ecfeff; padding: 1\.5rem; border-radius: 8px; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--cyan"'
    );

    // Gradient boxes
    refactored = refactored.replace(
        /style="background: linear-gradient\(135deg, #fdf2f8 0%, #fce7f3 100%\); padding: 2rem; border-radius: 12px; margin: 2rem 0;"/g,
        'class="highlight-box highlight-box--gradient-pink"'
    );

    refactored = refactored.replace(
        /style="background: linear-gradient\(135deg, #f8f8f8 0%, #e8e8e8 100%\); padding: 2rem; border-radius: 8px; border-left: 4px solid #EC4899; margin: 1\.5rem 0;"/g,
        'class="highlight-box highlight-box--gradient-gray"'
    );

    refactored = refactored.replace(
        /style="background: linear-gradient\(135deg, #E8F5E9 0%, #C8E6C9 100%\); padding: 2rem; border-radius: 8px; border-left: 4px solid #4CAF50; margin: 1\.5rem 0;"/g,
        'class="summary-box"'
    );

    // Replace margin, padding, color styles
    refactored = refactored.replace(/style="margin-top: 0;"/g, 'class="margin-top-0"');
    refactored = refactored.replace(/style="margin-bottom: 0;"/g, 'class="margin-bottom-0"');
    refactored = refactored.replace(/style="margin: 0; padding-left: 1\.5rem;"/g, 'class="list-no-margin"');
    refactored = refactored.replace(/style="margin-bottom: 0\.75rem;"/g, '');
    refactored = refactored.replace(/style="color: #666;"/g, 'class="text-gray"');
    refactored = refactored.replace(/style="font-size: 0\.9rem;"/g, 'class="text-small"');
    refactored = refactored.replace(/style="margin-left: 1\.5rem;"/g, 'class="margin-left-1"');
    refactored = refactored.replace(/style="font-weight: 500;"/g, 'class="font-weight-500"');

    // Icon colors - Remove inline styles completely
    refactored = refactored.replace(/ style="color: #EC4899; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #10B981; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #8B7355; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #2196F3; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #F59E0B; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #06B6D4; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #FFD700; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #d32f2f; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #2E7D32; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #4CAF50; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #1976D2; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #FFC107; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #8B5CF6; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #7B1FA2; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #E65100; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #C62828; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #FF9800; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #F57F17; margin-right: 0\.5rem;"/g, '');
    refactored = refactored.replace(/ style="color: #C2185B; margin-right: 0\.5rem;"/g, '');

    // Just margin-left for icons
    refactored = refactored.replace(/ style="margin-left: 0\.5rem;"/g, '');

    // CTA boxes
    refactored = refactored.replace(
        /style="background: #EC4899; color: white; padding: 2rem; border-radius: 8px; margin: 2rem 0; text-align: center;"/g,
        'class="cta-box"'
    );

    refactored = refactored.replace(
        /style="background: #8B7355; color: white; padding: 2rem; border-radius: 8px; margin: 2rem 0; text-align: center;"/g,
        'class="cta-box cta-box--brown"'
    );

    refactored = refactored.replace(
        /style="color: white; margin-top: 0;"/g,
        ''
    );

    refactored = refactored.replace(
        /style="margin-bottom: 1\.5rem;"/g,
        ''
    );

    refactored = refactored.replace(
        /style="display: inline-block; background: white; color: #EC4899; padding: 1rem 2rem; border-radius: 4px; text-decoration: none; font-weight: bold; transition: all 0\.3s;"/g,
        'class="cta-box__button"'
    );

    refactored = refactored.replace(
        /style="display: inline-block; background: white; color: #8B7355; padding: 1rem 2rem; border-radius: 4px; text-decoration: none; font-weight: bold; transition: all 0\.3s;"/g,
        'class="cta-box__button"'
    );

    // Code blocks
    refactored = refactored.replace(
        /style="background: #1E1E1E; color: #4EC9B0; padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: monospace;"/g,
        'class="code-block"'
    );

    refactored = refactored.replace(
        /style="background: #1E1E1E; color: #D4D4D4; padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: monospace; margin: 0\.5rem 0;"/g,
        'class="code-block"'
    );

    refactored = refactored.replace(
        /style="background: #E8F5E9; color: #2E7D32; padding: 1rem; border-radius: 4px; margin: 0\.5rem 0;"/g,
        'class="code-block code-block--light"'
    );

    refactored = refactored.replace(
        /style="background: #FFEBEE; color: #C62828; padding: 1rem; border-radius: 4px; margin: 0\.5rem 0;"/g,
        'class="code-block code-block--error"'
    );

    // Inline code
    refactored = refactored.replace(
        /style="background: #1E1E1E; color: #4EC9B0; padding: 0\.2rem 0\.5rem; border-radius: 3px;"/g,
        'class="code-inline"'
    );

    // 6. Remove Footer (will be generated by article-template.js)
    // Match both with and without comment
    refactored = refactored.replace(
        /(?:<!-- Footer -->\n)?[\s]*<footer class="footer">[\s\S]*?<\/footer>\n/,
        ''
    );

    // 7. Remove Share Buttons
    // Match both with and without comment
    refactored = refactored.replace(
        /(?:\s*<!-- Share Buttons -->\n)?\s*<div class="article__share">[\s\S]*?<\/div>\n\s*<\/div>\n/g,
        ''
    );

    // 8. Remove Floating TOC Button and Mobile TOC Modal
    // Match both with and without comment
    refactored = refactored.replace(
        /(?:<!-- Floating TOC Button \(Mobile\) -->\n)?[\s]*<button class="floating-toc-btn"[\s\S]*?<\/button>\n[\s]*(?:<!-- Mobile TOC Modal -->\n)?[\s]*<div class="mobile-toc-modal"[\s\S]*?<\/div>\n[\s]*<\/div>\n/,
        ''
    );

    // 9. Update scripts section - add GTM and structured data loaders before existing scripts
    refactored = refactored.replace(
        /<!-- Scripts -->[\s\S]*?(<\/body>)/,
        `<!-- Scripts -->
    <script src="src/js/gtm-loader.js"></script>
    <script src="src/js/structured-data.js"></script>
    <script src="src/js/blog-loader.js"></script>
    <script src="src/js/main.js"></script>
    <script src="src/js/blog.js"></script>
    <script src="src/js/article-template.js"></script>
$1`
    );

    return refactored;
}

/**
 * Process all HTML files
 */
function processFiles() {
    const files = getHtmlFiles(POSTS_DIR);
    let processedCount = 0;
    let errorCount = 0;

    files.forEach(file => {
        try {
            const filename = path.basename(file);
            console.log(`Processing: ${filename}`);

            const html = fs.readFileSync(file, 'utf8');
            const refactored = refactorHTML(html);

            fs.writeFileSync(file, refactored, 'utf8');
            processedCount++;
            console.log(`  ✓ Successfully processed`);
        } catch (error) {
            errorCount++;
            console.error(`  ✗ Error: ${error.message}`);
        }
    });

    console.log(`\n=== Summary ===`);
    console.log(`Total files: ${files.length}`);
    console.log(`Successfully processed: ${processedCount}`);
    console.log(`Errors: ${errorCount}`);
}

/**
 * Main execution
 */
function main() {
    console.log('Blog Posts Refactoring Script');
    console.log('==============================\n');

    // Create backup first
    createBackup();

    console.log('\nStarting refactoring...\n');
    processFiles();

    console.log('\n✓ Refactoring complete!');
    console.log(`Backup saved in: ${BACKUP_DIR}`);
}

// Run the script
main();
