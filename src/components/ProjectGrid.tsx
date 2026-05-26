/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Project } from "../types";
import { projectsData } from "../data";
import { Github, ExternalLink, ArrowRight, X } from "lucide-react";

export default function ProjectGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projectsData.map((project, index) => {
          const imageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000";
          const displaySubtitle = "INTERACTIVE DIGITAL IDENTITY";

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative border border-neutral-150 dark:border-neutral-850 bg-white dark:bg-neutral-900/30 rounded-xl p-4 transition-all duration-300 hover:border-neutral-350 dark:hover:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/60 cursor-pointer flex flex-col gap-5 shadow-xs"
            >
              {/* IMAGE HEADER - Inspired by Miro design and the shared image */}
              <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-neutral-150 dark:border-neutral-800/80 bg-neutral-950">
                {/* Image background with zoom scale */}
                <img
                  src={imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-65 dark:opacity-50 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />

                {/* Nice dark vignette gradient to overlay text smoothly */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-85" />

                {/* Bold Typography Title overlay at the bottom matching reference photo */}
                <div className="absolute bottom-4 left-4 right-4 text-left z-10 pointer-events-none">
                  <h4 className="font-sans font-bold text-lg md:text-xl text-white tracking-wide uppercase leading-tight">
                    PORTFOLIO WEBSITE
                  </h4>
                  <p className="font-mono text-[9px] text-neutral-400 tracking-wider font-semibold mt-0.5">
                    {displaySubtitle}
                  </p>
                </div>
              </div>

              {/* DETAILS SECTION BELOW - Styled exactly matching user mockup inspiration */}
              <div className="space-y-4 flex-1 flex flex-col justify-between px-1">
                <div className="space-y-3">
                  {/* Mockup Row: Number on left, Status Pills on right */}
                  <div className="flex justify-between items-center py-1">
                    <span className="font-mono text-sm md:text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </span>
                    <div className="flex gap-2 items-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                        LIVE
                      </span>
                    </div>
                  </div>

                  {/* Title & Date */}
                  <div className="space-y-1">
                    <h5 className="font-sans font-bold text-lg text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h5>
                    <p className="font-sans text-xs text-neutral-400 dark:text-neutral-500 md:text-[13px]">
                      Feb 2026 - Present
                    </p>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs md:text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tech Pills & Case Study row on bottom */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850/80 flex flex-wrap gap-2 items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9px] px-2.5 py-0.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="font-mono text-[9px] text-neutral-400 mt-0.5">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all flex items-center gap-1 shrink-0 font-sans">
                    View Spec Sheet <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Detail Overlay Sheet Specs Modal (Drawer style) */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xs shadow-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-950 dark:hover:text-white cursor-pointer transition-colors p-1"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] text-neutral-400 tracking-wider">PROJECT SPECIFICATION SHEET //</span>
                <div className="flex gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                    ● Live
                  </span>
                </div>
              </div>

              <h3 className="font-sans font-bold text-2xl text-neutral-950 dark:text-white uppercase tracking-tight">
                {selectedProject.title}
              </h3>
              <p className="font-mono text-xs text-neutral-400 dark:text-emerald-500 mb-6">
                subtitle_id: {selectedProject.subtitle}
              </p>

              {/* Sub-Divider */}
              <div className="font-mono text-neutral-300 dark:text-neutral-800 text-[10px] tracking-tight mb-4 select-none">
                ==========================================================
              </div>

              {/* Long Description */}
              <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans mb-6">
                <p>{selectedProject.description}</p>
                {selectedProject.longDescription && (
                  <div>
                    <h5 className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5 uppercase">
                      Architecture & Deployment Breakdown:
                    </h5>
                    <p className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xs border border-neutral-100 dark:border-neutral-850 text-xs font-mono text-neutral-600 dark:text-neutral-400 whitespace-pre-line leading-relaxed">
                      {selectedProject.longDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Full Tech Stack */}
              <div className="mb-6">
                <h5 className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-2 uppercase">
                  Fully Integrated Tech Stack:
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Footers */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
              <span className="text-[11px] font-mono text-neutral-400">
                // Ready for local review & inspection
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white bg-neutral-50 dark:bg-neutral-950 rounded-xs border border-neutral-200 dark:border-neutral-850 cursor-pointer"
                >
                  Close Spec
                </button>
                {selectedProject.id === "personal-portfolio" && (
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      window.location.hash = "#home";
                    }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-semibold tracking-wide rounded-xs hover:bg-emerald-700 transition-all cursor-pointer font-sans"
                  >
                    <ExternalLink size={13} />
                    <span>View Live Site</span>
                  </button>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold tracking-wide rounded-xs hover:bg-neutral-850 dark:hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    <Github size={13} />
                    <span>View GitHub Repository</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
