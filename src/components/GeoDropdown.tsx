"use client";

import { useEffect, useRef } from "react";

interface Props {
  currentLocation: string;
  onSelect: (location: string) => void;
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

function findCountryForLocation(location: string): string | null {
  const lower = location.toLowerCase();
  for (const [country, data] of Object.entries(GEO_DATA)) {
    if (country.toLowerCase() === lower) return country;
    if (data.cities.some((c) => c.toLowerCase() === lower)) return country;
  }
  return null;
}

export default function GeoDropdown({ currentLocation, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const currentCountry = findCountryForLocation(currentLocation);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 w-[320px] bg-white rounded-lg border border-border shadow-lg z-50 max-h-[400px] overflow-y-auto"
    >
      <div className="px-4 py-2 text-xs text-text-secondary border-b border-border">
        Select a location
      </div>
      <div className="py-1">
        {Object.entries(GEO_DATA).map(([country, data]) => (
          <div key={country}>
            <div className="px-4 py-1.5 text-[11px] font-semibold text-text-tertiary uppercase tracking-wide">
              {country}
            </div>
            {data.cities.map((city) => {
              const isSelected = currentLocation.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  onClick={() => {
                    onSelect(city);
                    onClose();
                  }}
                  className={`w-full px-6 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                    isSelected
                      ? "bg-accent-light text-accent font-medium"
                      : "text-text-primary hover:bg-chip-bg"
                  }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
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
