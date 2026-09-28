/**
 * 三项服务的完整文案（中英双语）。
 * ⚠️ 目前是占位文案 —— 请用真实的服务内容、交付物和案例数字替换。
 * 结构保持不变，页面会自动跟着更新。
 */

import type { Lang } from './site';

/** 一段双语文本 */
export type Bi = Record<Lang, string>;
/** 一组双语列表：按语言分组，例如 { en: ['a','b'], zh: ['甲','乙'] } */
export type BiList = Record<Lang, string[]>;
/** 成对的双语条目：中英写在一起，方便对照编辑 */
export type BiPair = { en: string; zh: string };
export type BiPairs = BiPair[];

export interface ServiceStep {
  title: Bi;
  body: Bi;
}

export interface ServiceFaq {
  q: Bi;
  a: Bi;
}

export interface Service {
  slug: string;
  index: string;
  name: Bi;
  /** 卡片上的一句话 */
  tagline: Bi;
  /** 详情页大标题下的说明 */
  summary: Bi;
  /** 详情页头部的三个关键信息 */
  meta: {
    engagement: Bi;
    bestFor: Bi;
    outcome: Bi;
  };
  /** 「如果你遇到这些情况」 */
  problems: BiPairs;
  /** 「你会拿到什么」 */
  deliverables: BiPairs;
  /** 「合作后会发生什么变化」 */
  outcomes: BiPairs;
  /** 合作流程 */
  process: ServiceStep[];
  faq: ServiceFaq[];
  /** 技术标签，卡片上显示 */
  tags: BiList;
  seo: {
    title: Bi;
    description: Bi;
  };
}

export const SERVICES: Service[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'fractional-cmo',
    index: '01',
    name: {
      en: 'Fractional CMO',
      zh: '外聘首席营销官（Fractional CMO）',
    },
    tagline: {
      en: 'Senior marketing leadership, without the full-time price tag.',
      zh: '用三分之一成本，获得一位资深营销负责人。',
    },
    summary: {
      en: 'You need someone who owns marketing strategy, hires and leads the team, and is accountable to the board — but a full-time CMO is 12–18 months and S$300k+ away. I step in two to three days a week, take ownership of the marketing function, and build the system that outlasts my engagement.',
      zh: '你需要有人对营销结果负责、能带团队、能在董事会汇报 —— 但招一位全职 CMO 要等 12–18 个月，成本 30 万新币起。我以每周 2–3 天的节奏介入，接管整个营销职能，并留下一套能长期运转的体系。',
    },
    meta: {
      engagement: {
        en: '6–12 months · 2–3 days/week',
        zh: '6–12 个月 · 每周 2–3 天',
      },
      bestFor: {
        en: 'Series A–C EdTech companies with traction but no senior marketing owner',
        zh: '已有初步增长、但缺少资深营销负责人的 A–C 轮教育科技公司',
      },
      outcome: {
        en: 'A marketing function that runs without you',
        zh: '一套不需要你操心的营销体系',
      },
    },
    problems: [
      {
        en: 'Founders are still doing the marketing themselves, at 11pm, badly.',
        zh: '创始人还在自己写文案、投广告 —— 晚上 11 点，效果还不好。',
      },
      {
        en: 'You are spending on ads and content but cannot explain what is working.',
        zh: '广告和内容都在花钱，但说不清哪一部分真正有效。',
      },
      {
        en: 'You have hired a small marketing team but nobody to lead them.',
        zh: '招了几个人做营销，但没有人带他们、给他们定方向。',
      },
      {
        en: 'The board keeps asking for a marketing plan and you keep improvising.',
        zh: '董事会反复要营销规划，你每次只能临场应付。',
      },
    ],
    deliverables: [
      {
        en: 'A 12-month marketing strategy tied to revenue targets, not vanity metrics',
        zh: '一份与营收目标挂钩的 12 个月营销战略（拒绝虚荣指标）',
      },
      {
        en: 'Positioning, messaging and ICP definition your whole team can use',
        zh: '定位、核心信息与理想客户画像 —— 全团队都能直接使用',
      },
      {
        en: 'A channel plan with budget allocation and expected CAC by channel',
        zh: '渠道规划：预算分配 + 每个渠道的预期获客成本',
      },
      {
        en: 'Hiring plan, scorecards and interview support for your marketing hires',
        zh: '招聘计划、面试评分表，并参与你营销岗位的面试',
      },
      {
        en: 'Weekly leadership of your marketing team and monthly board reporting',
        zh: '每周带你的营销团队复盘，每月向董事会汇报',
      },
      {
        en: 'A measurement stack so every dollar is traceable to pipeline',
        zh: '搭建数据追踪体系，让每一分钱都能追溯到销售线索',
      },
    ],
    outcomes: [
      {
        en: 'Marketing stops being the founder’s side project',
        zh: '营销不再是创始人的副业',
      },
      {
        en: 'Clear reporting: pipeline, CAC and payback visible every month',
        zh: '每月清晰可见：线索量、获客成本、回收周期',
      },
      {
        en: 'A team that knows what to do on Monday morning',
        zh: '团队清楚周一早上该做什么',
      },
      {
        en: 'A documented playbook you keep after the engagement ends',
        zh: '合作结束后留下的完整可复用手册',
      },
    ],
    process: [
      {
        title: { en: 'Diagnose (Weeks 1–3)', zh: '诊断（第 1–3 周）' },
        body: {
          en: 'I interview your team, customers and churned accounts, audit every channel, and put a number on where growth is actually leaking.',
          zh: '我访谈你的团队、现有客户和流失客户，审计所有渠道，找出增长究竟漏在哪里，并量化。',
        },
      },
      {
        title: { en: 'Plan (Weeks 3–5)', zh: '规划（第 3–5 周）' },
        body: {
          en: 'Together we agree the strategy, ICP, channel mix and budget. One page, signed off by the board.',
          zh: '我们一起敲定战略、理想客户画像、渠道组合与预算。浓缩成一页纸，董事会签字确认。',
        },
      },
      {
        title: { en: 'Build (Months 2–4)', zh: '搭建（第 2–4 个月）' },
        body: {
          en: 'We rebuild messaging, launch the priority channels, and fix tracking so results are measurable.',
          zh: '重塑核心信息，启动优先渠道，修好数据追踪，让效果可衡量。',
        },
      },
      {
        title: { en: 'Scale & hand over (Months 4–12)', zh: '放大与交接（第 4–12 个月）' },
        body: {
          en: 'Double down on what works, hire the team, document the playbook, and transition to your in-house leader.',
          zh: '加码有效的部分，招募团队，沉淀手册，最终交接给你自己的营销负责人。',
        },
      },
    ],
    faq: [
      {
        q: {
          en: 'How is a fractional CMO different from a marketing agency?',
          zh: '外聘 CMO 和营销代理公司有什么区别？',
        },
        a: {
          en: 'An agency executes the brief you give them. A fractional CMO writes the brief, owns the number, and manages the agencies. You get accountability, not just deliverables.',
          zh: '代理公司执行你给的 brief；外聘 CMO 制定 brief、对结果负责，并管理这些代理公司。你得到的是责任归属，而不只是一堆交付物。',
        },
      },
      {
        q: {
          en: 'How many days a week do you actually work with us?',
          zh: '你每周实际投入多少天？',
        },
        a: {
          en: 'Two to three days a week, scheduled around your team’s rhythm — including one recurring leadership meeting and monthly board prep.',
          zh: '每周 2–3 天，按你团队的节奏安排，包含固定的管理例会与每月的董事会准备。',
        },
      },
      {
        q: { en: 'What does it cost?', zh: '费用怎么算？' },
        a: {
          en: 'A monthly retainer based on days per month and scope. It is typically 25–40% of the fully loaded cost of a full-time CMO in Singapore.',
          zh: '按月收取顾问费，取决于每月投入天数与范围。通常是新加坡全职 CMO 综合成本的 25–40%。',
        },
      },
      {
        q: {
          en: 'Will you help us hire our own CMO eventually?',
          zh: '你会帮我们最终招到自己的 CMO 吗？',
        },
        a: {
          en: 'Yes — that is the goal. I write the job scorecard, run the search with you, and stay on for a structured handover.',
          zh: '会，这正是目标。我会撰写岗位评分卡、与你一起完成招聘，并留下来做有节奏的交接。',
        },
      },
    ],
    tags: {
      en: ['Strategy', 'Team leadership', 'Board reporting'],
      zh: ['战略', '团队管理', '董事会汇报'],
    },
    seo: {
      title: {
        en: 'Fractional CMO for EdTech Companies in Singapore & Southeast Asia',
        zh: '教育科技外聘 CMO（Fractional CMO）｜新加坡与东南亚',
      },
      description: {
        en: 'Senior marketing leadership two to three days a week. Strategy, team, hiring and board reporting for Series A–C EdTech companies. Book a 30-minute call.',
        zh: '每周 2–3 天的资深营销领导力：战略、团队、招聘与董事会汇报，服务 A–C 轮教育科技公司。预约 30 分钟通话。',
      },
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'edtech-go-to-market',
    index: '02',
    name: {
      en: 'EdTech Go-to-Market',
      zh: '教育科技上市策略（GTM）',
    },
    tagline: {
      en: 'From “schools love the demo” to signed contracts.',
      zh: '从「学校说产品很好」到真正签约。',
    },
    summary: {
      en: 'EdTech has one of the longest, most committee-driven buying processes in B2B. Teachers love you, but procurement signs the cheque nine months later. I build the go-to-market motion that survives that reality — segmented, priced and sequenced for how education actually buys.',
      zh: '教育科技是 B2B 里采购流程最长、决策链最复杂的领域之一。老师很喜欢你的产品，但采购九个月后才签字。我帮你搭一套能扛住这个现实的上市打法 —— 分人群、定价格、排节奏，按教育行业真实的采购方式来。',
    },
    meta: {
      engagement: { en: '6–10 week sprint', zh: '6–10 周冲刺' },
      bestFor: {
        en: 'EdTech products launching, repositioning or entering a new market',
        zh: '正在发布新品、重新定位或进入新市场的教育科技产品',
      },
      outcome: {
        en: 'A go-to-market plan your sales team can actually run',
        zh: '一份销售团队真正能执行的上市方案',
      },
    },
    problems: [
      {
        en: 'Strong product, but every deal feels like a one-off negotiation.',
        zh: '产品很强，但每一单都像是一次性的临时谈判。',
      },
      {
        en: 'You cannot tell which segment — K-12, higher ed or corporate L&D — pays best.',
        zh: '分不清 K-12、高校还是企业培训，哪一类客户最赚钱。',
      },
      {
        en: 'Pricing was set by guessing, and nobody wants to raise it.',
        zh: '定价靠拍脑袋，而且没人敢涨价。',
      },
      {
        en: 'Marketing and sales are telling two different stories.',
        zh: '市场和销售讲的是两套完全不同的故事。',
      },
    ],
    deliverables: [
      {
        en: 'Segment prioritisation with size, willingness to pay and sales-cycle length',
        zh: '人群优先级排序：市场规模、付费意愿、成交周期',
      },
      {
        en: 'Positioning and messaging tested with real buyers in your segments',
        zh: '经过真实买家验证的定位与核心信息',
      },
      {
        en: 'Packaging and pricing architecture, including pilot-to-contract path',
        zh: '产品打包与定价架构，含「试点转正式合同」的路径设计',
      },
      {
        en: 'Buying-committee map: who blocks, who champions, who signs',
        zh: '采购决策地图：谁反对、谁支持、谁签字',
      },
      {
        en: 'Launch plan with channel, content and sales-enablement assets',
        zh: '上市执行计划：渠道、内容与销售赋能物料',
      },
      {
        en: 'Leading indicators to watch weekly during the launch quarter',
        zh: '上市季度每周要盯的先行指标',
      },
    ],
    outcomes: [
      {
        en: 'A repeatable sales narrative instead of founder-led storytelling',
        zh: '可复制的销售话术，不再依赖创始人个人魅力',
      },
      {
        en: 'Shorter, more predictable sales cycles',
        zh: '更短、更可预测的成交周期',
      },
      {
        en: 'Pricing that reflects the value you deliver',
        zh: '反映真实价值的定价',
      },
      {
        en: 'Sales and marketing finally aligned on one ICP',
        zh: '市场与销售终于对齐同一个理想客户画像',
      },
    ],
    process: [
      {
        title: { en: 'Market & buyer research', zh: '市场与买家调研' },
        body: {
          en: 'Win/loss interviews, competitor teardown, and a close look at how your buyers actually get budget approved.',
          zh: '赢单/丢单访谈、竞品拆解，并搞清你的买家到底怎么拿到预算审批。',
        },
      },
      {
        title: { en: 'Positioning & pricing', zh: '定位与定价' },
        body: {
          en: 'We define the wedge, write the messaging, and stress-test pricing with real prospects.',
          zh: '确定切入点，写出核心信息，并用真实潜在客户压力测试定价。',
        },
      },
      {
        title: { en: 'Channel & content plan', zh: '渠道与内容计划' },
        body: {
          en: 'Pick the two channels you can win, and build the content that supports the sales conversation at each stage.',
          zh: '选定两个你能打赢的渠道，并搭建支撑各销售阶段的内容。',
        },
      },
      {
        title: { en: 'Launch & iterate', zh: '上市与迭代' },
        body: {
          en: 'Run the launch quarter with a weekly scorecard and adjust based on leading indicators.',
          zh: '用每周记分卡推进上市季度，依据先行指标快速调整。',
        },
      },
    ],
    faq: [
      {
        q: {
          en: 'We already have a marketing team. Do we still need this?',
          zh: '我们已经有市场团队了，还需要这个吗？',
        },
        a: {
          en: 'Usually yes — the team needs a decision, not more capacity. This sprint produces the positioning and pricing decisions they are waiting for.',
          zh: '通常需要。团队缺的是决策，不是人手。这个冲刺产出的正是他们一直在等的定位与定价决策。',
        },
      },
      {
        q: {
          en: 'Can you work with our existing sales team?',
          zh: '你能和我们现有的销售团队一起工作吗？',
        },
        a: {
          en: 'Yes. Sales leaders and their teams are interviewed in week one, and enablement assets are built with them, not for them.',
          zh: '可以。第一周我就会访谈销售负责人和团队，赋能物料是和他们一起做出来的，不是丢给他们的。',
        },
      },
      {
        q: {
          en: 'What if we sell to both K-12 and higher ed?',
          zh: '我们同时卖给 K-12 和高校怎么办？',
        },
        a: {
          en: 'Then we prioritise. Trying to run two go-to-market motions with one team is the most common reason EdTech launches stall.',
          zh: '那就必须排优先级。用一个团队同时跑两套上市打法，是教育科技新品卡住最常见的原因。',
        },
      },
      {
        q: {
          en: 'How do you measure success?',
          zh: '怎么衡量成败？',
        },
        a: {
          en: 'Qualified pipeline from the priority segment, sales-cycle length, and pilot-to-paid conversion rate.',
          zh: '优先人群带来的合格线索量、成交周期长度、以及试点转付费的转化率。',
        },
      },
    ],
    tags: {
      en: ['Positioning', 'Pricing', 'Launch'],
      zh: ['定位', '定价', '上市'],
    },
    seo: {
      title: {
        en: 'EdTech Go-to-Market Strategy & Pricing | Xiaoli',
        zh: '教育科技上市策略与定价咨询｜Xiaoli',
      },
      description: {
        en: 'A 6–10 week GTM sprint for EdTech products: segment prioritisation, positioning, packaging, pricing and a launch plan your sales team can run.',
        zh: '6–10 周教育科技 GTM 冲刺：人群优先级、定位、打包、定价，以及销售团队真正能执行的上市方案。',
      },
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'demand-generation',
    index: '03',
    name: {
      en: 'Demand Generation & Pipeline',
      zh: '需求生成与销售线索',
    },
    tagline: {
      en: 'Predictable pipeline for a nine-month sales cycle.',
      zh: '为九个月的销售周期，搭建可预测的线索管道。',
    },
    summary: {
      en: 'When your sales cycle is longer than most marketing managers have ever worked, standard demand-gen advice breaks. We build a pipeline system around the way education buyers actually move: long nurture, multiple stakeholders, committee decisions, and budget cycles that follow the school year.',
      zh: '当你的销售周期比大多数市场经理的工龄还长时，常规的增长打法会失效。我们围绕教育买家的真实行为搭管道：长周期培育、多方利益相关者、委员会决策，以及跟着学年走的预算周期。',
    },
    meta: {
      engagement: { en: '3–6 month build', zh: '3–6 个月搭建' },
      bestFor: {
        en: 'EdTech teams with sales capacity but not enough qualified conversations',
        zh: '有销售产能、但合格商机不足的教育科技团队',
      },
      outcome: {
        en: 'A pipeline number you can forecast',
        zh: '一个可以拿来预测的线索数字',
      },
    },
    problems: [
      {
        en: 'Sales says marketing leads are junk. Marketing says sales does not follow up.',
        zh: '销售说线索质量差，市场说销售不跟进。',
      },
      {
        en: 'Traffic and downloads look fine, but nothing turns into conversations.',
        zh: '流量和下载量看着不错，但就是不转化成真实商机。',
      },
      {
        en: 'You cannot forecast next quarter because you do not know your conversion rates.',
        zh: '不知道转化率，所以下季度完全没法预测。',
      },
      {
        en: 'Every lead is treated the same, whether they are a teacher or a ministry director.',
        zh: '不管是普通老师还是教育局负责人，所有线索都被同样对待。',
      },
    ],
    deliverables: [
      {
        en: 'Full funnel measurement: from first touch to closed-won, with real conversion rates',
        zh: '全漏斗度量：从首次触达到成交，算出真实转化率',
      },
      {
        en: 'Lead scoring and routing rules that reflect buying-committee roles',
        zh: '按采购决策角色设计的线索评分与分配规则',
      },
      {
        en: 'Content and nurture tracks built for a 6–12 month consideration window',
        zh: '为 6–12 个月考虑期设计的内容与培育路径',
      },
      {
        en: 'Two paid or organic channels tested to a defensible CAC',
        zh: '测试两个付费或自然渠道，跑出可站得住脚的获客成本',
      },
      {
        en: 'Sales enablement: one-pagers, objection handling, case-study library',
        zh: '销售赋能：一页纸资料、异议处理话术、案例库',
      },
      {
        en: 'A weekly pipeline dashboard your leadership team will actually read',
        zh: '一份管理层真的会看的每周线索看板',
      },
    ],
    outcomes: [
      {
        en: 'Marketing and sales arguing about data, not opinions',
        zh: '市场与销售的争论基于数据，而不是感觉',
      },
      {
        en: 'A forecastable cost per qualified opportunity',
        zh: '可预测的「每个合格商机成本」',
      },
      {
        en: 'Nurture that keeps you present across a school-year budget cycle',
        zh: '在整学年的预算周期里持续出现在客户面前',
      },
      {
        en: 'Fewer leads, more revenue',
        zh: '线索更少，营收更多',
      },
    ],
    process: [
      {
        title: { en: 'Audit the funnel', zh: '审计漏斗' },
        body: {
          en: 'We instrument every stage and find exactly where qualified demand dies.',
          zh: '为每个阶段埋点，精确定位合格需求死在哪一步。',
        },
      },
      {
        title: { en: 'Fix tracking & scoring', zh: '修好追踪与评分' },
        body: {
          en: 'CRM hygiene, attribution and lead scoring — the unglamorous work that makes everything else measurable.',
          zh: 'CRM 数据整洁、归因、线索评分 —— 这些不性感的工作，是其他一切可衡量的前提。',
        },
      },
      {
        title: { en: 'Build nurture & content', zh: '搭建培育与内容' },
        body: {
          en: 'Content mapped to each stage of a long committee-driven decision.',
          zh: '把内容映射到委员会式长决策的每一个阶段。',
        },
      },
      {
        title: { en: 'Test channels to CAC', zh: '把渠道测到获客成本' },
        body: {
          en: 'Two channels, real budget, measured against cost per qualified opportunity — then scale or kill.',
          zh: '两个渠道、真实预算，以「每个合格商机成本」衡量，然后要么加码要么砍掉。',
        },
      },
    ],
    faq: [
      {
        q: {
          en: 'How long before we see results?',
          zh: '多久能看到效果？',
        },
        a: {
          en: 'Tracking and routing improvements show up in 4–6 weeks. Channel-level CAC clarity takes about one quarter. Pipeline impact follows the sales cycle.',
          zh: '追踪与分配的改善 4–6 周内可见；渠道获客成本清晰大约需要一个季度；线索层面的结果则要等一个完整销售周期。',
        },
      },
      {
        q: {
          en: 'Do you run the campaigns or just plan them?',
          zh: '你是亲自执行，还是只做规划？',
        },
        a: {
          en: 'I set up and run the first cycle with your team, then hand over documented playbooks and train whoever runs it next.',
          zh: '第一轮我会和你的团队一起搭建并实操，之后交付成文的手册，并培训后续接手的人。',
        },
      },
      {
        q: {
          en: 'We have a tiny budget. Is this realistic?',
          zh: '我们预算很小，这现实吗？',
        },
        a: {
          en: 'A small budget is a reason to be more disciplined, not less. We pick one channel and prove it before spending on a second.',
          zh: '预算小更需要纪律，而不是更少。我们会先做一个渠道，验证之后再投第二个。',
        },
      },
      {
        q: {
          en: 'Which CRM do you work with?',
          zh: '你用哪个 CRM？',
        },
        a: {
          en: 'HubSpot, Salesforce and Pipedrive most often. The process matters more than the tool.',
          zh: '最常用 HubSpot、Salesforce 和 Pipedrive。流程比工具重要。',
        },
      },
    ],
    tags: {
      en: ['Demand gen', 'Marketing ops', 'CRM'],
      zh: ['需求生成', '营销运营', 'CRM'],
    },
    seo: {
      title: {
        en: 'Demand Generation & B2B Pipeline for EdTech | Xiaoli',
        zh: '教育科技需求生成与 B2B 线索管道｜Xiaoli',
      },
      description: {
        en: 'Build a forecastable pipeline for long education sales cycles: funnel measurement, lead scoring, nurture tracks and channel testing to a defensible CAC.',
        zh: '为长周期教育销售搭建可预测的线索管道：漏斗度量、线索评分、培育路径与渠道获客成本测试。',
      },
    },
  },
];

/** 按 slug 取服务 */
export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
