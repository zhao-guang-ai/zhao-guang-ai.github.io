/**
 * 页面文案（中英双语）。
 * ⚠️ 全部是占位内容 —— 拿到真实素材后，只需要改这个文件，
 * 页面结构会自动跟着变。
 */

import type { Lang } from '../data/site';

type Bi = Record<Lang, string>;
type BiList = Record<Lang, string[]>;

/* ==================================================================== */
/* 首页                                                                  */
/* ==================================================================== */

export const HOME = {
  hero: {
    eyebrow: {
      en: 'Fractional CMO · Singapore & Southeast Asia',
      zh: '外聘首席营销官 · 新加坡与东南亚',
    } as Bi,
    /** 标题里用 <em> 包住的部分会显示成强调色斜体 */
    title: {
      en: 'Marketing leadership for EdTech companies that have outgrown guesswork.',
      zh: '为已经不能再靠猜的教育科技公司，提供营销领导力。',
    } as Bi,
    lede: {
      en: 'I am Xiaoli — a fractional CMO who has spent the last decade taking education products from pilot programmes to signed contracts. Two to three days a week, I own the marketing number and build the team that keeps hitting it.',
      zh: '我是 Xiaoli，一位外聘首席营销官。过去十年，我把教育产品从「试点项目」一路带到「正式签约」。每周 2–3 天，我对营销结果负责，并帮你搭出一支能持续达标的团队。',
    } as Bi,
    note: {
      en: 'Currently taking on two new clients for Q3.',
      zh: '本季度开放两个新客户名额。',
    } as Bi,
  },

  stats: [
    {
      value: '10+',
      label: { en: 'Years in EdTech marketing', zh: '年教育科技营销经验' } as Bi,
    },
    {
      value: 'S$40M+',
      label: { en: 'Pipeline influenced', zh: '影响产生的销售管道' } as Bi,
    },
    {
      value: '12',
      label: { en: 'Marketing teams built', zh: '支从零搭建的营销团队' } as Bi,
    },
    {
      value: 'SEA',
      label: { en: 'Singapore · Indonesia · Vietnam', zh: '新加坡 · 印尼 · 越南' } as Bi,
    },
  ],

  logos: {
    label: {
      en: 'Teams I have worked with',
      zh: '合作过的团队',
    } as Bi,
    /** TODO: 换成真实客户/雇主名称，注意 NDA */
    items: ['EduScale', 'LearnLoop', 'K12 Labs', 'Campus Cloud', 'SkillBridge'],
  },

  services: {
    eyebrow: { en: 'How I can help', zh: '我能帮你做什么' } as Bi,
    heading: {
      en: 'Three ways to work together.',
      zh: '三种合作方式。',
    } as Bi,
    lede: {
      en: 'Most EdTech companies do not need another agency. They need someone who owns the strategy, makes the calls, and is accountable for the number.',
      zh: '大多数教育科技公司缺的不是又一家代理公司，而是一个真正对战略拍板、对结果负责的人。',
    } as Bi,
  },

  proof: {
    eyebrow: { en: 'What clients say', zh: '客户怎么说' } as Bi,
    heading: { en: 'Results, not retainers.', zh: '要的是结果，不是按时收费。' } as Bi,
    /** TODO: 换成真实客户评价，务必取得对方同意 */
    items: [
      {
        text: {
          en: 'We had a great product and no idea who to sell it to. Within one quarter we had a clear ICP, a pricing model that stopped the discounting, and a pipeline we could actually forecast.',
          zh: '我们产品很好，但完全不知道该卖给谁。一个季度内，我们有了清晰的客户画像、一套止住砍价的定价模型，还有一条终于能拿来预测的管道。',
        } as Bi,
        cite: {
          en: 'CEO, Series B K-12 platform',
          zh: '某 B 轮 K-12 平台 CEO',
        } as Bi,
      },
      {
        text: {
          en: 'The first thing she did was kill half our channels. It was uncomfortable and it was right — our cost per qualified opportunity dropped by a third in two months.',
          zh: '她做的第一件事就是砍掉我们一半的渠道。当时很难受，但完全正确 —— 两个月内我们的合格商机成本降了三分之一。',
        } as Bi,
        cite: {
          en: 'CMO, higher-ed SaaS',
          zh: '某高校 SaaS 公司 CMO',
        } as Bi,
      },
      {
        text: {
          en: 'She hired and coached our marketing lead, then handed over a playbook we still use two years later. That is the opposite of how agencies work.',
          zh: '她帮我们招到并带出了自己的市场负责人，交接的手册我们两年后还在用。这和代理公司的做法完全相反。',
        } as Bi,
        cite: {
          en: 'Founder, corporate L&D startup',
          zh: '某企业培训创业公司创始人',
        } as Bi,
      },
    ],
  },

  about: {
    eyebrow: { en: 'About', zh: '关于我' } as Bi,
    heading: {
      en: 'I have sat in your chair.',
      zh: '你现在的处境，我经历过。',
    } as Bi,
    body: {
      en: [
        'I started in growth marketing at a Singapore EdTech company where the sales cycle was nine months and every deal needed three signatures. Everything I know about this industry, I learned by being accountable for the number.',
        'Since then I have led marketing as a CMO and as a fractional partner for platforms serving K-12, higher education and corporate learning across Southeast Asia. I have run launches that worked and a couple that did not, which is where the useful lessons came from.',
        'Today I work with a small number of companies at a time, two to three days a week each, so that the advice stays specific and the accountability stays real.',
      ],
      zh: [
        '我职业生涯的起点，是一家新加坡教育科技公司的增长营销岗 —— 销售周期九个月，每一单都要三个签字。我关于这个行业的所有认知，都来自「必须对结果负责」这件事。',
        '此后我以 CMO 和外聘合伙人的身份，为东南亚的 K-12、高等教育和企业培训平台负责营销。我做过成功的发布，也搞砸过一两次 —— 真正有用的经验都来自后者。',
        '现在我只同时服务少数几家公司，每家每周投入 2–3 天 —— 这样建议才能具体，责任才不是空话。',
      ],
    } as BiList,
    bullets: {
      en: [
        'B2B marketing leadership in education technology',
        'Go-to-market strategy for long, committee-driven sales cycles',
        'Building and coaching in-house marketing teams',
        'Marketing operations, attribution and forecasting',
      ],
      zh: [
        '教育科技领域的 B2B 营销领导力',
        '面向长周期、委员会式决策的上市策略',
        '从零搭建并培养内部营销团队',
        '营销运营、归因与预测体系',
      ],
    } as BiList,
  },

  insights: {
    eyebrow: { en: 'Insights', zh: '洞察文章' } as Bi,
    heading: {
      en: 'Notes on marketing education products.',
      zh: '关于教育产品营销的思考。',
    } as Bi,
    lede: {
      en: 'Practical writing on go-to-market, pricing and demand generation for people selling into schools, universities and corporate learning teams.',
      zh: '写给「把产品卖进学校、高校和企业培训部门」的人：关于上市、定价与需求生成的实战笔记。',
    } as Bi,
  },
};

/* ==================================================================== */
/* 关于页                                                                */
/* ==================================================================== */

export const ABOUT = {
  eyebrow: { en: 'About Xiaoli', zh: '关于 Xiaoli' } as Bi,
  title: {
    en: 'A marketing leader who has carried the number.',
    zh: '一个真正扛过业绩数字的营销负责人。',
  } as Bi,
  lede: {
    en: 'Ten years in education technology, on both the agency side and in the room where the budget gets approved.',
    zh: '十年教育科技经验 —— 既待过代理公司，也坐在过批预算的那间会议室里。',
  } as Bi,

  story: {
    heading: { en: 'The short version', zh: '简短版' } as Bi,
    body: {
      en: [
        'I began my career in growth marketing at a Singapore-based EdTech company, learning very quickly that education does not buy like enterprise software. Teachers champion you, procurement questions you, and the budget is decided months before anyone signs.',
        'I moved from there into marketing leadership — first as a head of marketing building small teams, then as a CMO responsible for the whole function, and now as a fractional partner to a handful of companies at a time.',
        'The work I enjoy most is the unglamorous middle: choosing what not to do, fixing the tracking nobody wants to touch, and hiring people better than me.',
      ],
      zh: [
        '我的职业生涯始于一家新加坡教育科技公司的增长营销岗。我很快明白：教育行业的采购方式和企业软件完全不同。老师会为你说话，采购会质疑你，而预算早在签字前几个月就定了。',
        '之后我走上营销管理岗 —— 先是市场负责人，从零搭小团队；再是 CMO，对整个职能负责；现在是外聘合伙人，同时服务少数几家公司。',
        '我最享受的其实是最不性感的那部分：决定「不做什么」、修好没人愿意碰的数据追踪、以及招到比我更强的人。',
      ],
    } as BiList,
  },

  /** TODO: 换成真实履历 */
  timeline: [
    {
      period: '2023 — now',
      role: { en: 'Fractional CMO', zh: '外聘首席营销官' } as Bi,
      org: { en: 'Independent practice, Singapore', zh: '独立顾问 · 新加坡' } as Bi,
      note: {
        en: 'Two to three concurrent clients across K-12, higher ed and corporate learning.',
        zh: '同时服务 2–3 家客户，覆盖 K-12、高校与企业培训。',
      } as Bi,
    },
    {
      period: '2020 — 2023',
      role: { en: 'Chief Marketing Officer', zh: '首席营销官' } as Bi,
      org: { en: 'Series B EdTech platform', zh: '某 B 轮教育科技平台' } as Bi,
      note: {
        en: 'Built the marketing function from three people to fourteen across three markets.',
        zh: '把营销团队从 3 人扩展到 14 人，覆盖三个市场。',
      } as Bi,
    },
    {
      period: '2017 — 2020',
      role: { en: 'Head of Marketing', zh: '市场负责人' } as Bi,
      org: { en: 'Higher-education SaaS', zh: '某高校 SaaS 公司' } as Bi,
      note: {
        en: 'Owned demand generation and repositioned the product for a new segment.',
        zh: '负责需求生成，并为新产品人群完成重新定位。',
      } as Bi,
    },
    {
      period: '2014 — 2017',
      role: { en: 'Growth Marketing', zh: '增长营销' } as Bi,
      org: { en: 'EdTech startup, Singapore', zh: '教育科技创业公司 · 新加坡' } as Bi,
      note: {
        en: 'Where the nine-month sales cycle taught me everything.',
        zh: '九个月的销售周期，教会了我一切。',
      } as Bi,
    },
  ],

  expertise: {
    heading: { en: 'Where I am useful', zh: '我擅长的地方' } as Bi,
    groups: [
      {
        title: { en: 'Strategy & positioning', zh: '战略与定位' } as Bi,
        items: {
          en: [
            'Segment prioritisation and ICP definition',
            'Positioning and message testing with real buyers',
            'Packaging and pricing architecture',
            'Competitive and category analysis',
          ],
          zh: ['人群优先级与客户画像', '定位与真实买家信息测试', '打包与定价架构', '竞品与品类分析'],
        } as BiList,
      },
      {
        title: { en: 'Growth & demand generation', zh: '增长与需求生成' } as Bi,
        items: {
          en: [
            'Paid and organic channel strategy',
            'Full-funnel measurement and attribution',
            'Lead scoring, routing and nurture design',
            'Cost per qualified opportunity reduction',
          ],
          zh: ['付费与自然渠道策略', '全漏斗度量与归因', '线索评分、分配与培育设计', '降低每个合格商机成本'],
        } as BiList,
      },
      {
        title: { en: 'Team & operations', zh: '团队与运营' } as Bi,
        items: {
          en: [
            'Marketing hiring plans and interview scorecards',
            'Coaching first-time marketing managers',
            'Agency selection and management',
            'Board reporting and marketing forecasting',
          ],
          zh: ['营销招聘计划与面试评分卡', '带教新任市场经理', '代理公司筛选与管理', '董事会汇报与营销预测'],
        } as BiList,
      },
    ],
  },

  press: {
    heading: { en: 'Speaking & writing', zh: '演讲与撰稿' } as Bi,
    /** TODO: 换成真实的媒体署名、播客、演讲记录 */
    items: [
      { name: 'EdTech Southeast Asia Summit', note: { en: 'Panel speaker, 2025', zh: '圆桌嘉宾，2025' } as Bi },
      { name: 'e27', note: { en: 'Contributor on EdTech growth', zh: '教育科技增长专栏作者' } as Bi },
      { name: 'EdSurge', note: { en: 'Guest commentary', zh: '特邀评论' } as Bi },
    ],
  },
};

/* ==================================================================== */
/* 联系页                                                                */
/* ==================================================================== */

export const CONTACT = {
  title: { en: 'Let’s talk.', zh: '聊聊吧。' } as Bi,
  lede: {
    en: 'The fastest route is a 30-minute call. If you would rather write first, the form below reaches me directly — I reply within one working day.',
    zh: '最快的方式是直接约 30 分钟通话。如果你更愿意先写邮件，下面的表单会直接发到我这里 —— 一个工作日内回复。',
  } as Bi,

  form: {
    heading: { en: 'Send me a message', zh: '给我留言' } as Bi,
    name: { en: 'Your name', zh: '你的名字' } as Bi,
    email: { en: 'Work email', zh: '工作邮箱' } as Bi,
    company: { en: 'Company', zh: '公司' } as Bi,
    topic: { en: 'What do you need help with?', zh: '你需要哪方面的帮助？' } as Bi,
    topicOptions: {
      en: ['Fractional CMO', 'Go-to-market', 'Demand generation', 'Something else'],
      zh: ['外聘 CMO', '上市策略', '需求生成', '其他'],
    } as BiList,
    message: { en: 'Tell me a bit about the situation', zh: '简单描述一下你的情况' } as Bi,
    messagePlaceholder: {
      en: 'Where is growth stuck right now?',
      zh: '目前增长卡在哪里？',
    } as Bi,
    consent: {
      en: 'I agree that my details may be stored and used to respond to this enquiry, as described in the privacy policy.',
      zh: '我同意按隐私政策所述，存储并使用我的信息以回复本次咨询。',
    } as Bi,
    submit: { en: 'Send message', zh: '发送' } as Bi,
    /** TODO: 接入 Tally / Formspree 的表单地址 */
    action: 'https://formspree.io/f/REPLACE_ME',
  },

  next: {
    heading: { en: 'What happens next', zh: '接下来会发生什么' } as Bi,
    steps: [
      {
        title: { en: 'You send a message', zh: '你发来消息' } as Bi,
        body: {
          en: 'A short note about your product, market and what is not working.',
          zh: '简单说说你的产品、市场和目前不顺的地方。',
        } as Bi,
      },
      {
        title: { en: 'We have a 30-minute call', zh: '我们通一次 30 分钟的电话' } as Bi,
        body: {
          en: 'No deck, no pitch. I ask questions and tell you honestly whether I am the right person.',
          zh: '不用准备材料，也不用听我推销。我问问题，并诚实告诉你我是不是合适的人。',
        } as Bi,
      },
      {
        title: { en: 'You get a written proposal', zh: '你会收到一份书面方案' } as Bi,
        body: {
          en: 'Scope, days per month, deliverables and fee — on one page, within three working days.',
          zh: '范围、每月投入天数、交付物与费用 —— 三页以内，三个工作日内发出。',
        } as Bi,
      },
    ],
  },

  direct: {
    heading: { en: 'Or reach me directly', zh: '或者直接联系我' } as Bi,
    // 邮箱显示给人类，但 href 里做了简单防护，减少爬虫抓取
    emailLabel: 'hello [at] xiaolicmo [dot] com',
  },
};

/* ==================================================================== */
/* 隐私政策（新加坡 PDPA 合规用，正式上线前请找专业人士过一遍）           */
/* ==================================================================== */

export const PRIVACY = {
  title: { en: 'Privacy Policy', zh: '隐私政策' } as Bi,
  updated: { en: 'Last updated: 1 January 2026', zh: '最后更新：2026 年 1 月 1 日' } as Bi,
  intro: {
    en: 'This policy explains what personal data this website collects, why, and how it is handled, in line with Singapore’s Personal Data Protection Act (PDPA).',
    zh: '本政策说明本网站收集哪些个人数据、收集原因，以及如何处理这些数据，符合新加坡《个人资料保护法》（PDPA）的要求。',
  } as Bi,
  sections: [
    {
      heading: { en: 'What we collect', zh: '我们收集什么' } as Bi,
      body: {
        en: [
          'When you submit the contact form, we collect the name, email address, company name and message you provide.',
          'If you book a call, scheduling and calendar data is handled by the booking provider under their own privacy policy.',
          'Anonymous usage statistics may be collected to understand which pages are useful. These do not identify you personally.',
        ],
        zh: [
          '当你提交联系表单时，我们会收集你填写的姓名、邮箱、公司名称与留言内容。',
          '当你预约通话时，排期与日历数据由预约服务商按其自身隐私政策处理。',
          '我们可能收集匿名访问统计，用于了解哪些页面更有用；这些数据不会识别到个人。',
        ],
      } as BiList,
    },
    {
      heading: { en: 'Why we collect it', zh: '收集目的' } as Bi,
      body: {
        en: [
          'To respond to your enquiry and provide the services you ask about.',
          'To send you information you have explicitly requested, such as a downloadable resource.',
          'To meet legal and accounting obligations.',
        ],
        zh: [
          '回复你的咨询，并提供你所需要的服务。',
          '发送你明确索取的信息，例如可下载的资料。',
          '履行法律与财务合规义务。',
        ],
      } as BiList,
    },
    {
      heading: { en: 'Consent and withdrawal', zh: '同意与撤回' } as Bi,
      body: {
        en: [
          'We only collect data you submit voluntarily, and we ask for consent before storing it.',
          'You may withdraw consent at any time by emailing us. We will stop using your data and delete it unless we are required to keep it by law.',
          'Marketing emails always include an unsubscribe link.',
        ],
        zh: [
          '我们只收集你主动提交的数据，并在存储前征得你的同意。',
          '你可以随时发邮件撤回同意。除法律要求保留外，我们将停止使用并删除你的数据。',
          '所有营销邮件都会附带退订链接。',
        ],
      } as BiList,
    },
    {
      heading: { en: 'Sharing and retention', zh: '共享与保存期限' } as Bi,
      body: {
        en: [
          'We do not sell your personal data.',
          'Data may be processed by service providers such as form, scheduling, email and hosting providers, strictly to deliver the service.',
          'Enquiry data is retained for up to 24 months unless a client relationship requires longer.',
        ],
        zh: [
          '我们不会出售你的个人数据。',
          '数据可能由表单、排期、邮件与托管服务商处理，仅限于提供服务之目的。',
          '咨询数据最多保存 24 个月，除非因客户关系需要更长时间。',
        ],
      } as BiList,
    },
    {
      heading: { en: 'Your rights and contact', zh: '你的权利与联系方式' } as Bi,
      body: {
        en: [
          'You may request access to, correction of, or deletion of your personal data.',
          'To make a request, email hello [at] xiaolicmo [dot] com and we will respond within 30 days.',
        ],
        zh: [
          '你可以要求查阅、更正或删除你的个人数据。',
          '如需提出请求，请发送邮件至 hello [at] xiaolicmo [dot] com，我们将在 30 天内回复。',
        ],
      } as BiList,
    },
  ],
};

/* ==================================================================== */
/* 列表页通用                                                            */
/* ==================================================================== */

export const LIST = {
  services: {
    eyebrow: { en: 'Services', zh: '服务' } as Bi,
    title: { en: 'Ways to work together.', zh: '合作方式。' } as Bi,
    lede: {
      en: 'Three engagement models, all built around the same principle: senior ownership, clear deliverables, and a number we both agree on.',
      zh: '三种合作模式，遵循同一个原则：资深的人负责、交付物清晰、双方对同一个数字负责。',
    } as Bi,
  },
  work: {
    eyebrow: { en: 'Case studies', zh: '客户案例' } as Bi,
    title: { en: 'What changed, and by how much.', zh: '发生了什么变化，变化了多少。' } as Bi,
    lede: {
      en: 'Selected engagements. Some client names are withheld under NDA — the numbers are real.',
      zh: '部分合作案例。有些客户名称因保密协议未披露，但数字是真实的。',
    } as Bi,
  },
  insights: {
    eyebrow: { en: 'Insights', zh: '洞察文章' } as Bi,
    title: { en: 'Writing on EdTech marketing.', zh: '关于教育科技营销的写作。' } as Bi,
    lede: {
      en: 'Go-to-market, pricing, demand generation and the realities of selling into education.',
      zh: '上市、定价、需求生成，以及把产品卖进教育行业的真实情况。',
    } as Bi,
  },
};
