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

// Mirasee bird logo (simplified SVG inline)
const MIRASEE_LOGO = `
  <div style="display:flex;align-items:center;gap:4px;">
    <div style="position:relative;">
      <span style="color:white;font-size:22px;font-weight:900;font-family:'Montserrat',sans-serif;letter-spacing:-0.5px;">mirasee</span>
      <span style="position:absolute;top:-10px;left:8px;font-size:10px;">🐦🐦🐦🐦</span>
    </div>
  </div>`;

// Wavy SVG divider (white wave on blue)
const WAVE_DIVIDER = `<svg viewBox="0 0 1440 70" style="display:block;margin-bottom:-3px;" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M0,35 C240,70 480,0 720,35 C960,70 1200,10 1440,35 L1440,70 L0,70 Z"/></svg>`;

// Countdown timer block
const COUNTDOWN = `
  <div style="display:flex;gap:6px;align-items:center;">
    ${["00","00","00","00"].map((v, i) => `
      <div style="text-align:center;">
        <div style="background:#F5A623;border-radius:6px;padding:6px 12px;min-width:48px;">
          <div style="color:white;font-size:22px;font-weight:900;line-height:1;">${v}</div>
        </div>
        <div style="color:rgba(255,255,255,0.7);font-size:10px;margin-top:3px;font-weight:600;">${["Days","Hours","Mins","Secs"][i]}</div>
      </div>`).join("")}
  </div>`;

function renderSectionHTML(
  section: LayoutSection,
  content: string,
  primary: string,
  _style: string
): string {
  const ctaColor = "#F5A623";
  const safe = escapeHtml(content);
  const short = safe.slice(0, 90);
  const medium = safe.slice(0, 240);

  switch (section.sectionType) {
    case "hero":
      return `
        <section style="background:${primary};">
          <!-- Nav -->
          <div style="padding:16px 48px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);">
            ${MIRASEE_LOGO}
            ${COUNTDOWN}
          </div>
          <!-- Hero split -->
          <div style="padding:50px 48px 20px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;max-width:1100px;margin:0 auto;">
            <div>
              <h1 style="color:white;font-size:42px;font-weight:900;line-height:1.15;margin-bottom:20px;font-family:'Montserrat',sans-serif;">${short || "You're Invited! Claim Your Free Seat to the 3-Day Effortless AI Event"}</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:17px;margin-bottom:28px;line-height:1.6;">Your complimentary seat is waiting for you <em>(offer expires April 12)...</em></p>
              <a href="#" style="background:${ctaColor};color:white;padding:16px 40px;border-radius:999px;font-weight:900;font-size:18px;text-decoration:none;display:inline-block;box-shadow:0 6px 24px rgba(0,0,0,0.2);">Claim My Free Seat</a>
            </div>
            <div style="background:rgba(255,255,255,0.08);border-radius:16px;height:300px;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.15);">
              <div style="text-align:center;">
                <div style="width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.15);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:40px;">👨‍💼</div>
                <p style="color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;">Danny Iny</p>
                <p style="color:rgba(255,255,255,0.5);font-size:11px;">Founder & CEO, Mirasee</p>
              </div>
            </div>
          </div>
          ${WAVE_DIVIDER}
        </section>`;

    case "subheadline":
    case "headline":
      return `
        <section style="background:white;padding:50px 48px;text-align:center;">
          <div style="max-width:720px;margin:0 auto;">
            <h2 style="color:${primary};font-size:30px;font-weight:900;line-height:1.3;margin-bottom:14px;font-family:'Montserrat',sans-serif;">${short || "The headline goes here"}</h2>
            <p style="color:#444;font-size:17px;line-height:1.7;">${medium || "Supporting copy that reinforces the main message."}</p>
          </div>
        </section>`;

    case "problem":
      return `
        <section style="background:white;padding:60px 48px;">
          <div style="max-width:800px;margin:0 auto;">
            <p style="color:#444;font-size:17px;line-height:1.8;">${medium || "You're using AI well. You've gotten faster. But growth still feels like pushing a boulder uphill."}</p>
            <p style="color:#444;font-size:17px;line-height:1.8;margin-top:16px;">
              I'm running a 3-day live event called <strong style="color:${primary};">Effortless AI</strong> — and your ticket is free.
            </p>
            <p style="color:#444;font-size:17px;line-height:1.8;margin-top:16px;">
              This isn't another AI training. It's a business growth intensive where you'll use AI to diagnose where growth is being forced in your business.
            </p>
            <p style="color:#333;font-weight:700;font-size:16px;margin-top:20px;">At the Effortless AI Event, you'll work through:</p>
            <ul style="margin-top:14px;padding-left:0;list-style:none;">
              ${[
                ["Your Identity and Your Customer", "get clear on who you are as a business and who you're truly for"],
                ["Your Offer and Your Path", "build an offer that fits naturally and map the journey prospects take"],
                ["Putting It All Together", "a working session where you apply everything and walk away with a roadmap"],
              ].map(([bold, rest]) => `
                <li style="padding:10px 0;border-bottom:1px solid #F0F0F0;color:#444;font-size:16px;line-height:1.6;">
                  <strong style="color:#111;">• ${bold}</strong> — ${rest}...
                </li>`).join("")}
            </ul>
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
        <section style="background:#F9FAFB;padding:70px 48px;">
          <div style="max-width:940px;margin:0 auto;">
            <h2 style="color:${primary};font-size:30px;font-weight:900;text-align:center;margin-bottom:40px;font-family:'Montserrat',sans-serif;">Here's What Previous Attendees Said About Danny's Training...</h2>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;">
              ${items.map(b => `
                <div style="background:white;border:1px solid #E5E7EB;border-radius:12px;padding:22px;">
                  <div style="color:${_style === 'minimal' ? primary : '#F5A623'};font-size:18px;margin-bottom:8px;">✓</div>
                  <p style="color:#222;font-size:14px;font-weight:600;line-height:1.5;">${escapeHtml(b.trim().slice(0, 80))}</p>
                </div>`).join("")}
            </div>
          </div>
        </section>`;
    }

    case "framework":
      return `
        <section style="background:${primary};padding:70px 48px;">
          <div style="max-width:820px;margin:0 auto;text-align:center;">
            <h2 style="color:white;font-size:34px;font-weight:900;margin-bottom:16px;font-family:'Montserrat',sans-serif;">The frameworks behind this training come from 15+ years of hands-on work with hundreds of businesses.</h2>
            <p style="color:rgba(255,255,255,0.85);font-size:17px;line-height:1.7;max-width:620px;margin:0 auto 40px;">${medium || "This is the kind of strategic clarity that makes the assets you build work even harder."}</p>
            <a href="#" style="background:${ctaColor};color:white;padding:16px 44px;border-radius:999px;font-weight:900;font-size:18px;text-decoration:none;display:inline-block;">Claim My Free Seat →</a>
          </div>
        </section>`;

    case "testimonials":
      return `
        <section style="background:white;padding:70px 48px;">
          <div style="max-width:820px;margin:0 auto;">
            <h2 style="color:${primary};font-size:28px;font-weight:900;text-align:center;margin-bottom:36px;font-family:'Montserrat',sans-serif;">Here's what previous attendees said about Danny's training...</h2>
            ${[
              { name: "Dr. Steven Kirch", text: "I am a serious AI user and even train other business owners. Nevertheless, Danny's training was eye-opening. The perspective he shared was truly unique and provided me with key insights which will inform my work and business." },
              { name: "Jo Hafey", text: "Danny's AI Clarity Cascade training has been fantastic. I didn't have any knowledge of AI at all, total newbie! By the end of the course I had redesigned material, audited and upgraded my website, created working material to share with my business partner." },
              { name: "Sophie Lechner", text: "This training was extremely useful, especially in contrast to most other AI trainings I've signed up for. This wasn't just a bunch of prompts but a real strategy for using AI effectively without falling into the common traps." }
            ].map(t => `
              <div style="border:1px solid #E5E7EB;border-radius:10px;padding:24px 28px;margin-bottom:16px;background:white;">
                <p style="color:#333;font-size:15px;line-height:1.7;font-style:italic;">${t.text}</p>
                <p style="color:#666;font-size:13px;margin-top:14px;font-weight:600;">– ${t.name}</p>
              </div>`).join("")}
          </div>
        </section>`;

    case "speaker":
      return `
        <section style="background:white;padding:60px 48px;border-top:1px solid #F0F0F0;">
          <div style="max-width:820px;margin:0 auto;display:grid;grid-template-columns:200px 1fr;gap:48px;align-items:start;">
            <div style="text-align:center;">
              <div style="width:160px;height:160px;border-radius:50%;background:${primary};margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:56px;">👨‍💼</div>
              <div style="margin-top:16px;font-size:13px;color:#888;font-style:italic;">Danny Iny</div>
              <div style="margin-top:8px;font-size:18px;color:#F5A623;">★★★★★</div>
            </div>
            <div>
              <h3 style="color:${primary};font-size:22px;font-weight:900;margin-bottom:14px;font-family:'Montserrat',sans-serif;">About the Presenter:</h3>
              <p style="color:#444;font-size:15px;line-height:1.75;">${medium || "Danny Iny is the founder and CEO of the 8-figure business education company, Mirasee. For over a decade, he's helped coaches, consultants, and expertise-based entrepreneurs bridge the gap between their valuable knowledge and the income they know they should be making."}</p>
              <p style="color:#444;font-size:15px;line-height:1.75;margin-top:12px;">His ideas have been featured in the Harvard Business Review, Entrepreneur, Inc., Forbes, and Business Insider.</p>
              <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;">
                ${["HBR", "Forbes", "Entrepreneur", "Inc.", "Business Insider"].map(p => `<span style="background:#EEF2FF;color:${primary};padding:5px 14px;border-radius:999px;font-size:12px;font-weight:700;">${p}</span>`).join("")}
              </div>
              <div style="margin-top:20px;font-size:22px;font-style:italic;color:#333;font-family:Georgia,serif;">Danny Iny</div>
            </div>
          </div>
        </section>`;

    case "agenda":
      return `
        <section style="background:#F0F4FF;padding:60px 48px;">
          <div style="max-width:720px;margin:0 auto;">
            <h2 style="color:${primary};font-size:28px;font-weight:900;text-align:center;margin-bottom:36px;font-family:'Montserrat',sans-serif;">Here are 3 quick steps to take right now:</h2>
            ${[
              { step: "1", title: "Add all 3 training sessions to your calendar.", body: "The sessions will be Monday through Wednesday, from 11am–5pm Eastern each day." },
              { step: "2", title: "Let us send you reminders.", body: "Enter your phone number below if you'd like to receive text message reminders before the session starts." },
              { step: "3", title: "Watch your inbox for the pre-work.", body: "We're going to be getting a ton done during the training — you'll be surprised at how fast it goes!" },
            ].map(a => `
              <div style="background:white;border-radius:12px;padding:22px 26px;display:flex;gap:18px;margin-bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="min-width:40px;height:40px;background:${primary};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:16px;">${a.step}</div>
                <div>
                  <p style="font-weight:700;color:#111;font-size:15px;margin-bottom:4px;">${a.title}</p>
                  <p style="color:#666;font-size:14px;line-height:1.6;">${a.body}</p>
                </div>
              </div>`).join("")}
          </div>
        </section>`;

    case "faq":
      return `
        <section style="background:white;padding:60px 48px;">
          <div style="max-width:720px;margin:0 auto;">
            <h2 style="color:${primary};font-size:28px;font-weight:900;text-align:center;margin-bottom:36px;font-family:'Montserrat',sans-serif;">Frequently Asked Questions</h2>
            ${[
              { q: "Is this training really free?", a: "Yes! This is a completely free live training. No hidden costs or upsells during the event." },
              { q: "Who is this for?", a: "Coaches, consultants, and creatives who want to use AI to actually grow their business — not just get faster at busywork." },
              { q: "What if I can't attend live?", a: "A recording will be available for a limited time for all registered attendees." },
              { q: "How is this different from other AI training?", a: "We focus on the foundation your AI sits on — not prompting tricks or shortcuts that stop working next month." }
            ].map(faq => `
              <details style="border:1px solid #E5E7EB;border-radius:10px;padding:18px 22px;margin-bottom:10px;background:white;">
                <summary style="font-weight:700;color:${primary};font-size:15px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;">
                  ${faq.q}<span style="font-size:20px;font-weight:300;color:#aaa;">+</span>
                </summary>
                <p style="color:#555;font-size:14px;line-height:1.7;margin-top:12px;">${faq.a}</p>
              </details>`).join("")}
          </div>
        </section>`;

    case "cta":
      return `
        <section style="background:white;padding:60px 48px;">
          <div style="max-width:760px;margin:0 auto;">
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:16px;padding:40px;text-align:center;">
              <h2 style="color:${primary};font-size:30px;font-weight:900;margin-bottom:12px;font-family:'Montserrat',sans-serif;">${short || "To claim your complimentary ticket, fill out the form below."}</h2>
              <p style="color:#555;font-size:15px;margin-bottom:8px;font-weight:700;">Registration closes Sunday, April 12, at midnight.</p>
              <p style="color:#888;font-size:14px;margin-bottom:32px;">Pre-work begins April 13 and is mandatory.</p>
              <!-- Simple form -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:500px;margin:0 auto 20px;text-align:left;">
                ${["First Name*", "Last Name*", "Email*", "Phone number"].map(f => `
                  <input style="border:1px solid #D1D5DB;border-radius:6px;padding:12px 14px;font-size:14px;font-family:'Montserrat',sans-serif;width:100%;outline:none;" placeholder="${f}" />`).join("")}
              </div>
              <button style="background:${ctaColor};color:white;padding:16px 48px;border-radius:999px;font-weight:900;font-size:17px;border:none;cursor:pointer;display:inline-block;">Claim My Free Seat →</button>
              <p style="color:#aaa;font-size:12px;margin-top:14px;">We will never rent or sell your email address or phone number.</p>
            </div>
          </div>
        </section>`;

    default:
      return `
        <section style="background:white;padding:40px 48px;">
          <div style="max-width:800px;margin:0 auto;">
            <p style="color:#555;font-size:16px;line-height:1.8;">${medium}</p>
          </div>
        </section>`;
  }
}

export function generatePageHTML(layout: LayoutVariation, detectedSections: DetectedSection[]): string {
  const primary =
    layout.colorScheme === "blue" ? "#1E3A8A" :
    layout.colorScheme === "orange" ? "#C05200" :
    layout.colorScheme === "green" ? "#166534" : "#4C1D95";

  const sectionsHTML = layout.sections
    .map(section => {
      const detected = detectedSections.find(d => d.type === section.sectionType);
      const content = detected?.content || section.content || "";
      return renderSectionHTML(section, content, primary, layout.style);
    })
    .join("\n");

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Montserrat',sans-serif; background:#fff; color:#111; }
  input { font-family:'Montserrat',sans-serif; }
  details summary::-webkit-details-marker { display:none; }
</style>
</head><body>${sectionsHTML}
<footer style="background:#1E3A8A;padding:24px 48px;text-align:center;">
  <p style="color:rgba(255,255,255,0.5);font-size:12px;">© Mirasee · All rights reserved</p>
</footer>
</body></html>`;
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
      <div>
        <h2 className="text-2xl font-black" style={{ color: "#111", fontWeight: 900 }}>
          Layout Variations
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "#999" }}>
          {layouts.length} Mirasee-style page designs — click <strong>🔍 Full Preview</strong> to see full page
        </p>
      </div>

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
              <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: neon.bg }}>
                <span className="text-white text-xl">{LAYOUT_STYLE_ICONS[layout.style] || "📐"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate" style={{ fontWeight: 900 }}>
                    {idx + 1}. {layout.name}
                  </p>
                  <p className="text-white/70 text-xs truncate capitalize">
                    {layout.style} · {layout.colorScheme}
                  </p>
                </div>
                {isSelected && <span className="text-white text-xl font-black">✓</span>}
              </div>

              {/* Realistic Mirasee Page Preview */}
              <div style={{ height: "290px", overflow: "hidden", position: "relative", background: "white" }}>
                <iframe
                  srcDoc={pageHTML}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "1100px",
                    height: "1400px",
                    border: "none",
                    transform: "scale(0.245)",
                    transformOrigin: "top left",
                    pointerEvents: "none",
                  }}
                  sandbox="allow-same-origin"
                  title={layout.name}
                />
                <button
                  onClick={e => { e.stopPropagation(); setFullPreview(layout); }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer transition-all"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", fontWeight: 700, opacity: 0.85 }}
                >
                  🔍 Full Preview
                </button>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: "1px solid #F5F5F5", background: "white" }}>
                <span className="text-xs" style={{ color: "#aaa" }}>
                  {layout.sections.length} sections · CTA: {layout.ctaPosition}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: neon.glow, color: "#333", fontWeight: 700 }}>
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
            <div
              className="flex items-center justify-between px-6 py-3"
              style={{ background: NEON_GRADIENTS[layouts.findIndex(l => l.id === fullPreview.id) % NEON_GRADIENTS.length].bg }}
            >
              <p className="text-white font-black text-base">
                {LAYOUT_STYLE_ICONS[fullPreview.style]} {fullPreview.name} — Full Page Preview
              </p>
              <button onClick={() => setFullPreview(null)} className="text-white/80 hover:text-white text-2xl font-bold cursor-pointer leading-none">✕</button>
            </div>
            <iframe
              srcDoc={generatePageHTML(fullPreview, detectedSections)}
              style={{ width: "100%", height: "calc(100% - 52px)", border: "none" }}
              title={`${fullPreview.name} full preview`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
