const fs = require('fs');
const path = require('path');

function checkFile(name, filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  console.log(`\n========================================`);
  console.log(`Page: ${name} (${filePath})`);
  console.log(`========================================`);
  
  const titles = html.match(/<title>.*?<\/title>/g) || [];
  console.log(`Titles found (${titles.length}):`);
  titles.forEach((t) => console.log(`  ${t}`));

  const ogTitles = html.match(/<meta\s+property="og:title"\s+content="[^"]*"/g) || [];
  ogTitles.forEach((m) => console.log(`  ${m}`));

  const ogImages = html.match(/<meta\s+property="og:image"\s+content="[^"]*"/g) || [];
  ogImages.forEach((m) => console.log(`  ${m}`));

  const twitterCards = html.match(/<meta\s+name="twitter:card"\s+content="[^"]*"/g) || [];
  twitterCards.forEach((m) => console.log(`  ${m}`));

  const twitterTitles = html.match(/<meta\s+name="twitter:title"\s+content="[^"]*"/g) || [];
  twitterTitles.forEach((m) => console.log(`  ${m}`));

  const twitterImages = html.match(/<meta\s+name="twitter:image"\s+content="[^"]*"/g) || [];
  twitterImages.forEach((m) => console.log(`  ${m}`));

  const icons = html.match(/<link\s+[^>]*rel="[^"]*icon[^"]*"[^>]*>/g) || [];
  console.log(`Icon links (${icons.length}):`);
  icons.forEach((i) => console.log(`  ${i}`));
}

checkFile('Home Landing Page', path.resolve('.next/server/app/index.html'));
checkFile('About Page', path.resolve('.next/server/app/about.html'));
checkFile('Contact Page', path.resolve('.next/server/app/contact.html'));
checkFile('Dashboard Page', path.resolve('.next/server/app/dashboard.html'));
checkFile('Terms Page', path.resolve('.next/server/app/terms.html'));
