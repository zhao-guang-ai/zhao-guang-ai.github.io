# AGENTS.md

给 AI 编码代理（Codex、Claude Code 等）的工作说明。

这个仓库是一个**中英双语的静态网站**（Astro 7 + GitHub Pages），
所有者是新加坡的 EduTech 外聘 CMO 汪小力。
最常见的任务是**新增或修改文章**，而不是改代码。

---

## 最重要的三条规则

### 1. 不要编造任何数据、案例、客户名或统计数字

这是本仓库风险最高的地方。网站上有客户案例和成果数字，**潜在客户会去核实**。

- 用户没提供的数据，就保持没有
- 不要「帮忙补一个合理的数字」，哪怕是明显的占位也不行
- 如果原文提到某个结论但缺少支撑，提醒用户补充，而不是自己造

### 2. 只改用户明确要求改的文件

不要顺手：
- 重排其他文章的格式
- 更新 README 或文档
- 修改样式、配置、依赖
- 「优化」你没被要求的代码

需要改动范围之外的东西时，**先问**。

### 3. 改完必须跑验证

```bash
npm run verify:all
```

它会依次跑类型检查、构建、产物自检、SEO 审计、无障碍审计、上线预检。
**任何一步失败都不要提交** —— 修好再说。只看退出码，不要靠肉眼看输出。

---

## 内容结构

文章和案例都是 Markdown，中英两版放在不同语言目录、**文件名必须完全相同**
（系统靠这个做 hreflang 互指）：

```
src/content/insights/en/<slug>.md
src/content/insights/zh/<slug>.md
src/content/work/en/<slug>.md
src/content/work/zh/<slug>.md
```

**slug 规则**：全小写、只用字母数字和短横线、不能有中文或空格。例如 `edutech-pricing-guide`。

### 语言不写在 frontmatter 里

⚠️ **frontmatter 里不要写 `lang` 字段。**

语言由文件所在的 `en/` 或 `zh/` 目录自动决定（见 `src/content.config.ts`）。
写了 `lang` 也会被 schema 剥掉，而且可能误导后来的人。

### 文章（insights）的 frontmatter

```yaml
---
title: '页面上的大标题，可以完整有描述性'
seoTitle: '搜索结果里的标题，可省略；超过约 60 字符会被 Google 截断时用它写短版'
description: '搜索结果里标题下的两行字。英文 120–155 字符，中文 60–78 字'
pubDate: 2026-03-04
updatedDate: 2026-03-10   # 可选，修改旧文章时填
tags: ['外聘 CMO', '定价']  # 2–4 个
featured: false           # true 则出现在首页（首页最多显示 3 篇）
draft: false              # true 则不发布，也不进 sitemap
---

正文用 Markdown，## 做小标题。
```

### 客户案例（work）的 frontmatter

```yaml
---
title: '...'
seoTitle: '...'                                    # 可选
client: '某 B 轮 K-12 平台（因保密协议未披露名称）'   # 没授权就用匿名描述
industry: 'K-12'                                   # K-12 / 高校教育 / 企业培训 / 其他
description: '一句话摘要，建议带上最亮眼的数字'
pubDate: 2026-01-20
metrics:
  - label: '合格商机成本'
    value: '-34%'
services: ['定位', '定价']
featured: true
draft: false
---
```

### 完整字段定义

以 `src/content.config.ts` 里的 Zod schema 为准。**不要凭记忆写字段名。**

---

## 正文写作规范

- 文章长度：英文 900 词以上，中文 1200 字以上
- 用 `##` 分 4–6 个小节
- **每篇至少链到 1–2 个站内页面**（其他文章或服务页）。链接用站点相对路径：
  - 英文页：`/insights/xxx`、`/services/fractional-cmo`
  - 中文页：`/zh/insights/xxx`、`/zh/services/fractional-cmo`
- 结尾自然引导到 `/contact` 或 `/zh/contact`，不要硬推销
- 避免「在当今快速发展的时代」「本文将探讨」这类空话

### 服务页路径

| 英文 | 中文 |
|---|---|
| `/services/fractional-cmo` | `/zh/services/fractional-cmo` |
| `/services/edutech-go-to-market` | `/zh/services/edutech-go-to-market` |
| `/services/demand-generation` | `/zh/services/demand-generation` |

---

## 其他约定

- **行业用词统一写 `EduTech`**（不是 EdTech），中文写「教育科技」
- 图片放在 `public/images/`，Markdown 里用 `/images/文件名` 引用
- 改内容不需要动 `src/pages/`、`src/components/`、`src/styles/`
- 提交信息用中文，说清做了什么

---

## 出错了怎么排查

| 现象 | 多半是 |
|---|---|
| 构建报 `data does not match collection schema` | frontmatter 字段名或类型写错，对照 `src/content.config.ts` |
| 构建报 `内容文件必须放在 en/ 或 zh/ 子目录下` | 文件放错目录了 |
| 文章没出现在网站上 | frontmatter 里 `draft: true` |
| 中文版页面打不开 | 缺 `zh/` 目录下的同名文件，或文件名不一致 |
| 构建报 `File path must be relative to the site root` | 内容 loader 出了跨平台路径问题，见 `src/content.config.ts` 的注释 |

---

## 项目背景（判断取舍时参考）

- 这个网站的目标是**被 Google 搜到并带来客户线索**，不是展示技术
- 所以：SEO 正确性 > 视觉花哨；内容真实 > 内容多
- 用户（网站所有者）是**非技术背景的市场负责人**，用 ChatGPT 辅助写作
- 她可能通过内容后台（`/admin/`）或直接让 AI 代理改文件来发布内容 —— 两条路产出的都是同一批 Markdown
