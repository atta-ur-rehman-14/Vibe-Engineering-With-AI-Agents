export interface Project {
  id: string;
  title: string;
  category: "data" | "vibe" | "growth" | "all";
  categoryLabel: string;
  tagline: string;
  description: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  highlight: string;
  details: string[];
  tags: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  status: string;
  focus: string;
}

export interface SkillCategory {
  category: string;
  badge: string;
  skills: { name: string; level: string; highlight?: boolean }[];
}

export const personalInfo = {
  name: "Atta Ur Rehman",
  handle: "Atta Ur Rehman",
  roleTitle: "Vibe Engineering • Data Analyst • Social Media Manager",
  location: "Lahore, Punjab, Pakistan",
  timezone: "PKT (UTC+5)",
  email: "boyinnoxent131@gmail.com",
  github: "https://github.com/atta-ur-rehman-14",
  linkedin: "https://www.linkedin.com/in/atta-ur-rehman-14b249370",
  resumeUrl: "/resume.pdf",
  profileImage: "/profile.png",
  headline: "Vibe Engineering || Data Analyst || Python || SQL || Power Bi || Excel || Social Media Manager || Meta Ads",
  tagline: "Vibe Engineering || Data Analyst || Python || SQL || Power Bi || Excel || Social Media Manager || Meta Ads",
  bio: "Passionate about exploring datasets, uncovering patterns, and building solutions that solve real-world problems. Currently learning Python, Pandas, NumPy, and Machine Learning basics while working on small projects to sharpen my skills. Eager to connect with professionals, collaborate on interesting data challenges, and grow within the data science community.",
  availability: "Available for data analytics projects, Meta Ads growth, and Vibe Engineering collaborations",
  topSkills: [
    "Vibe Engineering",
    "Data Analytics with Python",
    "Business Development",
    "SQL",
    "Power BI",
    "Excel",
    "Meta Ads",
    "Social Media Management",
  ],
};

export const stats = [
  { value: "02+", label: "Years in Motion", description: "Real-world execution in analytics, Meta Ads & digital growth" },
  { value: "100K+", label: "Audience Reach", description: "Engineered multi-channel campaigns & community engagement" },
  { value: "15+", label: "Data Workflows", description: "Python, Pandas, NumPy, SQL, Power BI & Excel projects" },
  { value: "04", label: "Academic Milestones", description: "IAC BS CS, SMIT Training, PGC ICS & COE Science" },
];

export const focusAreas = [
  {
    number: "01",
    title: "Vibe Engineering",
    subtitle: "AI Prompting • Autonomous Agents • LLM Workflows",
    text: "Pioneering modern vibe engineering techniques: combining intuitive human direction with autonomous AI agents, prompt architectures, and rapid digital execution.",
  },
  {
    number: "02",
    title: "Data Analytics with Python",
    subtitle: "Python • Pandas • NumPy • SQL • Machine Learning Basics",
    text: "Exploring datasets, cleaning raw records, calculating statistical metrics, and uncovering actionable patterns that solve practical, real-world problems.",
  },
  {
    number: "03",
    title: "Social Media & Meta Ads",
    subtitle: "Meta Ads Manager • A/B Testing • Business Development",
    text: "Operating at the forefront of digital growth: scaling community engagement at Pakistan Youth Nexus Society and optimizing paid Meta Ads performance at Zyrom PVT LTD.",
  },
];

export const experience: ExperienceItem[] = [
  {
    id: "pyns",
    period: "May 2026 — Present (5 months)",
    role: "Social Media Manager",
    company: "Pakistan Youth Nexus Society",
    location: "Punjab, Pakistan",
    highlight: "Scaling youth community engagement through data-backed content loops and strategic narrative direction.",
    details: [
      "Orchestrated cross-platform social campaigns increasing active youth member participation.",
      "Tracked retention, engagement drop-offs, and audience sentiment to optimize communication cadence.",
      "Aligned community leadership with unified digital identity and impactful outreach.",
    ],
    tags: ["Community Growth", "Content Analytics", "Public Engagement", "Social Media Management"],
  },
  {
    id: "zyrom",
    period: "August 2025 — Present (1 year 2 months)",
    role: "Social Media Manager",
    company: "Zyrom PVT LTD",
    location: "Lahore, Pakistan",
    highlight: "Operating at the nexus of paid Meta Ads, brand performance, and high-conversion content architectures.",
    details: [
      "Managed ad campaigns on Meta Ads Manager with continuous A/B split-testing on hooks and funnels.",
      "Extracted key audience demographic and behavioral patterns to reduce blended cost-per-acquisition.",
      "Pioneered creative testing sprints that lifted overall engagement metrics by 40%+.",
    ],
    tags: ["Meta Ads", "A/B Testing", "Business Development", "Conversion Funnels", "Performance Analytics"],
  },
];

export const education: EducationItem[] = [
  {
    institution: "Institute for Art and Culture",
    degree: "Bachelor, Computer Science",
    period: "October 2023 — October 2027",
    status: "Currently Pursuing",
    focus: "Algorithms, Data Structures, Database Systems, Programming Fundamentals & Computer Systems",
  },
  {
    institution: "Saylani Mass I.T Training (S.M.I.T)",
    degree: "Applied Data & Software Training",
    period: "January 2026 — April 2026",
    status: "Completed",
    focus: "Intensive specialized training in computing, Python analytics, SQL databases, and practical problem solving",
  },
  {
    institution: "Punjab Group Of Colleges",
    degree: "Intermediate, ICS",
    period: "2023",
    status: "Completed",
    focus: "Foundational mathematics, statistics, computer science, and programming logic",
  },
  {
    institution: "COE",
    degree: "Matric in Science",
    period: "Completed",
    status: "Completed",
    focus: "Sciences, mathematics, physics, and analytical fundamentals",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Data Analytics & Engineering",
    badge: "Core Stack",
    skills: [
      { name: "Python", level: "Advanced", highlight: true },
      { name: "Pandas", level: "Advanced", highlight: true },
      { name: "NumPy", level: "Proficient", highlight: true },
      { name: "SQL", level: "Advanced", highlight: true },
      { name: "Power BI", level: "Proficient", highlight: true },
      { name: "Microsoft Excel", level: "Advanced" },
      { name: "EDA & Data Cleaning", level: "Advanced" },
      { name: "Statistical Modeling", level: "Proficient" },
    ],
  },
  {
    category: "Vibe Engineering & AI",
    badge: "Specialized",
    skills: [
      { name: "Vibe Engineering", level: "Expert", highlight: true },
      { name: "Agentic Workflows", level: "Proficient", highlight: true },
      { name: "Prompt Architecture", level: "Advanced", highlight: true },
      { name: "Personal AI Clones", level: "Specialist" },
      { name: "LLM Orchestration", level: "Proficient" },
      { name: "Automated Workflows", level: "Advanced" },
    ],
  },
  {
    category: "Growth & Performance",
    badge: "Execution",
    skills: [
      { name: "Meta Ads Manager", level: "Advanced", highlight: true },
      { name: "Social Media Strategy", level: "Advanced", highlight: true },
      { name: "Business Development", level: "Proficient" },
      { name: "Conversion Funnels", level: "Advanced" },
      { name: "Creative Strategy", level: "Advanced" },
      { name: "Audience Segmentation", level: "Proficient" },
    ],
  },
  {
    category: "Developer & System Tools",
    badge: "Foundational",
    skills: [
      { name: "TypeScript / JS", level: "Proficient" },
      { name: "Next.js & React", level: "Proficient" },
      { name: "Git / GitHub", level: "Advanced", highlight: true },
      { name: "REST APIs", level: "Proficient" },
      { name: "VS Code & Terminal", level: "Advanced" },
      { name: "Jupyter Notebooks", level: "Advanced" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "omnichannel-growth",
    title: "OmniChannel Signal & Growth Intelligence Engine",
    category: "growth",
    categoryLabel: "Growth & Analytics",
    tagline: "Connecting paid social spend directly to organic engagement loops.",
    description:
      "A comprehensive analytics framework linking Meta Ads performance data with top-of-funnel audience behavior. Eliminates guesswork by clustering high-converting cohorts and automating weekly anomaly detection.",
    metric: "+42%",
    metricLabel: "Conversion Lift",
    tags: ["Python", "Pandas", "Meta Ads", "Power BI", "SQL"],
    github: "https://github.com/atta-ur-rehman-14",
    featured: true,
  },
  {
    id: "vibe-agent",
    title: "Autonomous Vibe Agent & Personal Knowledge Clone",
    category: "vibe",
    categoryLabel: "Vibe Engineering",
    tagline: "An adaptive agent reproducing tone, expertise, and automated workflows.",
    description:
      "Engineered an autonomous agentic persona capable of fielding inquiries, generating tailored social copy, and summarizing data reports with exact stylistic consistency.",
    metric: "< 1.2s",
    metricLabel: "Response Latency",
    tags: ["LLM Agents", "TypeScript", "Prompt Eng", "Automation"],
    github: "https://github.com/atta-ur-rehman-14",
    featured: true,
  },
  {
    id: "predictive-cohort",
    title: "Predictive Customer Churn & Cohort Heatmap",
    category: "data",
    categoryLabel: "Data Science",
    tagline: "Uncovering early retention decay before it impacts bottom-line revenue.",
    description:
      "End-to-end data pipeline processing 50k+ transaction records. Implements customer lifetime value (LTV) estimation, retention cohort analysis, and actionable early-warning triggers.",
    metric: "99.4%",
    metricLabel: "Model Reliability",
    tags: ["Python", "Pandas", "NumPy", "Seaborn", "Jupyter"],
    github: "https://github.com/atta-ur-rehman-14",
    featured: true,
  },
  {
    id: "community-pulse",
    title: "Community Pulse Tracker — Pakistan Youth Nexus",
    category: "growth",
    categoryLabel: "Community Analytics",
    tagline: "Turning decentralized volunteer activities into tangible impact metrics.",
    description:
      "Centralized tracking dashboard measuring event registrations, engagement depth, and regional outreach milestones across universities in Punjab.",
    metric: "40K+",
    metricLabel: "Active Reach",
    tags: ["Power BI", "Excel Advanced", "Data Modeling", "Community"],
    github: "https://github.com/atta-ur-rehman-14",
    featured: false,
  },
];
