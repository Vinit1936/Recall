const fs = require('fs');
const path = require('path');

async function generateCodeforces() {
  console.log('Fetching Codeforces problemset...');
  const res = await fetch('https://codeforces.com/api/problemset.problems');
  const data = await res.json();
  if (data.status !== 'OK') {
    console.error('Failed to fetch Codeforces problems:', data);
    return;
  }

  const problems = data.result.problems.map((p) => {
    let diff = 'MEDIUM';
    if (p.rating) {
      if (p.rating < 1200) diff = 'EASY';
      else if (p.rating > 1700) diff = 'HARD';
    }
    const code = `${p.contestId}${p.index}`;
    // Compute unique numeric ID for DB storage
    const charCode = p.index ? p.index.charCodeAt(0) - 64 : 1;
    const numericId = p.contestId * 100 + (charCode > 0 && charCode < 30 ? charCode : 1);

    return {
      id: code,
      numericId,
      contestId: p.contestId,
      index: p.index,
      title: p.name,
      difficulty: diff,
      rating: p.rating || null,
      topic: p.tags && p.tags.length > 0 ? p.tags[0] : 'General',
      url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
    };
  });

  const outPath = path.join(__dirname, '..', 'src', 'data', 'codeforces-problems.json');
  fs.writeFileSync(outPath, JSON.stringify(problems, null, 2));
  console.log(`Successfully saved ${problems.length} Codeforces problems to ${outPath}`);
}

generateCodeforces();
