/**
 * 内容完成度检查：把「还差什么才能上线」变成一份可勾选的清单。
 *
 * 扫描源码与内容文件，找出所有仍是占位状态的地方，
 * 按「必需 / 重要 / 可选」分级，并指出要改哪个文件。
 *
 * 用法：node scripts/content-status.mjs
 */

import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFile(join(root, p), 'utf8');

const items = [];
const add = (severity, what, file, hit) => items.push({ severity, what, file, hit });

/* ------------------------------------------------------------------ */
/* 读取需要检查的文件                                                  */
/* ------------------------------------------------------------------ */

const files = {
  site: await read('src/data/site.ts'),
  copy: await read('src/i18n/copy.ts'),
  config: await read('astro.config.mjs'),
  robots: await read('public/robots.txt'),
  home: await read('src/components/pages/HomePage.astro'),
  about: await read('src/components/pages/AboutPage.astro'),
};

/* ------------------------------------------------------------------ */
/* 一、站点级配置：没有这些，网站就是假的                              */
/* ------------------------------------------------------------------ */

if (/name: \{ en: 'Xiaoli Chen'/.test(files.site)) {
  add('必需', '真实姓名（现在姓氏 "Chen" 是编的）', 'src/data/site.ts', "name: { en: 'Xiaoli Chen'");
}
if (/calendly: 'https:\/\/calendly\.com\/xiaoli\/30min'/.test(files.site)) {
  add('必需', 'Calendly 预约链接（全站主转化入口）', 'src/data/site.ts', 'calendly.com/xiaoli/30min');
}
if (/linkedin: ''/.test(files.site)) {
  add(
    '必需',
    'LinkedIn 主页地址（留空期间页脚与联系页会自动隐藏该链接）',
    'src/data/site.ts',
    "linkedin: ''"
  );
}
if (/email: 'hello@xiaolicmo\.com'/.test(files.site)) {
  add('必需', '收件邮箱', 'src/data/site.ts', 'hello@xiaolicmo.com');
}
if (/REPLACE_ME/.test(files.copy)) {
  add('必需', '表单服务地址（Formspree / Tally）', 'src/i18n/copy.ts', 'formspree.io/f/REPLACE_ME');
}
if (/site: 'https:\/\/xiaolicmo\.com'/.test(files.config)) {
  add('必需', '真实域名（买好后改这里）', 'astro.config.mjs', 'https://xiaolicmo.com');
}
if (/Sitemap: https:\/\/xiaolicmo\.com/.test(files.robots)) {
  add('必需', 'robots.txt 里的域名', 'public/robots.txt', 'Sitemap: https://xiaolicmo.com/...');
}
if (/whatsapp: ''/.test(files.site)) {
  add('可选', 'WhatsApp 链接（东南亚 B2B 客户常用）', 'src/data/site.ts', "whatsapp: ''");
}

/* ------------------------------------------------------------------ */
/* 二、人物内容：只有客户本人能提供                                    */
/* ------------------------------------------------------------------ */

if (/value: 'S\$40M\+'/.test(files.copy)) {
  add('必需', '3–4 条真实战绩数字（首页大数字区）', 'src/i18n/copy.ts', "'S$40M+' / '10+' / '12'");
}
if (/EduScale|LearnLoop|K12 Labs|Campus Cloud|SkillBridge/.test(files.copy)) {
  add('必需', '合作过的公司 / 客户名（首页背书条）', 'src/i18n/copy.ts', 'EduScale, LearnLoop, K12 Labs…');
}
if (/Series B K-12 platform|higher-ed SaaS/.test(files.copy)) {
  add('必需', '客户评价 3 条（需对方同意）', 'src/i18n/copy.ts', "'CEO, Series B K-12 platform' 等");
}
if (/2020 — 2023|2017 — 2020|2014 — 2017/.test(files.copy)) {
  add('必需', '真实履历时间线（4 段）', 'src/i18n/copy.ts', "'2020 — 2023' 等");
}
if (/I started in growth marketing at a Singapore|I began my career in growth marketing/.test(files.copy)) {
  add('重要', '个人简介长版（应为本人真实经历）', 'src/i18n/copy.ts', 'story / about 正文段落');
}
if (/EduTech Southeast Asia Summit|e27|EdSurge/.test(files.copy)) {
  add('重要', '演讲 / 媒体署名 / 播客记录', 'src/i18n/copy.ts', 'EduTech SEA Summit, e27, EdSurge');
}

/* ------------------------------------------------------------------ */
/* 三、图片                                                            */
/* ------------------------------------------------------------------ */

const placeholderPhotos =
  ((files.home.match(/<Photo\b(?![^>]*\bsrc=)/g) ?? []).length ?? 0) +
  ((files.about.match(/<Photo\b(?![^>]*\bsrc=)/g) ?? []).length ?? 0);

if (placeholderPhotos > 0) {
  add(
    '必需',
    `${placeholderPhotos} 处照片位还是虚线占位框（头像 / 工作照）`,
    'HomePage.astro · AboutPage.astro',
    '给 <Photo> 加 src 属性即可'
  );
}

/* ------------------------------------------------------------------ */
/* 四、内容文件                                                        */
/* ------------------------------------------------------------------ */

const listMd = async (dir) => {
  try {
    return (await readdir(join(root, dir))).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
};

const workDirs = ['src/content/work/en', 'src/content/work/zh'];
const insightDirs = ['src/content/insights/en', 'src/content/insights/zh'];

let workCount = 0;
let workWithSampleMetrics = 0;
for (const dir of workDirs) {
  for (const file of await listMd(dir)) {
    workCount += 1;
    const text = await read(`${dir}/${file}`);
    if (/^metrics:/m.test(text) && /value: '/.test(text)) workWithSampleMetrics += 1;
  }
}

if (workWithSampleMetrics > 0) {
  add(
    '重要',
    `${workWithSampleMetrics} 个案例的成果数字是示例值（需真实数据 + 客户授权）`,
    'src/content/work/',
    "metrics 里的 '-34%' / '19% → 38%' 等"
  );
}

let insightCount = 0;
for (const dir of insightDirs) {
  insightCount += (await listMd(dir)).length;
}
add(
  '可选',
  `${insightCount} 篇文章为代笔草稿，建议本人过一遍语气与观点`,
  'src/content/insights/',
  '英文 4 篇 + 中文 4 篇'
);

/* ------------------------------------------------------------------ */
/* 五、源码里的 TODO 注释                                              */
/* ------------------------------------------------------------------ */

const scanTargets = [
  'src/data/site.ts',
  'src/data/services.ts',
  'src/i18n/copy.ts',
  'src/content.config.ts',
  'astro.config.mjs',
];

let todoCount = 0;
const todoFiles = new Set();

for (const file of scanTargets) {
  let text = '';
  try {
    text = await read(file);
  } catch {
    continue;
  }
  text.split('\n').forEach((line) => {
    if (/TODO/.test(line)) {
      todoCount += 1;
      todoFiles.add(file);
    }
  });
}

if (todoCount > 0) {
  add(
    '提示',
    `${todoCount} 条 TODO 注释（源码里标出的待替换位置）`,
    [...todoFiles].join(' · '),
    '搜索 TODO 可逐条定位'
  );
}

/* ------------------------------------------------------------------ */
/* 输出                                                                */
/* ------------------------------------------------------------------ */

const order = { 必需: 0, 重要: 1, 可选: 2, 提示: 3 };
const icon = { 必需: '🔴', 重要: '🟠', 可选: '🟡', 提示: '⚪' };

items.sort((a, b) => order[a.severity] - order[b.severity]);

console.log('\n内容完成度检查');
console.log('═'.repeat(96));

for (const item of items) {
  console.log(`${icon[item.severity]} [${item.severity}] ${item.what}`);
  console.log(`         改这里：${item.file}`);
  console.log(`         当前值：${item.hit}`);
  console.log('');
}

const required = items.filter((i) => i.severity === '必需').length;
const important = items.filter((i) => i.severity === '重要').length;

console.log('═'.repeat(96));
console.log(
  `共 ${items.length} 项待办：必需 ${required} 项 · 重要 ${important} 项 · 其余 ${items.length - required - important} 项`
);
console.log(
  required === 0
    ? '✅ 必需项已全部完成，可以上线了'
    : `⚠️  还有 ${required} 项必需内容没填，现在上线会带着假信息`
);
console.log('\n填写模板见：素材填写模板.md\n');
