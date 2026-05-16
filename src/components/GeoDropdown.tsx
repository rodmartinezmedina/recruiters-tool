"use client";

import { useEffect, useRef } from "react";

interface Props {
  selectedLocations: string[];
  onToggle: (location: string) => void;
  onClose: () => void;
}

const GEO_DATA: Record<string, { cities: string[] }> = {
  Germany: { cities: ["Berlin", "Munich", "Hamburg"] },
  Spain: { cities: ["Madrid", "Barcelona", "Valencia"] },
  Netherlands: { cities: ["Amsterdam", "Rotterdam"] },
  France: { cities: ["Paris", "Lyon"] },
  Portugal: { cities: ["Lisbon", "Porto"] },
  UK: { cities: ["London", "Manchester"] },
  Sweden: { cities: ["Stockholm"] },
  Italy: { cities: ["Milan", "Rome"] },
  Poland: { cities: ["Warsaw", "Krakow"] },
  Denmark: { cities: ["Copenhagen"] },
  Ireland: { cities: ["Dublin"] },
  Switzerland: { cities: ["Zurich"] },
  "Czech Republic": { cities: ["Prague"] },
  Austria: { cities: ["Vienna"] },
  Romania: { cities: ["Bucharest"] },
  Estonia: { cities: ["Tallinn"] },
  Finland: { cities: ["Helsinki"] },
  Croatia: { cities: ["Zagreb"] },
};

export default function GeoDropdown({ selectedLocations, onToggle, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const selectedSet = new Set(selectedLocations.map((l) => l.toLowerCase()));

  const COUNTRY_ALIASES: Record<string, string> = {
    "united kingdom": "UK",
    uk: "UK",
  };

  function isCitySelected(city: string, country: string): boolean {
    if (selectedSet.has(city.toLowerCase())) return true;
    if (selectedSet.has(country.toLowerCase())) return true;
    const alias = COUNTRY_ALIASES[country.toLowerCase()];
    if (alias && selectedSet.has(alias.toLowerCase())) return true;
    return false;
  }

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 w-[320px] bg-white rounded-lg border border-border shadow-lg z-50 max-h-[400px] overflow-y-auto"
    >
      <div className="px-4 py-2 text-xs text-text-secondary border-b border-border flex items-center justify-between">
        <span>
          {selectedLocations.length > 0
            ? `${selectedLocations.length} selected`
            : "Select locations"}
        </span>
        {selectedLocations.length > 0 && (
          <button
            onClick={() => {
              for (const loc of selectedLocations) {
                onToggle(loc);
              }
            }}
            className="text-accent hover:underline font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="py-1">
        {Object.entries(GEO_DATA).map(([country, data]) => (
          <div key={country}>
            <div className="px-4 py-1.5 text-[11px] font-semibold text-text-tertiary uppercase tracking-wide">
              {country}
            </div>
            {data.cities.map((city) => {
              const isSelected = isCitySelected(city, country);
              return (
                <button
                  key={city}
                  onClick={() => onToggle(city)}
                  className={`w-full px-6 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                    isSelected
                      ? "bg-accent-light text-accent font-medium"
                      : "text-text-primary hover:bg-chip-bg"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-accent border-accent" : "border-border"
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
  );
}
