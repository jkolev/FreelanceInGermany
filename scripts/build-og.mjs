// Renders the default social preview image (scripts/og/default.svg) to public/og/default.png.
// Social platforms don't accept SVG previews, so the PNG is what og:image points to.
// Run with: npm run og
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

await mkdir('public/og', { recursive: true });
await sharp('scripts/og/default.svg', { density: 72 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile('public/og/default.png');
console.log('Wrote public/og/default.png (1200 × 630)');
