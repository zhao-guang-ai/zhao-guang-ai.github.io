# Xiaoli — 个人品牌站

新加坡 EdTech CMO 的个人品牌官网：中英双语、纯静态、为「被 Google 搜到」和「承接客户线索」而设计。

**技术栈**：Astro 7（静态输出）· 纯 CSS 设计系统 · Markdown 内容 · GitHub Pages 托管

---

## 一、本地跑起来

```powershell
cd C:\Users\Acer\Desktop\xiaoli-site

npm install          # 首次运行才需要
npm run dev          # 开发预览 → http://localhost:4321
npm run build        # 生成静态文件到 dist/
npm run preview      # 预览构建结果
```

其他可用命令：

| 命令 | 作用 |
|---|---|
| `npm run verify` | **构建后自检**：检查 27 个页面的中英文内容、SEO 标签、sitemap 是否都正常 |
| `npm run serve` | 用一个极简静态服务器预览 `dist/`（`node scripts/serve.mjs 4321`） |
| `npm run og` | 改了 `scripts/og-image.svg` 后重新生成社交分享图 |

> 💡 Windows 上如果 `npm run build` 报遥测写入错误，先执行一次：
> `$env:ASTRO_TELEMETRY_DISABLED = '1'`（或永久关闭：`npx astro telemetry disable`）

---

## 二、目录结构

```
xiaoli-site/
├─ astro.config.mjs          站点配置（★ 网站域名在这里改）
├─ src/
│  ├─ data/
│  │  ├─ site.ts             ★ 姓名、头衔、邮箱、Calendly、LinkedIn
│  │  └─ services.ts         ★ 三项服务的完整中英文案
│  ├─ i18n/copy.ts           ★ 首页/关于/联系/隐私页的全部文案
│  ├─ content.config.ts      内容集合定义（一般不用改）
│  ├─ content/
│  │  ├─ insights/{en,zh}/   ★ 文章（Markdown）
│  │  └─ work/{en,zh}/       ★ 客户案例（Markdown）
│  ├─ components/
│  │  ├─ SEO.astro           title/canonical/hreflang/OG/结构化数据
│  │  ├─ Header.astro · Footer.astro · Cta.astro
│  │  ├─ Photo.astro         图片位（没图时显示虚线占位框）
│  │  ├─ ServiceCard / PostCard / WorkCard
│  │  └─ pages/              每个页面的实际内容
│  ├─ layouts/BaseLayout.astro
│  ├─ pages/                 英文路由（根目录）
│  │  └─ zh/                 中文路由（/zh/…）
│  └─ styles/global.css      ★ 配色与排版变量
├─ public/
│  ├─ robots.txt
│  └─ favicon.svg
└─ .github/workflows/deploy.yml   推送 main 自动部署
```

★ = 换成真实内容时要动的文件。

---

## 三、要替换的占位内容（按优先级）

| 优先级 | 文件 | 改什么 |
|---|---|---|
| 🔴 最高 | `src/data/site.ts` | 真实姓名、头衔、邮箱、**Calendly 链接**、LinkedIn |
| 🔴 最高 | `astro.config.mjs` | `site:` 换成真实域名（影响 canonical 与 sitemap） |
| 🔴 最高 | `public/robots.txt` | 里面的域名换成真实域名 |
| 🟠 高 | `src/i18n/copy.ts` | 首页 Hero、战绩数字、客户评价、个人简介 |
| 🟠 高 | `src/data/services.ts` | 三项服务的真实交付物、流程与 FAQ |
| 🟡 中 | `src/pages/**/contact.astro` 用的表单地址 | `src/i18n/copy.ts` 里 `CONTACT.form.action` 换成 Formspree/Tally 地址 |
| 🟡 中 | `src/content/work/` | 真实案例与真实数字（要客户授权） |
| 🟢 低 | `src/styles/global.css` | 配色变量（想换主色改 `--accent` 即可） |
| 🟢 低 | `Photo` 组件 | 传入真实头像/工作照路径 |

**页面上的虚线框**就是「这里需要放图片」，尺寸已标好。

---

## 四、域名建议

已经查过一批候选（DNS 检查，**下单前请在注册商页面再确认一次**）：

| 域名 | 状态 |
|---|---|
| **`xiaolicmo.com`** | ✅ 很可能可注册 — **最推荐**，直接含 "CMO" 这个 SEO 主词 |
| `xiaoli.co` | ✅ 很可能可注册（短，适合做跳转短链） |
| `xiaoli.sg` | ✅ 很可能可注册（`.sg` 注册通常需要新加坡本地资料，对新加坡客户信任度最高） |
| `xiaoliconsulting.com` | ✅ 很可能可注册 |
| `xiaoli.com` · `xiaoli.io` · `helloxiaoli.com` · `xiaoli.tech` | ❌ 已被注册 |

**建议**：主域名用 `xiaolicmo.com`，如果预算允许，把 `xiaoli.co` 一起买下做短链。

---

## 五、上线步骤

### 1. 建仓库并推送

```powershell
cd C:\Users\Acer\Desktop\xiaoli-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

> 仓库可以设为 Public 或 Private；用 GitHub Pages 的 **Actions 部署方式**时，Private 仓库也能免费发布。

### 2. 打开 GitHub Pages

仓库 → **Settings** → **Pages** → **Source** 选 **GitHub Actions**。
推送后 Actions 会自动构建并发布，几十秒后访问 `https://<你的用户名>.github.io/<仓库名>/`。

### 3. 绑定自定义域名（强烈建议，B2B 客户看 github.io 会掉信任）

在 **Settings → Pages → Custom domain** 填入 `xiaolicmo.com` 并保存，然后在域名商处添加 DNS：

| 类型 | 主机记录 | 值 |
|---|---|---|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |
| CNAME | www | `<你的用户名>.github.io` |

（可选再加 4 条 IPv6 AAAA 记录：`2606:50c0:8000::153`、`2606:50c0:8001::153`、`2606:50c0:8002::153`、`2606:50c0:8003::153`）

等 DNS 生效后，勾选 **Enforce HTTPS**（证书由 GitHub 自动签发，免费）。

### 4. 提交给 Google（这一步才决定「能不能被搜到」）

1. 打开 [Google Search Console](https://search.google.com/search-console)，添加**网址前缀**资源 `https://xiaolicmo.com`
2. 验证方式选 **HTML 标记**：把给的那段 `<meta name="google-site-verification" ...>` 加到 `src/components/SEO.astro` 里，重新推送
3. 验证通过后：**Sitemaps** → 提交 `sitemap-index.xml`
4. 用 **网址检查** 工具，对首页和三个服务页各点一次「请求编入索引」
5. 顺手也提交 [Bing Webmaster Tools](https://www.bing.com/webmasters)（可直接从 GSC 导入）

### 5. 上线后持续要做的事

- **每月 2–4 篇文章**（`src/content/insights/`），这是唯一能长期带来搜索流量的东西
- 把网站链接放到 LinkedIn 个人资料、播客嘉宾页、行业媒体署名里（外链是最强的收录加速器）
- 每月看一次 Search Console 的「效果」报告：哪些词有曝光、哪些页面被索引

---

## 六、注意事项

- **表单**：GitHub Pages 是纯静态托管，**收不了表单提交**。必须用 Formspree / Tally / Getform 之类的第三方服务，把地址填进 `src/i18n/copy.ts` 的 `CONTACT.form.action`。
- **隐私合规**：联系表单已带 PDPA 要求的同意勾选框。上线前请让专业人士过一遍 `src/i18n/copy.ts` 里的隐私政策文案。
- **被搜索引擎收录需要时间**：新域名通常 3 天到 4 周，不要上线第二天就慌。
- **中英双语**：英文在根路径，中文在 `/zh/`，`SEO.astro` 已自动生成 `hreflang` 互指，避免被判重复内容。新增页面时**记得同时建 `src/pages/xxx.astro` 和 `src/pages/zh/xxx.astro`**。
- **新增文章**：在 `src/content/insights/en/` 和 `zh/` 下放**同名** `.md` 文件即可，两版会自动互指。

---

## 七、已知问题（不要改回去）

1. **没有用 Astro 内置的 `glob()` loader** —— 它依赖链里的 `picomatch` 是纯 CommonJS，在 Vite 8 下会报 `require is not defined` 导致构建失败。`src/content.config.ts` 里已用自写 loader 替代，功能一致。
2. **`js-yaml` 是显式依赖** —— 自定义 loader 用它解析 frontmatter，不要在 `package.json` 里删掉。
3. **`ASTRO_TELEMETRY_DISABLED`** —— 在本机受限环境下 Astro 遥测会因写入 `AppData\Roaming\astro` 失败，构建脚本里已规避。

---

## 八、SEO 已内置的东西

- 每页独立的 `title` / `meta description` / canonical
- 中英 `hreflang` 互指 + `x-default`
- Open Graph / Twitter Card（分享到微信、LinkedIn 有预览图）
- 结构化数据：`Person`、`WebSite`、`ProfessionalService`、`Service`、`FAQPage`、`BlogPosting`、`BreadcrumbList`
- 自动生成 `sitemap-index.xml` + `robots.txt`
- 语义化 HTML、移动端响应式、`prefers-reduced-motion` 支持、跳到主内容链接

**社交分享预览图**（`public/og-image.png`，1200×630）已生成。想改文案或配色就编辑 `scripts/og-image.svg`，然后运行 `npm run og` 重新生成。里面的人名目前是占位的 `Xiaoli`，记得换掉。
