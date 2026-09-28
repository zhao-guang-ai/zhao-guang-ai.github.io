/**
 * 把 Sveltia CMS 的脚本从 node_modules 复制到 public/admin/，
 * 让后台自托管 —— 不依赖 unpkg 之类的第三方 CDN，在部分网络环境下也能打开。
 *
 * 由 package.json 的 predev / prebuild 自动调用，不用手动跑。
 */

import { copyFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));

const source = join(root, 'node_modules', '@sveltia', 'cms', 'dist', 'sveltia-cms.js');
const targetDir = join(root, 'public', 'admin');
const target = join(targetDir, 'sveltia-cms.js');

try {
  await stat(source);
} catch {
  console.warn(
    '⚠️  找不到 @sveltia/cms，内容后台将无法加载。\n' +
      '   修复：运行 npm install'
  );
  process.exit(0); // 不要因为一个后台资源就让整站构建失败
}

await mkdir(targetDir, { recursive: true });
await copyFile(source, target);

const { size } = await stat(target);
console.log(`✓ 内容后台脚本已就绪（${(size / 1024 / 1024).toFixed(1)} MB）`);
