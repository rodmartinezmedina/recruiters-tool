# Foundernest Prototype Session Handoff

Context for the next Claude session. Covers the current state of the codebase, what was done in the last two sessions, key design decisions, and the open task list.

> Style rule (user preference): never use em dashes (—) in generated content. Use commas, parentheses, periods, or colons instead.

---

## Stack and structure

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind v4 with CSS variables in `src/app/globals.css`
- **Project root**: `/Users/rodrigomartinezmedina/CODE/FOUNDERNEST/FOUNDERNEST CODE PROTOTYPE WORKING`
- **Dev**: `bun dev` or `npm run dev`. Type-check with `npx tsc --noEmit`.

### Directory layout

```
src/
  app/
    page.tsx               # Root component, owns all app state
    globals.css            # Color tokens, theme
  components/
    Sidebar.tsx            # Left nav, collapsible
    TopBar.tsx             # Top header
    StartState.tsx         # Empty state with the prompt input
    SearchResults.tsx      # Results view with filters + chips + cards
    AIPanel.tsx            # Right AI assistant panel, collapsible
    FilterSidebar.tsx      # "All filters" drawer
    CandidateCard.tsx      # Candidate row in the results list
    GeoDropdown.tsx        # Multi-select location dropdown
  data/
    candidates.ts          # Mock candidate data
    extraction.ts          # Prompt to filters extraction
    filtering.ts           # Candidate scoring/filtering
```

### Color tokens (`globals.css`)

```
--color-bg:               #F6F5F1   page background
--color-white:            #FFFFFF
--color-border:           #E2E0DA
--color-text-primary:     #1A1A1A
--color-text-secondary:   #6B6867
--color-text-tertiary:    #9C9990
--color-accent:           #2563EB   blue, primary actions/links
--color-accent-light:     #EFF5FF
--color-accent-border:    #93B4F5
--color-confirmed-bg:     #E8F5EA
--color-confirmed-border: #66BB6A
--color-conflict-bg:      #FFF7EF
--color-conflict-border:  #FB8C00   orange, partial match / conflicts
--color-purple:           #7C3AED   AI signifier
--color-purple-light:     #F3EEFF
--color-chip-bg:          #F0EEE9
```

---

## App state (`src/app/page.tsx`)

Owned at the top, threaded through components.

- `appState`: `"start" | "results" | "conflict" | "too-broad" | "zero-results"`
- `prompt: string`
- `filters: Filter[]` where `Filter = { type, value, source: "prompt" | "manual" }`
- `aiMessages: AIMessage[]` with `type?: "extraction" | "conflict" | "resolution" | "info"`
- `showFilterSidebar`, `expandedCard`, `pendingNewLocations`
- **`sidebarCollapsed`, `aiPanelCollapsed`** (added this session)

Key handlers:
- `handleSearch(prompt?)` runs extraction, sets filters, transitions appState, generates AI messages.
- `handleClearFilters` does a full reset (filters, prompt, AI messages, appState back to "start").
- `handleConflictResolve`, `handleRemoveFilter`, `handleRelaxFilter`, etc.

---

## What was done in the previous session

Filter UX polish and chip styling.

- All filter dropdown headers unified: count on the left, `Clear` action on the right with `text-accent hover:underline`.
- Container max width unified to `max-w-[920px] mx-auto` between StartState and SearchResults so the layout does not jump between states.
- TopBar padding bumped to `px-8` to align with the content area.
- AIPanel width reduced from `340px` to `300px` to keep filter chips on one line.
- FilterSidebar:
  - Added a full `TITLE_OPTIONS` radio list (was a placeholder).
  - Stops auto-closing when a filter is selected, so users can pick across multiple sections.
  - "Clear all" routes through the same confirmation modal as the central "Clear" and the modal is rendered INSIDE the sidebar ref so clicking it does not trigger close-on-outside.
- CandidateCard chips redesigned to match Figma:
  - Transparent fill, subtle border, fully rounded (`rounded-full px-2`).
  - `text-purple` for prompt-source chips.
  - `text-conflict-border` for partial-match chips (full opacity orange).
- Legend label "From filter" renamed to "Manual filter".

---

## What was done in this session

### 1. Read-only "Starting search prompt" + edit affordance

Problem: the top of the results page was an editable input with a blue border that looked focused, and the text inside it did not stay in sync with filter/AI mutations, sending mixed signals.

Implementation in `SearchResults.tsx`:

- Replaced the input + Search button with static text under a "Starting search prompt" tertiary label.
- Added a small pencil **Edit** button (bordered pill, Lucide pencil icon at 13x13 in a 24-viewBox) next to the prompt text.
- Clicking Edit toggles inline edit mode with Save / Cancel. Save calls `onPromptChange(draftPrompt)` then `onSearch(draftPrompt)` which re-runs extraction.
- Added a `useEffect` to keep `draftPrompt` in sync with the `prompt` prop.
- Added a **Start new search** link in the top-right of this section. Opens the existing confirmation modal which calls `onClearFilters` (full reset).
- Outer layout uses `flex items-end justify-between gap-4` so the Start new search link baseline-aligns with the prompt text.
- Added `pb-5 border-b border-border mb-8` so the prompt block reads as a distinct header, separated from the filter row below (avoids cognitive dissonance between e.g. prompt saying "hybrid" and filters showing "Remote").

The chip-row "Clear filters" link was removed entirely. The only ways to mutate the search are now:

- Pencil Edit on the prompt
- Start new search (full reset, with confirmation)
- Filter chip dropdowns / removing individual filters
- AI Assistant input

Modal copy updated: `Start a new search?` / `This will clear your prompt, filters, and AI conversation.` / `Cancel` + `Yes, start over`.

### 2. Collapsible Sidebar and AI panel

Both panels now have a state hook in `page.tsx` (`sidebarCollapsed`, `aiPanelCollapsed`) and a `collapsed` + `onToggle` prop pair.

**Sidebar** (`src/components/Sidebar.tsx`):
- Expanded: `w-60`, logo + wordmark on the left, chevron-left collapse button on the right.
- Collapsed: `w-14`, chevron-right button always at the top (consistent placement across states), logo square below it, icon-only nav buttons centered (with native `title` tooltips), avatar only.
- Width transition: `transition-[width] duration-200`.

**AIPanel** (`src/components/AIPanel.tsx`):
- Expanded: `w-[300px]`, header is now `AI Assistant` text + purple sparkle + bordered chevron-right collapse button. The previous chunky `bg-chip-bg` icon square next to the title was removed.
- Collapsed: `w-14` rail with chevron-left expand button + purple sparkle as a wayfinding hint.

**Chevron button styling (shared between both)**:
```
w-8 h-8 rounded-md text-text-secondary hover:text-text-primary
hover:bg-chip-bg border border-border bg-white
flex items-center justify-center transition-colors shrink-0
```
16x16 Lucide chevron inside.

### 3. AI Assistant message cards

`AIPanel.tsx` extraction / resolution / generic assistant messages are now wrapped in `rounded-lg bg-purple-light p-4` containers so each AI turn is one visual unit:

- Label dot and "AI Assistant" text switched from `bg-accent / text-accent` to `bg-purple / text-purple` so the indicator color matches the card and reinforces the AI identity.
- Filter chips rendered inside the extraction card now use `bg-white border border-border` with purple sparkle, `text-text-secondary` for the type label, and `text-text-primary` for the value. They read as data tokens against the purple background.

User messages still use `bg-chip-bg`, system info uses `bg-accent-light`, conflict cards keep the orange treatment (different semantic signal). No changes to those.

---

## Open / pending tasks

### Replace Unicode sparkle (`&#10022;` / ✦) with custom SVG icons from Figma

User identified two Figma icons to use:
- **AI sparkle**, node `40:994` "Ai": 4-pointed purple sparkle with two small plus signs in upper-left and lower-left, 12x12px.
- **Partial match percent**, node `38:14386` "Percent": orange `%` symbol with two small circles and a diagonal line, 14x14px.

Locations using `&#10022;` that should be swapped to one of these components:

| File | Line approx | Context | Replace with |
|---|---|---|---|
| `AIPanel.tsx` | header (after refactor) | purple sparkle next to title | AI sparkle |
| `AIPanel.tsx` | filter chip inside extraction card | `<span className="text-purple">` | AI sparkle |
| `AIPanel.tsx` | collapsed rail | `text-purple text-xl` | AI sparkle (sized up) |
| `CandidateCard.tsx` | legend "From prompt" | purple sparkle prefix | AI sparkle |
| `CandidateCard.tsx` | legend "Partial match" | conflict-border sparkle | Percent icon |
| `CandidateCard.tsx` | prompt source chip prefix | `text-purple text-[9px]` | AI sparkle |
| `CandidateCard.tsx` | partial source chip prefix | `text-conflict-border text-[9px]` | Percent icon |
| `SearchResults.tsx` | filter token chip when `fromPrompt` | `text-purple text-xs` | AI sparkle |
| `SearchResults.tsx` | "Extracted from your prompt" legend | `text-purple` | AI sparkle |

Suggested approach: create two presentational components under `src/components/icons/`, e.g. `AiSparkle.tsx` and `PercentIcon.tsx`, taking `className` so the parent can size them. Pull the SVG paths via the Figma Desktop Bridge MCP using `mcp__figma-console__figma_get_component_for_development` against those node IDs, or screenshot and trace if the bridge is not connected.

### Possible follow-ups (not requested, just noted)

- The new SearchResults edit input does not show extracted-filter changes inline. If the user edits the prompt and the extraction returns the same filters, the user gets no visual feedback. Might want a tiny "Re-extracted N filters" toast.
- FilterSidebar's "Clear all" still goes through the full-reset modal. Could be renamed "Start new search" for consistency with the new top-of-results action.

---

## File-by-file change list (this session)

### `src/components/SearchResults.tsx`

- Added `editingPrompt`, `draftPrompt` state hooks and `useEffect` to sync `draftPrompt` to `prompt`.
- Replaced the search bar block with "Starting search prompt" header + pencil Edit button + Start new search link.
- Outer flex changed from `items-start` to `items-end`, added `pb-5 border-b border-border mb-8`.
- Removed the chip-row "Clear filters" button.
- Removed unused `onClearFiltersOnly` prop from interface.
- Modal copy updated to "Start a new search?" with "Cancel" / "Yes, start over".

### `src/components/Sidebar.tsx`

- Added `Props` interface: `collapsed`, `onToggle`.
- Width toggles between `w-60` and `w-14` with `transition-[width]`.
- Header is always a single flex row with the chevron at the top (right when expanded, centered when collapsed). Chevron is the shared 32x32 bordered button.
- Nav buttons become icon-only when collapsed, with `title` tooltips.
- Footer/user info is avatar-only when collapsed.
- Logo square moves to a centered row under the chevron when collapsed.

### `src/components/AIPanel.tsx`

- Added `collapsed`, `onToggle` to props.
- Collapsed branch renders a 56px rail with chevron-left button + purple sparkle.
- Expanded header refactored: removed the `bg-chip-bg` icon square, kept text + sparkle + chevron toggle.
- Extraction, resolution, and generic assistant messages now wrapped in `rounded-lg bg-purple-light p-4`.
- Label dot and text recolored to `bg-purple` / `text-purple`.
- Filter chips inside the extraction card restyled: `bg-white border border-border`, purple sparkle, secondary-colored type label, primary-colored value.

### `src/app/page.tsx`

- Added `sidebarCollapsed`, `aiPanelCollapsed` state hooks.
- Passed `collapsed` + `onToggle` to `Sidebar` and `AIPanel`.

---

## Verification checklist

When verifying changes:

1. Start screen renders centered with `max-w-[920px]` and a single prompt input.
2. Submit a prompt: results page shows a separated "Starting search prompt" header with the prompt as static text, pencil Edit button next to it, and "Start new search" baseline-aligned on the right.
3. Click Edit: input appears with Save/Cancel, Save re-runs extraction.
4. Click Start new search: confirmation modal opens, Yes returns to the empty start screen with everything reset.
5. Collapse sidebar: nav collapses to icon-only at 56px, chevron stays at the top.
6. Collapse AI panel: panel reduces to 56px rail with a chevron and purple sparkle.
7. AI messages render inside purple cards. Filter chips inside the card are white pills with subtle border.
8. Filter chip dropdowns still work, all show count-left / Clear-right header.
9. FilterSidebar opens, all sections including Title show full option lists, selecting filters does not close the sidebar, "Clear all" opens its confirmation and resets to start.
10. Run `npx tsc --noEmit` to confirm no type errors.
