// Builds the bitmap icons from public/favicon.svg:
//   public/favicon.ico          16, 32 and 48 px (PNG images inside an ICO container)
//   public/apple-touch-icon.png 180 px, full-bleed square (iOS rounds the corners itself)
// Run with: npm run icons
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = await readFile('public/favicon.svg');

const png = (size) => sharp(svg, { density: 300 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// ICO container with embedded PNGs (supported by all current browsers)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((img, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0); // width
  e.writeUInt8(sizes[i], 1); // height
  e.writeUInt8(0, 2); // palette colors
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // color planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(img.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += img.length;
  return e;
});
await writeFile('public/favicon.ico', Buffer.concat([header, ...entries, ...images]));

// Apple touch icon: square, no transparency, slightly smaller "F" so it isn't cropped by the rounded mask
const touch = Buffer.from(
  svg
    .toString()
    .replace('rx="14"', 'rx="0"')
    .replace('<path ', '<path transform="translate(6.4 6.4) scale(0.8)" '),
);
await sharp(touch, { density: 300 }).resize(180, 180).flatten({ background: '#0f6e6e' }).png().toFile('public/apple-touch-icon.png');

console.log('Wrote public/favicon.ico (16, 32, 48 px) and public/apple-touch-icon.png (180 px)');
