"use client";

export default function TopBar() {
  return (
    <header className="h-[60px] bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold text-text-primary">Candidate Search</h1>
      <div className="flex items-center gap-4">
        <div className="w-5 h-5 rounded bg-border" />
        <div className="w-8 h-8 rounded-full bg-border" />
      </div>
    </header>
  );
}
