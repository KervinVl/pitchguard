# PitchGuard - AI-Powered VC Audit Tool

## Project Overview

PitchGuard is a professional venture capital pitch deck analysis tool using Claude Vision API to identify cognitive biases, thesis vulnerabilities, and generate strategic due diligence questions. Dark, institutional aesthetic inspired by Linear and Bloomberg Terminal.

**Tech Stack:**
- Frontend: Vite + React 18 + TypeScript + Tailwind CSS
- State: Zustand
- UI: shadcn/ui (Sheet, Tabs, ScrollArea, Tooltip, Toast, Skeleton) + Lucide React
- Backend: Separate Express server
- API: Anthropic Claude Vision API
- PDF: react-pdf, pdfjs-dist
- Data Fetching: TanStack Query (React Query)
- Deploy: Vercel (frontend) + Railway/Render (backend)

**Browser Support:** Latest 2 versions Chrome, Safari, Edge (desktop-first, 1280px+ minimum)

---

## Quick Reference Docs

- **[Design System](./docs/design-system.md)** - Colors, typography, spacing, component specs
- **[Architecture](./docs/architecture.md)** - Data structures, API contracts, folder structure
- **[Component Behavior](./docs/component-behavior.md)** - Interaction patterns, state logic
- **[Development Phases](./docs/development-phases.md)** - Build roadmap with checkboxes
- **[API Integration](./docs/api-integration.md)** - Claude Vision prompt, backend setup

---

## Application Flow

**Single-page app** (no routing):
1. **Entry Screen** → Select funding stage + upload PDF → Click "Analyze Deck"
2. **Loading Screen** → "Analyzing deck..." → "Processing slides..." → "Generating insights..." (5-10s)
3. **Analysis Workspace** → PDF viewer with Smart Pins OR Insights Ledger (toggle with Σ button)
   - Smart Pin click → Right drawer (Sheet) slides in with finding details
   - Σ button → Switch between PDF view ↔ Ledger view
4. **New Analysis** → Reset state → Return to Entry Screen

---

## Key Design Principles

### Typography Hierarchy
- **Inter**: Human UI text (buttons, labels, headings)
- **JetBrains Mono**: Machine/AI data (findings, timer, system data)

### Color Usage
- Background: `#0B0C0E` (primary), `#1A1D23` (surfaces), `#2E333B` (borders)
- **Gold accent `#C9A961`**: Use SPARINGLY for selected states, elevated questions, hover accents
- Severity colors: Red (CRITICAL), Yellow (CONCERN), Blue (WATCH)

### Spacing
- 8px grid system: 4, 8, 12, 16, 24, 32, 48, 64
- Border radius: 6px (buttons/inputs), 8px (cards/panels)

---

## Core Components

### Entry Screen
- **StageSelector**: Tabs component (Pre-Seed, Seed, Series A, Series B+)
- **UploadZone**: react-dropzone, PDF only, max 25MB
- **Analyze Button**: Disabled until stage + file selected

### Analysis Workspace
- **TopNav** (48px): Logo, New Analysis, Timer (counts up from 00:00), Export Report
- **LeftSidebar** (60px PDF / 240px Ledger): Σ toggle button, slide numbers (clickable)
- **PDFViewer**: react-pdf with Smart Pins positioned at Y% from API
- **FindingDrawer** (Sheet, 420px): Slides from right, shows finding details
- **InsightsLedger**: Two-column layout (40% vulnerabilities / 60% questions)

### Smart Pins
- 32px circle badges on right edge of PDF
- Color-coded by severity (border + background at 20% opacity)
- Number in JetBrains Mono
- Click opens FindingDrawer (only ONE open at a time)

---

## State Management (Zustand)

```typescript
interface AppState {
  view: 'entry' | 'analysis';
  analysisSubView: 'pdf' | 'ledger';
  selectedStage: FundingStage | null;
  uploadedFile: File | null;
  analysisData: AnalysisData | null;
  selectedFinding: Finding | null;
  selectedVulnerability: number | null;
  sessionStartTime: number | null;
  isDrawerOpen: boolean;
}
```

See [architecture.md](./docs/architecture.md) for full TypeScript interfaces.

---

## API Integration

**Backend:** Express server on Railway/Render
- Endpoint: `POST /api/analyze`
- Accept: FormData (PDF file + funding stage)
- Process: PDF → Images → Claude Vision API → Structured JSON
- Return: `{ findings, thesisVulnerabilities, metadata }`

**Frontend:** React Query for data fetching
- Loading states: Skeleton components
- Error handling: Toast notifications
- Retry logic: 3 attempts with exponential backoff

See [api-integration.md](./docs/api-integration.md) for Claude Vision prompt template.

---

## Coding Standards

### TypeScript
- Strict mode, no `any` types
- Explicit return types for functions
- Interfaces for all data structures

### React
- Functional components only
- Custom hooks for reusable logic
- React.memo for expensive renders

### Tailwind
- Use design tokens from globals.css
- 8px spacing grid, no arbitrary values
- Group classes: layout → spacing → typography → colors

### File Organization
```
src/
├── components/entry/     (Upload screen)
├── components/analysis/  (PDF + pins)
├── components/ledger/    (Insights)
├── components/ui/        (shadcn)
├── types/index.ts
├── store/useAppStore.ts
├── api/analysis.ts
├── data/mockAnalysis.ts
└── styles/globals.css
```

---

## Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001

# Backend (.env)
ANTHROPIC_API_KEY=REDACTED_KEY
MAX_FILE_SIZE_MB=25
PORT=3001
```

**NEVER commit `.env` files. Add to `.gitignore`.**

---

## Development Workflow

1. **Phase 1**: Entry Screen (stage selector + upload + validation)
2. **Phase 2**: Backend API + Claude integration + mock data
3. **Phase 3**: Analysis Workspace layout + PDF viewer
4. **Phase 4**: Smart Pins + FindingDrawer
5. **Phase 5**: Insights Ledger + question filtering
6. **Phase 6**: Export Report
7. **Phase 7**: Polish (animations, error handling, accessibility)

See [development-phases.md](./docs/development-phases.md) for detailed checklist.

---

## Important Notes

- **Gold accent**: Use SPARINGLY (not for primary actions)
- **Timer**: Starts on "Analyze Deck", counts up from 00:00, resets on "New Analysis"
- **One drawer at a time**: Clicking new pin closes current drawer
- **No PDF highlights**: Skip feature, Smart Pins are sufficient
- **Desktop-first**: Min 1280px width, mobile out of scope
- **Loading states**: Skeleton components, not generic spinners
- **Error handling**: User-friendly messages, never expose API keys
- **Tooltips**: Show bias definitions on hover (Anchoring, Halo Effect, etc.)

---

## Deployment

**Frontend (Vercel):**
- Connect GitHub repo to Vercel
- Auto-deploy from `main` branch
- Environment variable: `VITE_API_URL`

**Backend (Railway/Render):**
- Deploy Express server
- Set environment variables (ANTHROPIC_API_KEY, PORT)
- CORS: Allow Vercel frontend domain

---

## References

- Design System: [design-system.md](./docs/design-system.md)
- Architecture: [architecture.md](./docs/architecture.md)
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/docs
- React PDF: https://react-pdf.org/
- Anthropic API: https://docs.anthropic.com/
