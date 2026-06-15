export const profile = {
  name: "Vamshi Krishna Bandari",
  title: "MSc Artificial Intelligence · Research & Engineering",
  location: "London, United Kingdom",
  email: "bvamshikrishna300@gmail.com",
  linkedin: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212",
  github: "https://github.com/VamshiKrishnaBandari07",
  photo: "/profile/assets/profile.jpg",
  tagline:
    "Machine learning research · Intelligent systems · Applied engineering for healthcare & decision support",
};

export const stats = [
  { value: 13, suffix: "+", label: "AI Certifications" },
  { value: 17, suffix: "", label: "Photos & Moments" },
  { value: 40, suffix: "%", label: "Data Integrity Gain · Cognizant" },
  { value: 4, suffix: "", label: "Major Events & Showcases" },
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
    title: "UK Parliament · AI in Healthcare Showcase",
    location: "Palace of Westminster, London",
    date: "2025",
    category: "Policy",
    featured: true,
    bento: "hero",
    image: "/profile/assets/gallery/parliament/01.jpg",
    fallback: "https://images.unsplash.com/photo-1529651737248-dad5a910bdb2?w=1200&q=85",
    excerpt:
      "Attended the AI in Healthcare & Life Sciences Parliamentary Showcase led by Steve Yemm MP — discussions on scaling AI adoption across the NHS and delivering measurable patient outcomes.",
    tags: ["NHS", "Healthcare AI", "Public Policy"],
    linkedin:
      "https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_ai-aidevelopment-aiadoption-activity-7449937731247542273-tCUW",
    photos: [
      { src: "/profile/assets/gallery/parliament/01.jpg", caption: "Westminster · Policy Forum" },
      { src: "/profile/assets/gallery/parliament/02.jpg", caption: "London · Institutional Setting" },
      { src: "/profile/assets/gallery/parliament/03.jpg", caption: "Healthcare AI Dialogue" },
      { src: "/profile/assets/gallery/parliament/04.jpg", caption: "Parliamentary Showcase" },
    ],
  },
  {
    id: "london-tech",
    title: "London Tech & Innovation Ecosystem",
    location: "London, United Kingdom",
    date: "2025",
    category: "Innovation",
    featured: true,
    bento: "wide",
    image: "/profile/assets/gallery/london-tech/01.jpg",
    fallback: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85",
    excerpt:
      "Engaged with London's technology community — founders, policymakers, and engineers shaping AI, fintech, and digital transformation across the UK.",
    tags: ["London Tech", "Innovation", "AI Ecosystem"],
    linkedin: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/recent-activity/all/",
    photos: [
      { src: "/profile/assets/gallery/london-tech/01.jpg", caption: "London Tech Summit" },
      { src: "/profile/assets/gallery/london-tech/02.jpg", caption: "Innovation Networking" },
      { src: "/profile/assets/gallery/london-tech/03.jpg", caption: "Startup & Enterprise Forum" },
      { src: "/profile/assets/gallery/london-tech/04.jpg", caption: "London Skyline · FinTech Hub" },
    ],
  },
  {
    id: "frc-hackathon",
    title: "FRC & ODI Innovation Sprint",
    location: "London, United Kingdom",
    date: "2025",
    category: "FinTech",
    featured: false,
    bento: "tall",
    image: "/profile/assets/gallery/frc-hackathon/01.jpg",
    fallback: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85",
    excerpt:
      "FRC & Open Data Institute Innovation Sprint — XBRL-to-AI-ready JSON transformation layer for smarter financial data analytics.",
    tags: ["FinTech", "XBRL", "Hackathon"],
    linkedin:
      "https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_frchackthon-ai-fintech-activity-7443460515583934464-_NxX",
    photos: [
      { src: "/profile/assets/gallery/frc-hackathon/01.jpg", caption: "Innovation Sprint Kickoff" },
      { src: "/profile/assets/gallery/frc-hackathon/02.jpg", caption: "Cross-functional Team Build" },
      { src: "/profile/assets/gallery/frc-hackathon/03.jpg", caption: "Collaborative Prototyping" },
      { src: "/profile/assets/gallery/frc-hackathon/04.jpg", caption: "FinTech · Data Engineering" },
    ],
  },
  {
    id: "donorlink",
    title: "DonorLink · Clinical Decision Support",
    location: "Research Prototype · Team VK7",
    date: "2026",
    category: "Healthcare",
    featured: false,
    bento: "standard",
    image: "/profile/assets/gallery/donorlink/01.jpg",
    fallback: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85",
    excerpt:
      "Full-stack agentic AI platform for living kidney donation — RAG-grounded education, multi-agent support, and explainable dropout-risk analytics.",
    tags: ["DonorLink", "RAG", "KidneyX"],
    linkedin: "https://github.com/VamshiKrishnaBandari07/donorlink",
    photos: [
      { src: "/profile/assets/gallery/donorlink/01.jpg", caption: "Clinical AI Platform" },
      { src: "/profile/assets/gallery/donorlink/02.jpg", caption: "Healthcare Innovation" },
      { src: "/profile/assets/gallery/donorlink/03.jpg", caption: "Decision Support Research" },
      { src: "/profile/assets/gallery/donorlink/04.jpg", caption: "KidneyX · Team VK7" },
    ],
  },
  {
    id: "profile",
    title: "Professional Profile",
    location: "London, United Kingdom",
    date: "2025",
    category: "Portrait",
    featured: false,
    bento: "standard",
    image: "/profile/assets/gallery/profile/01.jpg",
    fallback: "/profile/assets/profile.jpg",
    excerpt: "MSc Artificial Intelligence graduate · University of Roehampton · Applied ML research & engineering.",
    tags: ["MSc AI", "Roehampton", "London"],
    linkedin: "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212",
    photos: [{ src: "/profile/assets/gallery/profile/01.jpg", caption: "Vamshi Krishna Bandari · MSc AI" }],
  },
];

/** Flat list of every photo for masonry wall & lightbox */
export function getAllPhotos(highlights) {
  return highlights.flatMap((event) =>
    event.photos.map((photo, photoIndex) => ({
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
    metric: "UK Parliament",
    label: "AI in Healthcare Showcase",
    detail: "Palace of Westminster — policy & NHS scaling discussions with MPs and innovators",
  },
  {
    metric: "London",
    label: "Tech & Innovation Events",
    detail: "FRC/ODI Innovation Sprint, fintech hackathons, and UK AI ecosystem engagement",
  },
  {
    metric: "KidneyX",
    label: "EMPOWER Prize Submission",
    detail: "DonorLink clinical decision-support platform · Team VK7 · Track B prototype",
  },
  {
    metric: "40%",
    label: "Data Integrity Gain",
    detail: "Cognizant — Google Cloud migration, 10+ ETL pipelines, KPI dashboard automation",
  },
  {
    metric: "Pod Lead",
    label: "Team Leadership",
    detail: "Mentored 15 analysts at Cognizant; promoted for workflow & performance leadership",
  },
  {
    metric: "2nd Place",
    label: "Data Analytics Hackathon",
    detail: "Inter-college competition during B.Tech — Institute of Aeronautical Engineering",
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
    desc: "Clinical decision-support platform with intelligent agents, retrieval-grounded knowledge, and predictive analytics.",
    stack: ["FastAPI", "React", "TypeScript", "ML"],
    link: "https://github.com/VamshiKrishnaBandari07/donorlink",
    image: "/profile/assets/highlights/donorlink.jpg",
  },
  {
    title: "DT-AttNet",
    desc: "Dual-Head Temporal Attention Network for behavioural risk prediction using CNN, BiLSTM, and multi-head self-attention.",
    stack: ["PyTorch", "Deep Learning", "Python"],
    link: "https://github.com/VamshiKrishnaBandari07/DT-AttNet",
    image: null,
  },
  {
    title: "Credit Risk Prediction Agent",
    desc: "ML framework comparing Naive Bayes, Random Forest, and KNN with ROC-AUC and confusion matrix evaluation.",
    stack: ["Python", "Scikit-learn", "ML"],
    link: "https://github.com/VamshiKrishnaBandari07/Credit-Risk-Prediction-Agent",
    image: null,
  },
  {
    title: "SOH & RUL Prediction",
    desc: "MSc capstone on state-of-health estimation and remaining useful life prediction for battery systems.",
    stack: ["Python", "Time Series", "ML"],
    link: "https://github.com/VamshiKrishnaBandari07/MSc-CAPSTONE-PROJECT-SOH-RUL-PREDICTION--",
    image: null,
  },
];

export const timeline = [
  {
    period: "Apr 2026 — Present",
    role: "AI-Driven Business Development Intern",
    org: "Crown Fund · London",
    detail: "Data-driven market analysis, AI tooling exploration, lead generation, and cross-functional business insights.",
  },
  {
    period: "2025 — Present",
    role: "MSc Artificial Intelligence",
    org: "University of Roehampton · London",
    detail: "Machine learning, deep learning, generative AI, AI systems engineering, computational intelligence.",
  },
  {
    period: "Dec 2023 — Aug 2025",
    role: "Process Executive — Data",
    org: "Cognizant · Google Cloud",
    detail: "10+ ETL pipelines, 40% data integrity improvement, Power BI dashboards, 30% faster data refresh cycles.",
  },
  {
    period: "2019 — 2023",
    role: "B.Tech Electrical & Electronics Engineering",
    org: "Institute of Aeronautical Engineering · India",
    detail: "Engineering foundation with data analytics hackathon recognition and smart energy metering project.",
  },
];
