import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { AnalysisResult } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert landing page designer specializing in Mirasee's design style.
Mirasee creates conversion-focused marketing pages for online courses, webinars, and coaching programs.

Your task is to analyze marketing copy and generate structured landing page layouts following these Mirasee design principles:
- Bold, clear headline sections using Montserrat font
- Strong CTA buttons (orange: #F97316, on dark blue: #1E3A8A background)
- Clean spacing with generous whitespace
- Card-based layout blocks for benefits and features
- Section-based page structure
- High readability designed for age group 40+
- White background with blue (#1E3A8A) and orange (#F97316) accents

You must ALWAYS respond with valid JSON matching the AnalysisResult schema. No markdown, no explanation — pure JSON only.`;

const ANALYSIS_PROMPT = (copyText: string) => `Analyze this marketing copy and generate landing page layouts.

COPY TO ANALYZE:
${copyText}

Respond with ONLY this exact JSON structure (no markdown, no explanation):
{
  "pageTitle": "string - detected or inferred page title",
  "pageType": "webinar|course|product|event|lead-gen|general",
  "detectedSections": [
    {
      "type": "hero|headline|subheadline|problem|benefits|framework|testimonials|speaker|agenda|faq|cta|unknown",
      "content": "the actual copy text for this section (max 200 chars)",
      "confidence": "high|medium|low"
    }
  ],
  "layouts": [
    {
      "id": "layout-1",
      "name": "Bold Impact",
      "description": "High-contrast hero with immediate CTA",
      "colorScheme": "blue",
      "style": "bold",
      "ctaPosition": "top|middle|bottom|multiple",
      "sections": [
        {
          "sectionType": "hero|headline|subheadline|problem|benefits|framework|testimonials|speaker|agenda|faq|cta|unknown",
          "layout": "full-width|2-col|3-col|card-grid|accordion|split",
          "content": "brief description of what goes here",
          "accentColor": "#1E3A8A or #F97316",
          "icon": "optional emoji or icon name"
        }
      ]
    }
  ],
  "conversionScore": {
    "headlineClarity": "Strong|Medium|Weak|Missing",
    "benefitStructure": "Strong|Medium|Weak|Missing",
    "ctaPlacement": "Strong|Medium|Weak|Missing",
    "trustElements": "Strong|Medium|Weak|Missing",
    "overallScore": 0-100,
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  }
}

Rules:
1. Generate exactly 4 layout variations with different styles: "bold", "minimal", "card-heavy", "story"
2. Each layout should have 6-10 sections ordered for conversion
3. Layout names should be creative marketing names
4. Base the analysis on the Mirasee design style
5. Suggestions should be specific and actionable`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { copyText, imageBase64, imageMediaType } = body;

    if (!copyText && !imageBase64) {
      return NextResponse.json(
        { error: "No copy text or image provided" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Build message content
    type SupportedMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    const safeMediaType = (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(imageMediaType)
      ? imageMediaType
      : "image/png") as SupportedMediaType;

    const messageContent: Anthropic.MessageParam["content"] = [];

    if (imageBase64) {
      (messageContent as Anthropic.ContentBlockParam[]).push({
        type: "image",
        source: {
          type: "base64",
          media_type: safeMediaType,
          data: imageBase64,
        },
      });
      (messageContent as Anthropic.ContentBlockParam[]).push({
        type: "text",
        text: ANALYSIS_PROMPT(
          copyText
            ? copyText
            : "Analyze the marketing copy visible in this screenshot and generate landing page layouts."
        ),
      });
    } else {
      (messageContent as Anthropic.ContentBlockParam[]).push({
        type: "text",
        text: ANALYSIS_PROMPT(copyText),
      });
    }

    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: messageContent,
        },
      ],
    });

    const response = await stream.finalMessage();

    // Extract text content from response
    const textContent = response.content.find((b) => b.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 500 }
      );
    }

    // Parse JSON response
    let analysisResult: AnalysisResult;
    try {
      // Clean up response in case there's any markdown
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.slice(7);
      }
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.slice(0, -3);
      }
      analysisResult = JSON.parse(jsonText.trim());
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          raw: textContent.text.slice(0, 500),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Analysis error:", error);
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
