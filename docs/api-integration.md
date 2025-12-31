# API Integration

## Backend Setup

### Dependencies

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.20.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1",
    "pdf-parse": "^1.1.1",
    "pdfjs-dist": "^3.11.174",
    "canvas": "^2.11.2"
  }
}
```

---

## PDF Processing

### Convert PDF to Images

```typescript
// backend/src/services/pdfProcessor.ts

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { createCanvas } from 'canvas';

export async function convertPDFToImages(
  buffer: Buffer
): Promise<{ images: string[]; pageCount: number }> {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pageCount = pdf.numPages;
  const images: string[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    await page.render({
      canvasContext: context as any,
      viewport: viewport,
    }).promise;

    // Convert to base64 PNG
    const base64 = canvas.toDataURL('image/png').split(',')[1];
    images.push(base64);
  }

  return { images, pageCount };
}
```

---

## Claude Vision API Integration

### Prompt Template

```typescript
// backend/src/services/claudeAPI.ts

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzePitchDeck(
  images: string[],
  stage: string
): Promise<any> {
  const systemPrompt = `You are a venture capital analyst conducting due diligence on a ${stage} pitch deck. Your role is to identify cognitive biases, thesis vulnerabilities, and generate strategic questions that investors should ask founders.

Analyze each slide and identify:

1. **Findings**: Specific issues, claims, or red flags with severity levels:
   - CRITICAL: Deal-breaking issues or major red flags
   - CONCERN: Significant issues requiring clarification
   - WATCH: Items to monitor or minor concerns

2. **Categories**: Classify each finding:
   - Team: Founder experience, team composition, advisors
   - Market: TAM/SAM/SOM, market validation, competitive landscape
   - Product: Technical architecture, differentiation, roadmap
   - Traction: Metrics, growth, customer validation
   - Financial: Projections, unit economics, burn rate

3. **Cognitive Biases**: Identify biases in claims:
   - Anchoring bias, Confirmation bias, Survivorship bias, Recency bias, Halo effect, Optimism bias, etc.

4. **Strategic Questions**: Generate pointed questions investors should ask, formatted as direct inquiries.

5. **Thesis Vulnerabilities**: High-level weaknesses in the investment thesis (5-8 total).

For each finding, provide:
- Slide number (1-indexed)
- Approximate Y-position on slide (0-100%, where 0 is top, 100 is bottom)
- Severity level
- Category
- Title (concise, < 5 words)
- Description (2-3 sentences explaining the issue)
- Bias tag (specific cognitive bias name)
- Strategic questions (3-5 questions investors should ask)
- Elevated questions (1-2 most critical questions from the list)
- Logic evidence (signals observed, confidence score 0-1)`;

  const userMessage = {
    role: 'user' as const,
    content: [
      {
        type: 'text' as const,
        text: `Analyze this ${stage} pitch deck (${images.length} slides). Return JSON matching this schema:

{
  "findings": [
    {
      "id": number,
      "slide": number,
      "position": number,
      "severity": "CRITICAL" | "CONCERN" | "WATCH",
      "category": "Team" | "Market" | "Product" | "Traction" | "Financial",
      "title": string,
      "description": string,
      "biasTag": string,
      "strategicQuestions": string[],
      "elevatedQuestions": string[],
      "logicEvidence": {
        "signals": string[],
        "confidence": number
      }
    }
  ],
  "thesisVulnerabilities": [
    {
      "id": number,
      "title": string,
      "signal": string,
      "severity": "CRITICAL" | "CONCERN",
      "category": string,
      "relatedFindings": number[]
    }
  ]
}`,
      },
      ...images.map((image) => ({
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: 'image/png' as const,
          data: image,
        },
      })),
    ],
  };

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [userMessage],
  });

  // Extract JSON from response
  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  // Parse JSON (handle markdown code blocks)
  let jsonText = textContent.text;
  const jsonMatch = jsonText.match(/```json\n([\s\S]*)\n```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }

  return JSON.parse(jsonText);
}
```

---

## API Route Handler

```typescript
// backend/src/routes/analyze.ts

import { Request, Response } from 'express';
import { convertPDFToImages } from '../services/pdfProcessor';
import { analyzePitchDeck } from '../services/claudeAPI';

export async function analyzeRoute(req: Request, res: Response) {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const { stage } = req.body;
    if (!stage) {
      return res.status(400).json({
        success: false,
        error: 'Funding stage is required',
      });
    }

    // Convert PDF to images
    const { images, pageCount } = await convertPDFToImages(req.file.buffer);

    // Analyze with Claude
    const analysis = await analyzePitchDeck(images, stage);

    // Transform response to match frontend types
    const questionGroups = generateQuestionGroups(
      analysis.findings,
      analysis.thesisVulnerabilities
    );

    const response = {
      success: true,
      data: {
        findings: analysis.findings,
        thesisVulnerabilities: analysis.thesisVulnerabilities,
        questionGroups,
        metadata: {
          stage,
          slideCount: pageCount,
          analyzedAt: new Date().toISOString(),
        },
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
    });
  }
}

function generateQuestionGroups(findings: any[], vulnerabilities: any[]) {
  const categories = ['Team', 'Market', 'Product', 'Traction', 'Financial'];
  const questionMap = new Map<string, Set<string>>();

  // Collect unique questions from findings
  findings.forEach((finding) => {
    if (!questionMap.has(finding.category)) {
      questionMap.set(finding.category, new Set());
    }
    finding.strategicQuestions.forEach((q: string) => {
      questionMap.get(finding.category)!.add(q);
    });
  });

  // Generate question groups with IDs
  return categories.map((category) => {
    const questions = Array.from(questionMap.get(category) || []);
    return {
      category,
      questions: questions.map((text, idx) => {
        const questionId = `Q${String(idx + 1).padStart(2, '0')}`;

        // Find which vulnerabilities relate to this question
        const relatedVulnerabilities = vulnerabilities
          .filter((v) =>
            v.relatedFindings.some((fId: number) => {
              const finding = findings.find((f) => f.id === fId);
              return (
                finding?.category === category &&
                finding?.strategicQuestions.includes(text)
              );
            })
          )
          .map((v) => v.id);

        return {
          id: questionId,
          text,
          relatedVulnerabilities,
          isElevated: findings.some((f) =>
            f.elevatedQuestions?.includes(text)
          ),
        };
      }),
    };
  });
}
```

---

## Environment Configuration

### Backend .env

```bash
# Anthropic API
ANTHROPIC_API_KEY=REDACTED_KEY

# Server Config
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE_MB=25
```

### Frontend .env

```bash
# API Endpoint
VITE_API_URL=http://localhost:3001
```

---

## Error Handling

### Validation Errors
```typescript
// File size check
if (req.file.size > 25 * 1024 * 1024) {
  return res.status(400).json({
    success: false,
    error: 'File exceeds 25MB limit',
  });
}

// File type check
if (req.file.mimetype !== 'application/pdf') {
  return res.status(400).json({
    success: false,
    error: 'Only PDF files are supported',
  });
}
```

### API Errors
```typescript
try {
  const response = await client.messages.create(...);
} catch (error) {
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please try again in a moment.',
    });
  }

  if (error.status === 401) {
    console.error('Invalid API key');
    return res.status(500).json({
      success: false,
      error: 'Configuration error. Please contact support.',
    });
  }

  throw error;
}
```

---

## Rate Limiting

```typescript
// backend/src/middleware/rateLimiter.ts

import rateLimit from 'express-rate-limit';

export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    error: 'Too many analysis requests. Please try again later.',
  },
});

// Apply to route
app.post('/api/analyze', analyzeLimiter, upload.single('file'), analyzeRoute);
```

---

## Deployment

### Backend (Railway)

1. Create new project on Railway
2. Connect GitHub repo (backend folder)
3. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `FRONTEND_URL` (Vercel URL after frontend deployed)
   - `PORT=3001`
4. Deploy from `main` branch

### Frontend (Vercel)

1. Import project from GitHub
2. Set root directory to `frontend/`
3. Framework preset: Vite
4. Environment variables:
   - `VITE_API_URL` (Railway backend URL)
5. Deploy

### CORS Configuration

Update backend after deployment:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://pitchguard.vercel.app',
  credentials: true,
}));
```

---

## Testing

### Manual Testing Checklist

- [ ] Upload valid PDF (<25MB) → Analysis succeeds
- [ ] Upload file >25MB → Error toast displayed
- [ ] Upload non-PDF file → Error toast displayed
- [ ] Backend offline → Connection error toast
- [ ] Claude API key invalid → Generic error (don't expose key issue)
- [ ] PDF with 1 page → Renders correctly
- [ ] PDF with 20+ pages → All pages processed
- [ ] Analysis response missing fields → Graceful degradation
