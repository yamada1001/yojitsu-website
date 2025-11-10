/**
 * Final Comprehensive Check
 * Verify all HTML files have required elements
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

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    const issues = [];
    const warnings = [];

    // Check 1: Base tag position
    const baseTagIndex = content.indexOf('<base href');
    const firstCssIndex = content.indexOf('<link rel="stylesheet"');
    if (baseTagIndex === -1) {
        issues.push('Missing <base> tag');
    } else if (firstCssIndex !== -1 && baseTagIndex > firstCssIndex) {
        issues.push('<base> tag after CSS links (should be before)');
    }

    // Check 2: Favicon
    if (!content.includes('favicon')) {
        warnings.push('Missing favicon');
    }

    // Check 3: Font Awesome
    if (!content.includes('font-awesome') && !content.includes('fontawesome')) {
        warnings.push('Missing Font Awesome');
    }

    // Check 4: Google Fonts
    if (!content.includes('Noto+Sans+JP') && !content.includes('Google Fonts')) {
        warnings.push('Missing Google Fonts');
    }

    // Check 5: Incorrect company name
    if (content.includes('株式会社Yojitsu') || content.includes('株式会社余日')) {
        issues.push('Incorrect company name (株式会社)');
    }

    // Check 6: Incorrect OGP URLs
    if (content.includes('yojitsu.co.jp/assets/images/')) {
        issues.push('Incorrect OGP image URL (should use github.io)');
    }

    return { relativePath, issues, warnings };
}

const ROOT_DIR = path.join(__dirname, '..');
const files = getAllHtmlFiles(ROOT_DIR);

console.log('Final Comprehensive Check');
console.log('========================\n');

const results = files.map(checkFile);
const hasIssues = results.filter(r => r.issues.length > 0);
const hasWarnings = results.filter(r => r.issues.length === 0 && r.warnings.length > 0);
const perfect = results.filter(r => r.issues.length === 0 && r.warnings.length === 0);

// Show issues
if (hasIssues.length > 0) {
    console.log(`❌ Files with ISSUES (${hasIssues.length}):\n`);
    hasIssues.forEach(r => {
        console.log(`  ${r.relativePath}`);
        r.issues.forEach(issue => console.log(`    ❌ ${issue}`));
        r.warnings.forEach(warn => console.log(`    ⚠️  ${warn}`));
        console.log('');
    });
}

// Show warnings
if (hasWarnings.length > 0) {
    console.log(`⚠️  Files with WARNINGS (${hasWarnings.length}):\n`);
    hasWarnings.forEach(r => {
        console.log(`  ${r.relativePath}`);
        r.warnings.forEach(warn => console.log(`    ⚠️  ${warn}`));
    });
    console.log('');
}

// Show perfect files
if (perfect.length > 0) {
    console.log(`✅ Perfect files (${perfect.length}):\n`);
    perfect.forEach(r => {
        console.log(`  ✓ ${r.relativePath}`);
    });
    console.log('');
}

// Summary
console.log('=== Summary ===');
console.log(`Total files: ${files.length}`);
console.log(`Perfect: ${perfect.length}`);
console.log(`With warnings: ${hasWarnings.length}`);
console.log(`With issues: ${hasIssues.length}`);

if (hasIssues.length > 0) {
    process.exit(1);
}
