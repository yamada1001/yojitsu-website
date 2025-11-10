/**
 * Fix Base Tag Position
 * Move <base> tag to immediately after <head> opening tag
 * (before any CSS/JS links)
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../blog/posts');

function getHtmlFiles(dir) {
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(dir, file));
}

function fixBaseTagPosition(html) {
    // Remove any existing base tags
    let fixed = html.replace(/<base href="[^"]*">\n?\s*/g, '');

    // Insert base tag right after <head> tag and GTM script
    // Look for the GTM comment end
    if (fixed.includes('<!-- End Google Tag Manager -->')) {
        fixed = fixed.replace(
            /<!-- End Google Tag Manager -->\n/,
            '<!-- End Google Tag Manager -->\n    <base href="/yojitsu-website/">\n'
        );
    } else {
        // Fallback: insert right after <head>
        fixed = fixed.replace(
            /<head>\n/,
            '<head>\n    <base href="/yojitsu-website/">\n'
        );
    }

    return fixed;
}

function processFiles() {
    const files = getHtmlFiles(POSTS_DIR);
    let fixedCount = 0;
    let errors = [];

    console.log('Fix Base Tag Position Script');
    console.log('============================\n');

    files.forEach(file => {
        try {
            const filename = path.basename(file);
            const html = fs.readFileSync(file, 'utf8');
            const fixed = fixBaseTagPosition(html);

            if (html !== fixed) {
                fs.writeFileSync(file, fixed, 'utf8');
                fixedCount++;
                console.log(`✓ Fixed: ${filename}`);
            } else {
                console.log(`  Skip: ${filename} (already correct)`);
            }
        } catch (error) {
            errors.push({ file: path.basename(file), error: error.message });
            console.error(`✗ Error: ${path.basename(file)} - ${error.message}`);
        }
    });

    console.log(`\n=== Summary ===`);
    console.log(`Total files: ${files.length}`);
    console.log(`Fixed: ${fixedCount}`);
    console.log(`Errors: ${errors.length}`);

    if (errors.length > 0) {
        console.log(`\nErrors:`);
        errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
    }
}

processFiles();
