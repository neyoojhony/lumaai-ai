import { useState, useRef } from "react";
import { buildWebsite } from "../lib/agentLoop";

const toolLabel = (name, args) => {
  if (name === "list_files") return "Reading project files";
  if (name === "read_file") return `Reading ${args?.path || "file"}`;
  if (name === "write_file") return `Writing ${args?.path || "file"}`;
  return name;
};

export default function AgentBuilder() {
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const logEndRef = useRef(null);

  const pushLog = (entry) => {
    setLog((prev) => [...prev, entry]);
    setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  const handleRun = async () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    setLog([]);
    setPreviewUrl(null);

    try {
      await buildWebsite(prompt.trim(), (event) => {
        if (event.type === "step") pushLog({ kind: "active", text: event.label });
        else if (event.type === "step_done")
          pushLog({ kind: "done", text: event.label });
        else if (event.type === "step_error")
          pushLog({ kind: "error", text: event.label });
        else if (event.type === "tool_call")
          pushLog({ kind: "child", text: toolLabel(event.name, event.args) });
        else if (event.type === "thought" && event.text)
          pushLog({ kind: "note", text: event.text });
        else if (event.type === "preview_ready") setPreviewUrl(event.url);
      });
    } catch (e) {
      pushLog({ kind: "error", text: e.message });
    } finally {
      setRunning(false);
    }
  };

  const icon = (kind) => {
    if (kind === "active") return "⟳";
    if (kind === "done") return "✓";
    if (kind === "error") return "✕";
    if (kind === "note") return "…";
    return "·";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0d10",
        color: "#e7e9ec",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .agent-wrap { max-width: 1100px; margin: 0 auto; }
        .agent-input-row { display: flex; gap: 10px; margin-bottom: 20px; background: #14181d;
          border: 1px solid #22272e; border-radius: 10px; padding: 10px; }
        .agent-grid { display: grid; grid-template-columns: 340px 1fr; gap: 1px; background: #22272e;
          border: 1px solid #22272e; border-radius: 12px; overflow: hidden; min-height: 480px; }
        .agent-panel { background: #101317; padding: 18px; min-width: 0; }
        @media (max-width: 760px) {
          body, .agent-wrap { padding: 0; }
          .agent-input-row { flex-direction: column; align-items: stretch; }
          .agent-input-row button { width: 100%; }
          .agent-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="agent-wrap">
        <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          LumaAI Agent
        </h1>

        <div className="agent-input-row">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRun()}
            placeholder="e.g. Make a landing page for a coffee shop"
            disabled={running}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e7e9ec",
              fontSize: 14,
              padding: "6px 8px",
              minWidth: 0,
            }}
          />
          <button
            onClick={handleRun}
            disabled={running || !prompt.trim()}
            style={{
              background: running ? "#4a3b8f" : "#7c5cff",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: running ? "default" : "pointer",
              flexShrink: 0,
            }}
          >
            {running ? "Building..." : "Build"}
          </button>
        </div>

        <div className="agent-grid">
          <div className="agent-panel">
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#8b929c",
                marginBottom: 14,
              }}
            >
              Build log
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 12.5,
                maxHeight: 440,
                overflowY: "auto",
              }}
            >
              {log.length === 0 && (
                <span style={{ color: "#8b929c" }}>
                  Type what you want built, then hit Build.
                </span>
              )}
              {log.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingLeft: entry.kind === "child" ? 16 : 0,
                    color:
                      entry.kind === "error"
                        ? "#f2665e"
                        : entry.kind === "child" || entry.kind === "note"
                        ? "#8b929c"
                        : "#e7e9ec",
                  }}
                >
                  <span style={{ flex: "0 0 14px" }}>{icon(entry.kind)}</span>
                  <span>{entry.text}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          <div className="agent-panel">
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#8b929c",
                marginBottom: 14,
              }}
            >
              Live preview
            </div>
            <div
              style={{
                background: "#0d1013",
                border: "1px solid #22272e",
                borderRadius: 9,
                height: 440,
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {previewUrl ? (
                <iframe
                  title="preview"
                  src={previewUrl}
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              ) : (
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "#8b929c" }}>
                  {running ? "Building your site..." : "No preview yet"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
