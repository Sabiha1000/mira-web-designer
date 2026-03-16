"use client";

import { ConversionScore } from "@/lib/types";

interface ConversionFeedbackProps {
  score: ConversionScore;
}

type StrengthLevel = "Strong" | "Medium" | "Weak" | "Missing";

const STRENGTH_CONFIG: Record<StrengthLevel, { color: string; bg: string; icon: string; bar: number }> = {
  Strong: { color: "#16A34A", bg: "#F0FDF4", icon: "✅", bar: 90 },
  Medium: { color: "#D97706", bg: "#FFFBEB", icon: "⚠️", bar: 55 },
  Weak: { color: "#DC2626", bg: "#FEF2F2", icon: "❌", bar: 25 },
  Missing: { color: "#64748B", bg: "#F8FAFC", icon: "○", bar: 5 },
};

const METRIC_LABELS: Record<keyof Omit<ConversionScore, "overallScore" | "suggestions">, string> = {
  headlineClarity: "Headline Clarity",
  benefitStructure: "Benefit Structure",
  ctaPlacement: "CTA Placement",
  trustElements: "Trust Elements",
};

function ScoreCircle({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 70 ? "#16A34A" : score >= 45 ? "#D97706" : "#DC2626";
  const label = score >= 70 ? "Strong" : score >= 45 ? "Moderate" : "Needs Work";

  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="44" y="48" textAnchor="middle" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "18px", fill: color }}>
          {score}
        </text>
      </svg>
      <span className="text-xs font-bold mt-1" style={{ color, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

export default function ConversionFeedback({ score }: ConversionFeedbackProps) {
  const metrics: [keyof Omit<ConversionScore, "overallScore" | "suggestions">, StrengthLevel][] = [
    ["headlineClarity", score.headlineClarity],
    ["benefitStructure", score.benefitStructure],
    ["ctaPlacement", score.ctaPlacement],
    ["trustElements", score.trustElements],
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100" style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)" }}>
        <h2 className="text-white font-bold text-base" style={{ fontWeight: 800 }}>
          📊 Conversion Intelligence
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">AI-powered conversion analysis</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Overall Score */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <ScoreCircle score={score.overallScore} />
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Score</p>
            <p className="text-2xl font-black text-slate-800" style={{ fontWeight: 900 }}>
              {score.overallScore}<span className="text-base text-slate-400 font-normal">/100</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {score.overallScore >= 70
                ? "This layout is well-optimized for conversion"
                : score.overallScore >= 45
                ? "Good foundation, some improvements needed"
                : "Significant improvements recommended"}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Factors</p>
          {metrics.map(([key, value]) => {
            const config = STRENGTH_CONFIG[value] || STRENGTH_CONFIG.Missing;
            return (
              <div key={key} className="rounded-xl p-3" style={{ background: config.bg }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{config.icon}</span>
                    <span className="text-sm font-semibold text-slate-700" style={{ fontWeight: 600 }}>
                      {METRIC_LABELS[key]}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: config.color,
                      background: `${config.color}15`,
                      fontWeight: 700,
                    }}
                  >
                    {value}
                  </span>
                </div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${config.bar}%`,
                      background: config.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggestions */}
        {score.suggestions && score.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              💡 Improvement Suggestions
            </p>
            {score.suggestions.map((suggestion, i) => (
              <div
                key={i}
                className="flex gap-2.5 p-3 rounded-xl"
                style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}
              >
                <span className="text-orange-500 text-sm font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-slate-700 leading-snug">{suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
