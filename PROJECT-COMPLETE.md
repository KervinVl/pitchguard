# PitchGuard - Project Complete! 🎉

## Overview

PitchGuard is a professional AI-powered venture capital audit tool with a dark, institutional aesthetic inspired by Linear and Bloomberg Terminal. The application analyzes pitch decks to identify cognitive biases, thesis vulnerabilities, and generate strategic due diligence questions.

**Status:** ✅ MVP COMPLETE - Fully functional with mock data

---

## Tech Stack

### Frontend
- **Framework:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS 3
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **UI Components:** Custom + Radix UI primitives
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **PDF Rendering:** react-pdf + pdfjs-dist
- **Notifications:** Sonner (toast)

### Backend
- **Server:** Express + TypeScript
- **File Upload:** Multer
- **API:** Anthropic Claude Vision (ready for integration)
- **Environment:** Node.js with dotenv

### Deployment
- **Frontend:** Vercel (ready)
- **Backend:** Railway/Render (ready)

---

## Features Implemented

### ✅ Phase 1: Entry Screen
- Funding stage selector (Pre-Seed, Seed, Series A, Series B+)
- PDF upload with drag-and-drop
- File validation (PDF only, 25MB max)
- Toast notifications for errors
- Dark institutional design

### ✅ Phase 2: Loading & Mock Data
- Animated loading screen with 3 progress stages
- 3-second simulated analysis delay
- Comprehensive mock data with 7 findings
- 13 strategic questions across 5 categories
- 7 thesis vulnerabilities with cognitive bias tags

### ✅ Phase 3: Analysis Workspace
- Top navigation with logo, timer (counts up), and action buttons
- Left sidebar with Σ toggle and slide numbers
- PDF viewer (800px, centered, shadow)
- Smart Pins:
  - Color-coded by severity (CRITICAL/CONCERN/WATCH)
  - Positioned at Y% from API data
  - Hover animation (scale 1.1)
  - Click to open finding drawer
- Finding Drawer:
  - Slides in from right (420px)
  - Complete finding details
  - Strategic questions with elevated highlighting
  - Logic evidence with confidence bar

### ✅ Phase 4: Smart Pins & Drawer
- 7 Smart Pins across slides 3, 5, 7, 9, 11
- Only one drawer open at a time
- Gold border on active pin
- Smooth spring animations
- Click backdrop to close

### ✅ Phase 5: Insights Ledger
- Two-column layout (40% / 60%)
- 7 clickable vulnerability cards
- Question filtering by selected vulnerability
- Gold border highlighting for:
  - Selected vulnerabilities
  - Elevated questions (related to selection)
- Copy All Questions button (clipboard)
- Dynamic question group counts

### ✅ Phase 6: Export Report
- Generate comprehensive markdown report
- Download as .md file
- Includes all findings, vulnerabilities, and questions
- Formatted with headers, bullet points, and metadata
- Toast notification on success

### ✅ Phase 7: Polish
- Keyboard shortcuts:
  - `Esc` - Close drawer
  - `L` - Toggle Ledger view
  - `Cmd/Ctrl + E` - Export report
- Error handling with user-friendly messages
- Smooth transitions and animations
- Responsive scrolling
- Production-ready TypeScript (no `any` types)

---

## Application Flow

```
┌─────────────────┐
│  Entry Screen   │
│  - Select Stage │
│  - Upload PDF   │
└────────┬────────┘
         │ Click "Analyze Deck"
         ▼
┌─────────────────┐
│ Loading Screen  │
│  - 3 stages     │
│  - Progress bar │
└────────┬────────┘
         │ Analysis Complete
         ▼
┌─────────────────────────────────────┐
│     Analysis Workspace              │
├─────────────────────────────────────┤
│ TopNav: Logo | Timer | Actions      │
├──────┬──────────────────────────────┤
│ Side │  PDF View (default)          │
│ bar  │  - PDF rendering             │
│  │   │  - Smart Pins (right edge)   │
│  Σ   │  - Click pin → Drawer opens  │
│      │                              │
│      │  OR                          │
│      │                              │
│      │  Ledger View (toggle)        │
│      │  - Vulnerabilities (left)    │
│      │  - Questions (right)         │
│      │  - Click to filter           │
└──────┴──────────────────────────────┘
```

---

## Design System

### Colors
```css
Background:     #0B0C0E (primary)
                #1A1D23 (secondary)
                #2E333B (tertiary/borders)

Accent:         #C9A961 (gold - use sparingly)

Severity:       #DC2626 (critical - red)
                #EAB308 (concern - yellow)
                #3B82F6 (watch - blue)

Text:           #FFFFFF (primary)
                #9CA3AF (secondary)
                #6B7280 (tertiary)
```

### Typography
- **Inter**: Human UI text (buttons, labels, headings, questions)
- **JetBrains Mono**: Machine/AI data (timer, findings, slide numbers, descriptions)

### Spacing
- 8px grid: 4, 8, 12, 16, 24, 32, 48, 64
- Border radius: 6px (buttons), 8px (cards)

---

## File Structure

```
Bias VC 3/
├── docs/
│   ├── design-system.md
│   ├── architecture.md
│   ├── component-behavior.md
│   ├── api-integration.md
│   └── development-phases.md
│
├── frontend/
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
│   │   │   └── LoadingScreen.tsx
│   │   ├── hooks/
│   │   │   ├── useAnalysis.ts
│   │   │   ├── useTimer.ts
│   │   │   └── useKeyboardShortcuts.ts
│   │   ├── store/
│   │   │   └── useAppStore.ts
│   │   ├── api/
│   │   │   └── analysis.ts
│   │   ├── data/
│   │   │   └── mockAnalysis.ts
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   └── exportReport.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── src/
    │   └── index.ts
    ├── .env
    ├── tsconfig.json
    └── package.json
```

---

## Mock Data Summary

### Findings (7 total)
- **Slide 3**: Metric Discrepancy (CRITICAL), Vague Differentiation (CONCERN), Unsubstantiated Projection (WATCH)
- **Slide 5**: Team Experience Gap (CONCERN)
- **Slide 7**: Customer Validation Insufficient (WATCH)
- **Slide 9**: Technical Feasibility Unclear (CRITICAL)
- **Slide 11**: Unit Economics Missing (CONCERN)

### Cognitive Biases Identified
- Anchoring Bias
- Confirmation Bias
- Optimism Bias
- Halo Effect
- Survivorship Bias
- Recency Bias

### Questions (13 total)
- TEAM (1)
- MARKET (4)
- PRODUCT (1)
- TRACTION (4)
- FINANCIAL (3)

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close finding drawer |
| `L` | Toggle between PDF ↔ Ledger view |
| `Cmd/Ctrl + E` | Export report as markdown |

---

## Running the Application

### Frontend (Development)
```bash
cd frontend
npm run dev
# → http://localhost:5174/
```

### Backend (Development)
```bash
cd backend
npm run dev
# → http://localhost:3001/
```

### Environment Variables

**Frontend (.env)**
```bash
VITE_API_URL=http://localhost:3001
```

**Backend (.env)**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
MAX_FILE_SIZE_MB=25
PORT=3001
FRONTEND_URL=http://localhost:5174
```

---

## Testing Checklist

- [x] Upload PDF with all 4 funding stages
- [x] File validation (size, type errors)
- [x] Loading animation (3 stages, progress bar)
- [x] PDF viewer renders correctly
- [x] Navigate between slides (1-12)
- [x] Smart Pins appear at correct positions
- [x] Click pin → Drawer opens with finding details
- [x] Click different pin → Drawer switches content
- [x] Click backdrop → Drawer closes
- [x] Esc key → Drawer closes
- [x] Σ button → Toggle to Ledger view
- [x] Sidebar expands to 240px
- [x] Σ button gets gold border
- [x] Click vulnerability → Gold border appears
- [x] Questions filter correctly
- [x] Elevated questions have gold borders
- [x] Copy All Questions → Clipboard works
- [x] L key → Toggle views
- [x] Export Report button → Download .md file
- [x] Cmd+E → Export shortcut works
- [x] New Analysis → Confirmation → Reset
- [x] Timer counts up correctly

---

## Next Steps (Future Enhancements)

### Backend Integration (Phase 2.5)
- [ ] Implement PDF to image conversion
- [ ] Integrate Claude Vision API
- [ ] Parse structured JSON response
- [ ] Handle API errors gracefully
- [ ] Add rate limiting

### Additional Features
- [ ] PDF export (convert markdown to PDF)
- [ ] Save analysis sessions (localStorage)
- [ ] Comparison mode (compare multiple analyses)
- [ ] Custom bias definitions (tooltip explanations)
- [ ] Dark/light mode toggle
- [ ] Mobile responsive design
- [ ] User authentication
- [ ] Analysis history dashboard

### Performance Optimization
- [ ] PDF lazy loading (render only viewport)
- [ ] Virtual scrolling for long question lists
- [ ] Service worker for offline support
- [ ] Image optimization for findings

---

## Deployment Guide

### Frontend (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Set root directory: `frontend/`
4. Add environment variable: `VITE_API_URL` (backend URL)
5. Deploy

### Backend (Railway)
1. Create new project on Railway
2. Connect GitHub repo
3. Set root directory: `backend/`
4. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `FRONTEND_URL` (Vercel URL)
   - `PORT=3001`
5. Deploy

---

## Credits

**Built with:**
- React 18 + TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- react-pdf
- Anthropic Claude API

**Design Inspiration:**
- Linear
- Bloomberg Terminal
- Institutional VC tools

---

**Project Status:** ✅ COMPLETE

Ready for demo, user testing, and backend integration! 🚀
