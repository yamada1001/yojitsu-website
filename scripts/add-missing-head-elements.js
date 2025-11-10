/**
 * Add Missing Head Elements
 * Ensures all HTML files have:
 * - Favicon
 * - Font Awesome
 * - Google Fonts
 * - Proper OGP images
 */

const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!file.includes('backup') && !file.includes('node_modules')) {
                getAllHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function addMissingElements(html, filePath) {
    let fixed = html;
    const isBlogPost = filePath.includes('blog/posts/');
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);

    // 1. Add Favicon if missing
    if (!fixed.includes('favicon')) {
        const faviconLine = '    <link rel="icon" type="image/svg+xml" href="favicon.svg">\n';

        // Insert after canonical or before stylesheets
        if (fixed.includes('<link rel="canonical"')) {
            fixed = fixed.replace(
                /(<link rel="canonical"[^>]*>\n)/,
                `$1\n${faviconLine}`
            );
        } else if (fixed.includes('<!-- Stylesheets -->')) {
            fixed = fixed.replace(
                /(<!-- Stylesheets -->\n)/,
                `    <!-- Favicon -->\n${faviconLine}\n$1`
            );
        } else if (fixed.includes('<link rel="stylesheet"')) {
            fixed = fixed.replace(
                /(<link rel="stylesheet")/,
                `    <!-- Favicon -->\n${faviconLine}\n$1`
            );
        }
        console.log(`  + Added favicon to ${relativePath}`);
    }

    // 2. Add Font Awesome if missing
    if (!fixed.includes('font-awesome') && !fixed.includes('fontawesome')) {
        const fontAwesomeLine = '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">\n';

        // Insert after last CSS link or before Google Fonts
        if (fixed.includes('<!-- Google Fonts -->')) {
            fixed = fixed.replace(
                /(<!-- Google Fonts -->\n)/,
                `    <!-- Font Awesome -->\n${fontAwesomeLine}\n$1`
            );
        } else if (fixed.includes('</head>')) {
            // Find last stylesheet and insert after
            const lastCssIndex = fixed.lastIndexOf('<link rel="stylesheet"');
            if (lastCssIndex !== -1) {
                const endOfLine = fixed.indexOf('\n', lastCssIndex);
                fixed = fixed.slice(0, endOfLine + 1) +
                        `\n    <!-- Font Awesome -->\n${fontAwesomeLine}` +
                        fixed.slice(endOfLine + 1);
            }
        }
        console.log(`  + Added Font Awesome to ${relativePath}`);
    }

    // 3. Add Google Fonts if missing (Noto Sans JP)
    if (!fixed.includes('Noto+Sans+JP') && !fixed.includes('Google Fonts')) {
        const googleFontsBlock = `
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
`;

        // Insert before 構造化データ or before </head>
        if (fixed.includes('<!-- 構造化データ -->')) {
            fixed = fixed.replace(
                /(<!-- 構造化データ -->\n)/,
                `${googleFontsBlock}\n$1`
            );
        } else if (fixed.includes('<script type="application/ld+json">')) {
            fixed = fixed.replace(
                /(<script type="application\/ld\+json">\n)/,
                `${googleFontsBlock}\n$1`
            );
        } else {
            fixed = fixed.replace(
                /(<\/head>)/,
                `${googleFontsBlock}\n$1`
            );
        }
        console.log(`  + Added Google Fonts to ${relativePath}`);
    }

    // 4. Fix OGP images if pointing to yojitsu.co.jp
    if (fixed.includes('yojitsu.co.jp/assets/images/')) {
        fixed = fixed.replace(
            /https:\/\/yojitsu\.co\.jp\/assets\/images\//g,
            'https://yamada1001.github.io/yojitsu-website/assets/images/'
        );
        console.log(`  + Fixed OGP image URLs in ${relativePath}`);
    }

    return fixed;
}

const ROOT_DIR = path.join(__dirname, '..');
const files = getAllHtmlFiles(ROOT_DIR);

let fixedCount = 0;

console.log('Adding Missing Head Elements');
console.log('============================\n');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fixed = addMissingElements(content, file);

    if (content !== fixed) {
        fs.writeFileSync(file, fixed, 'utf8');
        fixedCount++;
    }
});

console.log(`\n=== Summary ===`);
console.log(`Total files checked: ${files.length}`);
console.log(`Files modified: ${fixedCount}`);
