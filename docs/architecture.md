# Architecture

## Folder Structure

```
pitchguard/
├── frontend/                     # Vite React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── entry/
│   │   │   │   ├── EntryScreen.tsx
│   │   │   │   ├── StageSelector.tsx
│   │   │   │   └── UploadZone.tsx
│   │   │   ├── analysis/
│   │   │   │   ├── AnalysisWorkspace.tsx
│   │   │   │   ├── TopNav.tsx
│   │   │   │   ├── LeftSidebar.tsx
│   │   │   │   ├── PDFViewer.tsx
│   │   │   │   ├── SmartPin.tsx
│   │   │   │   └── FindingDrawer.tsx
│   │   │   ├── ledger/
│   │   │   │   ├── InsightsLedger.tsx
│   │   │   │   ├── VulnerabilityCard.tsx
│   │   │   │   └── QuestionCard.tsx
│   │   │   └── ui/              # shadcn components
│   │   │       ├── sheet.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── tooltip.tsx
│   │   │       ├── toast.tsx
│   │   │       ├── skeleton.tsx
│   │   │       └── scroll-area.tsx
│   │   ├── hooks/
│   │   │   ├── useTimer.ts
│   │   │   └── useAnalysis.ts   # React Query hook
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── store/
│   │   │   └── useAppStore.ts   # Zustand
│   │   ├── api/
│   │   │   └── analysis.ts      # API client
│   │   ├── data/
│   │   │   └── mockAnalysis.ts  # Dev fallback
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
└── backend/                      # Express server
    ├── src/
    │   ├── routes/
    │   │   └── analyze.ts
    │   ├── services/
    │   │   ├── pdfProcessor.ts
    │   │   └── claudeAPI.ts
    │   ├── utils/
    │   │   ├── validation.ts
    │   │   └── logger.ts
    │   └── index.ts
    ├── .env
    ├── tsconfig.json
    └── package.json
```

---

## TypeScript Interfaces

```typescript
// types/index.ts

export type FundingStage = 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B+';

export type Severity = 'CRITICAL' | 'CONCERN' | 'WATCH';

export type Category = 'Team' | 'Market' | 'Product' | 'Traction' | 'Financial';

export interface Finding {
  id: number;
  slide: number;              // PDF page number (1-indexed)
  position: number;           // Y-position percentage (0-100)
  severity: Severity;
  category: Category;
  title: string;
  description: string;
  biasTag: string;           // e.g., "Anchoring Bias"
  strategicQuestions: string[];
  elevatedQuestions: string[]; // Subset of most important
  logicEvidence: {
    signals: string[];
    confidence: number;       // 0-1
  };
}

export interface ThesisVulnerability {
  id: number;
  title: string;
  signal: string;             // Short trigger description
  severity: 'CRITICAL' | 'CONCERN';
  category: Category;
  relatedFindings: number[];  // Finding IDs
  relatedQuestions: string[]; // Question IDs (e.g., "Q01")
}

export interface QuestionGroup {
  category: Category;
  questions: Question[];
}

export interface Question {
  id: string;                 // e.g., "Q01", "Q02"
  text: string;
  relatedVulnerabilities: number[];
  isElevated?: boolean;       // Highlighted question
}

export interface AnalysisData {
  findings: Finding[];
  thesisVulnerabilities: ThesisVulnerability[];
  questionGroups: QuestionGroup[];
  metadata: {
    stage: FundingStage;
    slideCount: number;
    analyzedAt: string;       // ISO timestamp
  };
}

export interface UploadRequest {
  file: File;
  stage: FundingStage;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisData;
  error?: string;
}
```

---

## Zustand Store

```typescript
// store/useAppStore.ts

import { create } from 'zustand';
import type { AnalysisData, Finding, FundingStage } from '../types';

interface AppState {
  // View state
  view: 'entry' | 'analysis';
  analysisSubView: 'pdf' | 'ledger';

  // Upload state
  selectedStage: FundingStage | null;
  uploadedFile: File | null;

  // Analysis state
  analysisData: AnalysisData | null;
  currentSlide: number;

  // Interaction state
  selectedFinding: Finding | null;
  selectedVulnerability: number | null;
  isDrawerOpen: boolean;

  // Session state
  sessionStartTime: number | null;

  // Actions
  setView: (view: 'entry' | 'analysis') => void;
  setAnalysisSubView: (subView: 'pdf' | 'ledger') => void;
  setSelectedStage: (stage: FundingStage) => void;
  setUploadedFile: (file: File | null) => void;
  setAnalysisData: (data: AnalysisData) => void;
  setCurrentSlide: (slide: number) => void;
  selectFinding: (finding: Finding | null) => void;
  selectVulnerability: (id: number | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  startSession: () => void;
  resetSession: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  view: 'entry',
  analysisSubView: 'pdf',
  selectedStage: null,
  uploadedFile: null,
  analysisData: null,
  currentSlide: 1,
  selectedFinding: null,
  selectedVulnerability: null,
  isDrawerOpen: false,
  sessionStartTime: null,

  setView: (view) => set({ view }),
  setAnalysisSubView: (analysisSubView) => set({ analysisSubView }),
  setSelectedStage: (selectedStage) => set({ selectedStage }),
  setUploadedFile: (uploadedFile) => set({ uploadedFile }),
  setAnalysisData: (analysisData) => set({ analysisData }),
  setCurrentSlide: (currentSlide) => set({ currentSlide }),
  selectFinding: (selectedFinding) => set({ selectedFinding }),
  selectVulnerability: (selectedVulnerability) => set({ selectedVulnerability }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  startSession: () => set({ sessionStartTime: Date.now() }),
  resetSession: () => set({
    view: 'entry',
    analysisSubView: 'pdf',
    selectedStage: null,
    uploadedFile: null,
    analysisData: null,
    currentSlide: 1,
    selectedFinding: null,
    selectedVulnerability: null,
    isDrawerOpen: false,
    sessionStartTime: null,
  }),
}));
```

---

## React Query Setup

```typescript
// api/analysis.ts

import { QueryClient } from '@tanstack/react-query';
import type { AnalysisData, FundingStage } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: Infinity, // Analysis data never goes stale
    },
  },
});

export async function analyzeDocument(
  file: File,
  stage: FundingStage
): Promise<AnalysisData> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('stage', stage);

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Analysis failed');
  }

  const result = await response.json();
  return result.data;
}
```

```typescript
// hooks/useAnalysis.ts

import { useMutation } from '@tanstack/react-query';
import { analyzeDocument } from '../api/analysis';
import { useAppStore } from '../store/useAppStore';

export function useAnalysis() {
  const { setAnalysisData, setView, startSession } = useAppStore();

  return useMutation({
    mutationFn: ({ file, stage }: { file: File; stage: string }) =>
      analyzeDocument(file, stage),
    onSuccess: (data) => {
      setAnalysisData(data);
      setView('analysis');
      startSession();
    },
  });
}
```

---

## Backend API Structure

### Express Server

```typescript
// backend/src/index.ts

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { analyzeRoute } from './routes/analyze';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  },
});

// Routes
app.post('/api/analyze', upload.single('file'), analyzeRoute);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### API Response Format

```typescript
// Success
{
  "success": true,
  "data": {
    "findings": [...],
    "thesisVulnerabilities": [...],
    "questionGroups": [...],
    "metadata": {
      "stage": "Seed",
      "slideCount": 15,
      "analyzedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}

// Error
{
  "success": false,
  "error": "File too large. Maximum size is 25MB."
}
```

---

## Environment Configuration

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
```bash
ANTHROPIC_API_KEY=REDACTED_KEY
MAX_FILE_SIZE_MB=25
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**CRITICAL: Never commit .env files. Add to .gitignore.**

---

## Data Flow

1. **Upload**: User selects stage + uploads PDF
2. **Frontend**: React Query mutation sends FormData to backend
3. **Backend**:
   - Validates file (PDF, <25MB)
   - Converts PDF pages to images
   - Sends images to Claude Vision API with structured prompt
   - Parses response into typed data
4. **Frontend**:
   - Receives AnalysisData
   - Updates Zustand store
   - Transitions to Analysis view
   - Starts session timer
5. **Interaction**:
   - Click Smart Pin → Open drawer (Zustand)
   - Click Σ → Toggle sub-view (Zustand)
   - Click vulnerability → Filter questions (computed from store)

---

## Performance Optimizations

- **React Query**: Caching, retry logic, deduplication
- **React.memo**: Expensive components (PDFViewer, SmartPin)
- **Lazy loading**: PDF pages (render viewport only)
- **Debounce**: PDF scroll navigation (300ms)
- **Code splitting**: Route-based (if needed later)
- **Bundle optimization**: Vite tree-shaking, minification
