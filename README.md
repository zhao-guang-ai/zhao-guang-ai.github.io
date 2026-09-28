# Xiaoli — 个人品牌站

新加坡 EduTech CMO 的个人品牌官网：中英双语、纯静态、为「被 Google 搜到」和「承接客户线索」而设计。

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
| `npm run status` | **内容完成度检查**：列出所有还是占位状态的内容，按必需/重要/可选分级，指出改哪个文件 |
| `npm run check` | **类型检查**：改完 `site.ts` / `services.ts` / `copy.ts` 后跑一次，结构写错会立刻报出来，不用等构建失败 |
| `npm run verify` | **构建后自检**：检查 27 个页面的中英文内容、SEO 标签、sitemap、hreflang 是否都正常 |
| `npm run audit:seo` | **页面 SEO 审计**：逐页检查 title/description 长度、H1 数量、标题层级、正文长度、图片 alt、内链数量 |
| `npm run audit:a11y` | **无障碍审计**：配色对比度（WCAG AA）+ 每页的 lang、landmark、表单标签、链接可读名、重复 id、alt |
| `npm run preflight` | **上线前预检**：校验 GitHub Actions 工作流、Node 版本要求、lockfile、robots.txt 是否就绪 |
| `npm run serve` | 用一个极简静态服务器预览 `dist/`（`node scripts/serve.mjs 4321`） |
| `npm run og` | 改了 `scripts/og-image.svg` 后重新生成社交分享图 |

**推荐的改动流程**：改内容 → `npm run check` → `npm run build` → `npm run verify` → `npm run audit:seo` → `npm run audit:a11y`。

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

**⚠️ 仓库名必须是 `zhao-guang-ai.github.io`**，原因见下面的说明。

在 GitHub 上新建一个仓库（**不要**勾选 Add README / .gitignore / license，否则推送会冲突），名字填：

```
zhao-guang-ai.github.io
```

建好后在本地执行：

```powershell
cd C:\Users\Acer\Desktop\xiaoli-site
git remote add origin https://github.com/zhao-guang-ai/zhao-guang-ai.github.io.git
git push -u origin main
```

> **建议设为 Public。** 免费账号的 GitHub Pages 对私有仓库的支持有版本限制，Public 是一定能用的。
> 本站源码里没有任何密钥（`.gitignore` 已排除 `.env`），公开没有安全风险。

**为什么仓库名不能随便取？**

GitHub Pages 有两种发布形态：

| 仓库名 | 发布地址 | 本站能否正常显示 |
|---|---|---|
| `zhao-guang-ai.github.io` | `https://zhao-guang-ai.github.io/`（根路径） | ✅ 可以 |
| 其他名字，如 `xiaoli-site` | `https://zhao-guang-ai.github.io/xiaoli-site/`（多一层子路径） | ❌ 不行 |

原因是本站的 CSS 和图片用的是**根路径**（`/_astro/...`）。放在子路径下会全部 404，页面变成没有样式的白板。要修就得设置 `base`，但那样将来绑定自有域名时又会反过来坏掉。

用 `zhao-guang-ai.github.io` 这个仓库名，**现在能看、以后绑 `xiaolicmo.com` 也不用改代码**。每个账号只能有一个这样的仓库。

### 2. 打开 GitHub Pages

仓库 → **Settings** → **Pages** → **Source** 选 **GitHub Actions**。
推送后 Actions 会自动构建并发布，几十秒后访问 `https://zhao-guang-ai.github.io/`。

### 3. 绑定自定义域名（强烈建议，B2B 客户看 github.io 会掉信任）

在 **Settings → Pages → Custom domain** 填入 `xiaolicmo.com` 并保存，然后在域名商处添加 DNS：

| 类型 | 主机记录 | 值 |
|---|---|---|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |
| CNAME | www | `zhao-guang-ai.github.io` |

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
  **只写一种语言也没问题** —— 系统会自动检测译文是否存在：没有译文时不输出指向 404 的 `hreflang`，页面底部也不显示语言切换链接。等你补上译文，下次构建会自动接上。

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
