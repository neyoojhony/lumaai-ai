import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import hljs from "highlight.js";
import { useBackClose } from "../useBackClose";

function CodeBlock({ children, className, isDark }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const language = className?.replace("language-", "") || "";
  const code = String(children).replace(/\n$/, "");

  useEffect(() => {
    if (codeRef.current) {
      if (language && hljs.getLanguage(language)) {
        codeRef.current.innerHTML = hljs.highlight(code, { language }).value;
      } else {
        codeRef.current.innerHTML = hljs.highlightAuto(code).value;
      }
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative", margin: "10px 0", borderRadius: 10, background: isDark ? "#0d0d0d" : "#1e1e1e", border: "0.5px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)", borderBottom: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "10px 10px 0 0", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "lowercase" }}>{language || "code"}</span>
        <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#86efac" : "rgba(255,255,255,0.5)", fontSize: 12, display: "flex", alignItems: "center", gap: 5, padding: "2px 6px", borderRadius: 4 }}>
          {copied
            ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
          }
        </button>
      </div>
      <pre style={{ margin: 0, padding: "14px 16px", overflowX: "auto", fontSize: 13, lineHeight: 1.6, maxHeight: 400, overflowY: "auto", borderRadius: "0 0 10px 10px" }}>
        <code ref={codeRef} className={`hljs ${language ? `language-${language}` : ""}`} />
      </pre>
    </div>
  );
}

function ModelSelector({ selectedModel, onModelChange, borderColor, mutedText, isDark, accentMain }) {
  const [open, setOpen] = useState(false);
  useBackClose(open, () => setOpen(false));
  const models = [
    { id: "groq", label: "Luma Pro", desc: "Fast & Powerful • Llama 3.3", color: "#a78bfa" },
    { id: "gemini", label: "Luma", desc: "Smart • ", color: "#60a5fa" },
    { id: "gpt4o-mini", label: "GPT-4o Mini", desc: "Fast & Smart", color: "#22c55e" },
   
  ];
  const current = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 8, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `0.5px solid ${borderColor}`, borderRadius: 8, padding: "6px 12px", fontSize: 13, color: mutedText, cursor: "pointer" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
        {current.label}
        <span style={{ fontSize: 10 }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: "110%", left: 0, zIndex: 50, background: isDark ? "#1e1e1a" : "#f0f0eb", border: `0.5px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", minWidth: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            {models.map(m => (
              <button key={m.id} onClick={() => { onModelChange(m.id); setOpen(false); }}
                style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: selectedModel === m.id ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)") : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, color: isDark ? "#e8e4d9" : "#1a1a1a", margin: 0, fontWeight: selectedModel === m.id ? 500 : 400 }}>{m.label}</p>
                  <p style={{ fontSize: 11, color: mutedText, margin: 0 }}>{m.desc}</p>
                </div>
                {selectedModel === m.id && <span style={{ marginLeft: "auto", color: accentMain, fontSize: 14 }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MsgBtn({ onClick, title, children, isDark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)") : "transparent",
        border: "none", cursor: "pointer",
        color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
        padding: "5px 6px", borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s"
      }}>
      {children}
    </button>
  );
}

export default function ChatScreen({ chat, onSend, onRegenerate, suggestions = [], accent, bubbleStyle, theme, textColor, selectedModel, onModelChange }) {
  const [input, setInput] = useState("");
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef(null);

  const isDark = theme !== "light";
  const bg = isDark ? "#1a1915" : "#f5f5f0";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "#242420" : "#e8e8e3";
  const mutedText = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";
  const accentMain = accent?.main || "#7c5fe6";
  const accentLight = accent?.light || "#a78bfa";
  const accentBg = accent?.bg || "rgba(124,95,230,0.2)";
  const accentBorder = accent?.border || "rgba(124,95,230,0.3)";
  const accentBorderVar = accent?.border || "rgba(124,95,230,0.3)";
  const borderRadius = bubbleStyle === "minimal" ? 6 : bubbleStyle === "modern" ? 10 : 16;
  const isLoading = chat.messages[chat.messages.length - 1]?.loading;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, suggestions]);

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

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100%", background: bg }}>
      {/* Topbar */}
      <div className="luma-search-pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, paddingBottom: 12, borderBottom: `0.5px solid ${borderColor}` }}>
        <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} borderColor={borderColor} mutedText={mutedText} isDark={isDark} accentMain={accentMain} />
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 6, border: `0.5px solid ${borderColor}`, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: mutedText, cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 820, display: "flex", flexDirection: "column", gap: 18 }}>
        {chat.messages.map((msg, i) => (
          <div key={i}
            className={msg.role === "user" ? "luma-message-enter-right" : "luma-message-enter-left"}
            onMouseEnter={() => setHoveredMsg(i)}
            onMouseLeave={() => setHoveredMsg(null)}
            style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>

            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 500, flexShrink: 0,
              background: msg.role === "ai" ? `linear-gradient(135deg, ${accentMain}, #3b82f6)` : accentBg,
              color: msg.role === "ai" ? "#fff" : accentLight,
              border: msg.role === "user" ? `0.5px solid ${accentBorder}` : "none"
            }}>
              {msg.role === "ai" ? "L" : "A"}
            </div>

            {/* Content */}
            <div style={{ maxWidth: "85%", display: "flex", flexDirection: "column", gap: 4, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <p style={{ fontSize: 12, color: mutedText, textAlign: msg.role === "user" ? "right" : "left" }}>
                {msg.role === "ai" ? "LumaAI" : "You"}
              </p>

              {/* Edit mode for user messages */}
              {editingMsg === i ? (
                <div style={{ width: "100%", minWidth: 200 }}>
                  <textarea autoFocus value={editText} onChange={e => setEditText(e.target.value)}
                    style={{ width: "100%", background: inputBg, border: `0.5px solid ${accentMain}`, borderRadius: borderRadius, padding: "10px 14px", color: textColor, fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6, minHeight: 60, boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => setEditingMsg(null)} style={{ padding: "5px 12px", borderRadius: 6, border: `0.5px solid ${borderColor}`, background: "transparent", color: mutedText, cursor: "pointer", fontSize: 13 }}>Cancel</button>
                    <button onClick={() => { onSend(editText); setEditingMsg(null); }} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: accentMain, color: "#fff", cursor: "pointer", fontSize: 13 }}>Send</button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: "10px 14px", fontSize: 14, lineHeight: 1.6,
                  borderRadius: borderRadius,
                  background: msg.role === "ai" ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") : accentBg,
                  border: `0.5px solid ${msg.role === "ai" ? borderColor : accentBorder}`,
                  color: msg.role === "ai" ? textColor : accentLight,
                }}>
                  {msg.role === "ai" ? (
                    msg.loading ? (
                      <div style={{ display: "flex", gap: 5, padding: "2px 0" }}>
                        <span className="luma-typing-dot" style={{ background: mutedText }} />
                        <span className="luma-typing-dot" style={{ background: mutedText }} />
                        <span className="luma-typing-dot" style={{ background: mutedText }} />
                      </div>
                    ) : (
                      <ReactMarkdown components={{
                        p: ({node, ...props}) => <p style={{ marginBottom: 8 }} {...props} />,
                        strong: ({node, ...props}) => <strong style={{ color: textColor, fontWeight: 600 }} {...props} />,
                        ul: ({node, ...props}) => <ul style={{ paddingLeft: 16, marginBottom: 8 }} {...props} />,
                        ol: ({node, ...props}) => <ol style={{ paddingLeft: 16, marginBottom: 8 }} {...props} />,
                        li: ({node, ...props}) => <li style={{ color: textColor, opacity: 0.8 }} {...props} />,
                        code: ({node, inline, className, children, ...props}) => inline
                          ? <code style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", padding: "1px 5px", borderRadius: 4, color: accentLight, fontSize: 13 }} {...props}>{children}</code>
                          : <CodeBlock className={className} isDark={isDark}>{children}</CodeBlock>,
                      }}>
                        {msg.text}
                      </ReactMarkdown>
                    )
                  ) : msg.text}
                </div>
              )}

              {/* Action buttons on hover */}
              {hoveredMsg === i && !msg.loading && editingMsg !== i && (
                <div style={{ display: "flex", gap: 2, marginTop: 2, alignItems: "center" }}>
                  {msg.role === "user" ? (
                    <>
                      <span style={{ fontSize: 11, color: mutedText, marginRight: 4 }}>
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {onRegenerate && (
                        <MsgBtn title="Retry" isDark={isDark} onClick={onRegenerate}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                        </MsgBtn>
                      )}
                      <MsgBtn title="Edit" isDark={isDark} onClick={() => { setEditingMsg(i); setEditText(msg.text); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </MsgBtn>
                      <MsgBtn title="Copy" isDark={isDark} onClick={() => navigator.clipboard.writeText(msg.text)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                      </MsgBtn>
                    </>
                  ) : (
                    <>
                      <MsgBtn title="Copy" isDark={isDark} onClick={() => navigator.clipboard.writeText(msg.text)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                      </MsgBtn>
                      {i === chat.messages.length - 1 && onRegenerate && (
                        <MsgBtn title="Retry" isDark={isDark} onClick={onRegenerate}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                        </MsgBtn>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Suggestions */}
        {suggestions.length > 0 && !isLoading && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 40 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => onSend(s)}
                className="luma-suggestion-enter luma-btn-press"
                style={{ fontSize: 13, padding: "6px 12px", borderRadius: 20, border: `0.5px solid ${accentBorder}`, color: accentLight, background: "transparent", cursor: "pointer", animationDelay: `${i * 0.06}s`, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = accentBg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      </div>

      {/* Input */}
      <div className="luma-chat-input-pad luma-safe-bottom" style={{ borderTop: `0.5px solid ${borderColor}` }}>
        <div className="luma-input-glow" style={{ maxWidth: 820, margin: "0 auto", background: inputBg, border: `0.5px solid ${borderColor}`, borderRadius: 14, padding: 16, "--luma-glow-color": accentBorderVar }}>
          <textarea value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(e); }}
            onKeyDown={handleKey}
            placeholder="Message LumaAI..."
            rows={1}
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: textColor, fontSize: 15, resize: "none", fontFamily: "inherit", lineHeight: 1.6, minHeight: 24, maxHeight: 120, overflow: "hidden", boxSizing: "border-box" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <button className="luma-btn-press" style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: `0.5px solid ${borderColor}`, borderRadius: 6, background: "transparent", color: mutedText, cursor: "pointer", fontSize: 18, flexShrink: 0 }}>+</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <button className="luma-btn-press" style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, display: "flex", alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </button>
              <button onClick={handleSend} disabled={!input.trim()} className="luma-btn-press"
                style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: input.trim() ? accentMain : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"), display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", transition: "background 0.2s ease, transform 0.1s ease" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "#fff" : mutedText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: mutedText, marginTop: 8 }}>LumaAI can make mistakes. Verify important info.</p>
      </div>
    </div>
  );
}