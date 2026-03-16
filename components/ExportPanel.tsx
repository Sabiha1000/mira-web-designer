"use client";

import { useState } from "react";
import { LayoutVariation, SectionType } from "@/lib/types";

interface ExportPanelProps {
  layout: LayoutVariation | null;
  pageTitle: string;
}

const SECTION_NAMES: Record<SectionType, string> = {
  hero: "Hero Section",
  headline: "Headline Block",
  subheadline: "Sub-Headline",
  problem: "Problem Statement",
  benefits: "Benefits Section",
  framework: "Framework / Method",
  testimonials: "Testimonials",
  speaker: "Speaker / Author Bio",
  agenda: "Event Agenda",
  faq: "FAQ Accordion",
  cta: "Call-to-Action Block",
  unknown: "Content Section",
};

function generatePageBuilderText(layout: LayoutVariation, pageTitle: string): string {
  let output = `=== PAGE BUILDER STRUCTURE ===\n`;
  output += `Title: ${pageTitle}\n`;
  output += `Layout Style: ${layout.name} (${layout.style})\n`;
  output += `Color Scheme: ${layout.colorScheme}\n`;
  output += `CTA Position: ${layout.ctaPosition}\n\n`;
  output += `--- SECTION ORDER ---\n\n`;

  layout.sections.forEach((section, i) => {
    output += `${i + 1}. ${SECTION_NAMES[section.sectionType]}\n`;
    output += `   Layout: ${section.layout}\n`;
    output += `   Content: ${section.content}\n`;
    if (section.accentColor) output += `   Accent Color: ${section.accentColor}\n`;
    output += "\n";
  });

  return output;
}

function generateHTML(layout: LayoutVariation, pageTitle: string): string {
  const primaryColor = {
    blue: "#1E3A8A",
    orange: "#EA580C",
    green: "#166534",
    purple: "#581C87",
  }[layout.colorScheme] || "#1E3A8A";

  const accentColor = "#F97316";

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Montserrat', sans-serif; }
    body { background: #fff; color: #0F172A; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    .btn-primary { display: inline-block; background: ${accentColor}; color: white; padding: 16px 40px; border-radius: 8px; font-weight: 800; font-size: 18px; text-decoration: none; border: none; cursor: pointer; }
    .btn-secondary { display: inline-block; background: ${primaryColor}; color: white; padding: 14px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; }
    h1 { font-size: clamp(32px, 5vw, 52px); font-weight: 900; line-height: 1.15; }
    h2 { font-size: clamp(26px, 4vw, 38px); font-weight: 800; }
    h3 { font-size: 22px; font-weight: 700; }
    p { line-height: 1.7; color: #475569; }
    .card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 20px rgba(0,0,0,0.08); border: 1px solid #E2E8F0; }
  </style>
</head>
<body>\n`;

  layout.sections.forEach((section) => {
    const isHero = section.sectionType === "hero";
    const isCTA = section.sectionType === "cta";
    const isCards = section.layout === "card-grid" || section.layout === "3-col";
    const is2Col = section.layout === "2-col" || section.layout === "split";

    html += `\n  <!-- ${SECTION_NAMES[section.sectionType]} -->\n`;

    if (isHero) {
      html += `  <section style="background: ${primaryColor}; padding: 100px 0; text-align: center;">
    <div class="container">
      <h1 style="color: white; margin-bottom: 20px;">${section.content || "Your Powerful Headline Here"}</h1>
      <p style="color: rgba(255,255,255,0.8); font-size: 20px; max-width: 600px; margin: 0 auto 36px;">[Your compelling sub-headline]</p>
      <a href="#" class="btn-primary">Register Now — It's Free</a>
    </div>
  </section>\n`;
    } else if (isCTA) {
      html += `  <section style="background: ${primaryColor}; padding: 80px 0; text-align: center;">
    <div class="container">
      <h2 style="color: white; margin-bottom: 16px;">${section.content || "Ready to Get Started?"}</h2>
      <p style="color: rgba(255,255,255,0.75); margin-bottom: 32px; font-size: 18px;">[Your urgency statement]</p>
      <a href="#" class="btn-primary">Yes, I Want In!</a>
    </div>
  </section>\n`;
    } else if (isCards) {
      html += `  <section style="padding: 80px 0; background: #F8FAFC;">
    <div class="container">
      <h2 style="text-align: center; color: ${primaryColor}; margin-bottom: 48px;">${section.content || "Key Benefits"}</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
        <div class="card"><h3 style="color: ${primaryColor}; margin-bottom: 12px;">✅ Benefit One</h3><p>[Description]</p></div>
        <div class="card"><h3 style="color: ${primaryColor}; margin-bottom: 12px;">✅ Benefit Two</h3><p>[Description]</p></div>
        <div class="card"><h3 style="color: ${primaryColor}; margin-bottom: 12px;">✅ Benefit Three</h3><p>[Description]</p></div>
      </div>
    </div>
  </section>\n`;
    } else if (is2Col) {
      html += `  <section style="padding: 80px 0;">
    <div class="container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
      <div>
        <h2 style="color: ${primaryColor}; margin-bottom: 20px;">${section.content || "Section Heading"}</h2>
        <p>[Content for this section]</p>
      </div>
      <div style="background: #F1F5F9; border-radius: 16px; height: 300px; display: flex; align-items: center; justify-content: center; color: #94A3B8;">[Image / Visual]</div>
    </div>
  </section>\n`;
    } else if (section.sectionType === "faq") {
      html += `  <section style="padding: 80px 0; background: #F8FAFC;">
    <div class="container" style="max-width: 760px;">
      <h2 style="color: ${primaryColor}; margin-bottom: 48px; text-align: center;">Frequently Asked Questions</h2>
      <details style="margin-bottom: 16px; background: white; border-radius: 12px; border: 1px solid #E2E8F0; padding: 20px;">
        <summary style="font-weight: 700; cursor: pointer; color: ${primaryColor};">Question 1?</summary>
        <p style="margin-top: 12px;">Answer goes here.</p>
      </details>
      <details style="margin-bottom: 16px; background: white; border-radius: 12px; border: 1px solid #E2E8F0; padding: 20px;">
        <summary style="font-weight: 700; cursor: pointer; color: ${primaryColor};">Question 2?</summary>
        <p style="margin-top: 12px;">Answer goes here.</p>
      </details>
    </div>
  </section>\n`;
    } else {
      html += `  <section style="padding: 72px 0;">
    <div class="container" style="max-width: 800px; margin: 0 auto; text-align: center;">
      <h2 style="color: ${primaryColor}; margin-bottom: 24px;">${section.content || "Section Heading"}</h2>
      <p style="font-size: 18px;">[Section content goes here]</p>
    </div>
  </section>\n`;
    }
  });

  html += `</body>
</html>`;

  return html;
}

export default function ExportPanel({ layout, pageTitle }: ExportPanelProps) {
  const [exportType, setExportType] = useState<"pagebuilder" | "html" | "wireframe">("pagebuilder");
  const [copied, setCopied] = useState(false);

  if (!layout) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="text-center py-6">
          <div className="text-3xl mb-3">📤</div>
          <h3 className="font-bold text-slate-800 text-sm" style={{ fontWeight: 700 }}>Export Options</h3>
          <p className="text-xs text-slate-400 mt-1">Select a layout to enable export</p>
        </div>
      </div>
    );
  }

  const getExportContent = () => {
    if (exportType === "pagebuilder") return generatePageBuilderText(layout, pageTitle);
    if (exportType === "html") return generateHTML(layout, pageTitle);
    // Wireframe - JSON structure
    return JSON.stringify(layout, null, 2);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getExportContent();
    const ext = exportType === "html" ? "html" : exportType === "wireframe" ? "json" : "txt";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pageTitle.toLowerCase().replace(/\s+/g, "-")}-layout.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportContent = getExportContent();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100" style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)" }}>
        <h2 className="text-white font-bold text-base" style={{ fontWeight: 800 }}>
          📤 Export Layout
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">{layout.name}</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Export Type Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {(["pagebuilder", "html", "wireframe"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setExportType(type)}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                exportType === type
                  ? "text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{
                background: exportType === type ? "#1E3A8A" : undefined,
                fontWeight: 700,
              }}
            >
              {type === "pagebuilder" && "📋 Page Builder"}
              {type === "html" && "💻 HTML"}
              {type === "wireframe" && "🔲 JSON"}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="relative">
          <pre
            className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 overflow-auto leading-relaxed border border-slate-200"
            style={{ maxHeight: "200px", fontFamily: "Monaco, monospace", fontSize: "11px" }}
          >
            {exportContent.slice(0, 600)}{exportContent.length > 600 ? "\n..." : ""}
          </pre>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            style={{ background: copied ? "#16A34A" : "#F1F5F9", color: copied ? "white" : "#1E3A8A", fontWeight: 700 }}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            style={{ background: "#1E3A8A", fontWeight: 700 }}
          >
            ⬇️ Download
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center">
          {exportType === "html" ? "Ready-to-use HTML with inline styles" :
           exportType === "pagebuilder" ? "Structured layout for page builder tools" :
           "JSON structure for custom implementations"}
        </p>
      </div>
    </div>
  );
}
