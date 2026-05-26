/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  category: "AI" | "Mobile" | "Web" | "DevOps";
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  techUsed?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  bullets?: string[];
  coursework?: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface CVData {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  github: string;
  twitter?: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: SkillGroup[];
  languages: string[];
  clubs: string[];
  referees: {
    name: string;
    title: string;
    phone: string;
    email: string;
  }[];
}

