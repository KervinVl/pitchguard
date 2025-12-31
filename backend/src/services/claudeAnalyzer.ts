import Anthropic from '@anthropic-ai/sdk';
import type { ConvertedPage } from '../utils/pdfConverter';

// Lazy initialization to ensure env vars are loaded
let anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

export interface Finding {
  id: number;
  category: string;
  severity: 'CRITICAL' | 'CONCERN' | 'WATCH';
  biasTag: string;
  title: string;
  description: string;
  slide: number;
  strategicQuestions: string[];
  logicEvidence: {
    signals: string[];
    confidence: number;
  };
}

export interface ThesisVulnerability {
  id: number;
  category: string;
  title: string;
  impact: string;
  relatedFindings: number[];
}

export interface AnalysisResult {
  findings: Finding[];
  thesisVulnerabilities: ThesisVulnerability[];
  metadata: {
    stage: string;
    slideCount: number;
    analyzedAt: string;
  };
}

function buildAnalysisPrompt(stage: string): string {
  return `You are an expert venture capital analyst specializing in identifying cognitive biases and thesis vulnerabilities in pitch decks. You're analyzing a ${stage} pitch deck.

Your task is to analyze the deck slide-by-slide and identify 8-12 key findings across all slides. For each finding:
1. Identify which slide it appears on (be specific and accurate)
2. Categorize the type of issue (COGNITIVE_BIAS, THESIS_GAP, or NARRATIVE_WEAKNESS)
3. Specify the bias or weakness (e.g., "Anchoring Bias", "Market Sizing Risk", etc.)
4. Provide a brief title and description
5. Generate 2-3 strategic due diligence questions specific to that finding
6. Include supporting evidence from the slide

Also identify 4-6 overarching thesis vulnerabilities that could undermine the investment case.

CRITICAL INSTRUCTIONS:
- Each finding must be accurately mapped to the slide where you observed it
- Keep descriptions concise (max 2-3 sentences)
- Return ONLY valid JSON - no extra text before or after
- Escape all quotes inside strings using \"
- Do not use newlines inside string values

Return your analysis as a JSON object with this exact structure:

{
  "findings": [
    {
      "id": 1,
      "category": "COGNITIVE_BIAS",
      "severity": "CRITICAL",
      "biasTag": "Anchoring Bias",
      "title": "Brief title of the finding",
      "description": "Detailed explanation of what you found and why it matters",
      "slide": 3,
      "strategicQuestions": [
        "Question 1?",
        "Question 2?",
        "Question 3?"
      ],
      "logicEvidence": {
        "signals": [
          "Specific text or claim from the slide",
          "Another supporting signal"
        ],
        "confidence": 0.85
      }
    }
  ],
  "thesisVulnerabilities": [
    {
      "id": 1,
      "category": "Market Risk",
      "title": "Brief vulnerability title",
      "impact": "Description of potential impact on investment thesis",
      "relatedFindings": [1, 2]
    }
  ]
}

Focus on being professional, specific, and actionable. Each finding should reveal something non-obvious that a careful investor would want to investigate. Ensure slide numbers are accurate - do not guess.`;
}

export async function analyzePitchDeck(
  pages: ConvertedPage[],
  stage: string
): Promise<AnalysisResult> {
  try {
    // Build image content for Claude
    const imageBlocks = pages.map((page) => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: 'image/png' as const,
        data: page.base64,
      },
    }));

    const prompt = buildAnalysisPrompt(stage);

    console.log(`[claude] Analyzing ${pages.length} slides for ${stage} deck...`);

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract text response
    const response = message.content.find((block) => block.type === 'text');
    if (!response || response.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    console.log('[claude] Raw response length:', response.text.length);

    // Parse JSON from response (handle markdown code blocks)
    let jsonText = response.text.trim();

    // Remove markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    // Try to find JSON object if there's extra text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let analysisData;
    try {
      analysisData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[claude] JSON parse error:', parseError);
      console.error('[claude] Failed JSON (first 500 chars):', jsonText.substring(0, 500));
      console.error('[claude] Failed JSON (last 500 chars):', jsonText.substring(jsonText.length - 500));
      throw new Error(`Failed to parse Claude response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`);
    }

    return {
      ...analysisData,
      metadata: {
        stage,
        slideCount: pages.length,
        analyzedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('[claude] Analysis error:', error);
    throw new Error(
      `Claude analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
