"use client";

import { DetectedSection, SectionType } from "@/lib/types";

interface DetectedSectionsProps {
  sections: DetectedSection[];
  pageTitle: string;
  pageType: string;
}

const SECTION_STYLES: Record<SectionType, { bg: string; border: string; text: string; emoji: string }> = {
  hero: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", emoji: "🚀" },
  headline: { bg: "#EFF6FF", border: "#93C5FD", text: "#1D4ED8", emoji: "📣" },
  subheadline: { bg: "#F0F9FF", border: "#BAE6FD", text: "#0369A1", emoji: "📝" },
  problem: { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626", emoji: "⚠️" },
  benefits: { bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A", emoji: "✅" },
  framework: { bg: "#FAF5FF", border: "#E9D5FF", text: "#7C3AED", emoji: "📐" },
  testimonials: { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706", emoji: "💬" },
  speaker: { bg: "#ECFDF5", border: "#A7F3D0", text: "#059669", emoji: "👤" },
  agenda: { bg: "#EFF6FF", border: "#BFDBFE", text: "#2563EB", emoji: "📅" },
  faq: { bg: "#F8FAFC", border: "#E2E8F0", text: "#475569", emoji: "❓" },
  cta: { bg: "#FFF7ED", border: "#FED7AA", text: "#EA580C", emoji: "🎯" },
  unknown: { bg: "#F8FAFC", border: "#E2E8F0", text: "#64748B", emoji: "📄" },
};

const PAGE_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  webinar: { label: "Webinar Registration", emoji: "🎥" },
  course: { label: "Online Course", emoji: "🎓" },
  product: { label: "Product Launch", emoji: "🛍️" },
  event: { label: "Live Event", emoji: "🎪" },
  "lead-gen": { label: "Lead Generation", emoji: "🎣" },
  general: { label: "Marketing Page", emoji: "📢" },
};

const CONFIDENCE_CONFIG = {
  high: { label: "High confidence", color: "#16A34A" },
  medium: { label: "Medium confidence", color: "#D97706" },
  low: { label: "Low confidence", color: "#DC2626" },
};

export default function DetectedSections({ sections, pageTitle, pageType }: DetectedSectionsProps) {
  const pageTypeInfo = PAGE_TYPE_LABELS[pageType] || PAGE_TYPE_LABELS.general;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-slate-800 font-bold text-base" style={{ fontWeight: 800 }}>
              🔍 Copy Analysis
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">{pageTitle || "Untitled Page"}</p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: "rgba(30,58,138,0.08)", color: "#1E3A8A", fontWeight: 700 }}
          >
            {pageTypeInfo.emoji} {pageTypeInfo.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          {sections.length} sections detected
        </p>
        <div className="space-y-2">
          {sections.map((section, i) => {
            const style = SECTION_STYLES[section.type] || SECTION_STYLES.unknown;
            const confidence = CONFIDENCE_CONFIG[section.confidence] || CONFIDENCE_CONFIG.medium;
            return (
              <div
                key={i}
                className="p-3 rounded-xl transition-all"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{style.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: style.text, letterSpacing: "0.07em" }}>
                    {section.type.replace(/-/g, " ")}
                  </span>
                  <span className="ml-auto text-xs" style={{ color: confidence.color, fontWeight: 600 }}>
                    ● {section.confidence}
                  </span>
                </div>
                {section.content && (
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {section.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
