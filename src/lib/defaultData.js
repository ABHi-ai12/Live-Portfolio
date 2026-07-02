export const defaultData = {
  personal: {
    name: "Abhinav",
    headline: "Full Stack Developer",
    tagline: "I build fast, scalable, and modern web applications using React, Node.js, and Tailwind CSS.",
    about: "Hi, my name is Abhinav, a passionate full-stack developer dedicated to crafting clean, functional, and highly scalable web applications. I focus on premium user experiences, high-performance backends, and modular codebase architectures.",
    location: "India",
    email: "hello@abhinav.com",
    phone: "+91 98765 43210",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    avatar: "/src/assets/about/image.png",
    videoUrl: "/videos/hero-reel.mp4"
  },
  seo: {
    title: "Abhinav | Full Stack Developer Portfolio",
    description: "Premium video portfolio of Abhinav, a Full Stack Developer building scalable React and Node.js web applications.",
    keywords: "Abhinav, Full Stack Developer, React, Node.js, Tailwind CSS, Video Portfolio, Web Developer"
  },
  projects: [
    {
      title: "PortfolioAI SaaS Platform",
      description: "A world-class AI-powered SaaS platform that automatically generates premium portfolio websites from LinkedIn profiles, resumes, or manual input.",
      link: "https://github.com",
      tech: ["React", "Next.js", "Tailwind CSS", "Gemini AI"]
    },
    {
      title: "E-Commerce Microservices",
      description: "High-performance online commerce backend leveraging Docker containers, RabbitMQ queues, and Redis cache clusters.",
      link: "https://github.com",
      tech: ["Node.js", "Docker", "RabbitMQ", "Redis"]
    },
    {
      title: "Interactive Video Portfolio",
      description: "A gorgeous single-page developer reel showcasing live video playback, custom lanyard ID badges, and interactive project cards.",
      link: "https://github.com",
      tech: ["React", "Vite", "Tailwind CSS", "Framer Motion"]
    }
  ],
  skills: [
    { name: "React / Next.js", level: "Expert", category: "Frontend" },
    { name: "Node.js / Express", level: "Expert", category: "Backend" },
    { name: "Tailwind CSS / CSS4", level: "Expert", category: "Frontend" },
    { name: "MongoDB / PostgreSQL", level: "Advanced", category: "Database" },
    { name: "Docker / DevOps", level: "Advanced", category: "DevOps" },
    { name: "JavaScript / TypeScript", level: "Expert", category: "Languages" }
  ],
  experience: [
    {
      role: "Lead Full Stack Developer",
      company: "Abhinav Studio",
      duration: "2024 - Present",
      description: "Architecting microservices, optimizing database pipelines, and designing custom interactive web platforms for global clients."
    },
    {
      role: "Senior Software Engineer",
      company: "Tech Solutions",
      duration: "2022 - 2024",
      description: "Spearheaded the migration of legacy client dashboards to modern React architectures, resulting in a 40% page speed increase."
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology in Computer Science",
      school: "State Engineering University",
      duration: "2018 - 2022",
      description: "Graduated with Honors. Focused on Distributed Systems, Cloud Computing, and Software Engineering methodologies."
    }
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2024" },
    { name: "Google UX Design Certificate", issuer: "Coursera / Google", date: "2023" }
  ],
  achievements: [
    { title: "National Hackathon Winner", date: "2023", description: "Secured 1st place out of 200 teams by building an AI-based automated crop diagnostic tool." },
    { title: "Open Source Contributor", date: "2022 - Present", description: "Active contributor to popular UI and framework repositories, merged 20+ pull requests." }
  ],
  blogs: [
    {
      title: "Building Micro-Animations with Framer Motion",
      excerpt: "Learn how to use viewport tracking and springs to create highly interactive layout cues.",
      date: "June 15, 2026",
      content: "Framer Motion is a powerful library for React that simplifies animations. By using properties like whileInView and type: spring, you can craft micro-interactions that feel incredibly premium and responsive to user behaviors...",
      readTime: "4 min read"
    },
    {
      title: "Why We Switched to Tailwind v4 in Production",
      excerpt: "A deep dive into Tailwind CSS v4's direct compiler, CSS variables theme mapping, and speed gains.",
      date: "May 22, 2026",
      content: "Tailwind CSS v4 introduces a native compilation engine that speeds up builds by up to 5x. By shifting configuration to CSS variables directly inside globals.css, we get cleaner configs and instant runtime updates...",
      readTime: "5 min read"
    }
  ],
  gallery: [
    { url: "/src/assets/about/image.png", caption: "Abhinav working on the next-gen portfolio SaaS launcher." },
    { url: "/src/assets/about/image.png", caption: "Interactive design studio environment." }
  ],
  testimonials: [
    {
      name: "Sarah Jenkins",
      role: "Product Director",
      company: "Linear Systems",
      text: "Abhinav is a rare talent in software engineering. He doesn't just write functional code, he delivers fully optimized, pixel-perfect user experiences that exceed expectations."
    },
    {
      name: "Marcus Aurelius",
      role: "Lead Tech Lead",
      company: "Stripe Integrations",
      text: "His ability to take complex requirements, map them out cleanly, and execute them into modular, clean-code React components is top-tier."
    }
  ],
  services: [
    { title: "Full Stack Development", description: "End-to-end frontend interfaces and backend microservices using React, Node.js, and SQL/NoSQL databases.", icon: "Code" },
    { title: "UI/UX & Prototyping", description: "Design concepts, animations, and high-fidelity clickable mockups using Framer Motion and modern styling systems.", icon: "Laptop" },
    { title: "Cloud & DevOps", description: "Containerized deployments, CI/CD automated test pipelines, and serverless architectures on AWS and GCP.", icon: "Cloud" }
  ],
  faqs: [
    { question: "What is your typical project timeline?", answer: "Typical microservice backends take 2-4 weeks, while complex full-stack web portals range from 4-8 weeks depending on requirements." },
    { question: "Do you work with global remote clients?", answer: "Yes, I collaborate with clients across Europe, North America, and Asia using asynchronous tools and structured milestones." }
  ],
  privacy: "Your privacy is important to us. This portfolio website does not collect personal trackers, cookies, or analytics profiles. Any contact form submissions are processed securely and never shared with third parties.",
  terms: "All source code, designs, and content featured in this portfolio belong to Abhinav unless stated otherwise. You are free to view, study, and reference the portfolio layouts for educational and creative purposes."
};
