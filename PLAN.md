# Foundernest Prototype: Build Plan

## What exists now

A working Next.js 16 + Tailwind + TypeScript app with:
- Sidebar, TopBar, StartState (search bar + example prompts)
- SearchResults with filter tokens, candidate cards, match details
- AIPanel with extraction, conflict detection, resolution
- FilterSidebar drawer with hierarchical geo
- 50 candidates in a JSON file (all Python/backend, limited locations)
- Hardcoded filter extraction (always returns same 5 filters regardless of prompt)

## What needs to change

### 1. Real NLP-like filter extraction from any prompt

**Current:** Every search returns the same 5 hardcoded filters (Sr Backend Eng, Python, +5 years, Berlin, Remote EU).

**Target:** Parse the prompt for keywords and extract matching filters dynamically:
- **Title keywords:** "backend", "frontend", "fullstack", "designer", "data", "devops", "mobile", "product manager"
- **Skill keywords:** "python", "javascript", "typescript", "java", "go", "rust", "react", "node", "django", "kubernetes", etc.
- **Location keywords:** "berlin", "madrid", "barcelona", "amsterdam", "paris", "lisbon", "london", "stockholm", "milan", "warsaw", etc.
- **Experience patterns:** regex for "5+ years", "senior" (implies 5+), "junior" (implies 0-2), digit+years
- **Work pref keywords:** "remote", "hybrid", "on-site", "onsite"

The extraction function takes a prompt string and returns `Filter[]`. Unrecognized words are ignored.

### 2. Expand candidate database to cover all roles/skills/locations

**Current:** 50 candidates, all Python backend, limited to Berlin/Madrid/a few EU cities.

**Target:** 60-80 candidates across:
- **Roles:** Backend, Frontend, Fullstack, Mobile, Data, DevOps, Designer, Product Manager
- **Skills:** Python, JavaScript, TypeScript, Java, Go, Rust, React, Vue, Angular, Node.js, Django, Spring, Kubernetes, Docker, Terraform, Figma, SQL, GraphQL
- **Locations:** Berlin, Madrid, Barcelona, Amsterdam, Paris, Lisbon, London, Stockholm, Milan, Warsaw, Copenhagen, Dublin, Zurich, Prague, Vienna
- **Work prefs:** Remote (EU), Hybrid, On-site
- **Experience:** 2-12 years range

Each candidate gets realistic match tags based on their actual skills/role.

### 3. Real filtering logic

**Current:** Only filters by location city name.

**Target:** Filter candidates by ALL active filters:
- Title filter: fuzzy match against candidate title
- Skill filter: check if candidate.skills includes the skill
- Location filter: match city or country
- Experience filter: compare experienceYears against extracted threshold
- Work pref filter: match workPref field
- Compute dynamic match scores based on how many filters match (not hardcoded)

### 4. Dynamic conflict detection

**Current:** Hardcoded to trigger only when user types "barcelona".

**Target:** Detect conflicts when:
- User types a location different from current location filter
- User types a work pref that contradicts current work pref filter
- Any AI panel message that introduces a filter contradicting an existing one

### 5. GitHub repo + Vercel-ready

- `git init`, commit all files, push to GitHub
- Ensure `npm run dev` works on port 3001 (already configured)
- Clean package.json name for deployment

### 6. Polish

- Remove "Demo: Zero results" debug link
- Trigger zero results naturally when filters are too narrow (0 matching candidates)
- Trigger too-broad naturally when result count > some threshold
- Make "Clear" reset to start state properly
- Make filter token remove buttons work (x on each token)

## File changes

| File | Action |
|------|--------|
| `src/data/candidates.ts` | Rewrite: 70+ diverse candidates |
| `src/data/extraction.ts` | New: prompt parsing / filter extraction |
| `src/data/filtering.ts` | New: candidate filtering + scoring |
| `src/app/page.tsx` | Rewrite: use extraction + filtering, dynamic state |
| `src/components/SearchResults.tsx` | Update: remove debug links, use dynamic counts |
| `src/components/AIPanel.tsx` | Update: dynamic conflict detection |
| `src/components/CandidateCard.tsx` | Update: dynamic match tags |
| `src/components/FilterSidebar.tsx` | Update: dynamic filter sections |
| `src/components/GeoDropdown.tsx` | Update: support all locations |
| `src/components/StartState.tsx` | Update: more diverse example prompts |

## Execution order

1. Build extraction engine (`extraction.ts`)
2. Build filtering + scoring engine (`filtering.ts`)  
3. Rewrite candidate data with diverse roles/skills/locations
4. Rewire `page.tsx` to use extraction + filtering
5. Update all components
6. Test full flow in browser
7. Git init + push to GitHub

## How to run

```bash
cd "/Users/rodrigomartinezmedina/CODE/FOUNDERNEST/FOUNDERNEST CODE PROTOTYPE WORKING"
npm run dev
# Open http://localhost:3001
```

## How to deploy

```bash
# After GitHub push:
# 1. Go to vercel.com
# 2. Import the GitHub repo
# 3. Deploy (zero config needed for Next.js)
```
