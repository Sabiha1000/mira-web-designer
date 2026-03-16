export type SectionType =
  | "hero"
  | "headline"
  | "subheadline"
  | "problem"
  | "benefits"
  | "framework"
  | "testimonials"
  | "speaker"
  | "agenda"
  | "faq"
  | "cta"
  | "unknown";

export interface DetectedSection {
  type: SectionType;
  content: string;
  confidence: "high" | "medium" | "low";
}

export interface ConversionScore {
  headlineClarity: "Strong" | "Medium" | "Weak" | "Missing";
  benefitStructure: "Strong" | "Medium" | "Weak" | "Missing";
  ctaPlacement: "Strong" | "Medium" | "Weak" | "Missing";
  trustElements: "Strong" | "Medium" | "Weak" | "Missing";
  overallScore: number; // 0-100
  suggestions: string[];
}

export interface LayoutSection {
  sectionType: SectionType;
  layout: string; // e.g. "full-width", "2-col", "3-col", "card-grid"
  content: string;
  accentColor?: string;
  icon?: string;
}

export interface LayoutVariation {
  id: string;
  name: string;
  description: string;
  sections: LayoutSection[];
  ctaPosition: "top" | "middle" | "bottom" | "multiple";
  colorScheme: "blue" | "orange" | "green" | "purple";
  style: "bold" | "minimal" | "card-heavy" | "story";
}

export interface AnalysisResult {
  detectedSections: DetectedSection[];
  layouts: LayoutVariation[];
  conversionScore: ConversionScore;
  pageTitle: string;
  pageType: "webinar" | "course" | "product" | "event" | "lead-gen" | "general";
}

export interface CopyInput {
  type: "text" | "url" | "screenshot";
  content: string; // raw text, URL string, or base64 image
  filename?: string;
}
