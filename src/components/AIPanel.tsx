"use client";

import { useState, useRef, useEffect } from "react";
import { AIMessage, AppState, Filter } from "@/app/page";

interface Props {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  onConflictResolve: (option: string) => void;
  appState: AppState;
  collapsed: boolean;
  onToggle: () => void;
}

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function AIPanel({
  messages,
  onSendMessage,
  onConflictResolve,
  appState,
  collapsed,
  onToggle,
}: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  if (collapsed) {
    return (
      <div className="w-14 bg-white border-l border-border flex flex-col items-center shrink-0 h-full pt-3 pb-3 gap-3">
        <button
          onClick={onToggle}
          aria-label="Expand AI Assistant"
          title="AI Assistant"
          className="w-8 h-8 rounded-md text-text-secondary hover:text-text-primary hover:bg-chip-bg border border-border bg-white flex items-center justify-center transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-md flex items-center justify-center text-purple text-xl">
          &#10022;
        </div>
      </div>
    );
  }

  return (
    <div className="w-[300px] bg-white border-l border-border flex flex-col shrink-0 h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">AI Assistant</span>
        <div className="flex items-center gap-2">
          <span className="text-purple text-lg">&#10022;</span>
          <button
            onClick={onToggle}
            aria-label="Collapse AI Assistant"
            className="w-8 h-8 rounded-md text-text-secondary hover:text-text-primary hover:bg-chip-bg border border-border bg-white flex items-center justify-center transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg, i) => {
          if (msg.type === "info" && msg.role === "system") {
            return (
              <div key={i} className="bg-accent-light rounded-lg px-4 py-3">
                <p className="text-[13px] text-text-primary">{msg.content}</p>
              </div>
            );
          }

          if (msg.role === "user") {
            return (
              <div key={i} className="bg-chip-bg rounded-lg px-4 py-3">
                <p className="text-[13px] text-text-primary">{msg.content}</p>
              </div>
            );
          }

          if (msg.type === "extraction") {
            return (
              <div key={i} className="rounded-lg bg-purple-light p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-purple" />
                  <span className="text-xs font-semibold text-purple">AI Assistant</span>
                </div>
                <p className="text-[13px] text-text-primary mb-3 whitespace-pre-line">
                  {msg.content}
                </p>
                {msg.filters && (
                  <div className="flex flex-col gap-2">
                    {msg.filters.map((f: Filter, j: number) => (
                      <div
                        key={j}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-white text-xs font-medium text-text-primary self-start"
                      >
                        <span className="text-purple">&#10022;</span>
                        <span className="text-text-secondary font-normal">{f.type}:</span>
                        <span>{f.value}</span>
                        <button className="ml-0.5 text-text-tertiary hover:text-text-primary">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (msg.type === "conflict" && msg.conflictData) {
            const cd = msg.conflictData;
            return (
              <div
                key={i}
                className="rounded-lg border-2 border-conflict-border bg-conflict-bg p-4"
              >
                <h4 className="text-sm font-semibold text-conflict-border mb-1">{cd.title}</h4>
                <p className="text-[13px] text-text-primary mb-3">{renderBold(cd.description)}</p>
                <div className="flex flex-wrap gap-2">
                  {cd.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => onConflictResolve(opt.label)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        opt.primary
                          ? "bg-conflict-border text-white hover:bg-conflict-border/90"
                          : "bg-white border border-conflict-border text-conflict-border hover:bg-conflict-bg"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          if (msg.type === "resolution") {
            return (
              <div key={i} className="rounded-lg bg-purple-light p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple" />
                  <span className="text-xs font-semibold text-purple">AI Assistant</span>
                </div>
                <p className="text-[13px] text-text-primary whitespace-pre-line">
                  {renderBold(msg.content)}
                </p>
              </div>
            );
          }

          return (
            <div key={i} className="rounded-lg bg-purple-light p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-purple" />
                <span className="text-xs font-semibold text-purple">AI Assistant</span>
              </div>
              <p className="text-[13px] text-text-primary whitespace-pre-line">
                {renderBold(msg.content)}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell the assistant what you need..."
            className="flex-1 h-10 px-3 rounded-md border border-border text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-md bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
