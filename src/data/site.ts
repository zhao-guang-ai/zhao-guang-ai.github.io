/**
 * 站点全局配置 —— 真实信息到位后，先改这个文件。
 * 这里出现的所有占位值都标了 TODO。
 */

export type Lang = 'en' | 'zh';

export const SITE = {
  /** TODO: 买好域名后同步修改 astro.config.mjs 里的 site */
  url: 'https://xiaolicmo.com',

  /** TODO: 真实姓名。中英两版可以不一样 */
  name: { en: 'Xiaoli Chen', zh: 'Xiaoli Chen' } as Record<Lang, string>,

  /** 品牌短名（logo 位置显示） */
  shortName: 'Xiaoli',

  /** TODO: 一句话头衔，会出现在 logo 下方和 Google 标题里 */
  role: {
    en: 'Fractional CMO for EduTech',
    zh: '教育科技 · 外聘首席营销官',
  } as Record<Lang, string>,

  /** TODO: 联系方式 —— 邮箱建议保留在表单之后，避免被爬虫抓取 */
  email: 'hello@xiaolicmo.com',
  /** TODO: 换成真实的 Calendly 预约链接 */
  calendly: 'https://calendly.com/xiaoli/30min',
  linkedin: 'https://www.linkedin.com/in/xiaoli',
  /** TODO: 可选，填了才会在联系页显示 WhatsApp 按钮 */
  whatsapp: '',
  x: '',

  location: { en: 'Singapore', zh: '新加坡' } as Record<Lang, string>,

  ogImage: '/og-image.png',
};

export type NavKey =
  | 'home'
  | 'about'
  | 'services'
  | 'work'
  | 'insights'
  | 'contact';

export const NAV_ITEMS: {
  key: NavKey;
  path: string;
  label: Record<Lang, string>;
}[] = [
  { key: 'home', path: '/', label: { en: 'Home', zh: '首页' } },
  { key: 'about', path: '/about', label: { en: 'About', zh: '关于我' } },
  { key: 'services', path: '/services', label: { en: 'Services', zh: '服务' } },
  { key: 'work', path: '/work', label: { en: 'Case Studies', zh: '客户案例' } },
  { key: 'insights', path: '/insights', label: { en: 'Insights', zh: '洞察文章' } },
  { key: 'contact', path: '/contact', label: { en: 'Contact', zh: '联系' } },
];

/** 把语言无关的路径转成带语言前缀的真实链接 */
export function href(lang: Lang, path: string): string {
  if (lang === 'en') return path === '/' ? '/' : path;
  return path === '/' ? '/zh/' : `/zh${path}`;
}

/** 同一个页面在另一种语言下的地址（用于语言切换和 hreflang） */
export function altHref(lang: Lang, path: string): string {
  return href(lang === 'en' ? 'zh' : 'en', path);
}

/** 页面语言对应的 <html lang> 值，SEO 和读屏软件都依赖它 */
export const htmlLang: Record<Lang, string> = {
  en: 'en-SG',
  zh: 'zh-CN',
};

/** 通用 UI 文案 */
export const UI = {
  bookCall: { en: 'Book a 30-min call', zh: '预约 30 分钟通话' },
  viewAllServices: { en: 'View all services', zh: '查看全部服务' },
  readMore: { en: 'Read more', zh: '阅读全文' },
  allInsights: { en: 'All insights', zh: '全部文章' },
  allWork: { en: 'All case studies', zh: '全部案例' },
  switchLang: { en: '中文', zh: 'EN' },
  skipToContent: { en: 'Skip to content', zh: '跳到主要内容' },
  menu: { en: 'Menu', zh: '菜单' },
  emailMe: { en: 'Email me', zh: '发邮件给我' },
  connectLinkedIn: { en: 'Connect on LinkedIn', zh: '在 LinkedIn 联系我' },
  whatsapp: { en: 'WhatsApp', zh: 'WhatsApp' },
  home: { en: 'Home', zh: '首页' },
  minRead: { en: 'min read', zh: '分钟阅读' },
} as const;
