const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createIcoBuffer(pngBuffers) {
  // ICO file header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(pngBuffers.length, 4); // Count

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
    entry.writeUInt16LE(32, 6); // bpp = 32
    entry.writeUInt32LE(buffer.length, 8); // size in bytes
    entry.writeUInt32LE(currentOffset, 12); // offset
    dirEntries.push(entry);
    currentOffset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
}

async function run() {
  const logoPath = path.resolve('public/logo.png');
  if (!fs.existsSync(logoPath)) {
    throw new Error('public/logo.png not found');
  }

  console.log('Generating icons from public/logo.png with RGBA...');

  // Ensure alpha channel (RGBA) so Next.js Turbopack / image-rs can decode it without errors
  const resizePng = async (size) => {
    return await sharp(logoPath)
      .ensureAlpha()
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  const [buf16, buf32, buf48, buf180, buf192, buf512] = await Promise.all([
    resizePng(16),
    resizePng(32),
    resizePng(48),
    resizePng(180),
    resizePng(192),
    resizePng(512),
  ]);

  // Save standalone PNG icons
  fs.writeFileSync(path.resolve('public/icon.png'), buf32);
  fs.writeFileSync(path.resolve('src/app/icon.png'), buf32);
  console.log('✓ public/icon.png & src/app/icon.png (32x32 RGBA)');

  fs.writeFileSync(path.resolve('public/icon-48.png'), buf48);
  console.log('✓ public/icon-48.png (48x48 RGBA)');

  fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), buf180);
  console.log('✓ public/apple-touch-icon.png (180x180 RGBA)');

  fs.writeFileSync(path.resolve('public/icon-192.png'), buf192);
  console.log('✓ public/icon-192.png (192x192 RGBA)');

  fs.writeFileSync(path.resolve('public/icon-512.png'), buf512);
  console.log('✓ public/icon-512.png (512x512 RGBA)');

  // Generate valid binary ICO containing 16x16, 32x32, 48x48 RGBA PNGs
  const icoBuffer = createIcoBuffer([
    { buffer: buf16, width: 16, height: 16 },
    { buffer: buf32, width: 32, height: 32 },
    { buffer: buf48, width: 48, height: 48 },
  ]);

  fs.writeFileSync(path.resolve('public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.resolve('src/app/favicon.ico'), icoBuffer);
  console.log(`✓ public/favicon.ico & src/app/favicon.ico (${icoBuffer.length} bytes)`);

  console.log('All icons generated from logo.png successfully!');
}

run().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
