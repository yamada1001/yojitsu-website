/**
 * Comprehensive Fix Script
 * 1. Add missing <base> tag
 * 2. Remove article__related sections
 * 3. Ensure all files are consistent
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../blog/posts');

function getHtmlFiles(dir) {
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(dir, file));
}

function fixHTML(html) {
    let fixed = html;

    // 1. Add <base> tag if missing
    if (!fixed.includes('<base href')) {
        // Insert after <head> tag
        fixed = fixed.replace(
            /<head>/,
            '<head>\n    <base href="/yojitsu-website/">'
        );
    }

    // 2. Remove article__related sections
    fixed = fixed.replace(
        /\s*<!-- Related Articles -->[\s\S]*?<aside class="article__related">[\s\S]*?<\/aside>/g,
        ''
    );

    // Also remove without comment
    fixed = fixed.replace(
        /\s*<aside class="article__related">[\s\S]*?<\/aside>/g,
        ''
    );

    return fixed;
}

function processFiles() {
    const files = getHtmlFiles(POSTS_DIR);
    let fixedCount = 0;
    let errors = [];

    console.log('Comprehensive Fix Script');
    console.log('========================\n');

    files.forEach(file => {
        try {
            const filename = path.basename(file);
            const html = fs.readFileSync(file, 'utf8');
            const fixed = fixHTML(html);

            if (html !== fixed) {
                fs.writeFileSync(file, fixed, 'utf8');
                fixedCount++;
                console.log(`✓ Fixed: ${filename}`);
            } else {
                console.log(`  Skip: ${filename} (no changes needed)`);
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
