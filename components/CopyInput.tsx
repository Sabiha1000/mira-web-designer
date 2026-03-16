"use client";

import { useState, useRef } from "react";

interface CopyInputProps {
  onAnalyze: (copyText: string, imageBase64?: string, imageMediaType?: string) => void;
  isLoading: boolean;
}

export default function CopyInput({ onAnalyze, isLoading }: CopyInputProps) {
  const [activeTab, setActiveTab] = useState<"text" | "url" | "screenshot">("text");
  const [copyText, setCopyText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<string>("image/png");
  const [urlLoading, setUrlLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMediaType(file.type || "image/png");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      // Strip data URL prefix for API
      const base64 = result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setImageMediaType(file.type || "image/png");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      const base64 = result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    // For now, use the URL as reference text since we can't fetch arbitrary URLs from client
    // In production, this would call a server-side fetch endpoint
    setCopyText(`[URL to analyze: ${urlInput}]\n\nPlease analyze the marketing copy from this page and generate landing page layouts based on the typical structure found at this URL.`);
    setActiveTab("text");
    setUrlLoading(false);
  };

  const handleSubmit = () => {
    if (activeTab === "screenshot" && imageBase64) {
      onAnalyze(copyText || "", imageBase64, imageMediaType);
    } else if (activeTab === "text" && copyText.trim()) {
      onAnalyze(copyText);
    } else if (activeTab === "url" && urlInput.trim()) {
      onAnalyze(`Analyze landing page from URL: ${urlInput}. Generate conversion-focused layouts following Mirasee design style.`);
    }
  };

  const canSubmit =
    !isLoading &&
    ((activeTab === "text" && copyText.trim().length > 20) ||
      (activeTab === "url" && urlInput.trim().length > 5) ||
      (activeTab === "screenshot" && imageBase64 !== null));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100" style={{ background: "linear-gradient(135deg, #1E3A8A, #1d4ed8)" }}>
        <h2 className="text-white font-bold text-lg">Copy Input</h2>
        <p className="text-blue-200 text-sm mt-0.5">Paste your marketing copy, URL, or upload screenshots</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {(["text", "url", "screenshot"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-600 capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? "text-blue-800 border-b-2 border-blue-800 bg-blue-50"
                : "text-slate-500 hover:text-slate-700"
            }`}
            style={{ fontWeight: activeTab === tab ? 700 : 500 }}
          >
            {tab === "text" && "📝 "}
            {tab === "url" && "🔗 "}
            {tab === "screenshot" && "📸 "}
            {tab === "text" ? "Paste Copy" : tab === "url" ? "URL" : "Screenshot"}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Text Tab */}
        {activeTab === "text" && (
          <div className="space-y-3">
            <textarea
              value={copyText}
              onChange={(e) => setCopyText(e.target.value)}
              placeholder="Paste your marketing copy here...

Example:
- Headline: Join 10,000+ Entrepreneurs Who Have Built 6-Figure Online Courses
- Subheadline: Learn the proven Mirasee ACES Method for creating and launching courses that sell
- Problem: Struggling to turn your expertise into a profitable online course?
- Benefits: Lifetime access, Weekly coaching calls, Private community..."
              className="w-full h-64 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              style={{ fontFamily: "inherit", lineHeight: "1.6" }}
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{copyText.length} characters</span>
              <span>Minimum 20 characters required</span>
            </div>
          </div>
        )}

        {/* URL Tab */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://mirasee.com/your-landing-page or Google Doc URL"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={handleFetchUrl}
                disabled={!urlInput.trim() || urlLoading}
                className="px-4 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-colors cursor-pointer"
                style={{ background: "#1E3A8A", fontWeight: 700 }}
              >
                {urlLoading ? "Loading..." : "Load"}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700 font-medium">
                💡 <strong>Tip:</strong> Works with Google Docs, Notion pages, or any public URL. The AI will analyze the marketing structure of the page.
              </p>
            </div>
          </div>
        )}

        {/* Screenshot Tab */}
        {activeTab === "screenshot" && (
          <div className="space-y-4">
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="text-4xl mb-3">📸</div>
                <p className="text-slate-600 font-semibold text-sm">Drop screenshot here or click to upload</p>
                <p className="text-slate-400 text-xs mt-1">PNG, JPG, WebP supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded screenshot"
                  className="w-full rounded-xl border border-slate-200 max-h-64 object-cover"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-md text-slate-500 hover:text-red-500 cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            <textarea
              value={copyText}
              onChange={(e) => setCopyText(e.target.value)}
              placeholder="Optional: Add additional context or copy text to supplement the screenshot..."
              className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm text-slate-700 resize-none focus:outline-none focus:border-blue-500"
              style={{ fontFamily: "inherit" }}
            />
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full mt-5 py-4 rounded-xl text-white font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          style={{
            background: canSubmit
              ? "linear-gradient(135deg, #1E3A8A, #1d4ed8)"
              : "#94a3b8",
            fontWeight: 800,
            fontSize: "15px",
            letterSpacing: "0.02em",
          }}
        >
          {isLoading ? (
            <>
              <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Analyzing Copy with Claude AI...
            </>
          ) : (
            <>
              ✨ Generate Layout Designs
            </>
          )}
        </button>
      </div>
    </div>
  );
}
