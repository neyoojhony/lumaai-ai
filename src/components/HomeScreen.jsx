import { useState, useRef, useEffect } from "react";
import { useBackClose } from "../useBackClose";

const pills = [
  { label: "Code", icon: <CodeIcon /> },
  { label: "Write", icon: <WriteIcon /> },
  { label: "Learn", icon: <LearnIcon /> },
  { label: "Life stuff", icon: <HeartIcon /> },
  { label: "Luma's choice", icon: <StarIcon /> },
];

const ALL_MODELS = [
  { id: "groq", label: "Luma Pro", desc: "Fast & Powerful • Llama 3.3", color: "#a78bfa" },
  { id: "gemini", label: "Luma", desc: "Smart •", color: "#60a5fa" },
  { id: "gpt4o-mini", label: "GPT-4o Mini", desc: "Fast & Smart", color: "#22c55e" },
  
];

export default function HomeScreen({ onSend, accent, theme, textColor, prefill, onPrefillUsed, user, selectedModel, onModelChange }) {
  const [input, setInput] = useState("");
  const [showPlus, setShowPlus] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (prefill) {
      setInput(prefill.trim());
      textareaRef.current?.focus();
      if (onPrefillUsed) onPrefillUsed();
    }
  }, [prefill]);

  // Plus menu aur model dropdown bhi back button se band ho jayenge
  useBackClose(showPlus, () => setShowPlus(false));
  useBackClose(showModels, () => setShowModels(false));

  const isDark = theme !== "light";
  const bg = isDark ? "#1a1915" : "#f5f5f0";
  const inputBg = isDark ? "#242420" : "#e8e8e3";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const mutedText = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";
  const menuBg = isDark ? "#1e1e1a" : "#f0f0eb";
  const accentMain = accent?.main || "#7c5fe6";
  const accentLight = accent?.light || "#a78bfa";
  const accentBorder = accent?.border || "rgba(124,95,230,0.3)";

  const currentModel = ALL_MODELS.find(m => m.id === (selectedModel || "groq")) || ALL_MODELS[0];

  const greeting = () => {
    const h = new Date().getHours();
    const firstName = user?.displayName?.split(" ")[0] || "there";
    if (h < 12) return `Good morning, ${firstName}`;
    if (h < 17) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setInput(prev => prev + `[File: ${file.name}] `);
    setShowPlus(false);
  };

  const handleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Mic not supported in this browser. Use Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev + transcript);
      textareaRef.current?.focus();
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="luma-page-enter luma-home-pad luma-safe-bottom" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", background: bg, minHeight: 0, overflowY: "auto" }}
      onClick={() => { setShowPlus(false); setShowModels(false); }}>

      {/* Plan badge */}
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 8, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)", border: `0.5px solid ${borderColor}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, color: mutedText }}>
        <span className="luma-plan-badge-text">Free plan</span>
        <span style={{ color: accentLight, cursor: "pointer" }}>Upgrade</span>
      </div>

      {/* Greeting */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 30, marginBottom: 12, color: accentLight }}>✦</div>
        <h1 className="luma-greeting" style={{ fontWeight: 400, color: textColor, letterSpacing: "-0.02em", margin: 0 }}>{greeting()}</h1>
      </div>

      {/* Input */}
      <div style={{ width: "100%", maxWidth: 660, position: "relative" }}>
        <div className="luma-input-glow" style={{ background: inputBg, border: `0.5px solid ${borderColor}`, borderRadius: 14, padding: 16, "--luma-glow-color": accentBorder }}
          onClick={e => e.stopPropagation()}>
          <textarea ref={textareaRef} value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(e); }}
            onKeyDown={handleKey}
            placeholder="How can I help you today?"
            rows={1}
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: textColor, fontSize: 15, resize: "none", fontFamily: "inherit", lineHeight: 1.6, minHeight: 24, maxHeight: 120, overflow: "hidden", boxSizing: "border-box" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            {/* Plus button */}
            <div style={{ position: "relative" }}>
              <button onClick={e => { e.stopPropagation(); setShowPlus(!showPlus); setShowModels(false); }}
                style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: `0.5px solid ${borderColor}`, borderRadius: 6, background: "transparent", color: mutedText, cursor: "pointer", fontSize: 18, flexShrink: 0 }}>+</button>

              {showPlus && (
                <div onClick={e => e.stopPropagation()}
                  style={{ position: "absolute", bottom: "110%", left: 0, background: menuBg, border: `0.5px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", minWidth: 180, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", zIndex: 50 }}>
                  <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
                  <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                  <MenuBtn icon="📎" label="Add files" onClick={() => { fileInputRef.current?.click(); }} borderColor={borderColor} mutedText={mutedText} textColor={textColor} isDark={isDark} />
                  <MenuBtn icon="🖼️" label="Add image" onClick={() => { imageInputRef.current?.click(); }} borderColor={borderColor} mutedText={mutedText} textColor={textColor} isDark={isDark} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {/* Model selector */}
              <div style={{ position: "relative" }}>
                <button onClick={e => { e.stopPropagation(); setShowModels(!showModels); setShowPlus(false); }}
                  style={{ fontSize: 13, color: mutedText, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", background: "none", border: "none", padding: "2px 4px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: currentModel.color, display: "inline-block" }} />
                  {currentModel.label}
                  <span style={{ fontSize: 10 }}>▼</span>
                </button>

                {showModels && (
                  <div onClick={e => e.stopPropagation()}
                    style={{ position: "absolute", bottom: "110%", right: 0, background: menuBg, border: `0.5px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", minWidth: 220, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", zIndex: 50 }}>
                    {ALL_MODELS.map(m => (
                      <button key={m.id} onClick={() => { onModelChange && onModelChange(m.id); setShowModels(false); }}
                        style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: selectedModel === m.id ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)") : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, color: isDark ? "#e8e4d9" : "#1a1a1a", margin: 0, fontWeight: selectedModel === m.id ? 500 : 400 }}>{m.label}</p>
                          <p style={{ fontSize: 11, color: mutedText, margin: 0 }}>{m.desc}</p>
                        </div>
                        {selectedModel === m.id && <span style={{ color: accentMain, fontSize: 14 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mic button */}
              <button onClick={handleMic}
                style={{ background: "none", border: "none", cursor: "pointer", color: isListening ? accentMain : mutedText, transition: "color 0.2s" }}>
                <MicIcon />
              </button>

              {/* Send button */}
              <button onClick={handleSend} disabled={!input.trim()} className="luma-btn-press"
                style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: input.trim() ? accentMain : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"), display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", transition: "background 0.15s ease, transform 0.1s ease" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "#fff" : mutedText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" }}>
          {pills.map((p) => (
            <button key={p.label} onClick={() => setInput(p.label + " - ")}
              style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `0.5px solid ${borderColor}`, borderRadius: 20, padding: "6px 16px", fontSize: 13, color: mutedText, cursor: "pointer" }}>
              {p.icon}{p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuBtn({ icon, label, onClick, borderColor, mutedText, textColor, isDark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: hovered ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)") : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: textColor, fontSize: 13 }}>
      <span>{icon}</span>{label}
    </button>
  );
}

function CodeIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>; }
function WriteIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>; }
function LearnIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function HeartIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>; }
function StarIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function MicIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>; }