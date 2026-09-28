/**
 * 大小写一致性检查。
 *
 * Windows 不区分大小写，Linux 区分 —— 所以 `import X from './seo.astro'`
 * 在本地能跑，推送到 GitHub Actions（Ubuntu）就会秒挂。
 * 这个脚本把所有导入路径按「逐段精确匹配」的方式验证一遍。
 *
 * 用法：node scripts/check-case.mjs
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname, resolve, relative, sep } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));

const SCAN_EXT = new Set(['.astro', '.ts', '.mjs', '.js']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.git']);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (SCAN_EXT.has(full.slice(full.lastIndexOf('.')))) out.push(full);
  }
  return out;
}

/** 检查 path 的每一段在磁盘上的大小写是否完全一致 */
async function exactCaseExists(path) {
  const parts = relative(root, path).split(sep).filter(Boolean);
  let current = root;

  for (const part of parts) {
    let entries;
    try {
      entries = await readdir(current);
    } catch {
      return false;
    }
    if (!entries.includes(part)) {
      // 找出大小写不同的近似项，方便报错
      const near = entries.find((e) => e.toLowerCase() === part.toLowerCase());
      return near ? { wrongCase: near, expected: part } : false;
    }
    current = join(current, part);
  }
  return true;
}

/** 补全导入路径可能省略的扩展名 */
async function tryExtensions(base) {
  const candidates = [base];
  for (const ext of SCAN_EXT) candidates.push(base + ext);
  for (const ext of SCAN_EXT) candidates.push(join(base, `index${ext}`));
  return candidates;
}

const files = await walk(root);
const problems = [];
let checked = 0;

for (const file of files) {
  const text = await readFile(file, 'utf8');
  const importRe = /(?:from|import)\s+['"](\.[^'"]+)['"]/g;

  for (const match of text.matchAll(importRe)) {
    const spec = match[1];
    checked += 1;
    const base = resolve(dirname(file), spec);

    let ok = false;
    let detail = '';

    for (const candidate of await tryExtensions(base)) {
      const result = await exactCaseExists(candidate);
      if (result === true) {
        ok = true;
        break;
      }
      if (result && result.wrongCase) {
        detail = `磁盘上是 "${result.wrongCase}"，代码里写的是 "${result.expected}"`;
        break;
      }
    }

    if (!ok) {
      problems.push({
        file: relative(root, file),
        spec,
        detail: detail || '文件不存在',
      });
    }
  }
}

console.log('\n导入路径大小写一致性检查');
console.log('─'.repeat(80));

if (problems.length === 0) {
  console.log(`  ✅ 检查 ${checked} 条导入，全部与实际文件名大小写一致`);
  console.log('     （本地能构建但 CI 失败的常见原因已排除）');
} else {
  for (const p of problems) {
    console.log(`  ❌ ${p.file}`);
    console.log(`       导入: ${p.spec}`);
    console.log(`       ${p.detail}`);
  }
}

console.log('─'.repeat(80));
console.log(`共 ${files.length} 个源文件 · ${checked} 条导入 · ${problems.length} 个问题\n`);

process.exit(problems.length === 0 ? 0 : 1);
