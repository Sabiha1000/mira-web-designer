"use client";

import { useState } from "react";
import { LayoutVariation, LayoutSection, SectionType } from "@/lib/types";

interface LayoutViewerProps {
  layouts: LayoutVariation[];
  selectedLayoutId: string | null;
  onSelectLayout: (id: string) => void;
}

const SECTION_COLORS: Record<SectionType, { bg: string; border: string; label: string; emoji: string }> = {
  hero: { bg: "rgba(30,58,138,0.08)", border: "#1E3A8A", label: "HERO", emoji: "🚀" },
  headline: { bg: "rgba(30,58,138,0.06)", border: "#3B82F6", label: "HEADLINE", emoji: "📣" },
  subheadline: { bg: "rgba(59,130,246,0.06)", border: "#93C5FD", label: "SUB-HEADLINE", emoji: "📝" },
  problem: { bg: "rgba(239,68,68,0.06)", border: "#FCA5A5", label: "PROBLEM", emoji: "⚠️" },
  benefits: { bg: "rgba(34,197,94,0.06)", border: "#86EFAC", label: "BENEFITS", emoji: "✅" },
  framework: { bg: "rgba(168,85,247,0.06)", border: "#C4B5FD", label: "FRAMEWORK", emoji: "📐" },
  testimonials: { bg: "rgba(245,158,11,0.06)", border: "#FCD34D", label: "TESTIMONIALS", emoji: "💬" },
  speaker: { bg: "rgba(16,185,129,0.06)", border: "#6EE7B7", label: "SPEAKER BIO", emoji: "👤" },
  agenda: { bg: "rgba(59,130,246,0.06)", border: "#93C5FD", label: "AGENDA", emoji: "📅" },
  faq: { bg: "rgba(107,114,128,0.06)", border: "#D1D5DB", label: "FAQ", emoji: "❓" },
  cta: { bg: "rgba(249,115,22,0.12)", border: "#F97316", label: "CTA", emoji: "🎯" },
  unknown: { bg: "#F8FAFC", border: "#E2E8F0", label: "SECTION", emoji: "📄" },
};

const LAYOUT_STYLE_ICONS: Record<string, string> = {
  bold: "⚡",
  minimal: "✨",
  "card-heavy": "🃏",
  story: "📖",
};

const LAYOUT_STYLE_DESCRIPTIONS: Record<string, string> = {
  bold: "High-impact, maximum contrast",
  minimal: "Clean, focused, whitespace-rich",
  "card-heavy": "Structured, scannable, card-based",
  story: "Narrative flow, emotional journey",
};

const COLOR_SCHEME_MAP: Record<string, { primary: string; accent: string }> = {
  blue: { primary: "#1E3A8A", accent: "#F97316" },
  orange: { primary: "#EA580C", accent: "#1E3A8A" },
  green: { primary: "#166534", accent: "#F97316" },
  purple: { primary: "#581C87", accent: "#F97316" },
};

function WireframeSection({ section, colorScheme }: { section: LayoutSection; colorScheme: string }) {
  const style = SECTION_COLORS[section.sectionType] || SECTION_COLORS.unknown;
  const colors = COLOR_SCHEME_MAP[colorScheme] || COLOR_SCHEME_MAP.blue;

  const isCTA = section.sectionType === "cta";
  const isHero = section.sectionType === "hero";

  const layoutClass = {
    "full-width": "w-full",
    "2-col": "grid grid-cols-2 gap-1",
    "3-col": "grid grid-cols-3 gap-1",
    "card-grid": "grid grid-cols-3 gap-1",
    accordion: "space-y-0.5",
    split: "grid grid-cols-2 gap-1",
  }[section.layout] || "w-full";

  return (
    <div
      className="rounded-lg p-3 mb-2 transition-all"
      style={{
        background: isCTA ? colors.primary : style.bg,
        border: `1.5px solid ${isCTA ? colors.primary : style.border}`,
      }}
    >
      {/* Section Label */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs">{style.emoji}</span>
        <span
          className="text-xs font-bold tracking-wider"
          style={{
            color: isCTA ? "#fff" : style.border,
            letterSpacing: "0.08em",
          }}
        >
          {style.label}
        </span>
        <span
          className="ml-auto text-xs opacity-60"
          style={{ color: isCTA ? "#fff" : "#64748B" }}
        >
          {section.layout}
        </span>
      </div>

      {/* Content mockup */}
      {isHero && (
        <div className="space-y-1.5">
          <div className="h-3 rounded" style={{ background: colors.primary, opacity: 0.7, width: "80%" }} />
          <div className="h-2 rounded" style={{ background: colors.primary, opacity: 0.3, width: "60%" }} />
          <div className="h-7 rounded-lg mt-2 inline-block px-3 flex items-center justify-center" style={{ background: colors.accent, width: "40%" }}>
            <div className="h-2 rounded" style={{ background: "white", opacity: 0.9, width: "80%" }} />
          </div>
        </div>
      )}

      {isCTA && (
        <div className="text-center space-y-1.5">
          <div className="h-2.5 rounded mx-auto" style={{ background: "white", opacity: 0.8, width: "70%" }} />
          <div
            className="h-7 rounded-lg mx-auto flex items-center justify-center"
            style={{ background: colors.accent, width: "50%" }}
          >
            <div className="h-2 rounded" style={{ background: "white", opacity: 0.9, width: "70%" }} />
          </div>
        </div>
      )}

      {section.layout === "card-grid" || section.layout === "3-col" ? (
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-md p-2 space-y-1" style={{ border: "1px solid #E2E8F0" }}>
              <div className="h-2 rounded" style={{ background: "#E2E8F0", width: "60%" }} />
              <div className="h-1.5 rounded" style={{ background: "#E2E8F0", width: "90%" }} />
              <div className="h-1.5 rounded" style={{ background: "#E2E8F0", width: "75%" }} />
            </div>
          ))}
        </div>
      ) : section.layout === "2-col" || section.layout === "split" ? (
        <div className="grid grid-cols-2 gap-1">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-2 rounded" style={{ background: isCTA ? "rgba(255,255,255,0.3)" : "#E2E8F0", width: "80%" }} />
              <div className="h-1.5 rounded" style={{ background: isCTA ? "rgba(255,255,255,0.2)" : "#E2E8F0", width: "90%" }} />
            </div>
          ))}
        </div>
      ) : section.layout === "accordion" ? (
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 bg-white rounded" style={{ border: "1px solid #E2E8F0" }}>
              <div className="h-2 flex-1 rounded" style={{ background: "#E2E8F0" }} />
              <span className="text-slate-400 text-xs">▼</span>
            </div>
          ))}
        </div>
      ) : !isHero && !isCTA ? (
        <div className="space-y-1">
          <div className="h-1.5 rounded" style={{ background: style.border, opacity: 0.3, width: "70%" }} />
          <div className="h-1.5 rounded" style={{ background: style.border, opacity: 0.2, width: "90%" }} />
          <div className="h-1.5 rounded" style={{ background: style.border, opacity: 0.2, width: "55%" }} />
        </div>
      ) : null}

      {/* Content label */}
      {section.content && (
        <p className="text-xs mt-2 leading-snug" style={{ color: isCTA ? "rgba(255,255,255,0.8)" : "#64748B" }}>
          {section.content.slice(0, 80)}{section.content.length > 80 ? "…" : ""}
        </p>
      )}
    </div>
  );
}

export default function LayoutViewer({ layouts, selectedLayoutId, onSelectLayout }: LayoutViewerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
  const selectedLayout = layouts.find((l) => l.id === selectedLayoutId);

  if (!layouts.length) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800" style={{ fontWeight: 800 }}>
            Layout Variations
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">{layouts.length} conversion-focused designs generated</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "grid" ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            style={{ fontWeight: 700 }}
          >
            ⊞ Grid
          </button>
          <button
            onClick={() => setViewMode("detail")}
            disabled={!selectedLayoutId}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-40 ${viewMode === "detail" ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            style={{ fontWeight: 700 }}
          >
            ≡ Detail
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4">
          {layouts.map((layout, idx) => {
            const colors = COLOR_SCHEME_MAP[layout.colorScheme] || COLOR_SCHEME_MAP.blue;
            const isSelected = layout.id === selectedLayoutId;
            return (
              <div
                key={layout.id}
                onClick={() => onSelectLayout(layout.id)}
                className={`layout-card bg-white rounded-2xl border-2 cursor-pointer overflow-hidden ${isSelected ? "selected" : "border-slate-200"}`}
              >
                {/* Card Header */}
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: colors.primary }}>
                  <span className="text-lg">{LAYOUT_STYLE_ICONS[layout.style] || "📐"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate" style={{ fontWeight: 800 }}>
                      {idx + 1}. {layout.name}
                    </p>
                    <p className="text-white text-xs opacity-70 truncate">
                      {LAYOUT_STYLE_DESCRIPTIONS[layout.style]}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-white text-lg">✓</span>
                  )}
                </div>

                {/* Wireframe Preview */}
                <div className="p-3 max-h-80 overflow-y-auto">
                  {layout.sections.slice(0, 6).map((section, i) => (
                    <WireframeSection key={i} section={section} colorScheme={layout.colorScheme} />
                  ))}
                  {layout.sections.length > 6 && (
                    <p className="text-center text-xs text-slate-400 py-1">
                      +{layout.sections.length - 6} more sections
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {layout.sections.length} sections • CTA: {layout.ctaPosition}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${colors.accent}20`, color: colors.accent, fontWeight: 700 }}
                  >
                    {layout.style}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : selectedLayout ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Detail Header */}
          <div className="px-6 py-4 flex items-center gap-3" style={{ background: COLOR_SCHEME_MAP[selectedLayout.colorScheme]?.primary || "#1E3A8A" }}>
            <span className="text-2xl">{LAYOUT_STYLE_ICONS[selectedLayout.style]}</span>
            <div>
              <h3 className="text-white font-bold text-lg" style={{ fontWeight: 800 }}>{selectedLayout.name}</h3>
              <p className="text-white opacity-70 text-sm">{selectedLayout.description}</p>
            </div>
          </div>

          {/* Section List */}
          <div className="p-6 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Page Structure ({selectedLayout.sections.length} sections)</p>
            {selectedLayout.sections.map((section, i) => {
              const style = SECTION_COLORS[section.sectionType] || SECTION_COLORS.unknown;
              return (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1E3A8A" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 p-3 rounded-xl" style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{style.emoji}</span>
                      <span className="text-xs font-bold" style={{ color: style.border }}>{style.label}</span>
                      <span className="ml-auto text-xs text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">{section.layout}</span>
                    </div>
                    <p className="text-sm text-slate-600">{section.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
