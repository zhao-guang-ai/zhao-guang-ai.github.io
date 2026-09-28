// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ⚠️ 买好域名后，把下面的 site 换成真实地址（结尾不要带斜杠）
// 这个值决定了 canonical、sitemap、OG 图里的绝对 URL，必须准确。
export default defineConfig({
  site: 'https://xiaolicmo.com',

  // 中英双语：英文是默认语言（不带前缀），中文在 /zh/ 下
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh',
        },
      },
      // 隐私政策页不参与排名，但保留在 sitemap 里也无妨；这里排除掉更干净
      filter: (page) => !page.includes('/privacy'),
    }),
  ],

  build: {
    inlineStylesheets: 'auto',
  },

  // 让 Vite 用 Node 的 require 加载这个纯 CommonJS 的依赖，
  // 否则加载内容集合配置时会报 “require is not defined”。
  vite: {
    ssr: {
      external: ['picomatch'],
    },
  },
});
