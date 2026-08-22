const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Using browser binary:', CHROME_PATH);

// 1. Create HTML template for OG Image (1200x630)
const ogHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #080808;
      color: #f0f0f0;
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 72px;
    }

    /* Background effects */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 28px 28px;
      opacity: 0.6;
      pointer-events: none;
    }
    .bg-glow-orange {
      position: absolute;
      top: -100px;
      right: 20px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255, 107, 0, 0.16) 0%, rgba(255, 107, 0, 0) 70%);
      filter: blur(50px);
      pointer-events: none;
    }
    .bg-glow-bottom {
      position: absolute;
      bottom: -150px;
      left: 60px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
      filter: blur(50px);
      pointer-events: none;
    }

    /* Top Bar */
    .header {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-family: 'Geist Mono', monospace;
      font-size: 34px;
      font-weight: 600;
      letter-spacing: -0.03em;
      color: #ffffff;
      display: flex;
      align-items: baseline;
    }
    .logo-dot {
      color: #ff6b00;
    }
    .badge {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      color: #a3a3a3;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.09);
      padding: 7px 16px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .badge-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ff6b00;
      box-shadow: 0 0 10px #ff6b00;
    }

    /* Main Content */
    .main {
      position: relative;
      z-index: 10;
      margin-top: 10px;
    }
    .tagline {
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic;
      font-size: 70px;
      font-weight: 400;
      line-height: 1.08;
      color: #ffffff;
      margin-bottom: 18px;
      letter-spacing: -0.02em;
    }
    .description {
      font-family: 'Geist', sans-serif;
      font-size: 20px;
      line-height: 1.45;
      color: #8e8e93;
      max-width: 880px;
      font-weight: 400;
    }

    /* Interval Pills */
    .preview-strip {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 28px;
    }
    .interval-chip {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      padding: 7px 15px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .interval-chip.done {
      background: rgba(74, 222, 128, 0.1);
      color: #4ade80;
      border: 1px solid rgba(74, 222, 128, 0.25);
    }
    .interval-chip.active {
      background: rgba(255, 107, 0, 0.15);
      color: #ff8c33;
      border: 1px solid rgba(255, 107, 0, 0.4);
      box-shadow: 0 0 18px rgba(255, 107, 0, 0.25);
    }
    .interval-chip.upcoming {
      background: rgba(255, 255, 255, 0.03);
      color: #737373;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .interval-arrow {
      color: #404040;
      font-size: 14px;
    }

    /* Footer */
    .footer {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 20px;
    }
    .platforms {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .platform-item {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      color: #737373;
      letter-spacing: 0.04em;
    }
    .site-url {
      font-family: 'Geist Mono', monospace;
      font-size: 15px;
      font-weight: 500;
      color: #ff6b00;
      letter-spacing: -0.01em;
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="bg-glow-orange"></div>
  <div class="bg-glow-bottom"></div>

  <div class="header">
    <div class="logo">recall<span class="logo-dot">.</span></div>
    <div class="badge">
      <span class="badge-indicator"></span>
      Cognitive Spaced Repetition for DSA
    </div>
  </div>

  <div class="main">
    <h1 class="tagline">Never forget what you solved.</h1>
    <p class="description">
      Automated spaced repetition queue (+3, +7, +14, +30d) for LeetCode, Codeforces, HackerRank, GeeksForGeeks, and CodeChef.
    </p>

    <div class="preview-strip">
      <div class="interval-chip done">✓ Day 0 (Solved)</div>
      <span class="interval-arrow">→</span>
      <div class="interval-chip done">✓ +3 Days</div>
      <span class="interval-arrow">→</span>
      <div class="interval-chip active">● +7 Days (Due Today)</div>
      <span class="interval-arrow">→</span>
      <div class="interval-chip upcoming">+14 Days</div>
      <span class="interval-arrow">→</span>
      <div class="interval-chip upcoming">+30 Days (Mastered)</div>
    </div>
  </div>

  <div class="footer">
    <div class="platforms">
      <span class="platform-item">LEETCODE</span>
      <span style="color:#333">•</span>
      <span class="platform-item">CODEFORCES</span>
      <span style="color:#333">•</span>
      <span class="platform-item">GEEKSFORGEEKS</span>
      <span style="color:#333">•</span>
      <span class="platform-item">HACKERRANK</span>
      <span style="color:#333">•</span>
      <span class="platform-item">CODECHEF</span>
    </div>
    <div class="site-url">recallx.tech</div>
  </div>
</body>
</html>`;

// 2. Create Icon SVG template (monogram / mark for favicon & apple touch icon)
function getIconSvg(size) {
  const fontSize = Math.round(size * 0.58);
  const dotRadius = Math.max(2, Math.round(size * 0.08));
  const dotX = Math.round(size * 0.76);
  const dotY = Math.round(size * 0.70);

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#080808"/>
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" stroke="#222222" stroke-width="${Math.max(1, Math.round(size * 0.03))}"/>
    <text x="${Math.round(size * 0.38)}" y="${Math.round(size * 0.68)}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Geist Mono', monospace" font-weight="700" font-size="${fontSize}" fill="#ffffff" letter-spacing="-0.04em">r</text>
    <circle cx="${dotX}" cy="${dotY}" r="${dotRadius}" fill="#ff6b00"/>
  </svg>`;
}

// Function to generate multi-size ICO from PNG buffers
function createIcoBuffer(pngBuffers) {
  // ICO file header: 6 bytes
  // 0-1: Reserved (0)
  // 2-3: Type (1 = ICO)
  // 4-5: Number of images
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  // Each directory entry is 16 bytes
  const dirEntrySize = 16;
  const dirEntries = [];
  let currentOffset = 6 + pngBuffers.length * dirEntrySize;

  for (const { buffer, width, height } of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buffer.length, 8); // size in bytes
    entry.writeUInt32LE(currentOffset, 12); // offset
    dirEntries.push(entry);
    currentOffset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
}

async function run() {
  const tempHtmlPath = path.resolve(__dirname, 'temp_og.html');
  const tempPngPath = path.resolve(__dirname, 'temp_og.png');
  fs.writeFileSync(tempHtmlPath, ogHtml);

  console.log('1. Rendering OG image via headless browser at 1200x630...');
  execSync(
    `"${CHROME_PATH}" --headless=new --disable-gpu --virtual-time-budget=2500 --window-size=1200,630 --screenshot="${tempPngPath}" "file:///${tempHtmlPath.replace(/\\\\/g, '/')}"`,
    { stdio: 'inherit' }
  );

  // Save public/og-image.png
  await sharp(tempPngPath)
    .resize(1200, 630)
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.resolve('public/og-image.png'));
  console.log('✓ Created public/og-image.png (1200x630)');

  fs.unlinkSync(tempHtmlPath);
  fs.unlinkSync(tempPngPath);

  // 2. Generate Favicon & App Icons
  console.log('2. Generating crisp, branded icon assets...');
  
  // Apple Touch Icon: 180x180
  const appleSvg = Buffer.from(getIconSvg(180));
  const applePng = await sharp(appleSvg).png().toBuffer();
  fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), applePng);
  console.log('✓ Created public/apple-touch-icon.png (180x180)');

  // Icon 32x32
  const icon32Svg = Buffer.from(getIconSvg(32));
  const icon32Png = await sharp(icon32Svg).png().toBuffer();
  fs.writeFileSync(path.resolve('public/icon.png'), icon32Png);
  fs.writeFileSync(path.resolve('src/app/icon.png'), icon32Png);
  console.log('✓ Created public/icon.png and src/app/icon.png (32x32)');

  // Icon 16x16
  const icon16Svg = Buffer.from(getIconSvg(16));
  const icon16Png = await sharp(icon16Svg).png().toBuffer();

  // Icon 48x48 (for Google Search bot optimal favicon guidelines)
  const icon48Svg = Buffer.from(getIconSvg(48));
  const icon48Png = await sharp(icon48Svg).png().toBuffer();
  fs.writeFileSync(path.resolve('public/icon-48.png'), icon48Png);
  console.log('✓ Created public/icon-48.png (48x48)');

  // Icon 192x192 & 512x512 for PWA manifest
  const icon192Svg = Buffer.from(getIconSvg(192));
  const icon192Png = await sharp(icon192Svg).png().toBuffer();
  fs.writeFileSync(path.resolve('public/icon-192.png'), icon192Png);

  const icon512Svg = Buffer.from(getIconSvg(512));
  const icon512Png = await sharp(icon512Svg).png().toBuffer();
  fs.writeFileSync(path.resolve('public/icon-512.png'), icon512Png);
  console.log('✓ Created PWA icons (192x192, 512x512)');

  // Generate valid binary ICO with 16x16, 32x32, 48x48
  const icoBuffer = createIcoBuffer([
    { buffer: icon16Png, width: 16, height: 16 },
    { buffer: icon32Png, width: 32, height: 32 },
    { buffer: icon48Png, width: 48, height: 48 },
  ]);
  fs.writeFileSync(path.resolve('public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.resolve('src/app/favicon.ico'), icoBuffer);
  console.log(`✓ Created valid binary multi-size public/favicon.ico (${icoBuffer.length} bytes)`);

  console.log('All branding assets generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
