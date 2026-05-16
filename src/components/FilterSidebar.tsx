"use client";

import { useEffect, useRef, useState } from "react";
import { Filter } from "@/app/page";

interface Props {
  filters: Filter[];
  onClose: () => void;
  onFilterChange: (filters: Filter[]) => void;
  selectedLocations: string[];
  onLocationChange: (location: string) => void;
}

const ALL_LOCATIONS = [
  { country: "Germany", cities: ["Berlin", "Munich", "Hamburg"] },
  { country: "Spain", cities: ["Madrid", "Barcelona", "Valencia"] },
  { country: "Netherlands", cities: ["Amsterdam", "Rotterdam"] },
  { country: "France", cities: ["Paris", "Lyon"] },
  { country: "Portugal", cities: ["Lisbon", "Porto"] },
  { country: "UK", cities: ["London", "Manchester"] },
  { country: "Sweden", cities: ["Stockholm"] },
  { country: "Italy", cities: ["Milan", "Rome"] },
  { country: "Poland", cities: ["Warsaw", "Krakow"] },
  { country: "Denmark", cities: ["Copenhagen"] },
  { country: "Ireland", cities: ["Dublin"] },
  { country: "Switzerland", cities: ["Zurich"] },
  { country: "Czech Republic", cities: ["Prague"] },
  { country: "Austria", cities: ["Vienna"] },
];

const WORK_PREFS = ["Remote (EU)", "Hybrid", "On-site"];

const EXPERIENCE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+ years", value: "+1 years" },
  { label: "3+ years", value: "+3 years" },
  { label: "5+ years", value: "+5 years" },
  { label: "8+ years", value: "+8 years" },
  { label: "10+ years", value: "+10 years" },
];

const SKILL_OPTIONS = [
  "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "React", "Vue",
  "Angular", "Node.js", "Django", "Kubernetes", "Docker", "AWS", "PostgreSQL",
  "GraphQL", "Figma", "Swift", "Kotlin", "Terraform",
];

export default function FilterSidebar({
  filters,
  onClose,
  onFilterChange,
  selectedLocations,
  onLocationChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const titleFilter = filters.find((f) => f.type === "Title");
  const skillFilters = filters.filter((f) => f.type === "Skill");
  const expFilter = filters.find((f) => f.type === "Experience");
  const workFilters = filters.filter((f) => f.type === "Work pref");

  const filteredLocations = locationSearch
    ? ALL_LOCATIONS.map((group) => ({
        ...group,
        cities: group.cities.filter((c) =>
          c.toLowerCase().includes(locationSearch.toLowerCase())
        ),
      })).filter(
        (group) =>
          group.cities.length > 0 ||
          group.country.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : ALL_LOCATIONS;

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
            f.type === "Experience" ? { ...f, value, source: "manual" } : f
          )
        );
      } else {
        onFilterChange([...filters, { type: "Experience", value, source: "manual" }]);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/10" onClick={onClose} />
      <div
        ref={ref}
        className="absolute right-0 top-0 bottom-0 w-[340px] bg-white border-l border-border overflow-y-auto"
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <span className="text-xs font-semibold text-text-tertiary tracking-wide uppercase">
            Filters
          </span>
          <button
            onClick={() => onFilterChange([])}
            className="text-xs font-medium text-accent hover:underline"
          >
            Clear all
          </button>
        </div>

        {/* Title */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm text-text-primary">Title</span>
          <span className={`text-xs font-medium ${titleFilter ? "text-accent" : "text-text-tertiary"}`}>
            {titleFilter?.value || "Any"}
          </span>
        </div>

        {/* Skills */}
        <div className="px-5 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-primary">Skills</span>
            <span className={`text-xs font-medium ${skillFilters.length > 0 ? "text-accent" : "text-text-tertiary"}`}>
              {skillFilters.length > 0
                ? `${skillFilters.length} selected`
                : "Any"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
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

        {/* Experience */}
        <div className="px-5 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-primary">Experience</span>
            <span className={`text-xs font-medium ${expFilter ? "text-accent" : "text-text-tertiary"}`}>
              {expFilter?.value || "Any"}
            </span>
          </div>
          <div className="space-y-0.5">
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

        {/* Location */}
        <div className="px-5 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-primary">Location</span>
            <span className={`text-xs font-medium ${selectedLocations.length > 0 ? "text-accent" : "text-text-tertiary"}`}>
              {selectedLocations.length > 0 ? `${selectedLocations.length} selected` : "Any"}
            </span>
          </div>
          <input
            type="text"
            placeholder="Search city..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full h-8 px-3 mb-2 rounded border border-border text-xs placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <div className="max-h-[200px] overflow-y-auto space-y-0.5">
            {filteredLocations.map((group) => (
              <div key={group.country}>
                <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide px-2 py-1">
                  {group.country}
                </div>
                {group.cities.map((city) => {
                  const isSelected = selectedLocations.some((l) => l.toLowerCase() === city.toLowerCase());
                  return (
                    <button
                      key={city}
                      onClick={() => onLocationChange(city)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                        isSelected
                          ? "text-accent font-medium bg-accent-light"
                          : "text-text-primary hover:bg-chip-bg"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? "bg-accent border-accent"
                            : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      {city}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Work Arrangement */}
        <div className="px-5 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-primary">Work Arrangement</span>
            <span className={`text-xs font-medium ${workFilters.length > 0 ? "text-accent" : "text-text-tertiary"}`}>
              {workFilters.length > 0 ? `${workFilters.length} selected` : "Any"}
            </span>
          </div>
          <div className="space-y-0.5">
            {WORK_PREFS.map((pref) => {
              const isActive = workFilters.some((f) => f.value === pref);
              return (
                <button
                  key={pref}
                  onClick={() => {
                    if (isActive) {
                      onFilterChange(filters.filter((f) => !(f.type === "Work pref" && f.value === pref)));
                    } else {
                      onFilterChange([...filters, { type: "Work pref", value: pref, source: "manual" }]);
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                    isActive
                      ? "text-accent font-medium bg-accent-light"
                      : "text-text-primary hover:bg-chip-bg"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isActive
                        ? "bg-accent border-accent"
                        : "border-border"
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

        {/* Industry */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm text-text-primary">Industry</span>
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-text-tertiary">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Languages */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm text-text-primary">Languages</span>
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-text-tertiary">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Last active */}
        <div className="px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-text-primary">Last active</span>
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-text-tertiary">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
