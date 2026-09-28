/**
 * 无障碍（a11y）审计：
 *   1. 配色对比度（WCAG 2.1 AA）—— 直接读取 global.css 里的颜色变量计算
 *   2. HTML 结构检查 —— lang、跳转链接、landmark、重复 id、表单标签、链接可访问名、图片 alt
 *
 * 为什么值得做：语义化程度越高，搜索引擎越能理解页面；同时这也是很多市场的合规要求。
 * 用法：npm run build 之后运行 node scripts/audit-a11y.mjs
 */

import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

/* ==================================================================== */
/* 一、配色对比度                                                        */
/* ==================================================================== */

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function relativeLuminance([r, g, b]) {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(hexToRgb(fg));
  const l2 = relativeLuminance(hexToRgb(bg));
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

// 从 global.css 读取真实色值，配色改了这里会跟着变
const css = await readFile(join(root, 'src/styles/global.css'), 'utf8');
const token = (name) => {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
  return match ? match[1] : null;
};

const C = {
  paper: token('paper'),
  paperAlt: token('paper-alt'),
  sand: token('sand'),
  ink: token('ink'),
  inkSoft: token('ink-soft'),
  muted: token('muted'),
  line: token('line'),
  lineStrong: token('line-strong'),
  accent: token('accent'),
  accentDark: token('accent-dark'),
  accentSoft: token('accent-soft'),
  white: '#ffffff',
  inkText: '#f2efe9', // .section--ink 的文字色
  ctaText: '#b9b4ac', // .cta 段落文字色
};

/**
 * 实际用到的前景/背景组合。
 * 要求分三档：
 *   'text'       —— 正文文字，AA 需 4.5:1
 *   'ui'         —— 界面控件边界，WCAG 1.4.11 需 3:1
 *   'decorative' —— 纯装饰，不影响理解内容，不设门槛（只作参考输出）
 */
const PAIRS = [
  // 文字
  ['--ink-soft', C.inkSoft, '--paper', C.paper, 'text', '正文'],
  ['--muted', C.muted, '--paper', C.paper, 'text', '次要文字、日期、卡片说明'],
  ['--muted', C.muted, '--paper-alt', C.paperAlt, 'text', '页脚文字'],
  ['--accent', C.accent, '--paper', C.paper, 'text', '链接、eyebrow（小号大写）'],
  ['--accent', C.accent, '--accent-soft', C.accentSoft, 'text', '标签 pill（0.72rem）'],
  ['--accent', C.accent, '--paper-alt', C.paperAlt, 'text', '强调色区块'],
  ['--white', C.white, '--accent', C.accent, 'text', '主按钮文字'],
  ['--white', C.white, '--accent-dark', C.accentDark, 'text', '主按钮 hover'],
  ['--ink-soft', C.inkSoft, '--white', C.white, 'text', '卡片正文'],
  ['--inkText', C.inkText, '--ink', C.ink, 'text', '深色区块正文'],
  ['--ctaText', C.ctaText, '--ink', C.ink, 'text', 'CTA 段落文字'],
  ['--ink', C.ink, '--paper', C.paper, 'text', '标题'],

  // 界面控件
  ['--lineStrong', C.lineStrong, '--white', C.white, 'ui', '表单输入框边框（唯一可输入提示）'],

  // 装饰
  ['--line', C.line, '--paper', C.paper, 'decorative', '卡片描边、分隔线（不承载信息）'],
];

const THRESHOLD = { text: 4.5, ui: 3 };

console.log('\n配色对比度（WCAG 2.1 AA）');
console.log('─'.repeat(88));

let contrastFailures = 0;

for (const [fgName, fg, bgName, bg, kind, usage] of PAIRS) {
  if (!fg || !bg) {
    console.log(`  ⚠️  跳过 ${fgName} on ${bgName}（色值缺失）`);
    continue;
  }
  const ratio = contrastRatio(fg, bg);

  let mark;
  if (kind === 'decorative') {
    mark = '➖ 装饰 ';
  } else {
    const threshold = THRESHOLD[kind];
    if (ratio >= threshold) {
      mark = ratio >= 7 ? '✅ AAA' : '✅ AA ';
    } else {
      mark = '❌ 不达标';
      contrastFailures += 1;
    }
  }

  const need = kind === 'decorative' ? '—' : `需 ${THRESHOLD[kind]}`;
  console.log(
    `  ${mark}  ${ratio.toFixed(2).padStart(5)}:1  (${need})  ${fgName} on ${bgName}  — ${usage}`
  );
}

/* ==================================================================== */
/* 二、HTML 结构检查                                                     */
/* ==================================================================== */

async function walkHtml(dir, base = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await walkHtml(join(dir, entry.name), rel)));
    else if (entry.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

const files = (await walkHtml(dist)).sort();
const problems = [];

/** 去掉标签，得到纯文本 */
const textOf = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .trim();

for (const file of files) {
  const html = await readFile(join(dist, file), 'utf8');
  const issues = [];

  // lang 属性
  if (!/<html[^>]+lang="[a-z]/i.test(html)) issues.push('html 缺少 lang');

  // 跳到主内容链接，且目标必须存在
  const skip = html.match(/class="skip-link"[^>]*href="#([^"]+)"/);
  if (!skip) issues.push('缺少跳到主内容的链接');
  else if (!html.includes(`id="${skip[1]}"`)) issues.push(`跳转链接指向的 #${skip[1]} 不存在`);

  // landmark
  const mainCount = (html.match(/<main[\s>]/g) ?? []).length;
  if (mainCount !== 1) issues.push(`<main> 数量为 ${mainCount}（应为 1）`);
  if (!/<header[\s>]/.test(html)) issues.push('缺少 <header>');
  if (!/<nav[\s>]/.test(html)) issues.push('缺少 <nav>');
  if (!/<footer[\s>]/.test(html)) issues.push('缺少 <footer>');

  // 重复 id
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dupes.length > 0) issues.push(`重复 id: ${dupes.slice(0, 3).join(', ')}`);

  // 图片 alt
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((tag) => !/\balt=/.test(tag)).length;
  if (noAlt > 0) issues.push(`${noAlt} 张图片缺少 alt`);

  // 表单控件必须有可访问名称
  const controls = [
    ...html.matchAll(/<(input|select|textarea)\b[^>]*>/g),
  ].filter((m) => !/type="(hidden|submit|button|reset)"/.test(m[0]));

  for (const control of controls) {
    const tag = control[0];
    const id = (tag.match(/\sid="([^"]+)"/) ?? [])[1];
    const hasAria = /\saria-label=|\saria-labelledby=/.test(tag);
    const hasLabelFor = id ? new RegExp(`<label[^>]+for="${id}"`).test(html) : false;
    // 被 <label> 包裹的情况
    const index = html.indexOf(tag);
    const before = html.slice(Math.max(0, index - 400), index);
    const wrapped = before.lastIndexOf('<label') > before.lastIndexOf('</label>');

    if (!hasAria && !hasLabelFor && !wrapped) {
      issues.push(`表单控件缺少标签: ${tag.slice(0, 60)}`);
    }
  }

  // 链接与按钮必须有可访问名称
  const emptyLinks = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].filter((m) => {
    if (/aria-label=/.test(m[0].slice(0, m[0].indexOf('>')))) return false;
    if (/<img[^>]+alt="[^"]+"/.test(m[1])) return false;
    return textOf(m[1]).length === 0;
  }).length;
  if (emptyLinks > 0) issues.push(`${emptyLinks} 个链接没有可读文字`);

  const emptyButtons = [...html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)].filter(
    (m) => textOf(m[1]).length === 0 && !/aria-label=/.test(m[0])
  ).length;
  if (emptyButtons > 0) issues.push(`${emptyButtons} 个按钮没有可读文字`);

  // 新窗口打开必须带 rel="noopener"
  const unsafeTargets = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].filter(
    (m) => !/rel="[^"]*noopener/.test(m[0])
  ).length;
  if (unsafeTargets > 0) issues.push(`${unsafeTargets} 个新窗口链接缺少 rel="noopener"`);

  if (issues.length > 0) problems.push({ file, issues });
}

console.log('\nHTML 结构与无障碍');
console.log('─'.repeat(88));

if (problems.length === 0) {
  console.log(`  ✅ ${files.length} 个页面全部通过`);
} else {
  for (const p of problems) {
    console.log(`  ❌ ${p.file}`);
    for (const issue of p.issues) console.log(`       · ${issue}`);
  }
}

const total = contrastFailures + problems.length;
console.log(
  `\n${total === 0 ? '✅ 无障碍审计通过' : `❌ 有 ${total} 类问题需要处理`}` +
    `（对比度 ${PAIRS.length} 组 · 页面 ${files.length} 个）\n`
);

process.exit(total === 0 ? 0 : 1);
