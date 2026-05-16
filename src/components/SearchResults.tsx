"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Candidate } from "@/data/candidates";
import { AppState, Filter } from "@/app/page";
import CandidateCard from "./CandidateCard";
import GeoDropdown from "./GeoDropdown";

const SKILL_OPTIONS = [
  "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "React", "Vue",
  "Angular", "Node.js", "Django", "Kubernetes", "Docker", "AWS", "PostgreSQL",
  "GraphQL", "Figma", "Swift", "Kotlin", "Terraform",
];

const EXPERIENCE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+ years", value: "+1 years" },
  { label: "3+ years", value: "+3 years" },
  { label: "5+ years", value: "+5 years" },
  { label: "8+ years", value: "+8 years" },
  { label: "10+ years", value: "+10 years" },
];

const WORK_PREFS = ["Remote (EU)", "Hybrid", "On-site"];

const TITLE_OPTIONS = [
  "Backend Engineer", "Frontend Engineer", "Fullstack Engineer",
  "DevOps Engineer", "Data Engineer", "ML Engineer",
  "Mobile Engineer", "Product Designer", "Product Manager",
];

interface Props {
  prompt: string;
  filters: Filter[];
  candidates: Candidate[];
  resultCount: string;
  appState: AppState;
  expandedCard: number | null;
  onExpandCard: (id: number | null) => void;
  onSearch: (prompt?: string) => void;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
  onRemoveFilter: (index: number) => void;
  onRemoveFilterByType: (type: string) => void;
  onOpenFilterSidebar: () => void;
  onRelaxFilter: (filterType?: string) => void;
  onFilterChange: (filters: Filter[]) => void;
  onPromptChange: (prompt: string) => void;
  selectedLocations: string[];
}

interface GroupedFilter {
  type: string;
  label: string;
  values: string[];
  fromPrompt: boolean;
  indices: number[];
}

export default function SearchResults({
  prompt,
  filters,
  candidates,
  resultCount,
  appState,
  expandedCard,
  onExpandCard,
  onSearch,
  onLocationChange,
  onClearFilters,
  onRemoveFilter,
  onRemoveFilterByType,
  onOpenFilterSidebar,
  onRelaxFilter,
  onFilterChange,
  onPromptChange,
  selectedLocations,
}: Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const promptFilterCount = filters.filter((f) => f.source === "prompt").length;

  const grouped = useMemo(() => {
    const groups: GroupedFilter[] = [];
    const typeOrder = ["Title", "Skill", "Location", "Experience", "Work pref"];
    const typeLabels: Record<string, string> = {
      Title: "Title",
      Skill: "Skills",
      Location: "Location",
      Experience: "Experience",
      "Work pref": "Work pref",
    };

    for (const type of typeOrder) {
      const matching = filters
        .map((f, i) => ({ ...f, index: i }))
        .filter((f) => f.type === type);
      if (matching.length === 0) continue;

      groups.push({
        type,
        label: typeLabels[type] || type,
        values: matching.map((f) => f.value),
        fromPrompt: matching.every((f) => f.source === "prompt"),
        indices: matching.map((f) => f.index),
      });
    }
    return groups;
  }, [filters]);

  const relaxationChips = useMemo(() => {
    const types = new Set(filters.map((f) => f.type));
    return Array.from(types).map((type) => {
      const values = filters.filter((f) => f.type === type).map((f) => f.value);
      return {
        label: `Remove: ${values.join(", ")}`,
        type,
      };
    });
  }, [filters]);

  const skillFilters = filters.filter((f) => f.type === "Skill");
  const expFilter = filters.find((f) => f.type === "Experience");
  const workFilters = filters.filter((f) => f.type === "Work pref");

  function toggleSkill(skill: string) {
    const exists = skillFilters.some((f) => f.value === skill);
    if (exists) {
      onFilterChange(filters.filter((f) => !(f.type === "Skill" && f.value === skill)));
    } else {
      onFilterChange([...filters, { type: "Skill", value: skill, source: "manual" }]);
    }
  }

  function setExperience(value: string) {
    if (!value) {
      onFilterChange(filters.filter((f) => f.type !== "Experience"));
    } else {
      const hasExp = filters.some((f) => f.type === "Experience");
      if (hasExp) {
        onFilterChange(
          filters.map((f) =>
            f.type === "Experience" ? { ...f, value, source: "manual" as const } : f
          )
        );
      } else {
        onFilterChange([...filters, { type: "Experience", value, source: "manual" }]);
      }
    }
  }

  function toggleWorkPref(pref: string) {
    const exists = workFilters.some((f) => f.value === pref);
    if (exists) {
      onFilterChange(filters.filter((f) => !(f.type === "Work pref" && f.value === pref)));
    } else {
      onFilterChange([...filters, { type: "Work pref", value: pref, source: "manual" }]);
    }
  }

  function setTitle(value: string) {
    if (!value) {
      onFilterChange(filters.filter((f) => f.type !== "Title"));
    } else {
      const has = filters.some((f) => f.type === "Title");
      if (has) {
        onFilterChange(
          filters.map((f) =>
            f.type === "Title" ? { ...f, value, source: "manual" as const } : f
          )
        );
      } else {
        onFilterChange([...filters, { type: "Title", value, source: "manual" }]);
      }
    }
  }

  function renderDropdown(type: string) {
    if (type === "Title") {
      const titleFilter = filters.find((f) => f.type === "Title");
      return (
        <div className="absolute top-full left-0 mt-1 w-[260px] bg-white rounded-lg border border-border shadow-lg z-50">
          <div className="px-4 py-2 text-xs text-text-secondary border-b border-border flex items-center justify-between">
            <span>{titleFilter ? "1 selected" : "Select title"}</span>
            {titleFilter && (
              <button
                onClick={(e) => { e.stopPropagation(); setTitle(""); }}
                className="text-accent hover:underline font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="p-2 space-y-0.5">
            <button
              onClick={() => { setTitle(""); setOpenDropdown(null); }}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                !titleFilter
                  ? "text-accent font-medium bg-accent-light"
                  : "text-text-primary hover:bg-chip-bg"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!titleFilter ? "bg-accent border-accent" : "border-border"}`}>
                {!titleFilter && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              Any
            </button>
            {TITLE_OPTIONS.map((title) => {
              const isActive = titleFilter?.value === title;
              return (
                <button
                  key={title}
                  onClick={() => setTitle(title)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                    isActive
                      ? "text-accent font-medium bg-accent-light"
                      : "text-text-primary hover:bg-chip-bg"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? "bg-accent border-accent" : "border-border"}`}>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  {title}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === "Skill") {
      return (
        <div className="absolute top-full left-0 mt-1 w-[320px] bg-white rounded-lg border border-border shadow-lg z-50 max-h-[400px] overflow-y-auto">
          <div className="px-4 py-2 text-xs text-text-secondary border-b border-border flex items-center justify-between">
            <span>{skillFilters.length > 0 ? `${skillFilters.length} selected` : "Select skills"}</span>
            {skillFilters.length > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); onFilterChange(filters.filter((f) => f.type !== "Skill")); }}
                className="text-accent hover:underline font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="p-3 flex flex-wrap gap-1.5">
            {SKILL_OPTIONS.map((skill) => {
              const isActive = skillFilters.some((f) => f.value === skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    isActive
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-text-primary border-border hover:bg-chip-bg"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === "Experience") {
      return (
        <div className="absolute top-full left-0 mt-1 w-[240px] bg-white rounded-lg border border-border shadow-lg z-50">
          <div className="px-4 py-2 text-xs text-text-secondary border-b border-border flex items-center justify-between">
            <span>{expFilter ? "1 selected" : "Select experience"}</span>
            {expFilter && (
              <button
                onClick={(e) => { e.stopPropagation(); setExperience(""); }}
                className="text-accent hover:underline font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="p-2 space-y-0.5">
            {EXPERIENCE_OPTIONS.map((opt) => {
              const isActive = opt.value
                ? expFilter?.value === opt.value
                : !expFilter;
              return (
                <button
                  key={opt.label}
                  onClick={() => setExperience(opt.value)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                    isActive
                      ? "text-accent font-medium bg-accent-light"
                      : "text-text-primary hover:bg-chip-bg"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isActive ? "bg-accent border-accent" : "border-border"
                    }`}
                  >
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === "Work pref") {
      return (
        <div className="absolute top-full left-0 mt-1 w-[240px] bg-white rounded-lg border border-border shadow-lg z-50">
          <div className="px-4 py-2 text-xs text-text-secondary border-b border-border flex items-center justify-between">
            <span>{workFilters.length > 0 ? `${workFilters.length} selected` : "Work arrangement"}</span>
            {workFilters.length > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); onFilterChange(filters.filter((f) => f.type !== "Work pref")); }}
                className="text-accent hover:underline font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="p-2 space-y-0.5">
            {WORK_PREFS.map((pref) => {
              const isActive = workFilters.some((f) => f.value === pref);
              return (
                <button
                  key={pref}
                  onClick={() => toggleWorkPref(pref)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                    isActive
                      ? "text-accent font-medium bg-accent-light"
                      : "text-text-primary hover:bg-chip-bg"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isActive ? "bg-accent border-accent" : "border-border"
                    }`}
                  >
                    {isActive && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  {pref}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === "Location") {
      return (
        <GeoDropdown
          selectedLocations={selectedLocations}
          onToggle={onLocationChange}
          onClose={() => setOpenDropdown(null)}
        />
      );
    }

    return null;
  }

  return (
    <div className="max-w-[920px] mx-auto">
      {/* Search bar */}
      <div className="mb-1">
        <label className="text-xs font-medium text-text-tertiary mb-1.5 block">
          Initial prompt / text search
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="flex-1 h-11 px-4 rounded-lg border-2 border-accent bg-white text-sm text-text-primary focus:outline-none"
          />
          <button
            type="submit"
            className="h-11 px-5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter tokens - grouped by type */}
      <div className="flex flex-wrap items-center gap-2 mt-3 mb-1">
        {openDropdown && (
          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
        )}
        {grouped.map((g) => (
          <div key={g.type} className="relative z-50">
            <div
              onClick={() => setOpenDropdown(openDropdown === g.type ? null : g.type)}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[13px] font-medium border transition-colors cursor-pointer ${
                g.fromPrompt
                  ? "bg-white border-accent-border text-text-primary"
                  : "bg-white border-border text-text-primary"
              }`}
            >
              {g.fromPrompt && (
                <span className="text-purple text-xs">&#10022;</span>
              )}
              {g.values.length === 1 ? (
                g.values[0]
              ) : (
                <>
                  {g.label}
                  <span className="ml-0.5 min-w-[18px] h-[18px] rounded bg-accent/10 text-accent text-[10px] flex items-center justify-center font-semibold px-1">
                    {g.values.length}
                  </span>
                </>
              )}
              <svg width="12" height="12" viewBox="0 0 12 12" className="ml-0.5 text-text-primary">
                <path d="M3.5 5l2.5 2.5 2.5-2.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            {openDropdown === g.type && renderDropdown(g.type)}
          </div>
        ))}
        <div
          onClick={onOpenFilterSidebar}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[13px] font-medium border border-border text-text-primary bg-white hover:bg-chip-bg transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary">
            <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          All filters
          {promptFilterCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-semibold">
              {promptFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-xs font-medium text-accent hover:underline ml-1"
        >
          Clear
        </button>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowClearConfirm(false)} />
          <div className="relative bg-white rounded-lg border border-border shadow-xl p-5 w-[320px]">
            <p className="text-sm font-semibold text-text-primary mb-1">Clear all filters?</p>
            <p className="text-xs text-text-secondary mb-4">This will remove all filters and return to the start screen.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-1.5 rounded-md text-sm font-medium text-text-primary border border-border hover:bg-chip-bg transition-colors"
              >
                No
              </button>
              <button
                onClick={() => { setShowClearConfirm(false); onClearFilters(); }}
                className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent/90 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-text-secondary mt-1 mb-4">
        <span className="text-purple">&#10022;</span>
        Extracted from your prompt
      </div>

      {/* Too broad banner */}
      {appState === "too-broad" && (
        <div className="mb-4 p-5 rounded-lg border-2 border-accent bg-accent-light">
          <h3 className="text-base font-semibold text-text-primary mb-1">
            {resultCount}+ candidates match
          </h3>
          <p className="text-sm text-text-primary mb-3">
            Your search is too broad. Add filters to narrow results:
          </p>
          <div className="flex flex-wrap gap-2">
            {!filters.some((f) => f.type === "Skill") && (
              <button
                onClick={onOpenFilterSidebar}
                className="px-3 py-1.5 rounded-full border border-accent text-xs font-medium text-accent hover:bg-white transition-colors"
              >
                + Specific skills
              </button>
            )}
            {!filters.some((f) => f.type === "Experience") && (
              <button
                onClick={onOpenFilterSidebar}
                className="px-3 py-1.5 rounded-full border border-accent text-xs font-medium text-accent hover:bg-white transition-colors"
              >
                + Years of experience
              </button>
            )}
            {!filters.some((f) => f.type === "Location") && (
              <button
                onClick={onOpenFilterSidebar}
                className="px-3 py-1.5 rounded-full border border-accent text-xs font-medium text-accent hover:bg-white transition-colors"
              >
                + Location
              </button>
            )}
            {!filters.some((f) => f.type === "Work pref") && (
              <button
                onClick={onOpenFilterSidebar}
                className="px-3 py-1.5 rounded-full border border-accent text-xs font-medium text-accent hover:bg-white transition-colors"
              >
                + Work preference
              </button>
            )}
          </div>
        </div>
      )}

      {/* Zero results */}
      {appState === "zero-results" && (
        <div className="mt-8 mb-4 p-10 rounded-lg border border-border bg-white text-center">
          <div className="w-16 h-16 rounded-full bg-border mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No exact matches
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Try relaxing one or more filters:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {relaxationChips.map((chip) => (
              <button
                key={chip.type}
                onClick={() => onRelaxFilter(chip.type)}
                className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-text-primary hover:bg-chip-bg transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count + candidate cards */}
      {appState !== "zero-results" && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-text-primary">
              Showing {resultCount} candidates
            </p>
            <button className="text-xs text-text-secondary flex items-center gap-1">
              Sort: Best match
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M3 4l2 2 2-2" stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {candidates.slice(0, 10).map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                expanded={expandedCard === candidate.id}
                onToggle={() =>
                  onExpandCard(expandedCard === candidate.id ? null : candidate.id)
                }
              />
            ))}
          </div>

          {candidates.length > 10 && (
            <div className="mt-4 text-center">
              <button className="text-sm font-medium text-accent hover:underline">
                Load {candidates.length - 10} more results
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
