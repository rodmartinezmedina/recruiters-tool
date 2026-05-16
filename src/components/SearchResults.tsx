"use client";

import { useState, useMemo } from "react";
import { Candidate } from "@/data/candidates";
import { AppState, Filter } from "@/app/page";
import CandidateCard from "./CandidateCard";
import GeoDropdown from "./GeoDropdown";

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
  selectedLocations,
}: Props) {
  const [showGeoDropdown, setShowGeoDropdown] = useState(false);
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

  return (
    <div className="max-w-[780px]">
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
            readOnly
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
        {grouped.map((g) => (
          <div key={g.type} className="relative">
            <div
              onClick={() => {
                if (g.type === "Location") setShowGeoDropdown(!showGeoDropdown);
                else onOpenFilterSidebar();
              }}
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
            {g.type === "Location" && showGeoDropdown && (
              <GeoDropdown
                selectedLocations={selectedLocations}
                onToggle={onLocationChange}
                onClose={() => setShowGeoDropdown(false)}
              />
            )}
          </div>
        ))}
        <button
          onClick={onOpenFilterSidebar}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-text-primary bg-white hover:bg-chip-bg transition-colors"
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
        </button>
        <button
          onClick={onClearFilters}
          className="text-xs font-medium text-accent hover:underline ml-1"
        >
          Clear
        </button>
      </div>

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
