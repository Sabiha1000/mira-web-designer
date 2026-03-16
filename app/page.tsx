"use client";

import { useState } from "react";
import CopyInput from "@/components/CopyInput";
import LayoutViewer from "@/components/LayoutViewer";
import ConversionFeedback from "@/components/ConversionFeedback";
import ExportPanel from "@/components/ExportPanel";
import SectionLibrary from "@/components/SectionLibrary";
import DetectedSections from "@/components/DetectedSections";
import { AnalysisResult, LayoutVariation } from "@/lib/types";
import { DEMO_RESULT } from "@/lib/demoData";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDemo = () => {
    setAnalysisResult(DEMO_RESULT);
    setSelectedLayoutId(DEMO_RESULT.layouts[0].id);
    setError(null);
  };

  const selectedLayout: LayoutVariation | null =
    analysisResult?.layouts.find((l) => l.id === selectedLayoutId) ?? null;

  const handleAnalyze = async (copyText: string, imageBase64?: string, imageMediaType?: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSelectedLayoutId(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copyText, imageBase64, imageMediaType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysisResult(data);
      if (data.layouts?.length > 0) {
        setSelectedLayoutId(data.layouts[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0F4F8", fontFamily: "'Montserrat', sans-serif" }}>
      {/* Top Nav */}
      <header className="sticky top-0 z-50 shadow-sm" style={{ background: "#0F172A" }}>
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: "#F97316" }}>
              M
            </div>
            <div>
              <span className="text-white font-black text-base tracking-tight" style={{ fontWeight: 900 }}>
                Mira Web Designer
              </span>
              <span className="text-slate-400 text-xs ml-2">by Mirasee</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDemo}
              className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all hover:opacity-90"
              style={{ background: "#F97316", color: "white", fontWeight: 700 }}
            >
              ▶ Try Demo
            </button>
            <span className="text-xs text-slate-400 hidden sm:block">Powered by Claude AI</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Hero Banner (shown when no results) */}
      {!analysisResult && !isLoading && (
        <div className="py-10 px-6 text-center" style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #1d4ed8 100%)" }}>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-white font-black text-3xl sm:text-4xl leading-tight" style={{ fontWeight: 900 }}>
              Turn Marketing Copy into<br />
              <span style={{ color: "#F97316" }}>Conversion-Ready Layouts</span>
            </h1>
            <p className="text-blue-200 text-base mt-3 leading-relaxed">
              Paste your copy, and Claude AI will analyze it and generate<br className="hidden sm:block" />
              4 Mirasee-style landing page layout variations — instantly.
            </p>
            <div className="flex items-center justify-center gap-6 mt-5 text-xs text-blue-300">
              <span>✅ Mirasee Design Style</span>
              <span>✅ Conversion Scoring</span>
              <span>✅ Export Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-5 p-4 rounded-xl flex items-start gap-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <span className="text-red-500 text-lg">⚠️</span>
            <div>
              <p className="text-red-700 font-bold text-sm" style={{ fontWeight: 700 }}>Analysis Error</p>
              <p className="text-red-600 text-sm mt-0.5">{error}</p>
              {error.includes("ANTHROPIC_API_KEY") && (
                <p className="text-red-500 text-xs mt-2">
                  Add your API key to <code className="bg-red-100 px-1 rounded">.env.local</code>: <code className="bg-red-100 px-1 rounded">ANTHROPIC_API_KEY=your_key_here</code>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-5 p-5 rounded-2xl flex items-center gap-4 shadow-sm" style={{ background: "white", border: "1px solid #BFDBFE" }}>
            <div className="flex-shrink-0">
              <svg className="spin" width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#E2E8F0" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm" style={{ fontWeight: 700 }}>
                Claude is analyzing your copy...
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                Detecting sections, generating 4 layout variations, scoring conversion potential
              </p>
            </div>
          </div>
        )}

        {/* Main Layout: 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column — Input + Section Library */}
          <div className="lg:col-span-3 space-y-5">
            <CopyInput onAnalyze={handleAnalyze} isLoading={isLoading} />
            <SectionLibrary />
          </div>

          {/* Center Column — Layouts + Detected Sections */}
          <div className="lg:col-span-6 space-y-5">
            {analysisResult ? (
              <>
                <DetectedSections
                  sections={analysisResult.detectedSections}
                  pageTitle={analysisResult.pageTitle}
                  pageType={analysisResult.pageType}
                />
                <LayoutViewer
                  layouts={analysisResult.layouts}
                  selectedLayoutId={selectedLayoutId}
                  onSelectLayout={setSelectedLayoutId}
                />
              </>
            ) : (
              !isLoading && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <div className="text-5xl mb-4">🎨</div>
                  <h3 className="text-slate-700 font-bold text-lg" style={{ fontWeight: 800 }}>
                    Layout Variations Will Appear Here
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                    Paste your marketing copy on the left and click "Generate Layout Designs" to see 4 Mirasee-style layout variations.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 max-w-xs mx-auto text-left">
                    {["Bold Impact", "Clean Minimal", "Card-Heavy", "Story Flow"].map((name) => (
                      <div key={name} className="p-3 rounded-xl border-2 border-dashed border-slate-200">
                        <div className="h-2 rounded mb-1.5 bg-slate-200 w-3/4" />
                        <div className="h-1.5 rounded mb-1 bg-slate-100 w-full" />
                        <div className="h-1.5 rounded bg-slate-100 w-2/3" />
                        <p className="text-xs text-slate-400 mt-2 font-medium">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right Column — Conversion Score + Export */}
          <div className="lg:col-span-3 space-y-5">
            {analysisResult ? (
              <>
                <ConversionFeedback score={analysisResult.conversionScore} />
                <ExportPanel
                  layout={selectedLayout}
                  pageTitle={analysisResult.pageTitle}
                />
              </>
            ) : (
              !isLoading && (
                <>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="font-bold text-slate-700 text-sm" style={{ fontWeight: 700 }}>Conversion Score</h3>
                    <p className="text-xs text-slate-400 mt-1">Appears after analysis</p>
                    <div className="mt-4 space-y-2">
                      {["Headline Clarity", "Benefit Structure", "CTA Placement", "Trust Elements"].map((m) => (
                        <div key={m} className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-slate-100" />
                          <span className="text-xs text-slate-300 w-16 text-right">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                    <div className="text-3xl mb-2">📤</div>
                    <h3 className="font-bold text-slate-700 text-sm" style={{ fontWeight: 700 }}>Export Options</h3>
                    <p className="text-xs text-slate-400 mt-1">Available after analysis</p>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 text-center" style={{ background: "#F0F4F8" }}>
        <p className="text-xs text-slate-400">
          Mira Web Designer — Built for Mirasee page designers · Powered by Claude Opus 4.6
        </p>
      </footer>
    </div>
  );
}
