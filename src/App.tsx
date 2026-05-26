/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, MouseEvent, useRef } from "react";
import { cvData } from "./data";
import ResumeViewer from "./components/ResumeViewer";
import ProjectGrid from "./components/ProjectGrid";
import RetroMusicPlayer from "./components/RetroMusicPlayer";
import AsciiMacbook from "./components/AsciiMacbook";
import AsciiCupBackground from "./components/AsciiCupBackground";
import { 
  Github, 
  Linkedin, 
  Twitter,
  Mail, 
  Calendar, 
  BookOpen, 
  Briefcase, 
  MessageSquare, 
  Sun, 
  Moon, 
  ChevronRight, 
  Download, 
  Award,
  BookMarked,
  CheckCircle,
  Hash,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";

export function SitemapTypewriter({ onBack }: { onBack: () => void }) {
  const lines = [
    "You've stumbled upon this concealed, empty place.",
    "Turn back, weary traveler, for here lies no more.",
    "You've reached the expanse of the famed 404.",
    "Page Not Found",
    "The specified file was not found on this website. Please check the URL for mistakes and try again."
  ];

  const [visibleLines, setVisibleLines] = useState<string[]>(["", "", "", "", ""]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    // Reset typing state on mount
    setVisibleLines(["", "", "", "", ""]);
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
  }, []);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const timer = setTimeout(() => {
      const targetText = lines[currentLineIndex];
      if (currentCharIndex < targetText.length) {
        setVisibleLines(prev => {
          const next = [...prev];
          next[currentLineIndex] = targetText.slice(0, currentCharIndex + 1);
          return next;
        });
        setCurrentCharIndex(prev => prev + 1);
      } else {
        const nextLineTimer = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 600);
        return () => clearTimeout(nextLineTimer);
      }
    }, currentLineIndex === 3 ? 50 : currentLineIndex === 4 ? 20 : 40);

    return () => clearTimeout(timer);
  }, [currentLineIndex, currentCharIndex]);

  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-4 text-center overflow-hidden min-h-[500px] select-none font-sans">
      {/* Big 404 Watermark in the background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-[0.03] select-none pointer-events-none">
        <span className="font-sans font-extrabold text-[12rem] md:text-[24rem] tracking-tighter leading-none select-none">
          404
        </span>
      </div>

      {/* Main poetic container */}
      <div className="relative z-10 space-y-12 max-w-3xl mx-auto w-full">
        {/* Poem lines */}
        <div className="space-y-4 text-neutral-800 dark:text-neutral-300 font-normal tracking-wide leading-relaxed text-base md:text-xl md:px-6">
          <p className="min-h-[1.75rem] transition-all">{visibleLines[0]}</p>
          <p className="min-h-[1.75rem] transition-all">{visibleLines[1]}</p>
          <p className="min-h-[1.75rem] transition-all">{visibleLines[2]}</p>
        </div>

        {/* Big Alert section */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-emerald-600 dark:text-emerald-500 tracking-tight transition-all duration-300">
            {visibleLines[3]}
            {currentLineIndex === 3 && (
              <span className="animate-pulse text-emerald-500 font-bold ml-1">|</span>
            )}
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            {visibleLines[4]}
          </p>
        </div>

        {/* Interaction Action (EMERALD) */}
        <div className="pt-6 flex justify-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xs text-xs uppercase tracking-widest font-semibold font-mono transition-all duration-300 shadow-md shadow-emerald-600/10 cursor-pointer"
          >
            [← Return to Safe Harbor]
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved !== null ? saved === "dark" : true;
    }
    return true;
  });
  
  // Custom Green Mouse Follower Refs & Logic
  const followerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const follower = followerRef.current;
    const ring = ringRef.current;
    if (!follower || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let hasMoved = false;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        if (follower) follower.style.opacity = "1";
        if (ring) ring.style.opacity = "1";
      }

      // Live detection of clickable/interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = 
          target.tagName === "BUTTON" || 
          target.tagName === "A" || 
          target.closest("button") || 
          target.closest("a") || 
          target.closest(".cursor-pointer");

        if (isClickable) {
          ring.classList.add("scale-[1.8]", "border-emerald-500/60", "bg-emerald-500/10");
          follower.classList.add("scale-0");
        } else {
          ring.classList.remove("scale-[1.8]", "border-emerald-500/60", "bg-emerald-500/10");
          follower.classList.remove("scale-0");
        }
      }
    };

    const handleMouseLeave = () => {
      if (follower) follower.style.opacity = "0";
      if (ring) ring.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (hasMoved) {
        if (follower) follower.style.opacity = "1";
        if (ring) ring.style.opacity = "1";
      }
    };

    // Initially hide them off-screen or faded out
    follower.style.opacity = "0";
    ring.style.opacity = "0";

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let animationFrameId: number;
    const tick = () => {
      // Linear interpolation to create smooth lagging motion
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      
      currentX += dx * 0.15;
      currentY += dy * 0.15;

      follower.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [contactForm, setContactForm] = useState({ name: "", company: "", email: "", note: "" });
  const [ticket, setTicket] = useState<{ id: string; time: string } | null>(null);
  const [currentView, setCurrentView] = useState<"portfolio" | "privacy" | "sitemap">("portfolio");

  const roles = ["Software Engineer", "Full Stack Developer", "System Engineer", "AI Applications Developer"];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(intervalId);
  }, []);

  // Sync dark class on body element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Monitor location hashes for sitemap and privacy
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#privacy") {
        setCurrentView("privacy");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#sitemap") {
        setCurrentView("sitemap");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentView("portfolio");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleBackToPortfolio = () => {
    setCurrentView("portfolio");
    window.location.hash = "#home";
  };

  const handleBackToTop = (e: MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentView !== "portfolio") {
      setCurrentView("portfolio");
    }
    window.location.hash = "#home";
  };

  // Check section scroll highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "blog", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.note) return;

    // Generate custom ASCII Receipt Ticket
    const ticketId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: ticketId,
      time: new Date().toLocaleString()
    };

    // Store to LocalStorage so recruiter can retrieve later
    const existingMessages = JSON.parse(localStorage.getItem("recruiter_notes") || "[]");
    existingMessages.push({
      ...contactForm,
      id: ticketId,
      timestamp: newTicket.time
    });
    localStorage.setItem("recruiter_notes", JSON.stringify(existingMessages));

    setTicket(newTicket);
    setContactForm({ name: "", company: "", email: "", note: "" });
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-[#0A0A0A] text-neutral-800 dark:text-neutral-300 transition-colors duration-300 font-sans tracking-tight ${darkMode ? "dark" : ""}`}>
      
      {/* Dynamic ASCII Style Background Dot Grid */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0" />

      {/* Top Navigation Frame */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0A0A]/95 border-b border-neutral-200 dark:border-neutral-850 backdrop-blur-md px-4 py-3 select-none">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          {/* Leftside: Brand Metaphor Logo */}
          <div className="flex items-center">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                handleBackToPortfolio();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-end gap-0.5 group cursor-pointer"
            >
              <span className="font-sans text-xl md:text-2xl font-black tracking-wider text-emerald-600 dark:text-emerald-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-200">
                ABED
              </span>
              <span className="w-1.5 h-1.5 mb-[3px] md:mb-[4px] rounded-full bg-emerald-600 dark:bg-emerald-500 group-hover:scale-125 transition-transform duration-200" />
            </a>
          </div>

          {/* Rightside: Navigation Items + Controls */}
          <div className="flex items-center gap-6">
            {/* Nav Rail Indicators - Right aligned */}
            <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              <a href="#home" className={`hover:text-neutral-950 dark:hover:text-white transition-colors ${activeSection === "home" ? "text-neutral-950 dark:text-white font-bold" : ""}`}>
                HOME
              </a>
              <a href="#about" className={`hover:text-neutral-950 dark:hover:text-white transition-colors ${activeSection === "about" ? "text-neutral-950 dark:text-white font-bold" : ""}`}>
                ABOUT
              </a>
              <a href="#projects" className={`hover:text-neutral-950 dark:hover:text-white transition-colors ${activeSection === "projects" ? "text-neutral-950 dark:text-white font-bold" : ""}`}>
                PROJECTS
              </a>
              <a href="#blog" className={`hover:text-neutral-950 dark:hover:text-white transition-colors ${activeSection === "blog" ? "text-neutral-950 dark:text-white font-bold" : ""}`}>
                BLOGS
              </a>
              <a href="#contact" className={`hover:text-neutral-950 dark:hover:text-white transition-colors ${activeSection === "contact" ? "text-neutral-950 dark:text-white font-bold" : ""}`}>
                CONTACT
              </a>
            </nav>

            <span className="hidden md:block text-neutral-200 dark:text-neutral-800 font-mono text-xs">|</span>

            {/* Music & Theme Controls */}
            <div className="flex items-center gap-2">
              <RetroMusicPlayer />
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun size={13} /> : <Moon size={13} />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Single-Screen Content Frame wrapper */}
      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-16">

        {currentView === "portfolio" && (
          <>
            {/* SECTION 1: HOME (Landing Box) */}
            <section id="home" className="pt-4 scroll-mt-24">
          <div className="relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-neutral-200 dark:border-neutral-850 p-6 md:p-8 rounded-xs bg-neutral-50/50 dark:bg-neutral-950/25">
            
            {/* Embedded 3D wireframe MacBook rotating background */}
            <AsciiMacbook isBackground={true} />

            {/* Column Left: Visual Dither Portrait SVG (ASCII Metaphor) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 relative z-10">
              <div className="relative group select-none">
                {/* ASCII Box Frame border */}
                <div className="absolute -inset-1.5 border border-dashed border-neutral-300 dark:border-neutral-700/80 rounded-sm scale-102 group-hover:scale-104 transition-transform duration-300" />
                
                {/* SVG Geometric Portrait Art */}
                <div className="relative w-48 h-48 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden">
                  
                  {/* Custom high-craft particle coder dither avatar vector */}
                  <svg viewBox="0 0 100 100" className="w-40 h-40 text-neutral-800 dark:text-neutral-200 fill-current select-none transform transition-transform duration-500 group-hover:scale-103">
                    {/* Dynamic Backgrid dots inside avatar */}
                    <g className="text-neutral-300 dark:text-neutral-800">
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="50" cy="20" r="1.5" />
                      <circle cx="80" cy="20" r="1.5" />
                      <circle cx="20" cy="50" r="1.5" />
                      <circle cx="50" cy="50" r="1.5" />
                      <circle cx="80" cy="50" r="1.5" />
                      <circle cx="20" cy="80" r="1.5" />
                      <circle cx="50" cy="80" r="1.5" />
                      <circle cx="80" cy="85" r="1.5" />
                    </g>
                    {/* Coder Head and Shoulder Minimal layout */}
                    <path d="M 50 25 C 57 25, 62 30, 62 37 C 62 43, 58 46, 55 48 C 54 49, 54 51, 54 53" fill="none" strokeWidth="2.5" className="stroke-neutral-800 dark:stroke-white text-neutral-950" />
                    <circle cx="50" cy="35" r="12" fill="none" strokeWidth="2.5" className="stroke-neutral-800 dark:stroke-white" />
                    {/* Smile and Eyes flat vector */}
                    <circle cx="46" cy="33" r="1.5" />
                    <circle cx="54" cy="33" r="1.5" />
                    <path d="M 46 38 Q 50 42 54 38 M 41 33 H 48 M 52 33 H 59" fill="none" strokeWidth="1" className="stroke-neutral-800 dark:stroke-white" />
                    {/* Glasses Frame bridging eyes */}
                    <rect x="42" y="31" width="7" height="4" rx="1" fill="none" strokeWidth="1.2" className="stroke-neutral-800 dark:stroke-white" />
                    <rect x="51" y="31" width="7" height="4" rx="1" fill="none" strokeWidth="1.2" className="stroke-neutral-800 dark:stroke-white" />
                    <line x1="49" y1="33" x2="51" y2="33" strokeWidth="1.2" className="stroke-neutral-800 dark:stroke-white" />
                    {/* Minimalist Sweater shoulders collar */}
                    <path d="M 22 78 C 30 65, 40 60, 50 60 C 60 60, 70 65, 78 78 Z" fill="none" strokeWidth="2.5" className="stroke-neutral-800 dark:stroke-white" />
                    {/* Binary text stream decorations within profile */}
                    <text x="73" y="10" className="font-mono text-[6px] fill-emerald-500 font-semibold select-none">AI //</text>
                  </svg>
                  
                </div>
              </div>
            </div>

            {/* Column Right: Profile Metrics & pitch */}
            <div className="md:col-span-8 space-y-4 relative z-10">
              
              <h2 className="font-sans font-bold text-3xl md:text-4xl text-neutral-950 dark:text-white tracking-tight leading-none uppercase">
                Abedinego Ishimwe
              </h2>
              
              <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400 flex flex-wrap items-center gap-2">
                <span className="text-emerald-500 font-bold animate-[pulse_1s_infinite]">●</span>
                <span className="font-semibold text-neutral-900 dark:text-white transition-opacity duration-300">
                  {roles[roleIndex]}
                </span>
              </div>

              {/* Sub-divider */}
              <div className="font-mono text-neutral-200 dark:text-neutral-800 text-[10px] select-none tracking-tight">
                ·······································································
              </div>

              <p className="font-sans text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed md:max-w-lg">
                “Software Engineering student focused on full-stack development, AI applications, and building practical digital solutions.”
              </p>

              {/* Action Buttons list */}
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold tracking-wide rounded-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  <span>View Projects</span>
                  <ChevronRight size={12} />
                </a>
                
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <span>Contact Me</span>
                </a>

                {/* Social media links row */}
                <span className="hidden sm:inline text-neutral-200 dark:text-neutral-800 self-center px-1">|</span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={cvData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={13} />
                  </a>
                  <a
                    href={cvData.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                    title="Twitter Profile"
                  >
                    <Twitter size={13} />
                  </a>
                  <a
                    href={cvData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                    title="GitHub Profile"
                  >
                    <Github size={13} />
                  </a>
                </div>

                {/* Print button anchor */}
                <button
                  onClick={() => window.print()}
                  className="inline-flex sm:hidden items-center gap-1 px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-xs hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <span>Get CV</span>
                  <Download size={11} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: ABOUT SECTION */}
        <section id="about" className="relative overflow-hidden scroll-mt-24 p-1 rounded-sm">
          {/* Glowing 3D ASCII Cup and Steam Background */}
          <AsciiCupBackground />

          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1 select-none">
                ABOUT
              </h3>
              <div className="flex-1 h-px border-t border-dashed border-neutral-250 dark:border-neutral-800" />
            </div>

            <div className="space-y-8 max-w-3xl">
              {/* Elegant Display Greeting */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-2xl md:text-3xl text-neutral-950 dark:text-white tracking-tight">
                  Hello, I'm Abedinego!
                </h4>
                <p className="font-sans text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  I am a Software Engineer based in Nairobi, Kenya, currently pursuing my software engineering honors degree at the **United States International University Africa** (USIU-Africa). I combine technical knowledge with leadership to design and deploy digital solutions aimed at addressing real socio-economic demands across East Africa.
                </p>
                <p className="font-sans text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  I fell in love with coding through a desire to understand systems and build tools that are direct, accessible, and functional. Over my academic semesters, I have acquired working capabilities in full-stack engineering, robust conversational AI integration, lightweight backend API architectures, and relational database systems.
                </p>
                <p className="font-sans text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  I believe in tackling complex programming tasks with an open mind, using technology as a vehicle to streamline workflows, optimize computational pipelines, and build beautiful user-facing interfaces.
                </p>
              </div>

              {/* Structured Sub-sections with Miro-style layout */}
              <div className="pt-4">
                
                {/* Academics Block */}
                <div className="space-y-4 max-w-2xl">
                  <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5">
                    <Award size={13} className="text-amber-500" />
                    <span>Academics</span>
                  </h5>
                  <ul className="space-y-4 font-sans text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                    <li className="space-y-1">
                      <span className="font-semibold text-neutral-900 dark:text-white block">United States International University Africa</span>
                      <span>Bachelor of Science in Software Engineering (Class of 2026). Focused closely on practical software architecture, relational indexing, and computational AI.</span>
                    </li>
                    <li className="space-y-1">
                      <span className="font-semibold text-neutral-900 dark:text-white block">Student Tech Chapters</span>
                      <span>Active student contributor in the Google Developer Student Clubs (GDSC) chapter, USIU IT Club, and local East African open-source hackathons.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

            {/* Centered Resume Download Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all rounded-xs cursor-pointer"
              >
                <span>Download CV</span>
                <Download size={13} />
              </button>
            </div>
          </div>
        </section>

        {/* ASCII Space Divider */}
        <div className="font-mono text-[10px] text-neutral-200 dark:text-neutral-900 overflow-hidden tracking-tighter select-none">
          ········································································································
        </div>

        {/* SECTION 3: PROJECTS GRID SECTION */}
        <section id="projects" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1 select-none">
              PROJECTS
            </h3>
            <div className="flex-1 h-px border-t border-dashed border-neutral-250 dark:border-neutral-800" />
          </div>

          <ProjectGrid />
        </section>

        {/* ASCII Space Divider */}
        <div className="font-mono text-[10px] text-neutral-200 dark:text-neutral-900 overflow-hidden tracking-tighter select-none">
          ········································································································
        </div>

        {/* SECTION 4: FUTURE READY BLOG SECTION */}
        <section id="blog" className="scroll-mt-24 space-y-6">
          
          <div className="flex items-center gap-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1 select-none">
              BLOGS
            </h3>
            <div className="flex-1 h-px border-t border-dashed border-neutral-250 dark:border-neutral-800" />
          </div>

          <p className="font-sans text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed md:max-w-2xl">
            I haven't yet written any blogs, but you can expect topics like the following:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Blog Post 1 */}
            <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 p-5 rounded-xs hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 tracking-wider block">
                  COMING SOON • 5 MIN READ
                </span>
                <h4 className="font-sans font-bold text-base text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-emerald-400 transition-colors">
                  Things I Wish I Started Earlier as a Software Engineering Student
                </h4>
                <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Reflecting on high-impact habits that classroom syllabi ignore—from building in public and mastering advanced Git workflows to system design practices and early open-source collaboration.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors cursor-pointer select-none">
                EXPECTED SOON <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Blog Post 2 */}
            <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 p-5 rounded-xs hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 tracking-wider block">
                  COMING SOON • 7 MIN READ
                </span>
                <h4 className="font-sans font-bold text-base text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-emerald-400 transition-colors">
                  Astro Might Be the Best Framework Nobody Talks About
                </h4>
                <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  An exploration of Astro's zero-JS island architecture. Why modern web developers are shifting away from heavy dynamic dynamic SPA hydration for high-craft content sites.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors cursor-pointer select-none">
                EXPECTED SOON <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Blog Post 3 */}
            <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 p-5 rounded-xs hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 tracking-wider block">
                  COMING SOON • 4 MIN READ
                </span>
                <h4 className="font-sans font-bold text-base text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-emerald-400 transition-colors">
                  You Don’t Need to Know Everything to Start Building
                </h4>
                <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Demystifying key parts of tutorial hell. Why establishing a muscle memory for building messy drafts, experimenting, and breaking code early accelerates practical engineering skill.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors cursor-pointer select-none">
                EXPECTED SOON <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

          </div>

        </section>

                {/* SECTION 5: CONTACT */}
        <section id="contact" className="scroll-mt-24 space-y-6">
          
          <div className="flex items-center gap-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1 select-none">
              CONTACT
            </h3>
            <div className="flex-1 h-px border-t border-dashed border-neutral-250 dark:border-neutral-800" />
          </div>

          <div className="max-w-xl mx-auto space-y-6">
            <p className="font-sans text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-center">
              Have a proposal, collaboration idea, or want to connect? Please drop a message under the form below.
            </p>

            {/* Form Container */}
            <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs bg-white dark:bg-[#080808]/20 shadow-xs">
              
              {ticket ? (
                // SUCCESS TYPEWRITER TICKET
                <div className="font-mono text-xs text-neutral-700 dark:text-neutral-300 space-y-3 animate-fade-in select-text">
                  <div className="flex items-center gap-1.5 text-emerald-500 font-bold border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-2 mb-2 select-none">
                    <CheckCircle size={15} />
                    <span>CONTACT FORM SUBMITTED SUCCESSFULLY!</span>
                  </div>
                  <pre className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-xs leading-relaxed select-text font-mono text-[11px]">
                    {`==================================
TICKET RECEIPT ID: ${ticket.id}
TIMESTAMP:         ${ticket.time}
LOG_STATUS:        PENDING_REVIEW
COORDINATES:       SECURE_PORTAL
==================================

Thank you for your submission. Abedinego will review your message shortly.`}
                  </pre>
                  
                  <button
                    onClick={() => setTicket(null)}
                    className="w-full py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-mono text-xs uppercase tracking-wider cursor-pointer font-semibold"
                  >
                    [+] Send Another Message
                  </button>
                </div>
              ) : (
                // SUBMIT FORM with 4 fields: Name, Company, Email, Pitch Note
                <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono uppercase text-[10px] text-neutral-400">Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Dr. Evans"
                        className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 py-2.5 px-3 rounded-xs text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-mono uppercase text-[10px] text-neutral-400">Company *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        placeholder="Tech.co"
                        className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 py-2.5 px-3 rounded-xs text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono uppercase text-[10px] text-neutral-400">Company Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="evans@tech.co"
                      className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 py-2.5 px-3 rounded-xs text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono uppercase text-[10px] text-neutral-400">Message / Pitch Note *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.note}
                      onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
                      placeholder="Enter details on your message or pitch note here..."
                      className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 py-2 px-3 rounded-xs text-neutral-900 dark:text-white resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-mono uppercase tracking-wider text-[11px] font-bold cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Send Message</span>
                    <ArrowUpRight size={13} />
                  </button>
                </form>
              )}

            </div>

            {/* Bottom Connect Social Media line */}
            <div className="pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-3 font-mono">
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500 uppercase tracking-widest font-semibold">
                Connect with me on
              </p>
              <div className="flex items-center justify-center gap-6 text-xs font-semibold">
                <a
                  href={cvData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <Linkedin size={13} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={cvData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <Twitter size={13} />
                  <span>Twitter</span>
                </a>
                <a
                  href={cvData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <Github size={13} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

          </div>

        </section>
          </>
        )}

        {currentView === "privacy" && (
          <div className="space-y-8 animate-fade-in py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-dashed border-neutral-200 dark:border-neutral-800">
              <div>
                <h2 className="font-mono text-xs text-emerald-600 dark:text-emerald-500 uppercase tracking-widest font-semibold">
                  [legal_compliance]
                </h2>
                <h1 className="font-sans font-bold text-3xl text-neutral-900 dark:text-white mt-1">
                  Privacy Policy
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Effective date: May 25, 2026 // Active Document version 1.2
                </p>
              </div>
              <button
                onClick={handleBackToPortfolio}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                <span>← Back to Portfolio</span>
              </button>
            </div>

            {/* Privacy Policy Main Texts */}
            <div className="prose prose-neutral dark:prose-invert font-sans text-xs md:text-sm text-neutral-600 dark:text-neutral-400 space-y-6 leading-relaxed">
              <section className="space-y-2">
                <h3 className="font-mono text-xs uppercase text-neutral-900 dark:text-white font-bold tracking-wider">
                  [01] INTRODUCTION & CORE COMPLIANCE
                </h3>
                <p>
                  This personal resume portfolio is owned and operated by Abedinego Ishimwe. We prioritize user and recruiter privacy controls. This policy explains what information is collected, how it is managed, and your rights concerning local data caching mechanisms on this platform.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-xs uppercase text-neutral-900 dark:text-white font-bold tracking-wider">
                  [02] LOCAL CLIENT-SIDE COOKIES & PREFERENCES
                </h3>
                <p>
                  Unlike commercial projects tracking visitors with analytical beacons or behavioral profile pipelines, we do not employ commercial tracking scripts. Instead, we use your browser's persistent sandbox storing preferences:
                </p>
                <ul className="list-disc pl-5 font-mono text-[11px] space-y-1 text-neutral-500 dark:text-neutral-400">
                  <li><strong>Dark Mode Setting:</strong> Stores your light/dark display selection locally.</li>
                  <li><strong>Interactive Music Player:</strong> Remembers your playback preferences for retro background notes.</li>
                  <li><strong>Correspondence Logs:</strong> Saves submitted contact form receipts under your local browser storage context for self-review.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-xs uppercase text-neutral-900 dark:text-white font-bold tracking-wider">
                  [03] CORRESPONDENCE SUBMISSIONS & SECURITY
                </h3>
                <p>
                  When you complete the secure contact form under Section 5 (Name, Company, Email, Pitch Note), these variables are securely saved as a local ticket state and cached within your local device history. Your connection and message logs are protected within sandbox confines and never leaked to malicious or commercial entities.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-xs uppercase text-neutral-900 dark:text-white font-bold tracking-wider">
                  [04] THIRD PARTY API POLICIES
                </h3>
                <p>
                  This portfolio provides hyperlinks to external repositories and profiles (LinkedIn, X/Twitter, GitHub). Accessing external domains routes you under independent privacy laws which we do not govern.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-xs uppercase text-neutral-900 dark:text-white font-bold tracking-wider">
                  [05] CANDIDATE CONTACT
                </h3>
                <p>
                  Should you wish to remove cached portfolio records, simply clear your browser's Site Data / LocalStorage for this domain, or click "Send Another Message" inside our correspondence ticket view to clear old references. For administrative queries regarding student projects or collaborative assignments, please submit a formal form inquiry directly.
                </p>
              </section>
            </div>
          </div>
        )}

        {currentView === "sitemap" && (
          <div className="py-12 animate-fade-in">
            <SitemapTypewriter onBack={handleBackToPortfolio} />
          </div>
        )}

      </main>

      {/* Decorative Monospace Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-850 mt-16 py-12 bg-neutral-50/50 dark:bg-neutral-950/40 select-none font-sans">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center space-y-4">
          
          {/* Icons Row inspired by the uploaded image */}
          <div className="flex items-center gap-6">
            <a
              href={cvData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-500 hover:opacity-80 transition-all"
              title="GitHub"
            >
              <Github size={26} strokeWidth={1.5} />
            </a>
            <a
              href={cvData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-500 hover:opacity-80 transition-all"
              title="LinkedIn"
            >
              <Linkedin size={26} strokeWidth={1.5} />
            </a>
            <a
              href={cvData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-500 hover:opacity-80 transition-all"
              title="Twitter / X"
            >
              <Twitter size={26} strokeWidth={1.5} />
            </a>
          </div>

          {/* Copyright Line */}
          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 text-center font-medium">
            © 2026 Abedinego Ishimwe. <button onClick={handleBackToTop} className="text-emerald-600 dark:text-emerald-500 hover:underline cursor-pointer font-semibold bg-transparent border-none p-0">Designed and built by me.</button>
          </p>

          {/* Privacy & Sitemap links */}
          <div className="flex items-center gap-4 text-xs font-normal">
            <a href="#privacy" className="text-emerald-600 dark:text-emerald-500 hover:underline">
              Privacy
            </a>
            <span className="text-neutral-300 dark:text-neutral-800 text-[10px]">•</span>
            <a href="#sitemap" className="text-emerald-600 dark:text-emerald-500 hover:underline">
              Sitemap
            </a>
          </div>

        </div>
      </footer>

      {/* Hidden printable wrapper container for clean Download CV actions */}
      <div id="main-cv-wrapper" className="hidden print:block">
        <ResumeViewer />
      </div>

      {/* Dynamic Custom Green Mouse Follower */}
      <div
        ref={followerRef}
        className="hidden md:block fixed top-0 left-0 w-1.5 h-1.5 bg-emerald-500 rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(16,185,129,0.8)]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-500/30 dark:border-emerald-400/35 bg-emerald-500/5 backdrop-blur-[0.5px] pointer-events-none z-[9998] transition-[transform,border-color,background-color] duration-300 ease-out shadow-[0_0_12px_rgba(16,185,129,0.15)]"
        style={{ willChange: "transform" }}
      />

    </div>
  );
}
