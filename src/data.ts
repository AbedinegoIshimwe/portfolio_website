/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CVData, Project } from "./types";

export const cvData: CVData = {
  name: "Abedinego Ishimwe",
  title: "Software Engineering Student",
  phone: "+254757898980",
  email: "ishimweabedinego@gmail.com",
  location: "Nairobi, Kenya",
  linkedin: "https://www.linkedin.com/in/ishimweabedinego", // actual placeholder from CV screenshot
  github: "https://github.com/ishimweabedinego",
  twitter: "https://twitter.com/ish_abedinego",
  summary: "Passionate and purpose-driven Software Engineering student at United States International University Africa with hands-on experience in IT support, mobile app development, and AI-powered solutions. Skilled in building scalable applications, AI integration, and cloud-based systems, with a strong desire to use technology to create real-world impact. Eager to contribute to innovative projects and committed to continuous growth in the tech space.",
  experiences: [
    {
      role: "ICT Attachment Intern",
      company: "USIU-Africa",
      location: "Nairobi, Kenya",
      period: "Sep 2024 - Dec 24",
      bullets: [
        "Completed a 3-month professional attachment with the ICT Department, assisting in IT support, software troubleshooting, and systems maintenance.",
        "Collaborated with a team of 6+ IT professionals to maintain and monitor the university's network infrastructure across 3 key campuses.",
        "Resolved 80+ technical support tickets, improving helpdesk response time by 15% during peak periods.",
        "Gained hands-on experience in helpdesk management, hardware configuration, and cloud-based platforms such as Microsoft Azure.",
        "Enhanced documentation processes and participated in the rollout of new digital systems within the university."
      ],
      techUsed: ["Network Infrastructure", "Azure Active Directory", "IT Support Tools", "System Troubleshooting", "Documentation"]
    },
    {
      role: "App Factory Assistant",
      company: "USIU-Africa",
      location: "Nairobi, Kenya",
      period: "Jan 2023 - Dec 2023",
      bullets: [
        "Volunteered to mentor students in practical tech skills and guide them through startup idea incubation from concept to market-ready prototypes.",
        "Facilitated 5+ training programs in collaboration with Microsoft, Huawei, and Safaricom, preparing students for industry certifications.",
        "Provided technical and logistical support to over 20 students, ensuring seamless execution of workshops and hackathons.",
        "Developed skills in Microsoft Azure, particularly in cloud deployment and DevOps tools."
      ],
      techUsed: ["Mentorship", "DevOps Tools", "Azure", "Safaricom APIs", "Team Leadership"]
    }
  ],
  education: [
    {
      degree: "Bachelor's Degree in Software Engineering",
      institution: "United States International University Africa (USIU-A)",
      period: "May 2022 - Ongoing",
      bullets: [
        "Mastercard Foundation Scholar at USIU-A",
        "Active member of the Google Developer Student Club (GDSC) USIU-A, IT Club, and Music Club."
      ],
      coursework: [
        "Data Structures and Algorithms",
        "Computer Networks",
        "Software Design and Architecture",
        "Web Application Development",
        "Mobile App Development",
        "Object-Oriented Programming",
        "Operating Systems",
        "Database Management Systems",
        "Software Testing and Quality Assurance",
        "Cloud Computing (Microsoft Azure)",
        "Artificial Intelligence and Machine Learning",
        "Human-Computer Interaction",
        "Project Management in Software Engineering"
      ]
    },
    {
      degree: "High School Diploma",
      institution: "Chania High School",
      period: "Jan 2016 - 2020",
      bullets: [
        "Graduated with a Grade B (KCSE)"
      ]
    }
  ],
  skills: [
    {
      category: "Languages",
      skills: ["Python", "JavaScript", "Java", "C", "C++", "HTML", "CSS"]
    },
    {
      category: "Mobile App Development",
      skills: ["React Native (Expo)", "Kotlin"]
    },
    {
      category: "Frameworks & Libraries",
      skills: ["React.js", "Django", "Next.js", "Angular", "Flutter", "Flask"]
    },
    {
      category: "Artificial Intelligence & ML",
      skills: ["TensorFlow", "Natural Language Processing (NLP)", "Prompt Engineering", "Google AI SDK"]
    },
    {
      category: "Databases",
      skills: ["SQL", "PostgreSQL", "NoSQL", "MongoDB"]
    },
    {
      category: "Tools & Platforms",
      skills: ["Git", "Docker", "GitHub", "GitLab", "Microsoft Azure", "Figma", "Selenium", "Pytest"]
    }
  ],
  languages: ["English", "Swahili", "Kinyarwanda", "French"],
  clubs: ["IT Club", "Music Club", "Google Developer Student Club USIU-A", "Mastercard Foundation Scholar"],
  referees: [
    {
      name: "Dr. Evans",
      title: "Senior Software Consultant at Tech.co",
      phone: "+254 730 116166",
      email: "evans@tech.co"
    },
    {
      name: "Evans Oluoch",
      title: "ICT Assistant Officer at USIU-Africa",
      phone: "+254 758241814",
      email: "evoluoch@usiu.ac.ke"
    },
    {
      name: "Prof Austin Sifuna",
      title: "Assistant Professor in Information Systems at USIU-Africa",
      phone: "+254 708 380 726",
      email: "asifuna@usiu.ac.ke"
    }
  ]
};

export const projectsData: Project[] = [
  {
    id: "personal-portfolio",
    title: "Personal Portfolio Website",
    subtitle: "Interactive Digital Identity System",
    description: "This personal, high-craft response system built using Astro, React, TypeScript, and Tailwind CSS. Features dark-light switching modules, interactive client-side ASCII background grids, and custom background music players with simple playback toggles.",
    longDescription: "Created to provide deep technical validation for recruiters and technical leaders. Showcases engineering logs, integrated chatbot capabilities with customized context pools, responsive PDF printable layouts, and custom state synchronization.",
    techStack: ["Astro", "React.js", "TypeScript", "Tailwind CSS", "Node.js", "Local Storage", "Lucide Icons"],
    githubUrl: "https://github.com/ishimweabedinego/ishimweabedinego.github.io",
    featured: false,
    category: "Web"
  }
];
