import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';
// 只导入类型：编译后会被完全擦除，不会在运行时加载 astro/loaders
// （它的依赖链里有纯 CommonJS 的 picomatch，会引发构建错误）
import type { Loader, LoaderContext } from 'astro/loaders';

/**
 * 内容集合定义。
 *
 * 说明：这里没有用 Astro 内置的 glob() loader —— 它依赖链里有一个纯 CommonJS 的包
 * （picomatch），会被 Vite 当成 ESM 求值，导致 `require is not defined` 而无法构建。
 * 所以下面自己实现了一个最小的 Markdown 文件 loader，行为一致，但依赖干净。
 *
 * 文章和案例都写在 src/content/ 下的 Markdown 里，
 * 中英两版用同一个文件名（slug 相同），系统会自动互指 hreflang。
 */

const CONTENT_ROOT = fileURLToPath(new URL('./content', import.meta.url));
/** 项目根目录，用来把绝对路径换算成 Astro 要求的相对路径 */
const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));

/** 递归找出目录下所有 .md 文件 */
async function walk(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

/**
 * 把绝对路径换算成「相对于站点根目录」的路径，并统一用 / 分隔。
 *
 * Astro 的 filePath 必须是这种相对路径。传绝对路径时：
 *   - Windows：以 C:\ 开头，能绕过 Astro 的检查，本地看起来一切正常
 *   - Linux：以 / 开头，直接报 "File path must be relative to the site root"
 * 所以这里加了一道断言，让写错时在两个平台上都立刻失败，而不是等 CI 才发现。
 */
function toSiteRelative(absolutePath: string): string {
  const rel = relative(PROJECT_ROOT, absolutePath).split(sep).join('/');

  if (rel.startsWith('/') || /^[A-Za-z]:/.test(rel) || rel.startsWith('..')) {
    throw new Error(
      `内容 loader 的 filePath 必须是相对于站点根目录的路径，实际得到: ${rel}`
    );
  }
  return rel;
}

/** 拆出 YAML frontmatter 和正文 */function splitFrontmatter(raw: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const parsed = parseYaml(match[1]);
  return {
    data: (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, unknown>,
    body: match[2],
  };
}

/** 生成一个读取某个子目录的 Markdown loader */
function markdownLoader(subDir: string): Loader {
  const dir = join(CONTENT_ROOT, subDir);

  return {
    name: `markdown-fs:${subDir}`,
    load: async (context: LoaderContext) => {
      const { store, parseData, renderMarkdown, watcher } = context;

      watcher?.add(dir);
      store.clear?.();

      const files = await walk(dir);

      for (const file of files) {
        const raw = await readFile(file, 'utf8');
        const { data, body } = splitFrontmatter(raw);

        // id 形如 'en/what-is-a-fractional-cmo'
        const id = relative(dir, file).split(sep).join('/').replace(/\.md$/, '');

        // 语言由所在文件夹决定，不从 frontmatter 里读。
        // 这样后台编辑器不可能把中文文章误标成英文 —— 少一类只有人工填写才会犯的错。
        const lang = id.split('/')[0];
        if (lang !== 'en' && lang !== 'zh') {
          throw new Error(`内容文件必须放在 en/ 或 zh/ 子目录下，实际是: ${id}`);
        }

        const parsed = await parseData({
          id,
          data: { ...data, lang },
          filePath: toSiteRelative(file),
        });
        const rendered = await renderMarkdown(body);

        // ⚠️ filePath 必须是「相对于站点根目录」的路径。
        // 传绝对路径在 Windows 上能跑（以 C:\ 开头，绕过了 Astro 的检查），
        // 但在 Linux 上以 / 开头，会被直接拒绝 —— 本地测不出、CI 秒挂。
        store.set({ id, data: parsed, body, rendered, filePath: toSiteRelative(file) });
      }
    },
  };
}

const insights = defineCollection({
  loader: markdownLoader('insights'),
  schema: z.object({
    title: z.string(),
    /**
     * 搜索结果里显示的标题。不填就用 title。
     * 当 title 太长（会被 Google 截断）时，用它单独指定一个更短的版本 ——
     * 页面上的大标题仍然可以保持完整描述性。
     */
    seoTitle: z.string().optional(),
    description: z.string(),
    lang: z.enum(['en', 'zh']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** 是否在首页精选 */
    featured: z.boolean().default(false),
    /** 草稿不会出现在列表里 */
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: markdownLoader('work'),
  schema: z.object({
    title: z.string(),
    /** 搜索结果里显示的标题；不填就用 title（见 insights 集合的说明） */
    seoTitle: z.string().optional(),
    /** 客户名称；未获授权时写「某 K-12 教育科技公司」这类匿名描述 */
    client: z.string(),
    industry: z.string(),
    description: z.string(),
    lang: z.enum(['en', 'zh']),
    pubDate: z.coerce.date(),
    /** 成果数字，例如 { label: 'CAC', value: '-37%' } */
    metrics: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .default([]),
    services: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights, work };
