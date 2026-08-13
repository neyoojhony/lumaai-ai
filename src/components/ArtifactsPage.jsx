import { useState } from "react";

const categories = [
  { id: "apps", label: "Apps and websites", icon: <GlobeIcon /> },
  { id: "docs", label: "Documents and templates", icon: <DocIcon /> },
  { id: "games", label: "Games", icon: <FlagIcon /> },
  { id: "tools", label: "Productivity tools", icon: <BoltIcon /> },
  { id: "creative", label: "Creative projects", icon: <PaletteIcon /> },
  { id: "quiz", label: "Quiz or survey", icon: <ListIcon /> },
  { id: "scratch", label: "Start from scratch", icon: <PlusCircleIcon />, bold: true },
];

const categoryPrompts = {
  apps: "Build me a simple web app: ",
  docs: "Create a document/template: ",
  games: "Build a simple browser game: ",
  tools: "Create a productivity tool: ",
  creative: "Build a creative project: ",
  quiz: "Create a quiz or survey: ",
  scratch: "Help me build: ",
};

export default function ArtifactsPage({ artifacts, onSelectArtifact, onDeleteArtifact, onStartWithPrompt, theme, textColor, accent }) {
  const isDark = theme !== "light";
  const bg = isDark ? "#1a1915" : "#f5f5f0";
  const cardBg = isDark ? "#1e1e1a" : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const mutedText = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";
  const hoverBorder = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
  const accentMain = accent?.main || "#7c5fe6";

  return (
    <div className="luma-page-enter" style={{ flex: 1, background: bg, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto" }}>
      <div className="luma-page-pad" style={{ paddingBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 400, color: textColor, margin: "0 0 24px" }}>
          Let's get cooking! Pick an artifact category or start building your idea from scratch.
        </h1>
      </div>

      <div className="luma-list-pad">
        <div className="luma-artifact-grid">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onStartWithPrompt(categoryPrompts[cat.id])}
              style={{
                background: cardBg, border: `0.5px solid ${borderColor}`, borderRadius: 14,
                padding: 20, textAlign: "left", cursor: "pointer", minHeight: 100,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                transition: "border-color 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = hoverBorder}
              onMouseLeave={e => e.currentTarget.style.borderColor = borderColor}
            >
              <span style={{ fontSize: 15, fontWeight: cat.bold ? 500 : 400, color: textColor, lineHeight: 1.3 }}>{cat.label}</span>
              <span style={{ color: mutedText, alignSelf: "flex-end" }}>{cat.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Saved artifacts */}
      <div className="luma-page-pad-bottom" style={{ flex: 1, marginTop: 32 }}>
        {artifacts.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: mutedText, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Your artifacts</p>
            <div className="luma-projects-grid">
              {artifacts.map(a => (
                <div
                  key={a.id}
                  onClick={() => onSelectArtifact(a.id)}
                  style={{ background: cardBg, border: `0.5px solid ${borderColor}`, borderRadius: 12, padding: 16, cursor: "pointer", position: "relative" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = hoverBorder}
                  onMouseLeave={e => e.currentTarget.style.borderColor = borderColor}
                >
                  <div style={{ fontSize: 13, color: textColor, marginBottom: 6, fontWeight: 500, paddingRight: 20 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: mutedText }}>{a.type}</div>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteArtifact(a.id); }}
                    style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: mutedText }}
                    onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                    onMouseLeave={e => e.currentTarget.style.color = mutedText}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GlobeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>; }
function DocIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function FlagIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>; }
function BoltIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>; }
function PaletteIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.672 0-.434-.18-.83-.475-1.125-.299-.3-.475-.696-.475-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.555C21.917 6.012 17.435 2 12 2z"/></svg>; }
function ListIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function PlusCircleIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }