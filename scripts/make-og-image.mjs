/**
 * 把 scripts/og-image.svg 转成 public/og-image.png（1200×630）。
 * 社交平台（LinkedIn、微信、X）只认 PNG/JPG，不认 SVG，所以必须转一次。
 *
 * 用法：node scripts/make-og-image.mjs
 * 依赖：sharp（Astro 自带；若提示缺失，运行 npm i -D sharp）
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const svg = await readFile(join(here, 'og-image.svg'));

const png = await sharp(svg, { density: 144 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ quality: 92, compressionLevel: 9 })
  .toBuffer();

await writeFile(join(root, 'public', 'og-image.png'), png);

console.log(`✓ public/og-image.png 已生成（${(png.length / 1024).toFixed(1)} KB）`);
