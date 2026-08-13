export default function CustomizePanel({
  theme, setTheme,
  fontSize, setFontSize,
  accentColor, setAccentColor,
  bubbleStyle, setBubbleStyle,
  onClose, accent, sidebarBg, textColor
}) {
  const panelBg = theme === "dark" ? "#1a1915" : "#f0f0eb";
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const mutedText = theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const hoverBg = theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const activeBg = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.4)" }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
        width: "min(300px, 90vw)", background: panelBg,
        borderLeft: `0.5px solid ${borderColor}`,
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.3)"
      }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `0.5px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: textColor }}>Customize</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {/* Theme */}
          <Section label="Theme" mutedText={mutedText}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <OptionBtn label="🌙 Dark" active={theme === "dark"} accent={accent} activeBg={activeBg} hoverBg={hoverBg} borderColor={borderColor} textColor={textColor} mutedText={mutedText} onClick={() => setTheme("dark")} />
              <OptionBtn label="☀️ Light" active={theme === "light"} accent={accent} activeBg={activeBg} hoverBg={hoverBg} borderColor={borderColor} textColor={textColor} mutedText={mutedText} onClick={() => setTheme("light")} />
            </div>
          </Section>

          {/* Font Size */}
          <Section label="Font Size" mutedText={mutedText}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <OptionBtn label="Small" active={fontSize === "small"} accent={accent} activeBg={activeBg} hoverBg={hoverBg} borderColor={borderColor} textColor={textColor} mutedText={mutedText} onClick={() => setFontSize("small")} />
              <OptionBtn label="Medium" active={fontSize === "medium"} accent={accent} activeBg={activeBg} hoverBg={hoverBg} borderColor={borderColor} textColor={textColor} mutedText={mutedText} onClick={() => setFontSize("medium")} />
              <OptionBtn label="Large" active={fontSize === "large"} accent={accent} activeBg={activeBg} hoverBg={hoverBg} borderColor={borderColor} textColor={textColor} mutedText={mutedText} onClick={() => setFontSize("large")} />
            </div>
          </Section>

          {/* Accent Color */}
          <Section label="Accent Color" mutedText={mutedText}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {[
                { id: "purple", color: "#7c5fe6", label: "Purple" },
                { id: "blue",   color: "#3b82f6", label: "Blue" },
                { id: "green",  color: "#22c55e", label: "Green" },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setAccentColor(c.id)}
                  title={c.label}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: c.color, border: "none", cursor: "pointer",
                    outline: accentColor === c.id ? `2px solid ${c.color}` : "2px solid transparent",
                    outlineOffset: 3,
                    transition: "outline 0.2s"
                  }}
                />
              ))}
              <span style={{ fontSize: 12, color: mutedText, marginLeft: 4 }}>
                {accentColor.charAt(0).toUpperCase() + accentColor.slice(1)}
              </span>
            </div>
          </Section>

          {/* Bubble Style */}
          <Section label="Chat Bubble Style" mutedText={mutedText}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <OptionBtn label="Minimal" active={bubbleStyle === "minimal"} accent={accent} activeBg={activeBg} hoverBg={hoverBg} borderColor={borderColor} textColor={textColor} mutedText={mutedText} onClick={() => setBubbleStyle("minimal")} />
              <OptionBtn label="Rounded" active={bubbleStyle === "rounded"} accent={accent} activeBg={activeBg} hoverBg={hoverBg} borderColor={borderColor} textColor={textColor} mutedText={mutedText} onClick={() => setBubbleStyle("rounded")} />
              <OptionBtn label="Modern" active={bubbleStyle === "modern"} accent={accent} activeBg={activeBg} hoverBg={hoverBg} borderColor={borderColor} textColor={textColor} mutedText={mutedText} onClick={() => setBubbleStyle("modern")} />
            </div>
          </Section>

          {/* Preview */}
          <Section label="Preview" mutedText={mutedText}>
            <div style={{ background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderRadius: 10, padding: 12, border: `0.5px solid ${borderColor}` }}>
              {/* AI bubble */}
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${accent.main}, ${accent.light})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>L</div>
                <div style={{
                  padding: "6px 10px", fontSize: 12, color: textColor, maxWidth: "80%",
                  background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
                  border: `0.5px solid ${borderColor}`,
                  borderRadius: bubbleStyle === "minimal" ? 6 : bubbleStyle === "rounded" ? 16 : 10,
                }}>
                  Hello! How can I help you?
                </div>
              </div>
              {/* User bubble */}
              <div style={{ display: "flex", gap: 8, flexDirection: "row-reverse" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: accent.bg, border: `0.5px solid ${accent.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: accent.light, flexShrink: 0 }}>A</div>
                <div style={{
                  padding: "6px 10px", fontSize: 12, color: accent.light, maxWidth: "80%",
                  background: accent.bg, border: `0.5px solid ${accent.border}`,
                  borderRadius: bubbleStyle === "minimal" ? 6 : bubbleStyle === "rounded" ? 16 : 10,
                }}>
                  Tell me something cool!
                </div>
              </div>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `0.5px solid ${borderColor}` }}>
          <button
            onClick={onClose}
            style={{ width: "100%", padding: "9px", borderRadius: 8, background: accent.main, border: "none", color: "#fff", fontSize: 13, cursor: "pointer" }}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ label, mutedText, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontSize: 11, color: mutedText, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{label}</p>
      {children}
    </div>
  );
}

function OptionBtn({ label, active, accent, activeBg, hoverBg, borderColor, textColor, mutedText, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 8px", borderRadius: 7, fontSize: 12, cursor: "pointer",
        background: active ? activeBg : "transparent",
        border: active ? `0.5px solid ${accent.main}` : `0.5px solid ${borderColor}`,
        color: active ? accent.light : mutedText,
        transition: "all 0.15s"
      }}
    >
      {label}
    </button>
  );
}