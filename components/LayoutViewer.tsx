"use client";

import { useState } from "react";
import { LayoutVariation, LayoutSection, DetectedSection } from "@/lib/types";

interface LayoutViewerProps {
  layouts: LayoutVariation[];
  selectedLayoutId: string | null;
  onSelectLayout: (id: string) => void;
  detectedSections: DetectedSection[];
}

const NEON_GRADIENTS = [
  { bg: "linear-gradient(135deg, #00AAFF 0%, #0055FF 100%)", glow: "rgba(0,170,255,0.2)", border: "#00AAFF" },
  { bg: "linear-gradient(135deg, #00E676 0%, #00897B 100%)", glow: "rgba(0,230,118,0.2)", border: "#00E676" },
  { bg: "linear-gradient(135deg, #FF5F00 0%, #FF8F00 100%)", glow: "rgba(255,95,0,0.2)", border: "#FF5F00" },
  { bg: "linear-gradient(135deg, #D500F9 0%, #651FFF 100%)", glow: "rgba(213,0,249,0.2)", border: "#D500F9" },
];

const LAYOUT_STYLE_ICONS: Record<string, string> = {
  bold: "⚡",
  minimal: "✨",
  "card-heavy": "🃏",
  story: "📖",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSectionHTML(
  section: LayoutSection,
  content: string,
  primary: string,
  accent: string,
  _style: string
): string {
  const safe = escapeHtml(content);
  const short = safe.slice(0, 90);
  const medium = safe.slice(0, 220);

  switch (section.sectionType) {
    case "hero":
      return `
        <section style="background:${primary};padding:80px 40px;text-align:center;">
          <div style="max-width:800px;margin:0 auto;">
            <div style="display:inline-block;background:${accent};color:white;padding:6px 20px;border-radius:999px;font-size:12px;font-weight:800;margin-bottom:20px;letter-spacing:1.5px;text-transform:uppercase;">FREE LIVE TRAINING</div>
            <h1 style="color:white;font-size:48px;font-weight:900;line-height:1.15;margin-bottom:20px;">${short || "AI Works — So Why Aren't You Seeing Results?"}</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:19px;margin-bottom:36px;max-width:560px;margin-left:auto;margin-right:auto;">Join thousands of entrepreneurs discovering what actually drives AI-powered growth.</p>
            <a href="#" style="background:${accent};color:white;padding:18px 52px;border-radius:10px;font-weight:900;font-size:19px;text-decoration:none;display:inline-block;box-shadow:0 8px 32px rgba(0,0,0,0.25);">Register For Free →</a>
            <p style="color:rgba(255,255,255,0.55);font-size:13px;margin-top:14px;">Tuesday, April 7 · 11am Pacific · No charge, seats limited</p>
          </div>
        </section>`;

    case "subheadline":
    case "headline":
      return `
        <section style="background:#fff;padding:50px 40px;text-align:center;">
          <div style="max-width:700px;margin:0 auto;">
            <h2 style="color:#111;font-size:32px;font-weight:900;line-height:1.3;margin-bottom:16px;">${short || "The headline goes here"}</h2>
            <p style="color:#555;font-size:17px;line-height:1.7;">${medium || "Supporting copy that reinforces the main message."}</p>
          </div>
        </section>`;

    case "problem":
      return `
        <section style="background:#FFF8F3;padding:70px 40px;">
          <div style="max-width:800px;margin:0 auto;">
            <p style="color:${accent};font-weight:800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">DOES THIS SOUND FAMILIAR?</p>
            <h2 style="color:#111;font-size:34px;font-weight:800;line-height:1.3;margin-bottom:20px;">If you're like most coaches &amp; consultants...</h2>
            <p style="color:#555;font-size:17px;line-height:1.7;">${medium || "You're using AI well. You've gotten faster. But growth still feels like pushing a boulder uphill."}</p>
          </div>
        </section>`;

    case "benefits": {
      const bullets = content.split(/[•\n]/).filter(b => b.trim().length > 8).slice(0, 6);
      const items = bullets.length >= 3 ? bullets : [
        "Close the AI gap holding your business back",
        "Single variable approach for instant momentum",
        "15+ years of business pattern recognition",
        "Wrong direction vs. right direction thinking",
        "Framework test you can apply immediately",
        "AI amplifies your foundation — not your chaos",
      ];
      return `
        <section style="background:white;padding:70px 40px;">
          <div style="max-width:940px;margin:0 auto;">
            <p style="color:${accent};font-weight:800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;text-align:center;">WHAT YOU'LL DISCOVER</p>
            <h2 style="color:#111;font-size:36px;font-weight:900;text-align:center;margin-bottom:46px;">9 Business-Changing Insights</h2>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;">
              ${items.map(b => `
                <div style="background:#F8FAFF;border-radius:14px;padding:24px;border-left:4px solid ${primary};">
                  <div style="color:${accent};font-size:22px;margin-bottom:10px;">✓</div>
                  <p style="color:#222;font-size:15px;font-weight:600;line-height:1.5;">${escapeHtml(b.trim().slice(0, 70))}</p>
                </div>`).join("")}
            </div>
          </div>
        </section>`;
    }

    case "framework":
      return `
        <section style="background:${primary};padding:70px 40px;">
          <div style="max-width:820px;margin:0 auto;text-align:center;">
            <p style="color:${accent};font-weight:800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">THE SOLUTION</p>
            <h2 style="color:white;font-size:38px;font-weight:900;margin-bottom:20px;">The AI Foundation Framework</h2>
            <p style="color:rgba(255,255,255,0.8);font-size:17px;line-height:1.7;max-width:600px;margin:0 auto 40px;">${medium || "AI amplifies whatever it's attached to. Point it at solid foundations and you build momentum."}</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
              ${["Foundation", "Framework", "Freedom"].map((step, i) => `
                <div style="background:rgba(255,255,255,0.12);border-radius:14px;padding:28px;">
                  <div style="color:${accent};font-size:36px;font-weight:900;margin-bottom:10px;">${i + 1}</div>
                  <p style="color:white;font-weight:700;font-size:17px;">${step}</p>
                </div>`).join("")}
            </div>
          </div>
        </section>`;

    case "testimonials":
      return `
        <section style="background:#F9FAFB;padding:70px 40px;">
          <div style="max-width:940px;margin:0 auto;">
            <h2 style="color:#111;font-size:36px;font-weight:900;text-align:center;margin-bottom:46px;">What Students Are Saying</h2>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
              ${[
                { name: "Sarah K.", role: "Business Coach", text: "This completely changed how I approach my coaching practice. Revenue up 40% in 60 days." },
                { name: "Mike R.", role: "Consultant", text: "Finally a framework that actually works for service businesses. Highly recommended." },
                { name: "Lisa M.", role: "Course Creator", text: "My revenue doubled within 3 months of applying this system to my business." }
              ].map(t => `
                <div style="background:white;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                  <div style="color:${accent};font-size:18px;margin-bottom:12px;">★★★★★</div>
                  <p style="color:#444;font-size:15px;line-height:1.6;margin-bottom:20px;font-style:italic;">"${t.text}"</p>
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:44px;height:44px;border-radius:50%;background:${primary};display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:16px;">${t.name[0]}</div>
                    <div><p style="font-weight:700;color:#111;font-size:14px;">${t.name}</p><p style="color:#888;font-size:12px;">${t.role}</p></div>
                  </div>
                </div>`).join("")}
            </div>
          </div>
        </section>`;

    case "speaker":
      return `
        <section style="background:white;padding:70px 40px;">
          <div style="max-width:820px;margin:0 auto;display:grid;grid-template-columns:220px 1fr;gap:50px;align-items:center;">
            <div style="text-align:center;">
              <div style="width:180px;height:180px;border-radius:50%;background:${primary};margin:0 auto;display:flex;align-items:center;justify-content:center;color:white;font-size:64px;font-weight:900;">D</div>
              <div style="margin-top:14px;color:${accent};font-size:18px;">★★★★★</div>
            </div>
            <div>
              <p style="color:${accent};font-weight:800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">YOUR INSTRUCTOR</p>
              <h2 style="color:#111;font-size:38px;font-weight:900;margin-bottom:12px;">Danny Iny</h2>
              <p style="color:#555;font-size:16px;line-height:1.7;">${medium || "Founder/CEO of Mirasee (8-figure business education company). Featured in HBR, Entrepreneur, Inc., Forbes."}</p>
              <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;">
                ${["HBR", "Forbes", "Entrepreneur", "Inc."].map(p => `<span style="background:#EEF2FF;color:${primary};padding:6px 16px;border-radius:999px;font-size:13px;font-weight:700;">${p}</span>`).join("")}
              </div>
            </div>
          </div>
        </section>`;

    case "agenda":
      return `
        <section style="background:#F0F4FF;padding:70px 40px;">
          <div style="max-width:720px;margin:0 auto;">
            <p style="color:${accent};font-weight:800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;text-align:center;">TRAINING AGENDA</p>
            <h2 style="color:#111;font-size:36px;font-weight:900;text-align:center;margin-bottom:40px;">What We'll Cover</h2>
            ${["AI Gap Analysis — Why Most Are Getting It Wrong", "The Foundation Framework: Single Variable Approach", "Live Demo + Q&amp;A — First Time Teaching This Publicly"].map((item, i) => `
              <div style="background:white;border-radius:14px;padding:22px 26px;display:flex;align-items:center;gap:20px;margin-bottom:14px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
                <div style="min-width:46px;height:46px;background:${primary};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:17px;">${i + 1}</div>
                <p style="color:#222;font-size:16px;font-weight:600;">${item}</p>
              </div>`).join("")}
          </div>
        </section>`;

    case "faq":
      return `
        <section style="background:white;padding:70px 40px;">
          <div style="max-width:720px;margin:0 auto;">
            <h2 style="color:#111;font-size:36px;font-weight:900;text-align:center;margin-bottom:40px;">Frequently Asked Questions</h2>
            ${[
              { q: "Is this training really free?", a: "Yes! This is a free live training. No hidden costs or upsells during the event." },
              { q: "Who is this for?", a: "Coaches, consultants, and creatives who want to use AI to actually grow their business." },
              { q: "What if I can't attend live?", a: "A recording will be available for a limited time for all registered attendees." },
              { q: "How is this different from other AI training?", a: "We focus on the foundation your AI sits on — not prompting tricks or shortcuts." }
            ].map(faq => `
              <div style="border:1px solid #E5E7EB;border-radius:14px;padding:22px 26px;margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <p style="color:#111;font-weight:700;font-size:16px;">${faq.q}</p>
                  <span style="color:${primary};font-size:22px;font-weight:300;">+</span>
                </div>
                <p style="color:#555;font-size:14px;line-height:1.6;">${faq.a}</p>
              </div>`).join("")}
          </div>
        </section>`;

    case "cta":
      return `
        <section style="background:${accent};padding:80px 40px;text-align:center;">
          <div style="max-width:720px;margin:0 auto;">
            <h2 style="color:white;font-size:42px;font-weight:900;line-height:1.2;margin-bottom:18px;">${short || "Save Your Seat — Seats Are Limited"}</h2>
            <p style="color:rgba(255,255,255,0.9);font-size:18px;margin-bottom:40px;">Tuesday, April 7 at 11am Pacific · 2pm Eastern · No charge</p>
            <a href="#" style="background:white;color:${accent};padding:20px 60px;border-radius:12px;font-weight:900;font-size:20px;text-decoration:none;display:inline-block;box-shadow:0 10px 40px rgba(0,0,0,0.2);">Register For Free →</a>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:16px;">Free to attend · No credit card required · Limited seats</p>
          </div>
        </section>`;

    default:
      return `
        <section style="background:white;padding:50px 40px;">
          <div style="max-width:800px;margin:0 auto;">
            <p style="color:#555;font-size:16px;line-height:1.7;">${medium}</p>
          </div>
        </section>`;
  }
}

export function generatePageHTML(layout: LayoutVariation, detectedSections: DetectedSection[]): string {
  const primary =
    layout.colorScheme === "blue" ? "#1E3A8A" :
    layout.colorScheme === "orange" ? "#EA580C" :
    layout.colorScheme === "green" ? "#166534" : "#581C87";
  const accent = "#F97316";

  const sectionsHTML = layout.sections
    .map(section => {
      const detected = detectedSections.find(d => d.type === section.sectionType);
      const content = detected?.content || section.content || "";
      return renderSectionHTML(section, content, primary, accent, layout.style);
    })
    .join("\n");

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>* { margin:0; padding:0; box-sizing:border-box; } body { font-family:'Montserrat',sans-serif; background:#fff; color:#111; }</style>
</head><body>${sectionsHTML}</body></html>`;
}

export default function LayoutViewer({
  layouts,
  selectedLayoutId,
  onSelectLayout,
  detectedSections,
}: LayoutViewerProps) {
  const [fullPreview, setFullPreview] = useState<LayoutVariation | null>(null);

  if (!layouts.length) return null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black" style={{ color: "#111", fontWeight: 900 }}>
          Layout Variations
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "#999" }}>
          {layouts.length} realistic page designs — click Full Preview to see full page
        </p>
      </div>

      {/* 4 Layout Cards */}
      <div className="grid grid-cols-2 gap-5">
        {layouts.map((layout, idx) => {
          const neon = NEON_GRADIENTS[idx % NEON_GRADIENTS.length];
          const isSelected = layout.id === selectedLayoutId;
          const pageHTML = generatePageHTML(layout, detectedSections);

          return (
            <div
              key={layout.id}
              onClick={() => onSelectLayout(layout.id)}
              className="layout-card rounded-2xl overflow-hidden cursor-pointer transition-all"
              style={{
                border: `2px solid ${isSelected ? neon.border : "#F0F0F0"}`,
                boxShadow: isSelected
                  ? `0 0 0 3px ${neon.glow}, 0 8px 40px ${neon.glow}`
                  : "0 4px 24px rgba(0,0,0,0.07)",
              }}
            >
              {/* Neon Card Header */}
              <div
                className="flex items-center gap-2.5 px-4 py-3"
                style={{ background: neon.bg }}
              >
                <span className="text-white text-xl">{LAYOUT_STYLE_ICONS[layout.style] || "📐"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate" style={{ fontWeight: 900 }}>
                    {idx + 1}. {layout.name}
                  </p>
                  <p className="text-white/70 text-xs truncate capitalize">
                    {layout.style} · {layout.colorScheme}
                  </p>
                </div>
                {isSelected && (
                  <span className="text-white text-xl font-black">✓</span>
                )}
              </div>

              {/* Realistic Page Preview via iframe */}
              <div
                style={{
                  height: "290px",
                  overflow: "hidden",
                  position: "relative",
                  background: "white",
                }}
              >
                <iframe
                  srcDoc={pageHTML}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "1100px",
                    height: "1300px",
                    border: "none",
                    transform: "scale(0.245)",
                    transformOrigin: "top left",
                    pointerEvents: "none",
                  }}
                  sandbox="allow-same-origin"
                  title={layout.name}
                />
                {/* Full preview button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setFullPreview(layout);
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer transition-all hover:opacity-100"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                    fontWeight: 700,
                    opacity: 0.85,
                  }}
                >
                  🔍 Full Preview
                </button>
              </div>

              {/* Card Footer */}
              <div
                className="px-4 py-2.5 flex items-center justify-between"
                style={{ borderTop: "1px solid #F5F5F5", background: "white" }}
              >
                <span className="text-xs" style={{ color: "#aaa" }}>
                  {layout.sections.length} sections · CTA: {layout.ctaPosition}
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                  style={{ background: neon.glow, color: "#333", fontWeight: 700 }}
                >
                  {layout.style}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Page Preview Modal */}
      {fullPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.88)" }}
          onClick={() => setFullPreview(null)}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ width: "88vw", height: "90vh", background: "white" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header bar */}
            <div
              className="flex items-center justify-between px-6 py-3"
              style={{
                background:
                  NEON_GRADIENTS[layouts.findIndex(l => l.id === fullPreview.id) % NEON_GRADIENTS.length].bg,
              }}
            >
              <p className="text-white font-black text-base">
                {LAYOUT_STYLE_ICONS[fullPreview.style]} {fullPreview.name} — Full Page Preview
              </p>
              <button
                onClick={() => setFullPreview(null)}
                className="text-white/80 hover:text-white text-2xl font-bold cursor-pointer leading-none"
              >
                ✕
              </button>
            </div>
            <iframe
              srcDoc={generatePageHTML(fullPreview, detectedSections)}
              style={{
                width: "100%",
                height: "calc(100% - 52px)",
                border: "none",
              }}
              title={`${fullPreview.name} full preview`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
