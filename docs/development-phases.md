# Development Phases

## Phase 1: Project Setup & Entry Screen

### 1.1 Initialize Projects

**Frontend:**
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Dependencies:**
```bash
npm install zustand @tanstack/react-query react-dropzone lucide-react framer-motion sonner
npm install -D @types/react @types/react-dom
```

**shadcn/ui:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add sheet tabs tooltip toast skeleton scroll-area
```

**Backend:**
```bash
mkdir backend
cd backend
npm init -y
npm install express cors multer dotenv @anthropic-ai/sdk pdf-parse pdfjs-dist canvas
npm install -D typescript @types/express @types/cors @types/multer ts-node nodemon
npx tsc --init
```

**Checklist:**
- [ ] Frontend Vite project initialized
- [ ] Backend Express project initialized
- [ ] Tailwind CSS configured with design tokens
- [ ] shadcn/ui components installed
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] .gitignore includes .env files

---

### 1.2 Design System Setup

**globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg-primary: #0B0C0E;
    --bg-secondary: #1A1D23;
    --bg-tertiary: #2E333B;
    --accent-gold: #C9A961;
    --critical: #DC2626;
    --concern: #EAB308;
    --watch: #3B82F6;
    --text-primary: #FFFFFF;
    --text-secondary: #9CA3AF;
    --text-tertiary: #6B7280;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  .font-mono {
    font-family: 'JetBrains Mono', monospace;
  }
}
```

**Checklist:**
- [ ] CSS variables defined
- [ ] Inter font imported (Google Fonts or local)
- [ ] JetBrains Mono font imported
- [ ] Tailwind config extended with custom colors
- [ ] 8px spacing scale configured

---

### 1.3 Zustand Store

**Checklist:**
- [ ] `useAppStore.ts` created with full state interface
- [ ] All actions implemented (setView, selectFinding, etc.)
- [ ] resetSession clears all state properly

---

### 1.4 Entry Screen Components

**StageSelector:**
- [ ] Uses shadcn Tabs component
- [ ] Four options render correctly
- [ ] Selection updates Zustand store
- [ ] Visual matches Figma (selected state)

**UploadZone:**
- [ ] react-dropzone configured (PDF only, 25MB max)
- [ ] Drag-and-drop works
- [ ] Click to browse works
- [ ] File validation (type + size)
- [ ] Error toasts display (sonner)
- [ ] Selected file shows name + size
- [ ] Updates Zustand store

**EntryScreen:**
- [ ] Layout matches Figma
- [ ] Logo centered at top
- [ ] Stage selector below logo
- [ ] Upload zone below stage selector
- [ ] Analyze button at bottom
- [ ] Button disabled when stage OR file missing
- [ ] Privacy text at bottom (JetBrains Mono)

---

## Phase 2: Backend API & Mock Data

### 2.1 Backend Structure

**Checklist:**
- [ ] Express server setup (`index.ts`)
- [ ] CORS configured for frontend URL
- [ ] Multer file upload middleware
- [ ] Error handling middleware
- [ ] Environment variables loaded (.env)
- [ ] Health check endpoint (`GET /health`)

---

### 2.2 PDF Processing

**Checklist:**
- [ ] `pdfProcessor.ts` created
- [ ] PDF to images conversion works
- [ ] Images returned as base64 strings
- [ ] Page count extracted correctly
- [ ] Handle corrupted PDFs gracefully

---

### 2.3 Claude Vision Integration

**Checklist:**
- [ ] `claudeAPI.ts` created
- [ ] Anthropic client initialized with API key
- [ ] System prompt matches template from api-integration.md
- [ ] Images sent to Claude in correct format
- [ ] Response parsed (handle markdown code blocks)
- [ ] JSON validation (matches TypeScript interfaces)
- [ ] Error handling (rate limits, invalid responses)

---

### 2.4 API Route

**Checklist:**
- [ ] `POST /api/analyze` route created
- [ ] File validation (size, type)
- [ ] Stage validation
- [ ] PDF → Images → Claude → Response pipeline
- [ ] Question groups generated correctly
- [ ] Response matches AnalysisResponse interface
- [ ] Error responses include helpful messages

---

### 2.5 Mock Data (Development Fallback)

**Checklist:**
- [ ] `mockAnalysis.ts` created with realistic data
- [ ] 10+ findings across all categories
- [ ] 5-8 thesis vulnerabilities
- [ ] Question groups for all 5 categories
- [ ] Metadata includes stage, slideCount, timestamp
- [ ] Use mock data when backend unavailable (dev mode)

---

## Phase 3: Analysis Workspace Layout

### 3.1 React Query Setup

**Checklist:**
- [ ] QueryClient configured
- [ ] `api/analysis.ts` created
- [ ] `analyzeDocument` function implemented
- [ ] `useAnalysis` hook created
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Success triggers view transition

---

### 3.2 Loading Screen

**Checklist:**
- [ ] Progress indicator component created
- [ ] Three stages display sequentially
- [ ] Skeleton shimmer animation
- [ ] JetBrains Mono font used
- [ ] Framer Motion transitions

---

### 3.3 Top Navigation

**Checklist:**
- [ ] TopNav component created
- [ ] Logo text displays correctly
- [ ] New Analysis button (with confirmation dialog)
- [ ] Timer component counts up from 00:00
- [ ] Export Report button (placeholder for Phase 6)
- [ ] Layout matches Figma (48px height)

---

### 3.4 Left Sidebar

**Checklist:**
- [ ] LeftSidebar component created
- [ ] Σ button renders (FULL text below icon)
- [ ] Slide numbers list (1-N from metadata.slideCount)
- [ ] Click slide number → scroll to page (Phase 4)
- [ ] Width toggles: 60px (PDF) / 240px (Ledger)
- [ ] Σ button gold border when Ledger active

---

### 3.5 Workspace Layout

**Checklist:**
- [ ] AnalysisWorkspace component created
- [ ] Three-zone layout (TopNav + Sidebar + Main)
- [ ] Conditional render: PDF view OR Ledger view
- [ ] Σ button toggles between views
- [ ] Layout responsive (min 1280px)

---

## Phase 4: PDF View & Smart Pins

### 4.1 PDF Viewer

**Checklist:**
- [ ] react-pdf integrated
- [ ] PDF renders from uploaded file
- [ ] Lazy loading pages (viewport only)
- [ ] Scroll to page function works
- [ ] Current page tracked in Zustand

---

### 4.2 Smart Pins

**Checklist:**
- [ ] SmartPin component created
- [ ] Positioned absolutely at Y% from API
- [ ] Severity colors applied (border + background)
- [ ] Number displays in JetBrains Mono
- [ ] Hover animation (scale 1.1)
- [ ] Click opens Finding Drawer
- [ ] Gold border when active (drawer open)

---

### 4.3 Finding Drawer (Sheet)

**Checklist:**
- [ ] FindingDrawer component created
- [ ] Uses shadcn Sheet component
- [ ] Slides in from right (420px)
- [ ] Close button (X) works
- [ ] Backdrop click closes drawer
- [ ] Only ONE drawer open at a time
- [ ] Content structure matches design:
  - [ ] Category badge (gold text)
  - [ ] Title (Inter Semibold 18px)
  - [ ] Description (JetBrains Mono)
  - [ ] Bias tag chip
  - [ ] Strategic questions list
  - [ ] Elevated questions highlighted
  - [ ] Logic evidence (collapsible)

---

## Phase 5: Insights Ledger

### 5.1 Ledger Layout

**Checklist:**
- [ ] InsightsLedger component created
- [ ] Two-column layout (40% / 60%)
- [ ] Header: "INSIGHTS LEDGER" + "Summary of Scrutiny"
- [ ] Scrollable areas (shadcn ScrollArea)

---

### 5.2 Vulnerability Cards

**Checklist:**
- [ ] VulnerabilityCard component created
- [ ] Numbered prefix (01, 02...)
- [ ] Title, signal, category tag
- [ ] Click selects card (gold border)
- [ ] Only one selected at a time
- [ ] Updates Zustand selectedVulnerability

---

### 5.3 Question Cards

**Checklist:**
- [ ] QuestionCard component created
- [ ] Grouped by category
- [ ] Section headers with count
- [ ] Question ID (Q01, Q02...)
- [ ] Question text (Inter Regular 14px)
- [ ] Filtering logic:
  - [ ] No selection → Show all
  - [ ] Vulnerability selected → Show related only
  - [ ] Elevated questions → Gold border

---

### 5.4 Copy All Questions

**Checklist:**
- [ ] Copy button in top right of column
- [ ] Click collects all visible questions
- [ ] Format as numbered list
- [ ] Copy to clipboard
- [ ] Toast notification on success

---

## Phase 6: Export Report

### 6.1 Markdown Generation

**Checklist:**
- [ ] Generate markdown from analysisData
- [ ] Structure:
  - [ ] Header (stage, date, slide count)
  - [ ] Executive Summary (vulnerabilities)
  - [ ] Findings (grouped by slide)
  - [ ] Strategic Questions (grouped by category)
- [ ] Download as .md file
- [ ] Toast notification on success

---

### 6.2 PDF Export (Optional)

**Checklist:**
- [ ] Install jsPDF or similar
- [ ] Convert markdown to PDF
- [ ] Preserve formatting
- [ ] Download as .pdf file

---

## Phase 7: Polish & Production

### 7.1 Animations

**Checklist:**
- [ ] Drawer slide-in (framer-motion)
- [ ] Page transitions (entry → analysis)
- [ ] Smart Pin hover effects
- [ ] Loading skeleton shimmer
- [ ] Toast enter/exit animations

---

### 7.2 Error Handling

**Checklist:**
- [ ] All API errors show user-friendly messages
- [ ] File upload errors display toasts
- [ ] Network failures handled gracefully
- [ ] Timeout logic (30s max)
- [ ] Error boundaries around main components

---

### 7.3 Accessibility

**Checklist:**
- [ ] Focus states on all interactive elements (gold outline)
- [ ] ARIA labels for icons/buttons
- [ ] Keyboard shortcuts work (Esc, arrows, etc.)
- [ ] Screen reader announcements
- [ ] Color contrast meets WCAG AA
- [ ] Tab order logical

---

### 7.4 Testing

**Checklist:**
- [ ] Upload validation edge cases
- [ ] API error scenarios
- [ ] Large PDF (20+ pages)
- [ ] Small PDF (1 page)
- [ ] Drawer interactions
- [ ] Vulnerability filtering
- [ ] Timer functionality
- [ ] Copy to clipboard
- [ ] New Analysis reset

---

### 7.5 Deployment

**Frontend (Vercel):**
- [ ] Connect GitHub repo
- [ ] Configure build settings (root: frontend/)
- [ ] Add VITE_API_URL environment variable
- [ ] Deploy from main branch
- [ ] Verify deployment

**Backend (Railway):**
- [ ] Create new project
- [ ] Connect GitHub repo (backend/)
- [ ] Add environment variables (ANTHROPIC_API_KEY, etc.)
- [ ] Deploy
- [ ] Update frontend VITE_API_URL with Railway URL
- [ ] Update backend FRONTEND_URL with Vercel URL
- [ ] Test end-to-end

---

## Progress Tracking

Use this checklist to track implementation progress. Mark items as complete when:
- Code is written
- Functionality tested
- Visual matches Figma
- No console errors
- Passes accessibility checks
