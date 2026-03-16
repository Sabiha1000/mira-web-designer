"use client";

import { SectionType } from "@/lib/types";

interface SectionDef {
  type: SectionType;
  name: string;
  emoji: string;
  description: string;
  layouts: string[];
  miraseeNote: string;
}

const SECTION_LIBRARY: SectionDef[] = [
  {
    type: "hero",
    name: "Hero Section",
    emoji: "🚀",
    description: "Bold above-the-fold section with headline, sub-headline, and primary CTA",
    layouts: ["full-width", "split"],
    miraseeNote: "Dark blue background, white text, orange CTA button",
  },
  {
    type: "benefits",
    name: "Benefit Grid",
    emoji: "✅",
    description: "3-column card grid showcasing key benefits with icons",
    layouts: ["3-col", "card-grid"],
    miraseeNote: "White cards with blue icons, clean shadows, bold benefit names",
  },
  {
    type: "testimonials",
    name: "Testimonials",
    emoji: "💬",
    description: "Social proof section with student/client quotes and photos",
    layouts: ["3-col", "full-width"],
    miraseeNote: "Quote cards with name, title, and star rating",
  },
  {
    type: "framework",
    name: "Framework / Method",
    emoji: "📐",
    description: "Visual step-by-step breakdown of your methodology or system",
    layouts: ["3-col", "full-width", "2-col"],
    miraseeNote: "Numbered steps, icons, brief descriptions per step",
  },
  {
    type: "speaker",
    name: "Speaker Bio",
    emoji: "👤",
    description: "Author or speaker introduction with photo and credentials",
    layouts: ["split", "2-col"],
    miraseeNote: "Photo left, bio right; emphasize authority and credibility",
  },
  {
    type: "cta",
    name: "CTA Block",
    emoji: "🎯",
    description: "High-contrast call-to-action with urgency and primary button",
    layouts: ["full-width"],
    miraseeNote: "Orange or dark blue background; bold white text; one clear action",
  },
  {
    type: "faq",
    name: "FAQ Accordion",
    emoji: "❓",
    description: "Collapsible FAQ section to address objections and questions",
    layouts: ["accordion"],
    miraseeNote: "Clean expandable rows, typically 5–8 questions",
  },
  {
    type: "agenda",
    name: "Event Agenda",
    emoji: "📅",
    description: "Timeline or schedule for webinars and live events",
    layouts: ["full-width", "2-col"],
    miraseeNote: "Time + topic format; highlights key segments",
  },
  {
    type: "problem",
    name: "Problem Statement",
    emoji: "⚠️",
    description: "Pain point section that resonates with the target audience",
    layouts: ["full-width", "2-col"],
    miraseeNote: "Empathetic tone; leads into the solution/offer",
  },
];

export default function SectionLibrary() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100" style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)" }}>
        <h2 className="text-white font-bold text-base" style={{ fontWeight: 800 }}>
          🗂️ Section Library
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">Mirasee reusable page sections</p>
      </div>

      <div className="p-4 space-y-2.5 max-h-[500px] overflow-y-auto">
        {SECTION_LIBRARY.map((section) => (
          <div
            key={section.type}
            className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-default"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg flex-shrink-0 mt-0.5">{section.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-800" style={{ fontWeight: 700 }}>
                    {section.name}
                  </h4>
                  <div className="flex gap-1 flex-wrap">
                    {section.layouts.map((layout) => (
                      <span
                        key={layout}
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(30,58,138,0.08)", color: "#1E3A8A", fontWeight: 600, fontSize: "10px" }}
                      >
                        {layout}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{section.description}</p>
                <p className="text-xs mt-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(249,115,22,0.06)", color: "#9A3412", borderLeft: "2px solid #F97316" }}>
                  {section.miraseeNote}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
