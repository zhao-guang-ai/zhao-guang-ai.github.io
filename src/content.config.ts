import { defineCollection, z } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';

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

/** 拆出 YAML frontmatter 和正文 */
function splitFrontmatter(raw: string): {
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

interface LoaderContext {
  store: {
    set: (entry: Record<string, unknown>) => void;
    clear?: () => void;
  };
  parseData: (args: {
    id: string;
    data: Record<string, unknown>;
    filePath?: string;
  }) => Promise<Record<string, unknown>>;
  renderMarkdown: (body: string) => Promise<unknown>;
  watcher?: { add: (path: string) => void };
}

/** 生成一个读取某个子目录的 Markdown loader */
function markdownLoader(subDir: string) {
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

        const parsed = await parseData({ id, data, filePath: file });
        const rendered = await renderMarkdown(body);

        store.set({ id, data: parsed, body, rendered, filePath: file });
      }
    },
  };
}

const insights = defineCollection({
  loader: markdownLoader('insights'),
  schema: z.object({
    title: z.string(),
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
