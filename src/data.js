export const profile = {
  name: "Vamshi Krishna Bandari",
  title: "MSc Artificial Intelligence · AI Enthusiast & Engineer",
  location: "London, United Kingdom",
  email: "bvamshikrishna300@gmail.com",
  linkedin: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212",
  github: "https://github.com/VamshiKrishnaBandari07",
  photo: "/profile/assets/profile.jpg",
  tagline:
    "Artificial Intelligence enthusiast building intelligent systems across machine learning, generative AI, and applied engineering.",
};

export const about = {
  lead:
    "Artificial Intelligence enthusiast with an engineering foundation and a research-oriented MSc — focused on building reliable, data-driven intelligent systems.",
  paragraphs: [
    "I hold a B.Tech in Electrical and Electronics Engineering from the Institute of Aeronautical Engineering (IARE), Hyderabad, where I delivered a smart energy metering project and achieved 2nd place in an inter-college data analytics hackathon. At Cognizant on Google Cloud, I engineered ETL pipelines and automated KPI dashboards, improving data integrity by 40%.",
    "I am completing an MSc in Artificial Intelligence at the University of Roehampton, London, specialising in machine learning, deep learning, generative AI, and intelligent agent systems. I actively participate in London's innovation ecosystem — including London Tech Week, policy forums, and fintech hackathons.",
    "Currently serving as an AI-Driven Business Development Intern at Crown Fund, where I apply data analytics, AI tooling, and market research to support growth and innovation strategy.",
  ],
};

export const stats = [
  { value: 13, suffix: "+", label: "AI Certifications" },
  { value: 6, suffix: "", label: "Event Photos" },
  { value: 40, suffix: "%", label: "Data Integrity Gain · Cognizant" },
  { value: 2, suffix: "", label: "Featured Events" },
];

export const skills = [
  { name: "Machine Learning", level: 92 },
  { name: "Deep Learning & NLP", level: 88 },
  { name: "Generative AI & Agents", level: 90 },
  { name: "Python & PyTorch", level: 94 },
  { name: "Data Engineering", level: 87 },
  { name: "Full-Stack (React/FastAPI)", level: 85 },
];

export const highlights = [
  {
    id: "parliament",
    title: "Chamber UK · Policy & Parliament Forum",
    location: "London, United Kingdom",
    date: "2025",
    category: "Policy",
    featured: true,
    bento: "hero",
    image: "/profile/assets/gallery/parliament/01.png",
    fallback: "/profile/assets/gallery/parliament/01.png",
    excerpt:
      "Chamber UK & Curia policy forum — turning policy into practice alongside Westminster leaders, with data-driven discussions on AI adoption across public services and healthcare.",
    tags: ["Chamber UK", "Public Policy", "Westminster"],
    linkedin:
      "https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_ai-aidevelopment-aiadoption-activity-7449937731247542273-tCUW",
    photos: [
      { src: "/profile/assets/gallery/parliament/01.png", caption: "Chamber UK · Westminster Podium" },
      { src: "/profile/assets/gallery/parliament/02.png", caption: "Turning Policy Into Practice" },
    ],
  },
  {
    id: "london-tech",
    title: "London Tech Week & Innovation Events",
    location: "London, United Kingdom",
    date: "2026",
    category: "Innovation",
    featured: true,
    bento: "wide",
    image: "/profile/assets/gallery/london-tech/01.png",
    fallback: "/profile/assets/gallery/london-tech/01.png",
    excerpt:
      "London Tech Week 2026 EXPO · London Lab Live · Formula E × Google Cloud showcase — connecting with founders, enterprise partners, and the UK innovation ecosystem.",
    tags: ["London Tech Week", "Lab Live", "Google Cloud"],
    linkedin: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/recent-activity/all/",
    photos: [
      { src: "/profile/assets/gallery/london-tech/01.png", caption: "London Tech Week 2026 · EXPO" },
      { src: "/profile/assets/gallery/london-tech/02.png", caption: "London Lab Live · Visitor" },
      { src: "/profile/assets/gallery/london-tech/03.png", caption: "Formula E × Google Cloud Showcase" },
      { src: "/profile/assets/gallery/london-tech/04.png", caption: "LTW Badge · University of Roehampton" },
    ],
  },
  {
    id: "frc-hackathon",
    title: "FRC and ODI Innovation Sprint",
    location: "London, United Kingdom",
    date: "2025",
    category: "FinTech",
    featured: false,
    image: "/profile/assets/gallery/frc-hackathon/01.jpg",
    excerpt:
      "Financial Reporting Council and Open Data Institute Innovation Sprint — XBRL-to-AI-ready JSON transformation for financial analytics.",
    tags: ["FinTech", "XBRL", "Hackathon"],
    linkedin:
      "https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_frchackthon-ai-fintech-activity-7443460515583934464-_NxX",
    photos: [],
  },
  {
    id: "donorlink",
    title: "DonorLink · Agentic AI Platform",
    location: "Research Prototype",
    date: "2026",
    category: "AI Systems",
    featured: false,
    image: "/profile/assets/gallery/donorlink/01.jpg",
    excerpt:
      "Full-stack agentic AI platform with RAG-grounded knowledge, multi-agent workflows, and predictive analytics.",
    tags: ["DonorLink", "RAG", "Agents"],
    linkedin: "https://github.com/VamshiKrishnaBandari07/donorlink",
    photos: [],
  },
];

/** Flat list of gallery photos (excludes profile album) */
export function getAllPhotos(highlights) {
  return highlights
    .filter((event) => event.id !== "profile")
    .flatMap((event) =>
      (event.photos || []).map((photo, photoIndex) => ({
        ...photo,
        id: `${event.id}-${photoIndex}`,
        eventId: event.id,
        title: event.title,
        category: event.category,
        location: event.location,
        date: event.date,
        linkedin: event.linkedin,
        excerpt: event.excerpt,
        fallback: event.fallback,
      }))
    );
}

export const achievements = [
  {
    metric: "London",
    label: "Tech Week 2026 · EXPO",
    detail: "University of Roehampton representative at London Tech Week — enterprise AI, innovation & networking",
  },
  {
    metric: "Chamber UK",
    label: "Policy & Westminster Forum",
    detail: "Policy-to-practice discussions with leaders across public services, data, and AI adoption",
  },
  {
    metric: "2nd Place",
    label: "Data Analytics Hackathon",
    detail: "Inter-college competition during B.Tech at IARE — Institute of Aeronautical Engineering",
  },
  {
    metric: "40%",
    label: "Data Integrity Gain",
    detail: "Cognizant · Google Cloud — 10+ ETL pipelines, automated KPI dashboards, faster refresh cycles",
  },
  {
    metric: "Pod Lead",
    label: "Team Leadership · Cognizant",
    detail: "Mentored 15 analysts; promoted for workflow optimisation and performance leadership",
  },
  {
    metric: "13+",
    label: "AI & Data Certifications",
    detail: "Microsoft, Google Cloud, IBM, Oracle — generative AI, agents, ethics, and analytics",
  },
];

export const certifications = [
  {
    name: "Career Essentials in Generative AI",
    issuer: "Microsoft & LinkedIn",
    date: "Oct 2025",
    category: "Generative AI",
    link: "https://linkedin.com/learning/certificates/f454ed1e5e8eea6c07ae649ec35af454c9da3f579474d591d42da78ee8d06b72",
  },
  {
    name: "Intro to Generative AI: Core Concepts",
    issuer: "Google Cloud Skills Boost",
    date: "Oct 2025",
    category: "Generative AI",
    link: "https://coursera.org/account/accomplishments/specialization/certificate/KL5LQKLDHITD",
  },
  {
    name: "Introduction to Artificial Intelligence",
    issuer: "LinkedIn Learning",
    date: "Oct 2025",
    category: "Artificial Intelligence",
    link: "https://linkedin.com/learning/certificates/6313cf3a5e113fdb6dbfd16c55b40d1b34b373eea3469137d8a91e6b0d5dc22b",
  },
  {
    name: "Cloud Technical Series — AI Agents",
    issuer: "Google Cloud Asia Pacific",
    date: "Aug 2025",
    category: "AI Agents",
    link: "https://credential.net/b9c79565-b441-4fc0-be98-5fc2a962737d",
  },
  {
    name: "Ethics in the Age of Generative AI",
    issuer: "LinkedIn Learning",
    date: "Aug 2025",
    category: "AI Ethics",
    link: "https://linkedin.com/learning/certificates/17f87025ed71687aafab63a3235bf38aea69ba51dc19f54fbc79f9e444a9580c",
  },
  {
    name: "Oracle Fusion AI Agent Studio Foundations",
    issuer: "Oracle",
    date: "Aug 2025",
    category: "AI Agents",
    link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=E56134E093049A43AAA1D831E2DAC538F8414FE3E901A4E1CF808AEF66A268B2",
  },
  {
    name: "What Is Generative AI?",
    issuer: "LinkedIn Learning",
    date: "Aug 2025",
    category: "Generative AI",
    link: "https://linkedin.com/learning/certificates/02488a41508c12e02542af16b4c3419468beffa434b130bd110f5326b89bee69",
  },
  {
    name: "Getting Started with Artificial Intelligence",
    issuer: "IBM SkillsBuild",
    date: "2025",
    category: "Artificial Intelligence",
    link: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/details/certifications/",
  },
  {
    name: "Data Fundamentals with Capstone Project",
    issuer: "IBM SkillsBuild",
    date: "2025",
    category: "Data Analytics",
    link: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/details/certifications/",
  },
  {
    name: "Artificial Intelligence Fundamentals",
    issuer: "IBM SkillsBuild",
    date: "2025",
    category: "Artificial Intelligence",
    link: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/details/certifications/",
  },
  {
    name: "Data Analytics Job Simulation",
    issuer: "Deloitte · Forage",
    date: "Mar 2025",
    category: "Data Analytics",
    link: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/details/certifications/",
  },
  {
    name: "Power BI Job Simulation",
    issuer: "PwC Switzerland · Forage",
    date: "Mar 2025",
    category: "Business Intelligence",
    link: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/details/certifications/",
  },
  {
    name: "Data Analytics & Visualization Simulation",
    issuer: "Accenture · Forage",
    date: "Jun 2024",
    category: "Data Analytics",
    link: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/details/certifications/",
  },
];

export const projects = [
  {
    title: "DonorLink",
    period: "2026",
    category: "Agentic AI · Full-Stack",
    desc: "Multi-agent platform with RAG-grounded knowledge and predictive analytics — intelligent workflows for complex decision support.",
    stack: ["FastAPI", "React", "TypeScript", "ML"],
    link: "https://github.com/VamshiKrishnaBandari07/donorlink",
    image: "/profile/assets/gallery/donorlink/01.jpg",
  },
  {
    title: "SOH & RUL Prediction",
    period: "MSc Capstone",
    category: "MSc Research",
    desc: "Master's research on battery state-of-health estimation and remaining useful life prediction using time-series machine learning.",
    stack: ["Python", "Time Series", "ML"],
    link: "https://github.com/VamshiKrishnaBandari07/MSc-CAPSTONE-PROJECT-SOH-RUL-PREDICTION--",
    image: null,
  },
  {
    title: "DT-AttNet",
    period: "2025",
    category: "Deep Learning",
    desc: "Dual-Head Temporal Attention Network — CNN, BiLSTM, and multi-head self-attention for behavioural risk prediction.",
    stack: ["PyTorch", "Deep Learning", "Python"],
    link: "https://github.com/VamshiKrishnaBandari07/DT-AttNet",
    image: null,
  },
  {
    title: "Credit Risk Prediction Agent",
    period: "2025",
    category: "Machine Learning",
    desc: "Automated lending risk system comparing Naive Bayes, Random Forest, and KNN with ROC-AUC evaluation for data-driven decisions.",
    stack: ["Python", "Scikit-learn", "Jupyter"],
    link: "https://github.com/VamshiKrishnaBandari07/Credit-Risk-Prediction-Agent",
    image: null,
  },
  {
    title: "FRC × ODI Innovation Sprint",
    period: "2025",
    category: "Hackathon · FinTech",
    desc: "XBRL-to-AI-ready JSON transformation layer for structured financial data — built at the FRC & Open Data Institute sprint in London.",
    stack: ["Python", "XBRL", "Data Engineering"],
    link: "https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_frchackthon-ai-fintech-activity-7443460515583934464-_NxX",
    image: "/profile/assets/gallery/frc-hackathon/01.jpg",
  },
  {
    title: "Smart Energy Metering System",
    period: "B.Tech · IARE",
    category: "B.Tech · EEE",
    desc: "IoT-based smart energy metering project during B.Tech at Institute of Aeronautical Engineering — hardware sensing with data monitoring and analysis.",
    stack: ["Embedded Systems", "IoT", "EEE"],
    link: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212",
    image: null,
  },
];

export const timeline = [
  {
    period: "Apr 2026 — Present",
    role: "AI-Driven Business Development Intern",
    org: "Crown Fund · London",
    detail: "Market research, AI tooling exploration, lead generation, and cross-functional business insights driven by data analytics.",
  },
  {
    period: "2024 — 2026",
    role: "MSc Artificial Intelligence",
    org: "University of Roehampton · London",
    detail: "Machine learning, deep learning, generative AI, intelligent agents, AI systems engineering, and computational intelligence.",
  },
  {
    period: "Dec 2023 — Aug 2025",
    role: "Process Executive — Data",
    org: "Cognizant · Google Cloud · Hyderabad",
    detail: "10+ ETL pipelines, 40% data integrity improvement, Power BI & Cognos dashboards, pod leadership for 15 analysts.",
  },
  {
    period: "2019 — 2023",
    role: "B.Tech · Electrical & Electronics Engineering",
    org: "Institute of Aeronautical Engineering (IARE) · Hyderabad",
    detail: "Smart energy metering project, data analytics hackathon (2nd place), and engineering foundation in electronics, power systems, and embedded applications.",
  },
];
