/**
 * Remove incorrect "株式会社" references
 * The company name is "余日（ヨジツ）" NOT "株式会社Yojitsu"
 */

const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip backup directories
            if (!file.includes('backup')) {
                getAllHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

const ROOT_DIR = path.join(__dirname, '..');
const files = getAllHtmlFiles(ROOT_DIR);

let fixedCount = 0;

console.log('Removing incorrect "株式会社" references');
console.log('========================================\n');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Replace variations
    let fixed = content;
    fixed = fixed.replace(/株式会社Yojitsu/g, '余日（ヨジツ）');
    fixed = fixed.replace(/株式会社余日/g, '余日（ヨジツ）');
    fixed = fixed.replace(/Yojitsu Co\., Ltd\./g, '余日（ヨジツ）');

    if (content !== fixed) {
        fs.writeFileSync(file, fixed, 'utf8');
        const relativePath = path.relative(ROOT_DIR, file);
        console.log(`✓ Fixed: ${relativePath}`);
        fixedCount++;
    }
});

console.log(`\n=== Summary ===`);
console.log(`Total files checked: ${files.length}`);
console.log(`Files fixed: ${fixedCount}`);
