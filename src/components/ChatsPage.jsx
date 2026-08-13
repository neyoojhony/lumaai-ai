import { useState } from "react";

export default function ChatsPage({ chats, projects = [], onSelectChat, onDeleteChat, onNewChat, theme, textColor, accent }) {
  const [search, setSearch] = useState("");
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);

  const isDark = theme !== "light";
  const bg = isDark ? "#1a1915" : "#f5f5f0";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const mutedText = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const hoverBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const accentMain = accent?.main || "#7c5fe6";

  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const getProjectName = (projectId) => {
    if (!projectId) return null;
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : null;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const selectAll = () => selected.length === filteredChats.length ? setSelected([]) : setSelected(filteredChats.map(c => c.id));
  const deleteSelected = () => { selected.forEach(id => onDeleteChat(id)); setSelected([]); setSelecting(false); };

  return (
    <div className="luma-page-enter" style={{ flex: 1, background: bg, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto" }}>
      {/* Header */}
      <div className="luma-page-pad luma-page-header">
        <h1 style={{ fontSize: 28, fontWeight: 400, color: textColor, margin: 0 }}>Chats</h1>
        <div className="luma-header-actions">
          {selecting ? (
            <>
              <span style={{ fontSize: 13, color: mutedText }}>{selected.length} selected</span>
              <ActionBtn label="Select all" onClick={selectAll} borderColor={borderColor} textColor={textColor} />
              <ActionBtn label="Delete" onClick={deleteSelected} borderColor={borderColor} textColor="#f87171" disabled={selected.length === 0} />
              <ActionBtn label="Cancel" onClick={() => { setSelecting(false); setSelected([]); }} borderColor={borderColor} textColor={textColor} />
            </>
          ) : (
            <>
              <ActionBtn label="Select chats" onClick={() => setSelecting(true)} borderColor={borderColor} textColor={textColor} />
              <ActionBtn label="New chat" onClick={onNewChat} borderColor="transparent" textColor="#fff" bg={accentMain} />
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="luma-search-pad">
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: inputBg, border: `0.5px solid ${borderColor}`, borderRadius: 10, padding: "10px 16px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={mutedText} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: textColor, fontSize: 14, minWidth: 0 }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, flexShrink: 0 }}>✕</button>}
        </div>
      </div>

      {/* Chat list */}
      <div className="luma-list-pad" style={{ flex: 1 }}>
        {filteredChats.length === 0 ? (
          <p style={{ color: mutedText, fontSize: 14, marginTop: 24 }}>No chats found</p>
        ) : (
          filteredChats.map(chat => {
            const projectName = getProjectName(chat.projectId);
            return (
              <div key={chat.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `0.5px solid ${borderColor}`, cursor: "pointer" }}
                onClick={() => { if (!selecting) onSelectChat(chat.id); else toggleSelect(chat.id); }}
                onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {selecting && (
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${selected.includes(chat.id) ? accentMain : borderColor}`, background: selected.includes(chat.id) ? accentMain : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selected.includes(chat.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                )}
                <span style={{ flex: 1, fontSize: 14, color: textColor, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.title}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {projectName && (
                    <span style={{ fontSize: 12, color: mutedText, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      {projectName}
                    </span>
                  )}
                  <span style={{ fontSize: 13, color: mutedText, whiteSpace: "nowrap" }}>{formatTime(chat.id)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ActionBtn({ label, onClick, borderColor, textColor, bg, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: disabled ? "default" : "pointer", border: `0.5px solid ${borderColor}`, background: bg || "transparent", color: textColor, opacity: disabled ? 0.4 : 1 }}>
      {label}
    </button>
  );
}