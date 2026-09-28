/**
 * 预览构建结果用的极简静态服务器（只读 dist/，无第三方依赖）。
 * 用法：node scripts/serve.mjs [端口]
 *
 * 日常开发请用 npm run dev（带热更新）；这个脚本只是方便快速查看 dist 产物。
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname, normalize, sep } from 'node:path';

const root = fileURLToPath(new URL('../dist', import.meta.url));
const port = Number(process.argv[2] ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  // 防止路径穿越
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '');
  const base = join(root, safe);
  if (!base.startsWith(root)) return null;

  for (const candidate of [base, join(base, 'index.html'), `${base}.html`]) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* 继续试下一个 */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const urlPath = (req.url ?? '/').split('?')[0];
  const file = await resolveFile(urlPath);
  const target = file ?? join(root, '404.html');

  try {
    const body = await readFile(target);
    res.writeHead(file ? 200 : 404, {
      'content-type': TYPES[extname(target)] ?? 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('500 — 请先运行 npm run build 生成 dist/');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`预览地址 → http://127.0.0.1:${port}`);
  console.log(`静态目录 → ${root}`);
  console.log('按 Ctrl+C 停止');
});
