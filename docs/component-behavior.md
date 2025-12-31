# Component Behavior

## Entry Screen

### Stage Selector (Tabs)
- **Single selection required**
- **Options**: Pre-Seed, Seed, Series A, Series B+
- **Default**: None selected (force user choice)
- **State**: Updates `useAppStore.selectedStage`
- **Visual**: Selected tab has `bg-secondary` background

### Upload Zone (react-dropzone)
- **Accept**: PDF files only (`application/pdf`)
- **Max size**: 25MB
- **Validation**:
  - File type: Check MIME type AND extension
  - File size: Show error if >25MB
  - Error display: Toast notification (sonner)
- **States**:
  - Empty: Dashed border, icon, "Drop PDF or click to browse"
  - Hover (drag): Border color changes to `text-secondary`
  - File selected: Show filename + size, green checkmark icon
- **Actions**:
  - Updates `useAppStore.uploadedFile`
  - Enables "Analyze Deck" button when stage + file present

### Analyze Deck Button
- **Disabled when**: No stage OR no file
- **Click behavior**:
  1. Trigger React Query mutation (`useAnalysis`)
  2. Show loading screen
  3. Upload file to backend
  4. On success: Transition to Analysis Workspace
  5. On error: Show toast with error message

---

## Loading Screen

### Progress Indicator
- **Stages** (show sequentially):
  1. "Analyzing deck..." (0-33%)
  2. "Processing slides..." (33-66%)
  3. "Generating insights..." (66-100%)
- **Duration**: 5-10 seconds (actual backend response time)
- **Visual**: Skeleton shimmer + JetBrains Mono text
- **Animation**: Framer Motion fade transitions between stages

---

## Analysis Workspace

### Top Navigation Bar

**Logo Section (Left)**
- Text: "PitchGuard // Analysis"
- Font: Inter Medium 14px
- Not clickable (cosmetic only)

**Actions Section (Right)**
- **New Analysis Button**:
  - Shows confirmation dialog: "Start new analysis? Current session will be lost."
  - On confirm: Call `useAppStore.resetSession()` → Return to Entry Screen
- **Timer Display**:
  - Format: "MM:SS" (e.g., "02:34")
  - Counts up from 00:00
  - Starts when analysis loads (via `useAppStore.startSession()`)
  - Uses `useTimer` hook (updates every second)
- **Export Report Button**:
  - Click: Generate markdown/PDF with all findings + questions
  - Toast on success: "Report copied to clipboard"

---

### Left Sidebar

**PDF View (60px width)**
- **Σ Button**:
  - Click toggles to Ledger view
  - Visual: Gold border when Ledger active
- **Slide Numbers**:
  - Displayed as vertical list (1, 2, 3, ...)
  - Click: Scroll PDF viewer to that page
  - Current slide highlighted (bg-secondary)

**Ledger View (240px width)**
- Same Σ button (now with gold border)
- No slide numbers visible

---

### PDF Viewer

**Rendering**
- Uses `react-pdf` library
- Initial load: Page 1
- Lazy load pages (viewport only for performance)
- Scroll behavior: Smooth, debounced navigation

**Smart Pins**
- **Position**: Absolute, right edge at Y% from API
- **Visual**: 32px circle, severity-colored border + 20% opacity background
- **Number**: JetBrains Mono Medium 14px
- **Click behavior**:
  1. If drawer closed: Open drawer with finding details
  2. If drawer open for different pin: Close current, open new
  3. If drawer open for same pin: Close drawer
- **States**:
  - Default: Severity color
  - Hover: Scale 1.1, brighter border
  - Active (drawer open): Gold border

---

### Finding Drawer (Sheet)

**Trigger**: Click Smart Pin

**Animation**: Slide in from right (420px width)

**Content Structure**:
1. **Header**:
   - Category badge (top): Gold text, uppercase, JetBrains Mono 11px
   - Title: Inter Semibold 18px
   - Close button (X): Top right corner
2. **Body**:
   - Description: JetBrains Mono Regular 14px, line-height 1.6
   - Bias tag: Chip with dark background, Inter Regular 12px
   - Strategic questions section:
     - Header: "Strategic Questions"
     - Bulleted list, JetBrains Mono 14px
     - Elevated questions highlighted with gold accent
3. **Footer** (optional):
   - Logic evidence: Collapsible section
   - Signals list + confidence score

**Close Behavior**:
- X button click
- Backdrop click
- Click different Smart Pin (closes + opens new)
- Updates `useAppStore.isDrawerOpen` to `false`

---

### Insights Ledger

**Toggle**: Click Σ button in sidebar

**Layout**: Two-column (40% left / 60% right)

### Left Column: Thesis Vulnerabilities

**Display**:
- Numbered list (01, 02, 03...)
- Card design: Border, padding 16px, border-radius 8px

**Card Content**:
- Number prefix: JetBrains Mono Medium 14px
- Title: Inter Medium 16px
- Signal: Inter Italic 13px, color `text-tertiary`, prefix "Signal:"
- Category tag: Top right, 11px, color `text-tertiary`

**Interaction**:
- Click card:
  1. Add gold border (2px)
  2. Update `useAppStore.selectedVulnerability` with ID
  3. Filter questions in right column to show only related ones
- **Only ONE selected at a time**
- Click again to deselect (remove filter)

### Right Column: The Interrogation

**Structure**:
- Grouped by category (Team, Market, Product, Traction, Financial)
- Section headers: "TEAM (1)" - JetBrains Mono Medium 12px
  - Number = count of questions in category

**Question Cards**:
- Background: `bg-secondary`
- Padding: 16px
- Border: 1px solid `bg-tertiary`
- Question ID: "Q04" - JetBrains Mono 11px, top left
- Text: Inter Regular 14px

**Filtering Logic**:
- **No vulnerability selected**: Show ALL questions
- **Vulnerability selected**: Show only questions where `question.relatedVulnerabilities` includes selected ID
- **Elevated questions** (related to selected vulnerability): Gold border

**Copy All Questions Button**:
- Position: Top right of column
- Icon: Copy (Lucide) 16px
- Click behavior:
  1. Collect all visible question texts
  2. Format as numbered list
  3. Copy to clipboard
  4. Show toast: "Questions copied to clipboard"

---

## State Synchronization

### Entry → Analysis Transition
```typescript
// When "Analyze Deck" clicked
1. useAnalysis.mutate({ file, stage })
2. On success:
   - setAnalysisData(response.data)
   - setView('analysis')
   - startSession() // Start timer
   - analysisSubView defaults to 'pdf'
```

### PDF ↔ Ledger Toggle
```typescript
// When Σ button clicked
if (analysisSubView === 'pdf') {
  setAnalysisSubView('ledger')
} else {
  setAnalysisSubView('pdf')
}
// Close drawer if open
closeDrawer()
```

### Smart Pin Click
```typescript
// When Smart Pin clicked
1. Find finding by ID
2. If drawer open for different finding:
   - Close current
3. selectFinding(finding)
4. openDrawer()
```

### Vulnerability Selection
```typescript
// When vulnerability card clicked
1. If already selected:
   - selectVulnerability(null) // Deselect
2. Else:
   - selectVulnerability(id)
3. Questions auto-filter via computed selector
```

---

## Error Handling

### File Upload Errors
- **File too large**: Toast "File exceeds 25MB limit"
- **Invalid file type**: Toast "Only PDF files are supported"
- **No file selected**: Disable button, no error

### API Errors
- **Network failure**: Toast "Connection failed. Please try again."
- **Timeout**: Toast "Analysis is taking longer than expected. Please retry."
- **Server error**: Toast "Analysis failed. Please try a different deck."
- **Invalid PDF**: Toast "Unable to process PDF. File may be corrupted."

### Loading Timeout
- If analysis takes >30 seconds: Show option to retry or cancel

---

## Keyboard Shortcuts

- **Escape**: Close drawer (if open)
- **Arrow Up/Down**: Navigate slides (when PDF viewer focused)
- **1-9**: Jump to slide number (when sidebar focused)
- **C**: Copy all questions (when Ledger view active)
- **N**: New analysis (with confirmation)
- **E**: Export report

---

## Accessibility

### Focus Management
- **Drawer opens**: Focus on close button
- **Drawer closes**: Return focus to Smart Pin that opened it
- **Vulnerability selected**: Scroll to first related question

### Screen Reader Announcements
- "Analysis complete. 12 findings identified."
- "Drawer opened. Showing finding: Metric Discrepancy"
- "Vulnerability selected. Showing 3 related questions."
- "Questions copied to clipboard"

### Keyboard Navigation
- Tab order: Top nav → Sidebar → Main content → Drawer
- All interactive elements reachable via Tab
- Smart Pins focusable and activatable with Enter/Space
