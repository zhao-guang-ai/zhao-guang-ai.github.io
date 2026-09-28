/**
 * 上线前预检：验证 GitHub Actions 工作流语法、Node 版本要求、lockfile 是否就绪。
 * 用法：node scripts/preflight.mjs
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { load as parseYaml } from 'js-yaml';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = async (p) => JSON.parse(await readFile(join(root, p), 'utf8'));

let failed = 0;
const check = (label, ok, detail = '') => {
  console.log(`${ok ? '  ✅' : '  ❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
};

console.log('\n── GitHub Actions 工作流 ─────────────────────');

let workflow = null;
try {
  workflow = parseYaml(await readFile(join(root, '.github/workflows/deploy.yml'), 'utf8'));
  check('deploy.yml 是合法 YAML', true);
} catch (error) {
  check('deploy.yml 是合法 YAML', false, error.message);
}

if (workflow) {
  const jobBuild = workflow.jobs?.build;
  const jobDeploy = workflow.jobs?.deploy;

  check('触发条件含 push 到 main', Boolean(workflow.on?.push?.branches?.includes('main')));
  check('声明 pages: write 权限', workflow.permissions?.pages === 'write');
  check('声明 id-token: write 权限', workflow.permissions?.['id-token'] === 'write');

  const uses = [
    ...(jobBuild?.steps ?? []).map((s) => s.uses),
    ...(jobDeploy?.steps ?? []).map((s) => s.uses),
  ].filter(Boolean);

  for (const action of [
    'actions/checkout@v4',
    'actions/setup-node@v4',
    'actions/configure-pages@v5',
    'actions/upload-pages-artifact@v3',
    'actions/deploy-pages@v4',
  ]) {
    check(`使用 ${action}`, uses.includes(action));
  }

  const buildSteps = (jobBuild?.steps ?? []).map((s) => s.run).filter(Boolean);
  check('构建步骤执行 npm ci', buildSteps.includes('npm ci'));
  check('构建步骤执行 npm run build', buildSteps.includes('npm run build'));
  check(
    '构建时关闭遥测',
    (jobBuild?.steps ?? []).some((s) => s.env?.ASTRO_TELEMETRY_DISABLED)
  );
  check('部署依赖构建任务', Array.isArray(jobDeploy?.needs) ? jobDeploy.needs.includes('build') : jobDeploy?.needs === 'build');
}

console.log('\n── Node 版本 ─────────────────────────────────');

const astroPkg = await readJson('node_modules/astro/package.json');
const engines = astroPkg.engines?.node ?? '(未声明)';
const ciNodeRaw = String(
  (workflow?.jobs?.build?.steps ?? []).find((s) => s.with?.['node-version'])?.with?.[
    'node-version'
  ] ?? ''
);

/** 只比较主版本（CI 里常写 "24" 这种不带小版本的值） */
function majorSatisfies(version, range) {
  const required = (range.match(/(\d+)\.(\d+)\.(\d+)/) ?? []).slice(1).map(Number);
  const parts = version.split('.').map(Number);
  if (parts.length < 3) return parts[0] > required[0] || (parts[0] === required[0] && required[1] === 0);
  for (let i = 0; i < 3; i += 1) {
    if (parts[i] > required[i]) return true;
    if (parts[i] < required[i]) return false;
  }
  return true;
}

check(`Astro 要求 Node ${engines}`, true);
check(
  `CI 配置的 Node ${ciNodeRaw || '(缺失)'} 满足要求`,
  Boolean(ciNodeRaw) && majorSatisfies(ciNodeRaw, engines),
  ciNodeRaw ? '' : 'setup-node 里缺少 node-version'
);

console.log('\n── 上线就绪度 ────────────────────────────────');

const pkg = await readJson('package.json');
const lock = await readJson('package-lock.json');

check('存在 package-lock.json（npm ci 必需）', Boolean(lock.lockfileVersion));
check(
  'lockfile 已记录根依赖',
  Boolean(lock.packages?.['']?.dependencies?.astro || lock.packages?.['']?.dependencies?.['js-yaml'])
);
check('js-yaml 已声明为依赖', Boolean(pkg.dependencies?.['js-yaml']));
check('构建脚本存在', typeof pkg.scripts?.build === 'string');

const astroConfig = await readFile(join(root, 'astro.config.mjs'), 'utf8');
const siteMatch = astroConfig.match(/site:\s*'([^']+)'/);
const domain = siteMatch?.[1] ?? '';
check('astro.config.mjs 已配置 site', Boolean(domain), domain);
check(
  'site 仍是占位域名（上线前需替换）',
  domain.includes('xiaolicmo.com'),
  domain.includes('xiaolicmo.com') ? '记得换成真实域名' : ''
);

const robots = await readFile(join(root, 'public/robots.txt'), 'utf8');
check('robots.txt 允许抓取', /Allow:\s*\//.test(robots) && !/Disallow:\s*\/\s*$/m.test(robots));
check('robots.txt 指向 sitemap', /Sitemap:/.test(robots));

console.log(
  `\n${failed === 0 ? '✅ 预检通过，可以推送到 GitHub' : `❌ 有 ${failed} 项需要处理`}\n`
);

process.exit(failed === 0 ? 0 : 1);
