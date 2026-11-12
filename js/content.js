// ─────────────────────────────────────────────────────────────
//  ALL SITE CONTENT LIVES HERE. Edit this file, nothing else.
//  Anything marked TODO is a placeholder — replace before launch,
//  then set `draft: false` to remove the "draft" ribbon.
// ─────────────────────────────────────────────────────────────
export const content = {
  draft: false,

  name: "Bharath V L",
  initials: "BVL",
  role: "Supply Chain AI Solution Lead",
  tagline:
    "I help enterprise retailers put AI agents to work in their supply chains — from finding the right use case to shipping workflows people actually use.",
  availability: "Open to new roles",
  location: "Bengaluru, India",
  email: "Bharathvl92@gmail.com",

  links: {
    linkedin: "https://www.linkedin.com/in/bharath-v-l-16683179",
    github: "", // TODO: https://github.com/...
    resume: "", // optional: put resume.pdf in /assets and set "assets/resume.pdf"
  },

  stats: [
    { value: 9, suffix: "+", label: "Years in enterprise tech" },
    { value: 25, suffix: "+", label: "Platform features delivered" },
    { value: 10, suffix: "", label: "Enterprise retail accounts" },
    { prefix: "$", value: 1, suffix: "M+", label: "Billable revenue delivered" },
  ],

  about: {
    heading: "The 30-second version",
    paragraphs: [
      "Supply chain technology and AI solution leader with 9+ years across enterprise implementation, product ownership and software engineering — including 5+ years at Manhattan Associates on Manhattan Active Omni, a supply chain commerce and order management platform.",
      "I sit between business and technology: I work with process owners to find where AI genuinely helps, define scope and success metrics, then build the agent workflows myself and track the operational impact.",
    ],
    highlights: [
      "Hit 100%+ of annual billable revenue targets every year at Manhattan Associates",
      "Created Agent Foundry, an AI agent marketplace for enterprise customers",
      "Champion AI co-worker adoption through Manhattan India’s mAIn Council",
    ],
  },

  career: [
    {
      period: "May 2021 — Present",
      company: "Manhattan Associates",
      role: "Lead Consultant",
      location: "Bengaluru, India",
      summary:
        "Leading AI agent initiatives and Manhattan Active Omni enhancements for enterprise retail clients, across order orchestration, inventory, fulfilment, returns, payments and tax.",
      wins: [
        "Drive AI agent initiatives end to end — use-case discovery, scope and success metrics, then hands-on agent workflows that semi-automate order-management tasks",
        "Created Agent Foundry, a marketplace where enterprise customers discover and evaluate agents matched to their business needs",
        "Lead Glean AI assistant adoption via the mAIn Council: prioritised use cases by role, quantified rollout value and presented findings to leadership",
        "Delivered 25+ platform features over five years across a portfolio of 10 retail accounts, 3–4 as concurrent lead",
        "Integrated the platform with Adyen, Accertify and CyberSource; improved refund-eligibility handling and designed deposit and partial-cancellation enhancements",
      ],
      stack: ["AI Agents", "Manhattan Active Omni", "Glean", "Adyen", "Accertify", "CyberSource"],
    },
    {
      period: "Oct 2019 — Oct 2020",
      company: "Diversant, LLC",
      role: "Analyst",
      location: "Newark, Delaware, USA",
      summary: "Supported fraud management platforms at Bank of America, keeping transaction and order-processing systems reliable and secure.",
      wins: [
        "Designed SQL automation scripts for Oracle and Cassandra, with Unix log analysis to validate data flows",
        "Ran API and middleware testing to ensure secure, scalable integrations across enterprise platforms",
        "Translated business needs into design specifications with developers and business analysts",
      ],
      stack: ["SQL", "Oracle", "Cassandra", "Postman", "SOAP UI", "Unix"],
    },
    {
      period: "Jul 2014 — Jun 2017",
      company: "Accenture",
      role: "Software Engineer",
      location: "Bengaluru, India",
      summary: "Requirement gathering, functional testing and automation for global banking clients including Bank of America and Goldman Sachs. Joined as Associate Software Engineer.",
      wins: [
        "Built interactive Tableau dashboards — heat maps, forecasts, funnel charts — that turned business data into decision-ready insight",
        "Worked with stakeholders to define KPIs and track the value delivered",
      ],
      stack: ["Tableau", "Test Automation", "Banking"],
    },
  ],

  // status: "live" | "building" | "exited" | "paused"
  ventures: [
    {
      name: "Agent Foundry",
      status: "live",
      year: "Manhattan Associates",
      role: "Creator",
      blurb:
        "An AI agent marketplace where enterprise customers discover and evaluate agents matched to their specific business needs.",
      tags: ["AI Agents", "Enterprise", "Supply Chain"],
      link: "",
    },
    {
      name: "ZAR Intelligence",
      status: "building",
      year: "2026",
      role: "Founder",
      blurb:
        "The company I founded for the Google Cloud AI Builder Cup 2026. Its product is a domain-neutral adaptive-reasoning runtime for AI agents — the model proposes, deterministic policy decides — with a retail pack for custom team apparel as its first domain.",
      tags: ["Gemini", "Cloud Run", "Firestore", "Python"],
      link: "",
    },
    {
      name: "Store6",
      status: "building",
      year: "Venture",
      role: "Founder",
      blurb:
        "A venture I founded to try something new as a founder, built slowly and deliberately: corporate tournaments, with customisation and more around them.",
      tags: ["Corporate Tournaments", "Customisation"],
      link: "",
    },
  ],

  recognition: [
    { title: "Unsung Hero Award — Focus on the Customer", meta: "Manhattan Associates · Jul 2025" },
    { title: "Team Award", meta: "Manhattan Associates · Apr 2025 & Apr 2023" },
    { title: "Star of the Quarter", meta: "Manhattan Associates · Jul 2023" },
    { title: "Above & Beyond", meta: "Manhattan Associates · Jan 2023" },
  ],

  education: [
    { title: "MS, Business Analytics", meta: "Hult International Business School, San Francisco · 2018 – 2019" },
    { title: "MS, International Business", meta: "Hult International Business School, San Francisco · 2017 – 2018" },
    { title: "Bachelor’s, Computer Engineering", meta: "B.M.S. College of Engineering, Bengaluru · 2010 – 2014" },
  ],

  // What you are working on right now.
  lab: [
    {
      name: "ZAR Core 3",
      stage: "Working prototype",
      note: "Workflow engine, policy layer and decision plugins (Bayes, conformal, Monte Carlo, value of information).",
    },
    {
      name: "Prompt Your Jersey",
      stage: "AI Builder Cup task",
      note: "A competition challenge, not a company: use AI to design a jersey, with the best jersey winning.",
    },
  ],

  skills: [
    ["AI Agent Solutions", "Enterprise AI Adoption", "Change Management", "Product Ownership", "Use-Case Discovery", "Omnichannel Order Management", "Workshop Facilitation", "Stakeholder Management"],
    ["Glean", "Claude", "ChatGPT", "Prompt Engineering", "Manhattan Active Omni", "Adyen", "Accertify", "CyberSource", "SQL", "Postman", "Tableau"],
  ],
};
