/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { cvData } from "../data";
import { Copy, Check, Printer, FileText, Download, Sparkles } from "lucide-react";

export default function ResumeViewer() {
  const [activeTab, setActiveTab] = useState<"visual" | "markdown">("visual");
  const [highlightFilter, setHighlightFilter] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Convert cvData to formatted Markdown CV for HR ingestion
  const getMarkdownCV = () => {
    return `# ${cvData.name.toUpperCase()}
**${cvData.title}**
📍 ${cvData.location} | 📞 ${cvData.phone} | ✉️ ${cvData.email}
🔗 [LinkedIn](${cvData.linkedin}) | [GitHub](${cvData.github})

---

### PROFESSIONAL SUMMARY
${cvData.summary}

---

### EDUCATION
${cvData.education
  .map(
    (edu) => `#### ${edu.degree}
*${edu.institution} | ${edu.period}*
${edu.bullets ? edu.bullets.map((b) => `- ${b}`).join("\n") : ""}
Coursework Highlight: ${edu.coursework ? edu.coursework.join(", ") : ""}`
  )
  .join("\n\n")}

---

### PROFESSIONAL EXPERIENCE
${cvData.experiences
  .map(
    (exp) => `#### ${exp.role} — ${exp.company}
*${exp.location} | ${exp.period}*
${exp.bullets.map((b) => `- ${b}`).join("\n")}
Technologies: ${exp.techUsed ? exp.techUsed.join(", ") : ""}`
  )
  .join("\n\n")}

---

### RELEVANT PROJECTS
- **Rafiki App (AI Language Assistant)**: React Native, Node.js Express, Firebase, Google AI. Mobile tool delivering native African speech tutoring.
- **SmartCampus Support tickets**: React.js, Express, NLP classifications.

---

### TECHNICAL SKILLS
${cvData.skills.map((s) => `- **${s.category}**: ${s.skills.join(", ")}`).join("\n")}

---

### ADDITIONAL INFORMATION
- **Languages**: ${cvData.languages.join(", ")}
- **Clubs & Affiliations**: ${cvData.clubs.join(", ")}

---

### PROFESSIONAL REFEREES
${cvData.referees
  .map(
    (ref) => `- **${ref.name}** (${ref.title})
  Phone: ${ref.phone} | Email: ${ref.email}`
  )
  .join("\n")}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(getMarkdownCV());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="cv-section" className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] rounded-xs shadow-xs overflow-hidden transition-all duration-300">
      {/* Interactive Controls Bar - Hidden during native print styles via CSS */}
      <div className="print:hidden border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-1">
          <FileText size={16} className="text-neutral-500" />
          <span className="font-mono text-xs text-neutral-500 font-medium">CV FORMAT:</span>
          <div className="inline-flex rounded-md p-0.5 bg-neutral-200/60 dark:bg-neutral-800 ml-2">
            <button
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1 rounded-sm text-xs font-medium cursor-pointer transition-all ${
                activeTab === "visual"
                  ? "bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              }`}
            >
              Interactive Sheet
            </button>
            <button
              onClick={() => setActiveTab("markdown")}
              className={`px-3 py-1 rounded-sm text-xs font-medium cursor-pointer transition-all ${
                activeTab === "markdown"
                  ? "bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              }`}
            >
              Markdown (ATS-friendly)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
          {activeTab === "visual" ? (
            <div className="flex items-center gap-1.5 mr-auto sm:mr-4">
              <span className="font-mono text-[10px] text-neutral-400">Highlight:</span>
              <select
                value={highlightFilter}
                onChange={(e) => setHighlightFilter(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px] py-1 px-2 border border-neutral-200 dark:border-neutral-700 rounded-xs text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
              >
                <option value="all">Full Profile</option>
                <option value="AI">AI/ML Focus</option>
                <option value="Mobile">Mobile Apps</option>
                <option value="Cloud">Cloud/DevOps</option>
              </select>
            </div>
          ) : null}

          <button
            onClick={activeTab === "visual" ? handlePrint : handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium cursor-pointer transition-all"
          >
            {activeTab === "visual" ? (
              <>
                <Printer size={13} />
                <span>Print or Save PDF</span>
              </>
            ) : copied ? (
              <>
                <Check size={13} className="text-emerald-500" />
                <span>Copied Code!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RENDER VIEW */}
      {activeTab === "markdown" ? (
        <div className="p-6 font-mono text-xs bg-neutral-50/70 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 overflow-x-auto select-all max-h-[6400px]">
          <div className="flex justify-between items-center text-neutral-400 border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-2 mb-4">
            <span>------ COPY-COMPATIBLE CV MARKDOWN STATE ------</span>
            <button
              onClick={handleCopyMarkdown}
              className="text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-all flex items-center gap-1"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-mono leading-relaxed select-text">{getMarkdownCV()}</pre>
        </div>
      ) : (
        /* PRINT FRIENDLY SHEET RENDERER */
        <div className="p-6 md:p-12 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 select-text font-serif">
          
          {/* Header */}
          <div className="border-b-2 border-neutral-800 dark:border-neutral-200 pb-4 mb-6">
            <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-950 dark:text-white tracking-tight mb-2 uppercase select-text">
              {cvData.name}
            </h1>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs text-neutral-600 dark:text-neutral-400 font-sans gap-2 select-text">
              <span className="font-semibold text-neutral-800 dark:text-neutral-300">{cvData.title}</span>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <span>📍 {cvData.location}</span>
                <span>• {cvData.phone}</span>
                <span>• {cvData.email}</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-x-4 mt-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              <a href={cvData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-neutral-800 dark:hover:text-white">linkedin.com/in/ishimweabedinego</a>
              <span>·</span>
              <a href={cvData.github} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-neutral-800 dark:hover:text-white">github.com/ishimweabedinego</a>
            </div>
          </div>

          {/* Grid Layout of CV */}
          <div className="space-y-6">
            
            {/* Summary */}
            <section className="select-text">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-2 pb-0.5 border-b border-neutral-200 dark:border-neutral-800">
                Summary
              </h3>
              <p className="text-justify font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed text-xs">
                {cvData.summary}
              </p>
            </section>

            {/* Technical Skills */}
            <section className="select-text">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-2 pb-0.5 border-b border-neutral-200 dark:border-neutral-800">
                Technical Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs font-sans">
                {cvData.skills.map((grp) => {
                  // Determine if should highlight depending on selector
                  let isMatch = true;
                  if (highlightFilter === "AI" && grp.category !== "Artificial Intelligence & ML" && grp.category !== "Languages") isMatch = false;
                  if (highlightFilter === "Mobile" && grp.category !== "Mobile App Development" && grp.category !== "Frameworks & Libraries") isMatch = false;
                  if (highlightFilter === "Cloud" && grp.category !== "Tools & Platforms") isMatch = false;

                  return (
                    <div 
                      key={grp.category}
                      className={`py-1.5 transition-all duration-300 rounded-sm px-1.5 ${
                        !isMatch ? "opacity-30 dark:opacity-20 scale-95" : "bg-neutral-50 dark:bg-neutral-900/40 border-l border-neutral-400 dark:border-neutral-600"
                      }`}
                    >
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200 inline-block w-40 max-w-full">
                        {grp.category}:
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {grp.skills.join(", ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Professional Experience */}
            <section className="select-text">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-3 pb-0.5 border-b border-neutral-200 dark:border-neutral-800">
                Professional Experience
              </h3>
              <div className="space-y-4">
                {cvData.experiences.map((exp, i) => {
                  // Check matches
                  let isHighlight = false;
                  if (highlightFilter === "Cloud" && exp.techUsed?.some(t => ["Azure", "Cloud", "DevOps"].some(x => t.includes(x)))) isHighlight = true;
                  if (highlightFilter === "AI" && exp.techUsed?.some(t => ["AI", "Safaricom APIs"].some(x => t.includes(x)))) isHighlight = true;

                  return (
                    <div 
                      key={i} 
                      className={`transition-all duration-300 py-1 rounded-sm ${
                        highlightFilter !== "all" && !isHighlight ? "opacity-40 dark:opacity-25" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start font-sans font-semibold text-xs text-neutral-950 dark:text-white gap-2">
                        <span>{exp.role} <span className="font-normal text-neutral-500">at</span> {exp.company}</span>
                        <span className="whitespace-nowrap tabular-nums text-neutral-600 dark:text-neutral-400">{exp.period}</span>
                      </div>
                      <div className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400 italic mb-1.5">
                        📍 {exp.location}
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700 dark:text-neutral-300 font-sans text-justify">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                      {exp.techUsed && (
                        <div className="mt-2 text-[10px] font-mono flex flex-wrap gap-1">
                          <span className="text-neutral-400">Tools:</span>
                          {exp.techUsed.map((tech) => (
                            <span key={tech} className="bg-neutral-100 dark:bg-neutral-900 py-0.5 px-1.5 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Education */}
            <section className="select-text">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-3 pb-0.5 border-b border-neutral-200 dark:border-neutral-800">
                Education
              </h3>
              <div className="space-y-4 font-sans">
                {cvData.education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start font-semibold text-neutral-950 dark:text-white text-xs">
                      <span>{edu.degree}</span>
                      <span className="whitespace-nowrap font-mono tabular-nums text-neutral-600 dark:text-neutral-400">{edu.period}</span>
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400 text-xs mb-1">
                      {edu.institution}
                    </div>
                    {edu.bullets && (
                      <ul className="list-disc pl-4 space-y-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                        {edu.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    )}
                    {edu.coursework && (
                      <div className="mt-2 text-[11px] leading-relaxed select-text text-neutral-500 dark:text-neutral-400">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">Relevant Coursework:</span>{" "}
                        {edu.coursework.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Two Column details: Additions + Referees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans text-xs">
              
              {/* Additional & Clubs */}
              <section className="select-text">
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-2 pb-0.5 border-b border-neutral-200 dark:border-neutral-800">
                  Additional Information
                </h3>
                <div className="space-y-2 leading-relaxed">
                  <div>
                    <span className="font-semibold">Languages:</span> {cvData.languages.join(", ")}
                  </div>
                  <div>
                    <span className="font-semibold">Activities:</span> {cvData.clubs.join(", ")}
                  </div>
                </div>
              </section>

              {/* Referees */}
              <section className="select-text">
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-2 pb-0.5 border-b border-neutral-200 dark:border-neutral-800">
                  Referees
                </h3>
                <div className="space-y-2.5">
                  {cvData.referees.map((ref, idx) => (
                    <div key={idx} className="text-[11px] leading-snug">
                      <div className="font-bold text-neutral-950 dark:text-white">{ref.name}</div>
                      <div className="text-neutral-500 dark:text-neutral-400 truncate max-w-[340px]">{ref.title}</div>
                      <div className="text-neutral-400 text-[10px]">Email: {ref.email} | Tel: {ref.phone}</div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

          </div>
          
          {/* Subtle ASCII Watermark designed for printing footer */}
          <div className="hidden print:block text-center mt-12 text-[10px] font-mono text-neutral-400">
            ······························ Compiled dynamically via Abedinego's Modern AI Portfolio Port ······························
          </div>
        </div>
      )}
    </div>
  );
}
