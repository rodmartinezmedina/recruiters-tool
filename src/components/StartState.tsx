"use client";

import { RefObject } from "react";

interface Props {
  prompt: string;
  setPrompt: (v: string) => void;
  onSearch: (prompt?: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

const EXAMPLES = [
  "Senior backend engineer with Python experience in Berlin, open to remote",
  "Frontend developer with React and TypeScript in Amsterdam",
  "DevOps engineer with Kubernetes and AWS, 5+ years, Madrid",
  "Product designer with Figma in London or Barcelona, hybrid",
];

const FILTER_CHIPS = ["+ Title", "+ Skills", "+ Location", "+ Work pref", "+ Experience"];

export default function StartState({ prompt, setPrompt, onSearch, inputRef }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center pt-20 px-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-3">Find your next hire</h2>
      <p className="text-sm text-text-secondary mb-8">
        Describe who you&apos;re looking for in plain language.
      </p>

      <div className="w-full max-w-[920px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="flex gap-2 mb-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your ideal candidate..."
            className="flex-1 h-11 px-4 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <button
            type="submit"
            className="h-11 px-5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            Search
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mb-4">or add filters manually</p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-text-primary bg-white hover:bg-chip-bg transition-colors"
            >
              {chip}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-text-primary bg-white hover:bg-chip-bg transition-colors flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary">
              <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            All filters
          </button>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-center text-xs font-medium text-text-tertiary tracking-wide uppercase mb-4">
            Try a search to get started
          </p>
          <div className="flex flex-col gap-3">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                onClick={() => {
                  setPrompt(example);
                  onSearch(example);
                }}
                className="flex items-center gap-3 w-full px-4 py-4 bg-white rounded-lg border border-border text-sm text-text-secondary hover:border-accent-border hover:bg-accent-light/30 transition-colors text-left"
              >
                <div className="w-5 h-5 rounded border border-border shrink-0" />
                &ldquo;{example}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
