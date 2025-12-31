# Design System

## Typography

### Font Families
- **Inter**: Human-facing UI text (buttons, labels, headings, navigation)
  - Weights: 400 (Regular), 500 (Medium), 600 (Semibold)
- **JetBrains Mono**: Machine-generated/system data (AI analysis, findings, timer)
  - Weights: 400 (Regular), 500 (Medium)

### Font Sizes
```css
--text-xs: 11px;   /* Small labels, badges */
--text-sm: 12px;   /* Secondary text, captions */
--text-base: 14px; /* Body text, buttons */
--text-lg: 16px;   /* Card titles, section headers */
--text-xl: 18px;   /* Finding titles */
--text-2xl: 24px;  /* Page headings (rare) */
```

---

## Color Palette

```css
/* Background & Surfaces */
--bg-primary: #0B0C0E;        /* Main background */
--bg-secondary: #1A1D23;      /* Card/panel surfaces */
--bg-tertiary: #2E333B;       /* Borders, dividers */

/* Accent Colors */
--accent-gold: #C9A961;        /* Selection, hover - USE SPARINGLY */

/* Severity Colors */
--critical: #DC2626;          /* Red - Critical findings */
--concern: #EAB308;           /* Yellow - Concerns */
--watch: #3B82F6;             /* Blue - Watch items */

/* Text */
--text-primary: #FFFFFF;      /* Primary text */
--text-secondary: #9CA3AF;    /* Secondary text, muted labels */
--text-tertiary: #6B7280;     /* Tertiary text, disabled states */
```

### Tailwind Config
Add to `tailwind.config.js`:
```js
colors: {
  bg: {
    primary: '#0B0C0E',
    secondary: '#1A1D23',
    tertiary: '#2E333B',
  },
  accent: {
    gold: '#C9A961',
  },
  severity: {
    critical: '#DC2626',
    concern: '#EAB308',
    watch: '#3B82F6',
  }
}
```

---

## Spacing System

8px grid:
```css
4px  → space-1  (rare, tight gaps)
8px  → space-2  (default gaps)
12px → space-3  (compact padding)
16px → space-4  (standard padding)
24px → space-6  (section spacing)
32px → space-8  (large spacing)
48px → space-12 (nav bar height)
64px → space-16 (hero spacing)
```

---

## Border Radius

```css
--radius-sm: 4px;  /* Small chips, badges */
--radius-md: 6px;  /* Buttons, inputs */
--radius-lg: 8px;  /* Cards, panels */
--radius-xl: 12px; /* Large containers */
--radius-full: 50%; /* Smart Pins (circles) */
```

---

## Component Specifications

### Buttons

**Primary (Analyze Deck)**
- Height: `48px`
- Padding: `16px 32px`
- Border: `1px solid var(--bg-tertiary)`
- Border radius: `6px`
- Font: Inter Medium 14px
- Hover: Border → `var(--text-secondary)`
- Disabled: Opacity 50%

**Secondary (New Analysis, Export)**
- Height: `32px`
- Padding: `8px 16px`
- Border: `1px solid var(--bg-tertiary)`
- Icon + text with 8px gap
- Font: Inter Regular 14px

**Icon Button (Close, Toggle)**
- Size: `32px × 32px`
- Icon: 16px Lucide icon
- Hover: Background `var(--bg-secondary)`

---

### Funding Stage Selector (Tabs)

- Segmented control: 4 options (Pre-Seed, Seed, Series A, Series B+)
- Individual segment: Height `40px`, Padding `12px 24px`
- Selected: Background `var(--bg-secondary)`
- Unselected: Transparent
- Font: Inter Regular 14px
- Border radius: `6px` (outer corners only)

---

### Upload Zone

- Dashed border: `2px dashed var(--bg-tertiary)`
- Border radius: `8px`
- Min height: `320px`
- Icon: Document (Lucide) 48px, color `var(--text-tertiary)`
- Text: Inter Regular 14px, color `var(--text-secondary)`
- Hover: Border → `var(--text-secondary)`, subtle background highlight

---

### Smart Pins

- Circle: `32px` diameter
- Border: `2px solid` severity color
- Background: Severity color at 20% opacity
- Number: JetBrains Mono Medium 14px, white
- Position: Absolute on right edge of PDF
- Y-position: From API (0-100%)

**States:**
- Default: Severity border + opacity background
- Hover: Scale 1.1, border brightens
- Active (drawer open): Gold border

---

### Top Navigation Bar

- Height: `48px`
- Background: `var(--bg-primary)`
- Border bottom: `1px solid var(--bg-tertiary)`
- Layout: Flexbox, justify-between
- Logo: "PitchGuard // Analysis" - Inter Medium 14px
- Buttons: Right-aligned, 8px gap

**Timer:**
- Format: "MM:SS" (e.g., "02:34")
- Font: JetBrains Mono Regular 14px
- Icon: Clock (Lucide) 16px
- Color: `var(--text-secondary)`

---

### Left Sidebar

**PDF View:**
- Width: `60px`
- Background: `var(--bg-primary)`
- Border right: `1px solid var(--bg-tertiary)`

**Ledger View:**
- Width: `240px`

**Σ Button (FULL):**
- Size: `48px × 48px`
- Border: `1px solid var(--bg-tertiary)`
- Active (Ledger): Border → `var(--accent-gold)` 2px
- Icon: Sigma (Lucide) 20px
- Text: "FULL" below icon, 10px

**Slide Numbers:**
- Size: `32px × 32px`
- Font: JetBrains Mono Regular 12px
- Spacing: 4px gap
- Clickable, hover background

---

### Finding Drawer (Sheet)

- Width: `420px`
- Slides from right (framer-motion)
- Background: `var(--bg-secondary)`
- Padding: `24px`
- Close button: Top right, 32px square

**Content Structure:**
- Category badge: Gold text, JetBrains Mono 11px, uppercase
- Title: Inter Semibold 18px
- Description: JetBrains Mono Regular 14px, line-height 1.6
- Bias tag: Chip, Inter Regular 12px
- Questions: Bulleted list, JetBrains Mono 14px

---

### Insights Ledger

**Left Column (40% width): Thesis Vulnerabilities**
- Vulnerability card:
  - Padding: `16px`
  - Border: `1px solid var(--bg-tertiary)`
  - Border radius: `8px`
  - Hover: Border → `var(--text-secondary)`
  - Selected: Border → `var(--accent-gold)` 2px
  - Number: "01." JetBrains Mono Medium 14px
  - Title: Inter Medium 16px
  - Signal: Inter Italic 13px, `var(--text-tertiary)`
  - Category tag: Top right, 11px

**Right Column (60% width): Questions**
- Section header: "TEAM (1)" - JetBrains Mono Medium 12px
- Question card:
  - Padding: `16px`
  - Background: `var(--bg-secondary)`
  - Border: `1px solid var(--bg-tertiary)`
  - Border radius: `8px`
  - Question ID: "Q04" - JetBrains Mono 11px
  - Text: Inter Regular 14px
  - Elevated (related to vulnerability): Border → `var(--accent-gold)`

**Copy All Questions Button:**
- Top right of column
- Icon: Copy (Lucide) 16px
- Text: Inter Regular 14px

---

### Loading States (Skeleton)

- Background: `var(--bg-secondary)`
- Shimmer animation: Gradient from left to right
- Border radius: Match component (6px or 8px)
- Height: Match target component

**Progress Text:**
- Font: JetBrains Mono Regular 14px
- Color: `var(--text-secondary)`
- Stages: "Analyzing deck..." → "Processing slides..." → "Generating insights..."

---

### Tooltips

- Background: `var(--bg-secondary)`
- Border: `1px solid var(--bg-tertiary)`
- Padding: `8px 12px`
- Font: Inter Regular 12px
- Max width: `280px`
- Border radius: `6px`
- Arrow: 8px triangle

**Use for:**
- Bias tag definitions (e.g., "Anchoring Bias: Over-reliance on first piece of information")
- Button explanations
- Truncated text

---

### Toast Notifications (Sonner)

- Position: Bottom right
- Background: `var(--bg-secondary)`
- Border: `1px solid var(--bg-tertiary)`
- Padding: `12px 16px`
- Font: Inter Regular 14px
- Icon: 16px Lucide (checkmark, error, info)
- Duration: 3 seconds
- Border radius: `8px`

---

## Animation Guidelines

### Framer Motion Transitions

**Drawer slide-in:**
```js
initial={{ x: 420 }}
animate={{ x: 0 }}
exit={{ x: 420 }}
transition={{ type: "spring", damping: 30, stiffness: 300 }}
```

**Smart Pin hover:**
```js
whileHover={{ scale: 1.1 }}
transition={{ duration: 0.2 }}
```

**Page transitions:**
```js
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
```

**Loading skeleton shimmer:**
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## Accessibility

- **Focus states**: 2px gold outline on keyboard focus
- **ARIA labels**: All interactive elements
- **Color contrast**: WCAG AA minimum (4.5:1 for text)
- **Keyboard navigation**: Tab order matches visual hierarchy
- **Screen reader**: Announce state changes (drawer open, analysis complete)

---

## Responsive Breakpoints (Desktop-first)

- **Minimum**: 1280px (target)
- **Optimal**: 1440px - 1920px
- **Maximum**: No upper limit (scales gracefully)

Mobile optimization is out of scope for MVP.
