"use client";

import { useEffect, useRef, useState } from "react";
import { Filter } from "@/app/page";

interface Props {
  filters: Filter[];
  onClose: () => void;
  onFilterChange: (filters: Filter[]) => void;
  onClearAll: () => void;
  selectedLocations: string[];
  onLocationChange: (location: string) => void;
}

type SectionKey = "title" | "skills" | "experience" | "location" | "workpref" | "industry" | "languages" | "lastactive";

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

const TITLE_OPTIONS = [
  "Backend Engineer", "Frontend Engineer", "Fullstack Engineer",
  "DevOps Engineer", "Data Engineer", "ML Engineer",
  "Mobile Engineer", "Product Designer", "Product Manager",
];

const SKILL_OPTIONS = [
  "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "React", "Vue",
  "Angular", "Node.js", "Django", "Kubernetes", "Docker", "AWS", "PostgreSQL",
  "GraphQL", "Figma", "Swift", "Kotlin", "Terraform",
];

const INDUSTRY_OPTIONS = [
  "Fintech", "E-commerce", "SaaS", "Delivery", "Mobility", "HealthTech",
  "AdTech", "HR Tech", "EdTech", "Dev Tools", "Design Tools", "AI / ML",
  "Marketplace", "Travel", "Green Tech", "Payments", "Automation", "Media",
];

const LANGUAGE_OPTIONS = [
  "English", "German", "Spanish", "French", "Dutch", "Italian", "Portuguese",
  "Swedish", "Polish", "Czech", "Romanian", "Danish", "Finnish", "Croatian",
  "Russian", "Estonian", "Norwegian", "Catalan", "Mandarin", "Hindi",
];

const LAST_ACTIVE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
];

export default function FilterSidebar({
  filters,
  onClose,
  onFilterChange,
  onClearAll,
  selectedLocations,
  onLocationChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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
  const industryFilters = filters.filter((f) => f.type === "Industry");
  const languageFilters = filters.filter((f) => f.type === "Language");
  const lastActiveFilter = filters.find((f) => f.type === "Last active");

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

  function toggleIndustry(industry: string) {
    const exists = industryFilters.some((f) => f.value === industry);
    if (exists) {
      onFilterChange(filters.filter((f) => !(f.type === "Industry" && f.value === industry)));
    } else {
      onFilterChange([...filters, { type: "Industry", value: industry, source: "manual" }]);
    }
  }

  function toggleLanguage(language: string) {
    const exists = languageFilters.some((f) => f.value === language);
    if (exists) {
      onFilterChange(filters.filter((f) => !(f.type === "Language" && f.value === language)));
    } else {
      onFilterChange([...filters, { type: "Language", value: language, source: "manual" }]);
    }
  }

  function setLastActive(value: string) {
    if (!value) {
      onFilterChange(filters.filter((f) => f.type !== "Last active"));
    } else {
      const has = filters.some((f) => f.type === "Last active");
      if (has) {
        onFilterChange(
          filters.map((f) =>
            f.type === "Last active" ? { ...f, value, source: "manual" as const } : f
          )
        );
      } else {
        onFilterChange([...filters, { type: "Last active", value, source: "manual" }]);
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
        {showClearConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
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
                  onClick={() => { setShowClearConfirm(false); onClose(); onClearAll(); }}
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent/90 transition-colors"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <span className="text-xs font-semibold text-text-tertiary tracking-wide uppercase">
            Filters
          </span>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs font-medium text-accent hover:underline"
          >
            Clear all
          </button>
        </div>

        {/* Title */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("title")}
            className="w-full px-5 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary">Title</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${titleFilter ? "text-accent" : "text-text-tertiary"}`}>
                {titleFilter?.value || "Any"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`text-text-primary transition-transform ${openSections.has("title") ? "rotate-180" : ""}`}
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </button>
          {openSections.has("title") && (
            <div className="px-5 pb-3">
              <div className="space-y-0.5">
                <button
                  onClick={() => setTitle("")}
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
          )}
        </div>

        {/* Skills */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("skills")}
            className="w-full px-5 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary">Skills</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${skillFilters.length > 0 ? "text-accent" : "text-text-tertiary"}`}>
                {skillFilters.length > 0 ? `${skillFilters.length} selected` : "Any"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`text-text-primary transition-transform ${openSections.has("skills") ? "rotate-180" : ""}`}
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </button>
          {openSections.has("skills") && (
            <div className="px-5 pb-3">
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
          )}
        </div>

        {/* Experience */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("experience")}
            className="w-full px-5 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary">Experience</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${expFilter ? "text-accent" : "text-text-tertiary"}`}>
                {expFilter?.value || "Any"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`text-text-primary transition-transform ${openSections.has("experience") ? "rotate-180" : ""}`}
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </button>
          {openSections.has("experience") && (
            <div className="px-5 pb-3">
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
          )}
        </div>

        {/* Location */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("location")}
            className="w-full px-5 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary">Location</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${selectedLocations.length > 0 ? "text-accent" : "text-text-tertiary"}`}>
                {selectedLocations.length > 0 ? `${selectedLocations.length} selected` : "Any"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`text-text-primary transition-transform ${openSections.has("location") ? "rotate-180" : ""}`}
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </button>
          {openSections.has("location") && (
            <div className="px-5 pb-3">
              <input
                type="text"
                placeholder="Search city..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full h-8 px-3 mb-2 rounded border border-border text-xs placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <div className="max-h-[200px] overflow-y-auto space-y-0.5">
                {filteredLocations.map((group) => {
                  const countrySelected = selectedLocations.some(
                    (l) => l.toLowerCase() === group.country.toLowerCase()
                  );
                  return (
                    <div key={group.country}>
                      <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide px-2 py-1">
                        {group.country}
                      </div>
                      <button
                        onClick={() => onLocationChange(group.country)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                          countrySelected
                            ? "text-accent font-medium bg-accent-light"
                            : "text-text-primary hover:bg-chip-bg"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            countrySelected
                              ? "bg-accent border-accent"
                              : "border-border"
                          }`}
                        >
                          {countrySelected && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                        All of {group.country}
                      </button>
                      {group.cities.map((city) => {
                        const isSelected = selectedLocations.some((l) => l.toLowerCase() === city.toLowerCase());
                        return (
                          <button
                            key={city}
                            onClick={() => onLocationChange(city)}
                            className={`w-full flex items-center gap-2 pl-5 pr-2 py-1.5 rounded text-sm text-left transition-colors ${
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
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Work Arrangement */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("workpref")}
            className="w-full px-5 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary">Work Arrangement</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${workFilters.length > 0 ? "text-accent" : "text-text-tertiary"}`}>
                {workFilters.length > 0 ? `${workFilters.length} selected` : "Any"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`text-text-primary transition-transform ${openSections.has("workpref") ? "rotate-180" : ""}`}
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </button>
          {openSections.has("workpref") && (
            <div className="px-5 pb-3">
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
          )}
        </div>

        {/* Industry */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("industry")}
            className="w-full px-5 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary">Industry</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${industryFilters.length > 0 ? "text-accent" : "text-text-tertiary"}`}>
                {industryFilters.length > 0 ? `${industryFilters.length} selected` : "Any"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`text-text-primary transition-transform ${openSections.has("industry") ? "rotate-180" : ""}`}
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </button>
          {openSections.has("industry") && (
            <div className="px-5 pb-3">
              <div className="flex flex-wrap gap-1.5">
                {INDUSTRY_OPTIONS.map((industry) => {
                  const isActive = industryFilters.some((f) => f.value === industry);
                  return (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        isActive
                          ? "bg-accent text-white border-accent"
                          : "bg-white text-text-primary border-border hover:bg-chip-bg"
                      }`}
                    >
                      {industry}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("languages")}
            className="w-full px-5 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary">Languages</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${languageFilters.length > 0 ? "text-accent" : "text-text-tertiary"}`}>
                {languageFilters.length > 0 ? `${languageFilters.length} selected` : "Any"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`text-text-primary transition-transform ${openSections.has("languages") ? "rotate-180" : ""}`}
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </button>
          {openSections.has("languages") && (
            <div className="px-5 pb-3">
              <div className="space-y-0.5">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isActive = languageFilters.some((f) => f.value === lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
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
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Last active */}
        <div>
          <button
            onClick={() => toggleSection("lastactive")}
            className="w-full px-5 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary">Last active</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${lastActiveFilter ? "text-accent" : "text-text-tertiary"}`}>
                {lastActiveFilter ? LAST_ACTIVE_OPTIONS.find((o) => o.value === lastActiveFilter.value)?.label || lastActiveFilter.value : "Any"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`text-text-primary transition-transform ${openSections.has("lastactive") ? "rotate-180" : ""}`}
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </button>
          {openSections.has("lastactive") && (
            <div className="px-5 pb-3">
              <div className="space-y-0.5">
                {LAST_ACTIVE_OPTIONS.map((opt) => {
                  const isActive = opt.value
                    ? lastActiveFilter?.value === opt.value
                    : !lastActiveFilter;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setLastActive(opt.value)}
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
          )}
        </div>
      </div>
    </div>
  );
}
