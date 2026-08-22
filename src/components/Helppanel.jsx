import { useState } from "react";
import { useBackClose } from "../useBackClose";

const SUPPORT_EMAIL = "contact@infygen.in";

const FAQ_ITEMS = [
  {
    q: "LumaAI kya hai?",
    a: "LumaAI ek AI chat assistant hai jahan aap text chat kar sakte ho, images generate kar sakte ho, aur Agent se poori websites bana sakte ho.",
  },
  {
    q: "Image kaise generate karoon?",
    a: "Chat mein bas likho jo image chahiye — jaise \"cat ki image banao\". LumaAI automatically detect kar leta hai aur image generate kar deta hai, koi model select karne ki zaroorat nahi.",
  },
  {
    q: "Kaunse chat models available hain?",
    a: "Luma Pro (fast), Luma (smart), aur GPT-4o Mini beech mein switch kar sakte ho chat ke topbar se.",
  },
  {
    q: "Agent Builder kya karta hai?",
    a: "Sidebar mein \"Agent\" se ek poori website (React + Vite) bana sakte ho sirf ek prompt se. Build complete hone ke baad ZIP download kar sakte ho.",
  },
  {
    q: "Kya LumaAI free hai?",
    a: "Haan, abhi Free plan available hai.",
  },
];

function HomeTab({ onGoHelp, onGoMessages, textColor, mutedText, borderColor, accentMain }) {
  return (
    <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <p style={{ fontSize: 18, fontWeight: 600, color: textColor, margin: 0 }}>Hi there 👋</p>
        <p style={{ fontSize: 13, color: mutedText, marginTop: 4 }}>How can we help?</p>
      </div>
      <button onClick={onGoHelp}
        style={{ textAlign: "left", padding: "12px 14px", borderRadius: 10, border: `0.5px solid ${borderColor}`, background: "transparent", color: textColor, cursor: "pointer", fontSize: 13.5 }}>
        Browse frequently asked questions →
      </button>
      <button onClick={onGoMessages}
        style={{ textAlign: "left", padding: "12px 14px", borderRadius: 10, border: "none", background: accentMain, color: "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 500 }}>
        Send us a message →
      </button>
    </div>
  );
}

function MessagesTab({ onSend, textColor, mutedText, accentMain }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 18px", gap: 10, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(124,95,230,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accentMain} strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: textColor, margin: 0 }}>No messages</p>
      <p style={{ fontSize: 12.5, color: mutedText, margin: 0, maxWidth: 220 }}>Messages from the team will be shown here</p>
      <button onClick={onSend}
        style={{ marginTop: 10, width: "100%", padding: "11px 14px", borderRadius: 10, border: "none", background: accentMain, color: "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        Send us a message
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </div>
  );
}

function HelpTab({ textColor, mutedText, borderColor, hoverBg }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ borderBottom: `0.5px solid ${borderColor}` }}>
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 8px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontSize: 13.5, color: textColor, fontWeight: 500 }}>{item.q}</span>
            <span style={{ color: mutedText, fontSize: 12, transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}>▼</span>
          </button>
          {openIdx === i && (
            <p style={{ fontSize: 12.5, color: mutedText, padding: "0 8px 14px", margin: 0, lineHeight: 1.6 }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HelpPanel({ onClose, isDark, textColor, mutedText, borderColor, hoverBg, accentMain, sidebarBg }) {
  const [tab, setTab] = useState("home"); // home | messages | help
  useBackClose(true, onClose);

  const handleSendMessage = () => {
    window.open(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("LumaAI Support")}`, "_blank");
  };

  const tabs = [
    { id: "home", label: "Home", icon: <HomeIcon /> },
    { id: "messages", label: "Messages", icon: <MsgIcon /> },
    { id: "help", label: "Help", icon: <HelpIconSvg /> },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 90 }} />
      <div style={{
        position: "fixed", bottom: 20, right: 20, width: 340, maxWidth: "calc(100vw - 32px)", height: 480, maxHeight: "calc(100vh - 40px)",
        background: isDark ? "#1a1915" : "#f5f5f0", border: `0.5px solid ${borderColor}`, borderRadius: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 91,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `0.5px solid ${borderColor}` }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: textColor }}>
            {tab === "home" ? "Home" : tab === "messages" ? "Messages" : "Help"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, padding: 4, display: "flex" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {tab === "home" && <HomeTab onGoHelp={() => setTab("help")} onGoMessages={() => setTab("messages")} textColor={textColor} mutedText={mutedText} borderColor={borderColor} accentMain={accentMain} />}
          {tab === "messages" && <MessagesTab onSend={handleSendMessage} textColor={textColor} mutedText={mutedText} accentMain={accentMain} />}
          {tab === "help" && <HelpTab textColor={textColor} mutedText={mutedText} borderColor={borderColor} hoverBg={hoverBg} />}
        </div>

        {/* Bottom tab bar */}
        <div style={{ display: "flex", borderTop: `0.5px solid ${borderColor}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 0", background: "transparent", border: "none", cursor: "pointer", color: tab === t.id ? accentMain : mutedText }}>
              {t.icon}
              <span style={{ fontSize: 10.5 }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const MsgIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const HelpIconSvg = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
