/**
 * 页面级 SEO 审计：检查每个已构建页面的
 *   title 长度 / description 长度 / H1 数量 / 标题层级 / 正文长度 / 图片 alt / 内链数量
 *
 * 这些是最容易做错、又最直接影响 Google 排名和点击率的东西。
 * 用法：npm run build 之后运行 node scripts/audit-seo.mjs
 */

import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const dist = fileURLToPath(new URL('../dist', import.meta.url));

/* ---------------- 工具函数 ---------------- */

/** 把 HTML 实体还原成真实字符，否则 &amp; 会被算成 5 个宽度 */
function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

/** 中日韩字符按 2 个宽度计算，用来估算搜索结果里的实际占位 */
function displayWidth(text) {
  let width = 0;
  for (const char of text) {
    width += /[\u3000-\u9fff\uff00-\uffef]/.test(char) ? 2 : 1;
  }
  return width;
}

/** 统计正文规模：西文按词数、中文按字数 */
function contentUnits(text) {
  const cjk = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latin = text
    .replace(/[\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9]/.test(w)).length;
  return { cjk, latin, total: cjk + latin };
}

async function walkHtml(dir, base = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await walkHtml(join(dir, entry.name), rel)));
    else if (entry.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

/* ---------------- 审计规则 ---------------- */

const TITLE = { min: 15, warn: 60, error: 75 };
const DESC = { min: 50, warn: 160, error: 200 };
const BODY = { thin: 300, good: 600 };

/**
 * 这些页面天然偏薄，正文少是正常的，不算问题：
 *  - 列表聚合页：内容在卡片里，靠内链和标题发挥作用
 *  - 法律页：不需要靠篇幅排名
 * 不加这个豁免，审计就会一直喊狼来了，真正的薄内容问题反而被淹没。
 */
const THIN_CONTENT_OK = [
  /^$/,
  /^404$/,
  /^insights$/,
  /^services$/,
  /^work$/,
  /^privacy$/,
  /^zh$/,
  /^zh\/insights$/,
  /^zh\/services$/,
  /^zh\/work$/,
  /^zh\/privacy$/,
];

const rows = [];
const problems = [];

const files = (await walkHtml(dist)).sort();

for (const file of files) {
  const html = await readFile(join(dist, file), 'utf8');
  const isNoindex = /name="robots" content="noindex/.test(html);

  const title = decodeEntities(
    (html.match(/<title>([\s\S]*?)<\/title>/) ?? [])[1]?.trim() ?? ''
  );
  const description = decodeEntities(
    (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1]?.trim() ?? ''
  );

  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  const main = mainMatch?.[1] ?? '';

  const plain = main
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const units = contentUnits(plain);

  // 页面级 H1 可能在 main 外（本项目的 H1 都在 main 内），故两个范围都看一遍
  const h1All = (html.match(/<h1[\s>]/g) ?? []).length;

  const headingLevels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  let skipped = null;
  for (let i = 1; i < headingLevels.length; i += 1) {
    if (headingLevels[i] - headingLevels[i - 1] > 1 && headingLevels[i] > headingLevels[i - 1]) {
      skipped = `h${headingLevels[i - 1]} → h${headingLevels[i]}`;
      break;
    }
  }

  const images = [...main.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const imagesNoAlt = images.filter((tag) => !/\balt=/.test(tag)).length;

  const internalLinks = new Set(
    [...main.matchAll(/href="(\/[^"#?]*)"/g)]
      .map((m) => m[1])
      .filter((href) => !href.startsWith('/_astro'))
  ).size;

  const titleWidth = displayWidth(title);
  const descWidth = displayWidth(description);

  // 供豁免规则匹配用的干净路径，例如 'index.html' → ''、'insights/index.html' → 'insights'
  const cleanPath = file
    .replace(/\/index\.html$/, '')
    .replace(/^index\.html$/, '')
    .replace(/\.html$/, '');

  const issues = [];
  if (!isNoindex) {
    if (!title) issues.push('缺少 title');
    else if (titleWidth > TITLE.error) issues.push(`title 过长（${titleWidth} > ${TITLE.error}）`);
    else if (titleWidth > TITLE.warn) issues.push(`title 偏长（${titleWidth} > ${TITLE.warn}）`);
    if (!description) issues.push('缺少 description');
    else if (descWidth > DESC.error) issues.push(`description 过长（${descWidth}）`);
    else if (descWidth > DESC.warn) issues.push(`description 偏长（${descWidth}）`);
    else if (descWidth < DESC.min) issues.push(`description 过短（${descWidth} < ${DESC.min}）`);
    if (h1All !== 1) issues.push(`H1 数量为 ${h1All}（应为 1）`);
    if (skipped) issues.push(`标题层级跳跃 ${skipped}`);
    if (imagesNoAlt > 0) issues.push(`${imagesNoAlt} 张图片缺少 alt`);
    if (units.total < BODY.thin && !THIN_CONTENT_OK.some((re) => re.test(cleanPath))) {
      issues.push(`正文偏薄（${units.total} 单位 < ${BODY.thin}）`);
    }
  }

  rows.push({
    file: cleanPath || '/',
    titleWidth,
    descWidth,
    h1: h1All,
    units: units.total,
    links: internalLinks,
    issues,
  });
}

/* ---------------- 输出 ---------------- */

const pad = (value, width) => String(value).padEnd(width);

console.log('\n页面 SEO 审计');
console.log('─'.repeat(96));
console.log(
  `${pad('页面', 40)}${pad('title', 8)}${pad('desc', 7)}${pad('H1', 5)}${pad('正文', 9)}${pad('内链', 6)}状态`
);
console.log('─'.repeat(96));

for (const row of rows) {
  const status = row.issues.length === 0 ? '✅' : `⚠️  ${row.issues.join('；')}`;
  console.log(
    pad(row.file, 40) +
      pad(row.titleWidth, 8) +
      pad(row.descWidth, 7) +
      pad(row.h1, 5) +
      pad(row.units, 9) +
      pad(row.links, 6) +
      status
  );
  if (row.issues.length > 0) problems.push({ file: row.file, issues: row.issues });
}

console.log('─'.repeat(96));

const avgTitle = Math.round(rows.reduce((s, r) => s + r.titleWidth, 0) / rows.length);
const avgDesc = Math.round(rows.reduce((s, r) => s + r.descWidth, 0) / rows.length);
const avgUnits = Math.round(rows.reduce((s, r) => s + r.units, 0) / rows.length);

console.log(`\n共 ${rows.length} 个页面 · title 平均宽 ${avgTitle} · description 平均宽 ${avgDesc} · 正文平均 ${avgUnits} 单位`);
console.log(`有问题的页面：${problems.length} 个\n`);

process.exit(0);
