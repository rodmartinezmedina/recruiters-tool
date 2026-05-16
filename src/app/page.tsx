"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { candidates as allCandidates, Candidate } from "@/data/candidates";
import { extractFilters, extractLocationFromMessage } from "@/data/extraction";
import { filterAndScore } from "@/data/filtering";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import StartState from "@/components/StartState";
import SearchResults from "@/components/SearchResults";
import AIPanel from "@/components/AIPanel";
import FilterSidebar from "@/components/FilterSidebar";

export type AppState =
  | "start"
  | "results"
  | "conflict"
  | "too-broad"
  | "zero-results";

export interface Filter {
  type: string;
  value: string;
  source: "prompt" | "manual";
}

export interface AIMessage {
  role: "assistant" | "user" | "system";
  content: string;
  type?: "extraction" | "conflict" | "resolution" | "info";
  filters?: Filter[];
  conflictData?: {
    title: string;
    description: string;
    options: { label: string; primary?: boolean }[];
  };
}

const TOO_BROAD_THRESHOLD = 40;

export default function Home() {
  const [appState, setAppState] = useState<AppState>("start");
  const [prompt, setPrompt] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCandidates = useMemo(() => {
    if (appState === "start") return [];
    return filterAndScore(allCandidates, filters);
  }, [appState, filters]);

  useEffect(() => {
    if (appState === "start" || appState === "conflict") return;
    if (filters.length === 0) return;
    const count = filteredCandidates.length;
    if (count === 0 && appState !== "zero-results") {
      setAppState("zero-results");
    } else if (count >= TOO_BROAD_THRESHOLD && appState !== "too-broad") {
      setAppState("too-broad");
    } else if (count > 0 && count < TOO_BROAD_THRESHOLD && appState !== "results") {
      setAppState("results");
    }
  }, [filteredCandidates, filters, appState]);

  const handleSearch = useCallback(
    (searchPrompt?: string) => {
      const q = searchPrompt || prompt;
      if (!q.trim()) return;

      setPrompt(q);
      const extracted = extractFilters(q);

      if (extracted.length === 0) {
        setFilters([]);
        setAppState("zero-results");
        setAiMessages([
          {
            role: "system",
            content: `"${q}"`,
            type: "info",
          },
          {
            role: "assistant",
            content:
              "I couldn't extract any specific search dimensions from your prompt. Try including a role, skills, location, or experience level.",
            type: "info",
          },
        ]);
        return;
      }

      setFilters(extracted);
      setExpandedCard(null);

      const results = filterAndScore(allCandidates, extracted);

      let state: AppState = "results";
      if (results.length === 0) {
        state = "zero-results";
      } else if (results.length >= TOO_BROAD_THRESHOLD) {
        state = "too-broad";
      }

      if (results.length > 0) {
        setExpandedCard(results[0].id);
      }

      setAppState(state);

      const dimensionCount = extracted.length;
      const extractionMsg =
        state === "zero-results"
          ? `${dimensionCount} search dimension${dimensionCount !== 1 ? "s" : ""} found, but no candidates match all criteria. Try relaxing some filters.`
          : state === "too-broad"
            ? `${dimensionCount} search dimension${dimensionCount !== 1 ? "s" : ""} found, but the search is quite broad (${results.length}+ matches). Consider adding more specific filters.`
            : `${dimensionCount} search dimension${dimensionCount !== 1 ? "s" : ""} found in your prompt. They've been automatically applied as filters.\n\nYou can edit or remove any filter directly, or tell me what to change.`;

      setAiMessages([
        {
          role: "system",
          content: `"${q}"`,
          type: "info",
        },
        {
          role: "assistant",
          content: extractionMsg,
          type: "extraction",
          filters: extracted,
        },
      ]);
    },
    [prompt]
  );

  const handleLocationChange = useCallback((newLocation: string) => {
    setFilters((prev) => {
      const hasLocation = prev.some((f) => f.type === "Location");
      if (hasLocation) {
        return prev.map((f) =>
          f.type === "Location"
            ? { ...f, value: newLocation, source: "manual" as const }
            : f
        );
      }
      return [...prev, { type: "Location", value: newLocation, source: "manual" as const }];
    });
    setAiMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Location updated to **${newLocation}**.`,
        type: "info",
      },
    ]);
  }, []);

  const handleUserMessage = useCallback(
    (message: string) => {
      setAiMessages((prev) => [...prev, { role: "user", content: message }]);

      const locationConflict = extractLocationFromMessage(message, filters);

      if (locationConflict) {
        setTimeout(() => {
          setAppState("conflict");
          setAiMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "",
              type: "conflict",
              conflictData: {
                title: "Conflicting location",
                description: `You mentioned **${locationConflict.newLocation}** but you already have a **${locationConflict.conflictsWith}** filter applied.`,
                options: [
                  { label: `Include Both`, primary: true },
                  { label: `Change to ${locationConflict.newLocation}` },
                  { label: `Keep ${locationConflict.conflictsWith}` },
                ],
              },
            },
          ]);
        }, 400);
      } else {
        const newFilters = extractFilters(message);
        if (newFilters.length > 0) {
          setTimeout(() => {
            setFilters((prev) => {
              const updated = [...prev];
              for (const nf of newFilters) {
                const existingIdx = updated.findIndex((f) => f.type === nf.type && nf.type !== "Skill");
                if (existingIdx >= 0) {
                  updated[existingIdx] = nf;
                } else if (nf.type === "Skill" && !updated.some((f) => f.type === "Skill" && f.value === nf.value)) {
                  updated.push(nf);
                } else if (nf.type !== "Skill") {
                  updated.push(nf);
                }
              }
              return updated;
            });
            setAiMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `Got it. I've updated the search with ${newFilters.length} new dimension${newFilters.length !== 1 ? "s" : ""}.`,
                type: "info",
              },
            ]);
          }, 400);
        } else {
          setTimeout(() => {
            setAiMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "I understand. Let me know if you'd like to adjust any filters or refine the search.",
                type: "info",
              },
            ]);
          }, 400);
        }
      }
    },
    [filters]
  );

  const handleConflictResolve = useCallback(
    (option: string) => {
      const locationConflict = filters.find((f) => f.type === "Location");
      const currentLoc = locationConflict?.value || "";

      if (option.startsWith("Include Both")) {
        setFilters((prev) => prev.filter((f) => f.type !== "Location"));
        setAiMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `**Location conflict resolved.** Removed the location filter to search across all locations.`,
            type: "resolution",
          },
        ]);
        setAppState("results");
      } else if (option.startsWith("Change to")) {
        const newLoc = option.replace("Change to ", "");
        setFilters((prev) =>
          prev.map((f) => (f.type === "Location" ? { ...f, value: newLoc } : f))
        );
        setAiMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Location changed to **${newLoc}**.`,
            type: "resolution",
          },
        ]);
        setAppState("results");
      } else {
        setAiMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Keeping **${currentLoc}** as the location filter.`,
            type: "resolution",
          },
        ]);
        setAppState("results");
      }
    },
    [filters]
  );

  const handleRemoveFilter = useCallback((index: number) => {
    setFilters((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setAppState("start");
        setPrompt("");
        setAiMessages([]);
        return updated;
      }
      return updated;
    });
  }, []);

  const handleRelaxFilter = useCallback(
    (filterType?: string) => {
      if (filterType) {
        setFilters((prev) => {
          const updated = prev.filter((f) => f.type !== filterType);
          if (updated.length === 0) {
            setAppState("start");
            setPrompt("");
            setAiMessages([]);
            return updated;
          }
          return updated;
        });
        setAiMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Removed the **${filterType}** filter. Showing updated results.`,
            type: "info",
          },
        ]);
      } else {
        if (filters.length > 1) {
          const lastFilter = filters[filters.length - 1];
          setFilters((prev) => prev.slice(0, -1));
          setAiMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Relaxed filters by removing **${lastFilter.type}: ${lastFilter.value}**. Showing updated results.`,
              type: "info",
            },
          ]);
        }
      }
      setAppState("results");
    },
    [filters]
  );

  const handleClearFilters = useCallback(() => {
    setFilters([]);
    setAiMessages([]);
    setAppState("start");
    setPrompt("");
    setExpandedCard(null);
  }, []);

  const resultCount =
    appState === "zero-results"
      ? "0"
      : String(filteredCandidates.length);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex flex-1 overflow-hidden relative">
          {appState === "start" ? (
            <StartState
              prompt={prompt}
              setPrompt={setPrompt}
              onSearch={handleSearch}
              inputRef={inputRef}
            />
          ) : (
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-8 pt-6 pb-6">
                <SearchResults
                  prompt={prompt}
                  filters={filters}
                  candidates={filteredCandidates}
                  resultCount={resultCount}
                  appState={appState}
                  expandedCard={expandedCard}
                  onExpandCard={setExpandedCard}
                  onSearch={handleSearch}
                  onLocationChange={handleLocationChange}
                  onClearFilters={handleClearFilters}
                  onRemoveFilter={handleRemoveFilter}
                  onOpenFilterSidebar={() => setShowFilterSidebar(true)}
                  onRelaxFilter={handleRelaxFilter}
                  locationFilter={filters.find((f) => f.type === "Location")?.value || ""}
                />
              </div>
              <AIPanel
                messages={aiMessages}
                onSendMessage={handleUserMessage}
                onConflictResolve={handleConflictResolve}
                appState={appState}
              />
            </div>
          )}
          {showFilterSidebar && (
            <FilterSidebar
              filters={filters}
              onClose={() => setShowFilterSidebar(false)}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setShowFilterSidebar(false);
              }}
              locationFilter={filters.find((f) => f.type === "Location")?.value || ""}
              onLocationChange={(loc) => {
                handleLocationChange(loc);
                setShowFilterSidebar(false);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
