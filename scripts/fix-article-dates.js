/**
 * articles.jsonの日付を修正
 * 2025-11-10の記事を適切な日付範囲に分散
 */

const fs = require('fs');
const path = require('path');

// articles.jsonを読み込み
const articlesPath = path.join(__dirname, '../blog/articles.json');
const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

console.log(`📝 総記事数: ${articlesData.articles.length}\n`);

// 2025-11-10の記事を抽出
const incorrectDateArticles = articlesData.articles.filter(a => a.date === '2025-11-10');
console.log(`❌ 2025-11-10の記事: ${incorrectDateArticles.length}件\n`);

// 日付を割り当て（2025-01-19から逆順で1日ずつ減らす）
let currentDate = new Date('2025-01-19');
let articlesUpdated = 0;

articlesData.articles.forEach(article => {
    if (article.date === '2025-11-10') {
        const newDate = currentDate.toISOString().split('T')[0];
        console.log(`📅 ${article.id}: 2025-11-10 → ${newDate}`);
        article.date = newDate;

        // 次の記事は1日前に
        currentDate.setDate(currentDate.getDate() - 1);
        articlesUpdated++;
    }
});

// 日付順（新しい順）にソート
articlesData.articles.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // 新しい順
});

console.log(`\n✅ ${articlesUpdated}件の記事の日付を更新しました。\n`);

console.log('最新10記事:');
articlesData.articles.slice(0, 10).forEach((a, i) => {
    console.log(`${i + 1}. ${a.date} - ${a.title.substring(0, 50)}...`);
});

// articles.jsonに書き込み
fs.writeFileSync(articlesPath, JSON.stringify(articlesData, null, 2), 'utf-8');

console.log(`\n✅ ${articlesPath} を更新しました。`);
