/**
 * 一键跑完所有检查，任何一步失败就整体失败。
 *
 * 为什么需要它：npm run check / verify / audit 都是独立命令，
 * 单独跑很容易看漏 —— 比如 astro check 内存溢出时会直接崩掉、
 * 不打印 "Result"，扫一眼输出会误以为通过了。这个脚本只看退出码，
 * 不给人漏看的机会。
 *
 * 用法：node scripts/verify-all.mjs
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const STEPS = [
  { name: '类型检查', cmd: 'npm', args: ['run', 'check'] },
  { name: '构建', cmd: 'npm', args: ['run', 'build'] },
  { name: '产物自检', cmd: 'node', args: ['scripts/check-output.mjs'] },
  { name: 'SEO 审计', cmd: 'node', args: ['scripts/audit-seo.mjs'] },
  { name: '无障碍审计', cmd: 'node', args: ['scripts/audit-a11y.mjs'] },
  { name: '上线预检', cmd: 'node', args: ['scripts/preflight.mjs'] },
];

const results = [];

for (const step of STEPS) {
  process.stdout.write(`\n${'═'.repeat(60)}\n${step.name}\n${'═'.repeat(60)}\n`);

  const code = await new Promise((resolve) => {
    const child = spawn(step.cmd, step.args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
    });
    child.on('close', resolve);
  });

  // 只认退出码，不靠肉眼看输出
  results.push({ name: step.name, code, ok: code === 0 });
}

console.log(`\n${'═'.repeat(60)}\n汇总\n${'═'.repeat(60)}`);
for (const r of results) {
  console.log(`  ${r.ok ? '✅' : '❌'} ${r.name}${r.ok ? '' : `（退出码 ${r.code}）`}`);
}

const failed = results.filter((r) => !r.ok);
console.log(
  failed.length === 0
    ? '\n✅ 全部通过\n'
    : `\n❌ ${failed.length} 项未通过：${failed.map((r) => r.name).join('、')}\n`
);

process.exit(failed.length === 0 ? 0 : 1);
