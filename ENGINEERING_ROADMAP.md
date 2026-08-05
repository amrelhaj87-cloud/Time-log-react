# خطة هندسية شاملة: Time Log React Migration
## من Phase 2 إلى الانتهاء

---

## 📋 نظرة عامة على البنية

### معمارية التطبيق الكلية
```
App (ThemeProvider + LanguageProvider)
  ├─ Header (date picker, clock, mini ring)
  ├─ Dashboard (when not compact)
  │  ├─ WeekNavigator
  │  └─ TagRings (6 tag distribution rings)
  ├─ HoursSection
  │  ├─ TimerBar (or button)
  │  └─ HoursList (24 hours grid)
  ├─ PrioritiesSection
  │  ├─ GoldenGoal
  │  └─ PriorityList
  ├─ Footer (with save status)
  └─ Modals (via portals)
     ├─ TimerModal
     ├─ StatsModal (week/month + distribution)
     ├─ ExportModal
     ├─ AuthModal (Google + Email/Password)
     ├─ SettingsModal (age, dev tools, contact, guide)
     └─ PWAInstallModal

Data Flow:
App (main state) → useAppData hook
  ├─ currentDate, selectedWeek
  ├─ dayData (all days)
  ├─ user, isAuthed
  ├─ settings (lang, darkMode, birthDate, ...)
  └─ saveStatus
```

---

## 📊 State Management Strategy

### 1. **Local State (React State / Zustand Hook)**

#### `useAppData` hook (to be created in Phase 2)
```typescript
interface AppDataState {
  // Calendar
  currentDate: Date;
  selectedWeek: Date; // Monday of week
  
  // Hours data (keyed by ISO date)
  daysByDate: Record<string, DayData>;
  
  // Priorities (keyed by ISO date)
  prioritiesByDate: Record<string, DayPriority[]>;
  goldenGoalByDate: Record<string, string>;
  
  // Timer state
  timerRunning: boolean;
  timerStartTime: number | null;
  timerCurrentNote: string;
  timerSelectedHour: HourKey | null;
  
  // Modal states
  openModals: Set<string>; // "timer", "stats", "export", "auth", "settings", "pwa", "guide", "contact"
  statsModalTab: "week" | "month";
  
  // Settings (persisted to localStorage)
  settings: UserSettings;
  
  // Auth
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
  
  // Save status
  saveStatus: "idle" | "saving" | "saved" | "error";
}

// Actions
interface AppDataActions {
  setCurrentDate: (date: Date) => void;
  setSelectedWeek: (date: Date) => void;
  
  updateHour: (date: string, hourKey: HourKey, tag: TagCode, note: string) => void;
  deleteHour: (date: string, hourKey: HourKey) => void;
  
  addPriority: (date: string, text: string) => void;
  updatePriority: (date: string, id: string, text: string, done: boolean) => void;
  deletePriority: (date: string, id: string) => void;
  setGoldenGoal: (date: string, text: string) => void;
  
  startTimer: (hourKey: HourKey) => void;
  stopTimer: () => void;
  cancelTimer: () => void;
  updateTimerNote: (note: string) => void;
  saveTimerToHour: () => void;
  
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  setStatsTab: (tab: "week" | "month") => void;
  
  rolloverTomorrow: () => void;
  
  saveSettings: (settings: Partial<UserSettings>) => void;
  setUser: (user: AppUser | null) => void;
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
}
```

### 2. **localStorage Schema**

```javascript
// Persisted daily data (indexed by ISO date: "2026-08-05")
localStorage.setItem("day:2026-08-05", JSON.stringify({
  hours: {
    "5am": { tag: "E", note: "عمل على المشروع" },
    "6am": { tag: "", note: "" },
    ...
  },
  priorities: [
    { id: "p1", text: "اكمل الكود", done: false },
    { id: "p2", text: "اختبر التطبيق", done: true }
  ]
}));

// Settings
localStorage.setItem("settings", JSON.stringify({
  lang: "ar",
  isDarkMode: false,
  isCompact: true,
  userBirthDate: "1990-05-15",
  ageDisplayOpt: "days",
  isDevToolsEnabled: false,
  isCalSyncEnabled: false
}));

// User auth state
localStorage.setItem("user", JSON.stringify({
  uid: "xyz",
  email: "user@example.com",
  displayName: "أحمد",
  photoURL: "..."
}));
```

### 3. **Firebase Firestore (Phase 5)**

```javascript
// Structure when user is authed
firestore:
  users/{uid}
    ├─ settings (document)
    ├─ days/{dateStr} (collection)
    │  ├─ hours (map)
    │  └─ priorities (array)
    └─ metadata (lastSync, version, ...)
```

---

## 🗂️ File Structure (Complete)

```
src/
├─ types/
│  ├─ index.ts                     (Phase 1) ✓
│  └─ hooks.ts                     (Phase 2) — AppDataState, Actions
│
├─ lib/
│  ├─ constants.ts                 (Phase 1) ✓
│  ├─ utils.ts                     (Phase 2) — date helpers, week calc
│  ├─ distribution.ts              (Phase 4) — calc distribution
│  ├─ formatters.ts                (Phase 2) — time, date formatting
│  └─ firebase.ts                  (Phase 5) — Firebase config, sync
│
├─ i18n/
│  └─ translations.ts              (Phase 1) ✓
│
├─ context/
│  ├─ LanguageContext.tsx          (Phase 1) ✓
│  ├─ ThemeContext.tsx             (Phase 1) ✓
│  └─ AppDataContext.tsx           (Phase 2) — custom hook wrapper around state
│
├─ hooks/
│  ├─ useLiveClock.ts              (Phase 1) ✓
│  ├─ useAppData.ts                (Phase 2) — main state hook with actions
│  ├─ useLocalStorage.ts           (Phase 2) — generic persist hook
│  ├─ useFirebaseSync.ts           (Phase 5) — Firestore sync
│  ├─ useDistribution.ts           (Phase 4) — calculate tag distribution
│  ├─ useWeekDays.ts               (Phase 2) — get all 7 days of week
│  ├─ useAgeCalculator.ts          (Phase 7) — calculate age in days/years
│  └─ useTimer.ts                  (Phase 3) — timer logic
│
├─ components/
│  ├─ Header.tsx                   (Phase 1) ✓
│  │
│  ├─ Dashboard/
│  │  ├─ Dashboard.tsx             (Phase 2) — container, conditional render
│  │  ├─ WeekNavigator.tsx         (Phase 2)
│  │  ├─ TagRings.tsx              (Phase 4)
│  │  └─ DayStrip.tsx              (Phase 2) — week strip in header
│  │
│  ├─ Hours/
│  │  ├─ HoursSection.tsx          (Phase 2)
│  │  ├─ HoursList.tsx             (Phase 2)
│  │  ├─ HourRow.tsx               (Phase 2) — single hour (tag, note)
│  │  ├─ TagPickerPopover.tsx      (Phase 2) — 7-tag picker UI
│  │  ├─ HourNoteInput.tsx         (Phase 2) — editable note with copy-next
│  │  └─ TimerBar.tsx              (Phase 3)
│  │
│  ├─ Priorities/
│  │  ├─ PrioritiesSection.tsx     (Phase 3)
│  │  ├─ GoldenGoal.tsx            (Phase 3)
│  │  └─ PriorityList.tsx          (Phase 3)
│  │
│  ├─ Modals/
│  │  ├─ ModalOverlay.tsx          (Phase 2) — reusable modal wrapper
│  │  ├─ TimerModal.tsx            (Phase 3)
│  │  ├─ StatsModal.tsx            (Phase 4) — week/month tabs + rings
│  │  ├─ ExportModal.tsx           (Phase 6)
│  │  ├─ AuthModal.tsx             (Phase 5)
│  │  ├─ SettingsModal.tsx         (Phase 7)
│  │  ├─ AgeModal.tsx              (Phase 7)
│  │  ├─ PWAInstallModal.tsx       (Phase 7)
│  │  ├─ GuideModal.tsx            (Phase 7)
│  │  └─ ContactModal.tsx          (Phase 7)
│  │
│  ├─ Charts/
│  │  ├─ DistributionRing.tsx      (Phase 4) — Recharts Pie variant
│  │  └─ StatCard.tsx              (Phase 4)
│  │
│  └─ Common/
│     ├─ Button.tsx                (Phase 2)
│     ├─ Input.tsx                 (Phase 2)
│     └─ Footer.tsx                (Phase 2) — save status + footer text
│
└─ App.tsx                          (Phase 1 shell, updated per phase)
```

---

## 🚀 Detailed Phase Breakdown

### **PHASE 2: Hours Grid + Tag Picker + Local State** (3-4 days)

#### Files to Create
1. `hooks/useAppData.ts` — Main state hook with persisted state
2. `hooks/useLocalStorage.ts` — Generic persist utility
3. `hooks/useWeekDays.ts` — Get week dates from a reference date
4. `lib/utils.ts` — Date helpers (ISO date string, week calc, etc.)
5. `lib/formatters.ts` — Format time/date for display
6. `context/AppDataContext.tsx` — Provider wrapper
7. `components/Hours/HoursList.tsx` — 24-hour grid container
8. `components/Hours/HourRow.tsx` — Single hour with tag + note + buttons
9. `components/Hours/TagPickerPopover.tsx` — 7-button tag picker UI
10. `components/Hours/HourNoteInput.tsx` — Textarea with copy-next button
11. `components/Hours/HoursSection.tsx` — Collapsible section wrapper
12. `components/Dashboard/Dashboard.tsx` — Conditional render when not compact
13. `components/Dashboard/DayStrip.tsx` — Week day buttons in header
14. `components/Dashboard/WeekNavigator.tsx` — Prev/Today/Next week buttons
15. `components/Common/ModalOverlay.tsx` — Reusable modal container
16. `components/Common/Button.tsx` — Styled button component
17. `components/Common/Input.tsx` — Styled input component
18. `components/Common/Footer.tsx` — Footer with save status

#### Components Hierarchy
```
App
  ├─ Header (new: week day strip when not compact)
  ├─ Dashboard (show when expanded)
  │  ├─ DayStrip (selected day highlight)
  │  ├─ WeekNavigator (← → Today buttons)
  │  └─ TagRings (placeholder)
  ├─ HoursSection
  │  ├─ TimerBar (placeholder button)
  │  └─ HoursList
  │     └─ HourRow × 24
  │        ├─ TagPickerPopover
  │        └─ HourNoteInput
  ├─ PrioritiesSection (placeholder)
  └─ Footer
```

#### Features to Complete
- ✅ 24-hour grid (read/update tags, notes)
- ✅ Tag picker popover (7 tags + unassigned)
- ✅ Copy-to-next-hour (note + tag)
- ✅ Drag-select on hours grid (optional, can defer)
- ✅ Date navigation (prev/next day + date picker)
- ✅ Week strip in dashboard
- ✅ Compact vs expanded view toggle (wireframe → functional)
- ✅ localStorage persistence (one day's data initially, full sync later)
- ✅ Save status indicator
- ✅ Hour collapsibility (collapse/expand all hours)

#### State Additions
```typescript
// useAppData hook initializes:
- daysByDate: { "2026-08-05": DayData, ... }
- currentDate: Date
- selectedWeek: Date (Monday of week)
- timerRunning: false
- settings: UserSettings (from localStorage)
- saveStatus: "idle"
- openModals: Set()
```

#### localStorage Flow
```
On app load:
  → Load all "day:*" entries (if many, lazy-load by week)
  → Load settings, user
  → Hydrate state

On any hour update:
  → Update memory state
  → Set saveStatus = "saving"
  → setTimeout 300ms, write to localStorage
  → Set saveStatus = "saved"
  → (Later in Phase 5: also sync to Firestore)
```

---

### **PHASE 3: Timer + Priorities + Modal Infrastructure** (2-3 days)

#### Files to Create
1. `hooks/useTimer.ts` — Timer logic (running, elapsed, stop/cancel)
2. `components/Hours/TimerBar.tsx` — Start/stop/cancel UI
3. `components/Modals/TimerModal.tsx` — Hour select + note input + save
4. `components/Priorities/PrioritiesSection.tsx` — Collapsible section
5. `components/Priorities/GoldenGoal.tsx` — Single-line input + warning check
6. `components/Priorities/PriorityList.tsx` — List of checkboxes + delete buttons
7. `components/Modals/ModalOverlay.tsx` — Already in Phase 2, but now fully used

#### Features to Complete
- ✅ Timer: start/stop/cancel/display elapsed
- ✅ Timer modal: pick hour, enter note, save to hour
- ✅ Priorities: add/edit/delete/check
- ✅ Golden goal: "The One Thing" (1 per day)
- ✅ Golden goal warning: can't navigate if not empty/done
- ✅ Modal portal + ESC to close + click-outside
- ✅ Modal animations (fade in/out)
- ✅ Rollover: move unchecked priorities to next day

#### State Additions
```typescript
// useAppData adds:
- timerRunning: boolean
- timerStartTime: number
- timerCurrentNote: string
- timerSelectedHour: HourKey | null
- prioritiesByDate: Record<string, DayPriority[]>
- goldenGoalByDate: Record<string, string>

// Actions:
- startTimer(hourKey)
- stopTimer()
- cancelTimer()
- updateTimerNote(text)
- saveTimerToHour()
- addPriority(date, text)
- updatePriority(id, text, done)
- deletePriority(id)
- setGoldenGoal(text)
- rolloverTomorrow()
```

---

### **PHASE 4: Stats + Distribution Rings (Recharts)** (2-3 days)

#### Files to Create
1. `lib/distribution.ts` — Calculate tag distribution for day/week/month
2. `hooks/useDistribution.ts` — useCallback-memoized distribution calc
3. `components/Modals/StatsModal.tsx` — Week/month tabs + distribution
4. `components/Charts/DistributionRing.tsx` — Recharts Pie Chart
5. `components/Charts/StatCard.tsx` — Stats row (E: 8h, V: 6h, etc.)
6. `components/Dashboard/TagRings.tsx` — 6 small rings (E, V, R, S, SC, SL)

#### Features to Complete
- ✅ Daily distribution ring (24h total)
- ✅ Weekly distribution (7 days × 6 tags = heatmap or aggregated)
- ✅ Monthly distribution (4 weeks)
- ✅ Tag totals (hours per tag per period)
- ✅ Percentage labels on rings
- ✅ Interactive charts (click to see details)
- ✅ Mini rings in dashboard (updated live)
- ✅ Mini ring in header (shown when expanded)

#### Distribution Logic
```typescript
// For a day: map HourKey → TagCode, count hours per tag
function calculateDayDistribution(dayData: DayData): Distribution {
  const dist = { E: 0, V: 0, R: 0, S: 0, SC: 0, SL: 0, unassigned: 0 };
  for (const hourKey in dayData.hours) {
    const tag = dayData.hours[hourKey].tag || "";
    if (tag) dist[tag]++;
    else dist.unassigned++;
  }
  return dist;
}

// For a week/month: sum distributions of multiple days
```

#### New Components Example
```typescript
<StatsModal>
  <Tabs>
    <Tab label="Week">
      <DistributionRing data={weekDist} title="This Week" />
      <StatCard stats={weekStats} />
    </Tab>
    <Tab label="Month">
      <DistributionRing data={monthDist} title="This Month" />
      <StatCard stats={monthStats} />
    </Tab>
  </Tabs>
</StatsModal>
```

---

### **PHASE 5: Firebase Auth + Firestore Sync** (3-4 days)

#### Files to Create
1. `lib/firebase.ts` — Firebase config, initializeApp, etc.
2. `hooks/useFirebaseSync.ts` — Sync hook with two-way binding
3. `hooks/useFirebaseAuth.ts` — Auth state + login/logout/signup
4. `components/Modals/AuthModal.tsx` — Google + Email/Password tabs
5. `lib/firebaseUtils.ts` — Write/read day docs, settings sync

#### Dependencies
- `npm install firebase` 

#### Features to Complete
- ✅ Google OAuth login (auth/google)
- ✅ Email/password signup + signin
- ✅ Password reset email
- ✅ Logout
- ✅ Sync current day to Firestore on every update
- ✅ Sync settings to Firestore (birthDate, lang, etc.)
- ✅ Load full week from Firestore on week nav change
- ✅ Load full month on demand (stats modal)
- ✅ Merge strategy: Firestore wins on conflict (user's phone is source of truth until cloud)
- ✅ Offline support: localStorage cache, sync when online
- ✅ User profile display in header

#### Firestore Structure
```javascript
/users/{uid}/
  ├─ settings (document)
  │  ├─ lang: "ar"
  │  ├─ isDarkMode: false
  │  ├─ userBirthDate: "1990-05-15"
  │  └─ lastSync: timestamp
  │
  └─ days/ (collection)
     └─ {dateStr} (document, e.g., "2026-08-05")
        ├─ hours (map)
        ├─ priorities (array)
        ├─ goldenGoal: string
        └─ createdAt: timestamp
```

#### Auth Flow
```
1. User clicks "Sign in"
2. AuthModal opens with Google + Email tabs
3. Google: redirect to Google OAuth → Firebase auto-login
4. Email: enter email/password → createUserWithEmailAndPassword or signInWithEmailAndPassword
5. On success: user object in state → dismiss modal
6. On every app load: check Firebase auth state, auto-login if token valid
7. Logout: signOut() → clear user state + localStorage
```

---

### **PHASE 6: AI Analysis + Export (CSV, PDF, JSON)** (3-4 days)

#### Files to Create
1. `lib/gemini.ts` — Gemini API integration (if using Google Generative AI)
2. `lib/export.ts` — CSV, PDF, JSON generators
3. `components/Modals/ExportModal.tsx` — 3 export options + PDF preview
4. `hooks/useGeminiAnalysis.ts` — Call Gemini API

#### Dependencies
- `npm install @google/generative-ai` (for Gemini)
- `npm install pdfkit` or use `html2pdf` (for PDF export)
- `npm install papaparse` (for CSV, though easy to DIY)

#### Features to Complete
- ✅ Daily AI summary: "You spent 8h earning, 4h planning, 2h resting. Golden goal: not done. Top priority: admin tasks (3/5 done)."
- ✅ CSV export: date, hour, tag, note (Excel-friendly)
- ✅ PDF export: formatted table + distribution rings (printable)
- ✅ JSON backup: full day/week/month data (for backup/restore)
- ✅ Download buttons
- ✅ Loading states for Gemini calls

#### Gemini Prompt Example
```
Given the following time log data for {date}:
Hours: {distribution as JSON}
Priorities: {list}
Golden Goal: {text}

Provide a 2-3 sentence statistical summary in {language}.
Format: "You invested 8 hours in earning (E), 4 hours in vision (V)... Your priorities: {done}/{total} completed."
```

---

### **PHASE 7: Google Calendar, PWA, Age, Settings, Guide, Contact** (3-4 days)

#### Files to Create
1. `lib/googleCalendar.ts` — Google Calendar API integration
2. `hooks/useGoogleCalendarSync.ts` — Fetch events for current day
3. `components/Modals/SettingsModal.tsx` — All settings in collapsible sections
4. `components/Modals/AgeModal.tsx` — Birth date input + age display options
5. `components/Modals/GuideModal.tsx` — Markdown guide (5 tags philosophy, etc.)
6. `components/Modals/ContactModal.tsx` — Email form (EmailJS)
7. `components/Modals/PWAInstallModal.tsx` — Platform-specific install hints
8. `public/manifest.json` — PWA manifest
9. `public/sw.ts` or `sw.js` — Service worker (optional, Vite PWA plugin handles most)

#### Dependencies
- `npm install vite-plugin-pwa`
- `npm install emailjs-com` (for contact form)

#### Features to Complete
- ✅ Age calculator: birth date → display as days/years remaining
- ✅ Age badge in header (when enabled)
- ✅ Settings: lang, dark mode, dev tools, birth date, calendar sync toggle
- ✅ Google Calendar sync: fetch events, suggest tags/hours for busy times
- ✅ PWA install prompts (Android + iOS)
- ✅ Offline mode (service worker + localStorage)
- ✅ App guide modal (with screenshots/GIFs)
- ✅ Contact/feedback form (via EmailJS)
- ✅ Dev tools toggle: show/hide AI + stats + export buttons
- ✅ Birthday reminder banner (if today == birthday)

#### PWA Manifest
```json
{
  "name": "سجل الوقت",
  "short_name": "Time Log",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ],
  "theme_color": "#2F6F62",
  "background_color": "#EEE9DF"
}
```

#### Settings Modal Structure
```
┌─ Account
│  ├─ Google sign-in (show if not authed, show profile if authed)
│  └─ Email + password (signup/signin)
│
├─ Theme & Language
│  ├─ Dark mode toggle
│  └─ Language (AR/EN)
│
├─ Age & Birthday
│  ├─ Birth date picker
│  └─ Display option (days/years/compass)
│
├─ Analytics & Integrations
│  ├─ Dev tools (AI, stats, export buttons) toggle
│  └─ Google Calendar sync toggle
│
├─ Help & Support
│  ├─ Open guide button
│  ├─ Contact form
│  └─ App version
│
└─ Data Management
   ├─ Export data (JSON)
   ├─ Import data (from JSON)
   └─ Clear all local data (warning)
```

---

### **PHASE 8: Polish, Edge Cases, Performance** (2-3 days)

#### Tasks
1. **Accessibility (a11y)**
   - ARIA labels on all buttons/inputs
   - Keyboard navigation (Tab, Enter, ESC)
   - Focus management in modals

2. **Mobile/Responsive**
   - Breakpoints: mobile (< 480px), tablet (480-768px), desktop (> 768px)
   - Touch-friendly button sizes (48px minimum)
   - Drag-select on mobile (touch events)
   - Collapsible sections on mobile (header day strip)

3. **Performance**
   - Memoize HourRow, TagRings components
   - Lazy-load modals (code-split)
   - Paginate week/month data if > 1000 days
   - Reduce localStorage reads (cache in memory)

4. **Edge Cases**
   - Leap years, month boundaries, DST
   - Timezone handling (store as UTC ISO strings)
   - Empty day (no hours) handling
   - Null/undefined guards throughout
   - Network error recovery (retry, fallback to localStorage)

5. **Bug Fixes & Testing**
   - Unit tests for utils (date, distribution calc)
   - Integration tests for state mutations
   - E2E tests (Cypress/Playwright) for critical flows
   - Cross-browser testing (Chrome, Safari, Firefox)

6. **Analytics & Monitoring** (Optional)
   - Firebase Analytics events (log in, save hour, export, etc.)
   - Error tracking (Sentry or Firebase Crash Reporting)

---

## 📈 Feature Matrix by Phase

| Feature | Phase | Dependencies | Notes |
|---------|-------|--------------|-------|
| Header & Theming | 1 | — | ✓ Done |
| i18n (ar/en) | 1 | — | ✓ Done |
| Hours Grid (24h) | 2 | state mgmt | read/update/delete |
| Tag Picker | 2 | constants | 7 tags UI |
| Copy-to-next-hour | 2 | state mgmt | — |
| Week Navigation | 2 | utils | prev/next/today |
| Priorities & Golden Goal | 3 | state mgmt | add/edit/delete |
| Timer | 3 | useTimer hook | start/stop/save |
| Timer Modal | 3 | modals infrastructure | — |
| Rollover Tasks | 3 | state mgmt | move to next day |
| Distribution Rings | 4 | recharts, calc | day/week/month |
| Stats Modal | 4 | distribution | — |
| Mini Rings (Dashboard) | 4 | distribution | live updates |
| Firebase Auth | 5 | firebase SDK | Google + Email/Pass |
| Firestore Sync | 5 | firebase SDK | two-way sync |
| Offline Mode | 5 | localStorage | fallback |
| AI Summary (Gemini) | 6 | @google/generative-ai | daily analysis |
| CSV Export | 6 | papaparse | Excel-friendly |
| PDF Export | 6 | html2pdf/pdfkit | printable |
| JSON Backup | 6 | native | backup/restore |
| Google Calendar Sync | 7 | google-api-client | event suggestions |
| PWA Install | 7 | vite-plugin-pwa | home screen icon |
| Age Calculator | 7 | utils | birth date input |
| Settings Modal | 7 | — | collapsible sections |
| Contact Form | 7 | emailjs-com | feedback |
| Guide Modal | 7 | — | markdown content |
| Accessibility | 8 | — | ARIA, keyboard nav |
| Responsive Design | 8 | — | mobile/tablet/desktop |
| Performance Optimizations | 8 | React.memo, code-split | — |

---

## 💾 Data Persistence Timeline

```
Phase 1-2: localStorage only (single day, then full week)
Phase 5: Add Firestore (sync on auth)
         → If offline: use localStorage as cache
         → If online: sync to Firestore
         → Conflict resolution: last-write-wins
Phase 6: Export (JSON) — manual backup
Phase 7: Import from JSON — manual restore
```

---

## 🔗 Dependencies Summary

```json
{
  "devDependencies": {
    "@tailwindcss/vite": "^4.x",
    "@types/react": "^18.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^4.x",
    "typescript": "^5.x",
    "vite": "^8.x"
  },
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "recharts": "^2.x",
    "firebase": "^9.x or 10.x",
    "@google/generative-ai": "^0.x (Phase 6)",
    "emailjs-com": "^3.x (Phase 7)",
    "vite-plugin-pwa": "^0.x (Phase 7)"
  }
}
```

---

## 📅 Estimated Timeline

- **Phase 1**: 1 day ✓ (Done)
- **Phase 2**: 3-4 days
- **Phase 3**: 2-3 days
- **Phase 4**: 2-3 days
- **Phase 5**: 3-4 days
- **Phase 6**: 3-4 days
- **Phase 7**: 3-4 days
- **Phase 8**: 2-3 days

**Total: ~22-28 days** (full-time dev)

---

## ✅ Quality Checklist per Phase

- [ ] All TypeScript types strict (no `any`)
- [ ] No console errors or warnings
- [ ] localStorage persists correctly
- [ ] Dark mode toggles correctly
- [ ] RTL/LTR toggles correctly
- [ ] No memory leaks (cleanup side effects)
- [ ] Mobile-responsive (test on phone)
- [ ] Accessibility (keyboard nav, screen reader)
- [ ] Tested in Chrome, Safari, Firefox
- [ ] No unhandled promise rejections

---

## 🎯 Key Design Principles

1. **Ported Logic**: Every function from the original app is traced and ported line-for-line where possible.
2. **No Breaking Changes**: Component interfaces remain stable between phases; only extend.
3. **Offline-First**: localStorage is the source of truth; Firebase is sync mirror.
4. **RTL-Safe**: All UI respects `dir` attribute; use `inset-*` + `end/start` Tailwind utilities.
5. **Type Safety**: Full TypeScript; no prop drilling; context for global state.
6. **Test Before Deploy**: Each phase has manual QA checklist.

---

**Now ready to start Phase 2! 🚀**
