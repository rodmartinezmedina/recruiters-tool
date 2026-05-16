"use client";

import { Candidate } from "@/data/candidates";

interface Props {
  candidate: Candidate;
  expanded: boolean;
  onToggle: () => void;
}

function tagColor(source: "prompt" | "filter" | "partial") {
  switch (source) {
    case "prompt":
      return "bg-accent-light text-accent border-accent-border";
    case "filter":
      return "bg-white text-text-primary border-border";
    case "partial":
      return "bg-conflict-bg text-conflict-border border-conflict-border";
  }
}

function scoreColor(score: number) {
  if (score >= 90) return "bg-confirmed-border text-white";
  if (score >= 80) return "bg-confirmed-bg text-confirmed-border";
  return "bg-chip-bg text-text-secondary";
}

export default function CandidateCard({ candidate, expanded, onToggle }: Props) {
  return (
    <div className="bg-white rounded-lg border border-border p-4 hover:border-accent-border/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-border shrink-0 flex items-center justify-center text-xs font-medium text-text-secondary">
          {candidate.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{candidate.name}</h3>
              <p className="text-[13px] text-text-secondary">
                {candidate.title} &middot; {candidate.company}
              </p>
              <p className="text-[13px] text-text-tertiary">
                {candidate.location} &middot; {candidate.experience}
              </p>
            </div>
            <span
              className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${scoreColor(
                candidate.matchScore
              )}`}
            >
              {candidate.matchScore}%
            </span>
          </div>
          <button
            onClick={onToggle}
            className="mt-2 text-xs text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
          >
            {expanded ? "Hide" : "Match"} details
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M3 4l2 2 2-2" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-[11px] text-text-tertiary mb-2">
            <span className="flex items-center gap-1">
              <span className="text-purple">&#10022;</span> From prompt
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-text-secondary inline-block" /> From filter
            </span>
            <span className="flex items-center gap-1">
              <span className="text-conflict-border">&#10022;</span> Partial match
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.matchTags.map((tag, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${tagColor(
                  tag.source
                )}`}
              >
                {tag.source === "prompt" && <span className="text-purple">&#10022;</span>}
                {tag.source === "partial" && (
                  <span className="text-conflict-border">&#10022;</span>
                )}
                {tag.label}
              </span>
            ))}
          </div>
          {candidate.partialMatch && (
            <p className="mt-2 text-xs text-text-secondary">{candidate.partialMatch}</p>
          )}
        </div>
      )}
    </div>
  );
}
