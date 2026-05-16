import { Candidate, MatchTag } from "./candidates";
import { Filter } from "@/app/page";

interface ScoredCandidate extends Candidate {
  dynamicScore: number;
  dynamicTags: MatchTag[];
  dynamicPartialMatch?: string;
}

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().replace(/[.\-\s]/g, "");
}

function titleMatch(candidateTitle: string, filterTitle: string): "full" | "partial" | "none" {
  const ct = candidateTitle.toLowerCase();
  const ft = filterTitle.toLowerCase();

  if (ct.includes(ft) || ft.includes(ct)) return "full";

  const ctWords = ct.split(/\s+/);
  const ftWords = ft.split(/\s+/);
  const overlap = ftWords.filter((w) => ctWords.some((cw) => cw.includes(w) || w.includes(cw)));
  if (overlap.length >= Math.ceil(ftWords.length * 0.5)) return "partial";

  return "none";
}

export function filterAndScore(
  allCandidates: Candidate[],
  filters: Filter[]
): ScoredCandidate[] {
  if (filters.length === 0) return [];

  const titleFilter = filters.find((f) => f.type === "Title");
  const skillFilters = filters.filter((f) => f.type === "Skill");
  const locationFilters = filters.filter((f) => f.type === "Location");
  const expFilter = filters.find((f) => f.type === "Experience");
  const workFilters = filters.filter((f) => f.type === "Work pref");

  const expThreshold = expFilter
    ? parseInt(expFilter.value.replace(/[^0-9]/g, ""), 10) || 0
    : 0;

  const scored: ScoredCandidate[] = [];

  for (const candidate of allCandidates) {
    let score = 0;
    let maxScore = 0;
    const tags: MatchTag[] = [];
    let partialNote: string | undefined;

    // Title matching (25 points)
    if (titleFilter) {
      maxScore += 25;
      const match = titleMatch(candidate.title, titleFilter.value);
      if (match === "full") {
        score += 25;
        tags.push({ label: titleFilter.value, source: "prompt" });
      } else if (match === "partial") {
        score += 15;
        tags.push({ label: titleFilter.value, source: "partial" });
      }
    }

    // Skill matching (20 points each, up to 3)
    for (const sf of skillFilters) {
      maxScore += 20;
      const normalizedFilter = normalizeSkill(sf.value);
      const hasSkill = candidate.skills.some(
        (s) => normalizeSkill(s) === normalizedFilter
      );
      if (hasSkill) {
        score += 20;
        tags.push({ label: sf.value, source: sf.source === "manual" ? "filter" : "prompt" });
      }
    }

    // Location matching (15 points)
    if (locationFilters.length > 0) {
      maxScore += 15;
      let locationMatched = false;
      for (const lf of locationFilters) {
        const loc = lf.value.toLowerCase();
        if (
          candidate.city.toLowerCase() === loc ||
          candidate.country.toLowerCase() === loc
        ) {
          score += 15;
          tags.push({ label: candidate.city, source: lf.source === "manual" ? "filter" : "prompt" });
          locationMatched = true;
          break;
        }
      }
      if (!locationMatched) {
        for (const lf of locationFilters) {
          const loc = lf.value.toLowerCase();
          if (
            candidate.city.toLowerCase().includes(loc) ||
            candidate.country.toLowerCase().includes(loc)
          ) {
            score += 10;
            tags.push({ label: candidate.city, source: "partial" });
            break;
          }
        }
      }
    }

    // Experience matching (10 points)
    if (expFilter && expThreshold > 0) {
      maxScore += 10;
      if (candidate.experienceYears >= expThreshold) {
        score += 10;
        tags.push({
          label: `${candidate.experienceYears}y experience`,
          source: expFilter.source === "manual" ? "filter" : "prompt",
        });
      } else if (candidate.experienceYears >= expThreshold - 1) {
        score += 5;
        tags.push({ label: `~${expThreshold} years experience`, source: "partial" });
        partialNote = `Candidate has ${candidate.experienceYears}y experience. Prompt says +${expThreshold} years, this is a partial match.`;
      }
    }

    // Work pref matching (10 points)
    if (workFilters.length > 0) {
      maxScore += 10;
      const cp = candidate.workPref.toLowerCase();
      let workMatched = false;
      for (const wf of workFilters) {
        const wp = wf.value.toLowerCase();
        if (cp.includes(wp.split(" ")[0]) || wp.includes(cp.split(" ")[0])) {
          score += 10;
          tags.push({
            label: candidate.workPref,
            source: wf.source === "manual" ? "filter" : "prompt",
          });
          workMatched = true;
          break;
        }
      }
      if (!workMatched) {
        const hasRemote = workFilters.some((wf) => wf.value.toLowerCase().includes("remote"));
        if (hasRemote && cp.includes("hybrid")) {
          score += 5;
          tags.push({ label: candidate.workPref, source: "partial" });
        }
      }
    }

    if (maxScore === 0) continue;

    const pct = Math.round((score / maxScore) * 100);

    // Only include candidates with at least 30% match
    if (pct >= 30) {
      scored.push({
        ...candidate,
        dynamicScore: pct,
        dynamicTags: tags,
        dynamicPartialMatch: partialNote,
        matchScore: pct,
        matchTags: tags,
        partialMatch: partialNote,
      });
    }
  }

  return scored.sort((a, b) => b.dynamicScore - a.dynamicScore);
}
