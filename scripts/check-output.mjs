/**
 * 构建产物自检：确认中英文页面、SEO 标签和 sitemap 都正常。
 * 用法：npm run build 之后运行 node scripts/check-output.mjs
 */

import { readFile, access, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const read = (p) => readFile(join(dist, p), 'utf8');

let failed = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '  ✅' : '  ❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
}

console.log('\n── 页面内容 ──────────────────────────────────');

const pages = [
  ['index.html', 'Fractional CMO for EduTech'],
  ['zh/index.html', '外聘首席营销官'],
  ['about/index.html', 'Ten years in education technology'],
  ['zh/about/index.html', '教育科技'],
  ['services/index.html', 'Three ways to work together'],
  ['services/fractional-cmo/index.html', 'Fractional CMO'],
  ['zh/services/fractional-cmo/index.html', '外聘首席营销官'],
  ['services/edutech-go-to-market/index.html', 'EduTech Go-to-Market'],
  ['services/demand-generation/index.html', 'Demand Generation'],
  ['work/index.html', 'Case studies'],
  ['zh/work/index.html', '客户案例'],
  ['insights/index.html', 'Insight'],
  ['zh/insights/index.html', '洞察'],
  ['contact/index.html', 'Book a 30-min call'],
  ['zh/contact/index.html', '预约'],
  ['privacy/index.html', 'Privacy Policy'],
  ['zh/privacy/index.html', '隐私政策'],
  ['404.html', '404'],
];

const markdownPages = [
  ['insights/what-is-a-fractional-cmo/index.html', 'fractional CMO'],
  ['insights/fractional-cmo-cost-singapore/index.html', 'Singapore'],
  ['insights/fractional-cmo-vs-marketing-agency/index.html', 'agency'],
  ['insights/edutech-go-to-market-southeast-asia/index.html', 'Southeast Asia'],
  ['zh/insights/what-is-a-fractional-cmo/index.html', '外聘'],
  ['work/k12-platform-repositioning/index.html', 'K-12'],
  ['work/higher-ed-saas-demand-gen/index.html', 'NDA'],
  ['work/corporate-learning-launch/index.html', 'Corporate learning'],
  ['zh/work/k12-platform-repositioning/index.html', '保密'],
];

for (const [file, needle] of [...pages, ...markdownPages]) {
  try {
    const html = await read(file);
    check(file, html.includes(needle), html.includes(needle) ? '' : `未找到「${needle}」`);
  } catch {
    check(file, false, '文件不存在');
  }
}

console.log('\n── SEO 标签 ──────────────────────────────────');

const home = await read('index.html');

check('首页 <title>（品牌名在前）', home.includes('<title>Xiaoli — Fractional CMO for EduTech'));
check('canonical', home.includes('<link rel="canonical" href="https://xiaolicmo.com/"'));
check(
  'hreflang 三组齐全',
  home.includes('hreflang="en-SG"') &&
    home.includes('hreflang="zh-CN"') &&
    home.includes('hreflang="x-default"')
);
check('og:image 绝对地址', home.includes('content="https://xiaolicmo.com/og-image.png"'));
check('Person 结构化数据', home.includes('"@type":"Person"'));
check('ProfessionalService 结构化数据', home.includes('"@type":"ProfessionalService"'));

const zhHome = await read('zh/index.html');
check('中文页 html lang', zhHome.includes('<html lang="zh-CN"'));
check(
  '中文页 canonical 指向 /zh/',
  zhHome.includes('<link rel="canonical" href="https://xiaolicmo.com/zh/"')
);

const service = await read('services/fractional-cmo/index.html');
check('服务页 FAQPage', service.includes('"@type":"FAQPage"'));
check('服务页 Service 结构化数据', service.includes('"@type":"Service"'));
check('服务页面包屑', service.includes('"@type":"BreadcrumbList"'));

const post = await read('insights/what-is-a-fractional-cmo/index.html');
check('文章 BlogPosting', post.includes('"@type":"BlogPosting"'));
const words = post
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .split(/\s+/)
  .filter(Boolean).length;
check('文章正文长度合理', words > 800, `约 ${words} 个词`);

console.log('\n── sitemap 与静态资源 ────────────────────────');

const sitemapIndex = await read('sitemap-index.xml');
check('sitemap-index.xml', sitemapIndex.includes('<sitemap>'));
const sitemap = await read('sitemap-0.xml');
const urls = (sitemap.match(/<loc>/g) ?? []).length;
check('sitemap 收录 URL', urls >= 30, `${urls} 条`);
check('sitemap 含 hreflang 互指', sitemap.includes('xhtml:link'));

for (const asset of ['robots.txt', 'favicon.svg', 'og-image.png']) {
  let ok = true;
  try {
    await access(join(dist, asset));
  } catch {
    ok = false;
  }
  check(asset, ok);
}

console.log('\n── hreflang 完整性 ───────────────────────────');

/** 递归列出 dist 下所有 html 的相对路径 */
async function walkHtml(dir, base = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await walkHtml(join(dir, entry.name), rel)));
    else if (entry.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

/** 把站点绝对地址映射成 dist 里的相对文件路径 */
function urlToFile(url) {
  const path = url.replace(/^https:\/\/xiaolicmo\.com/, '').replace(/\/$/, '');
  if (path === '') return 'index.html';
  return path.endsWith('.html') ? path.slice(1) : `${path.slice(1)}/index.html`;
}

const htmlFiles = await walkHtml(dist);
const brokenLinks = [];
let hreflangCount = 0;

for (const file of htmlFiles) {
  const html = await readFile(join(dist, file), 'utf8');
  const links = html.match(/<link rel="alternate" hreflang="[^"]+" href="[^"]+"/g) ?? [];

  for (const link of links) {
    hreflangCount += 1;
    const href = (link.match(/href="([^"]+)"/) ?? [])[1];
    if (!href) continue;
    const target = urlToFile(href);
    try {
      await access(join(dist, target));
    } catch {
      brokenLinks.push(`${file} → ${href}`);
    }
  }
}

check('hreflang 全部指向真实存在的页面', brokenLinks.length === 0,
  brokenLinks.length === 0 ? `共 ${hreflangCount} 条链接` : brokenLinks.slice(0, 5).join(' | '));

console.log(
  `\n${failed === 0 ? '✅ 全部检查通过' : `❌ 有 ${failed} 项未通过`}（共 ${
    pages.length + markdownPages.length
  } 个页面内容检查）\n`
);

process.exit(failed === 0 ? 0 : 1);
