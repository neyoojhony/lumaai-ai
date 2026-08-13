import { useState } from "react";

export default function ProjectsPage({ projects, chats, onCreateProject, onDeleteProject, onRenameProject, onSelectProject, onNewChat, theme, textColor, accent }) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [activeProject, setActiveProject] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const isDark = theme !== "light";
  const bg = isDark ? "#1a1915" : "#f5f5f0";
  const cardBg = isDark ? "#1e1e1a" : "#eaeae5";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const mutedText = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const accentMain = accent?.main || "#7c5fe6";
  const accentLight = accent?.light || "#a78bfa";

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateProject(newName.trim(), newDesc.trim());
    setNewName(""); setNewDesc(""); setShowNew(false);
  };

  const projectChats = activeProject ? chats.filter(c => c.projectId === activeProject.id) : [];

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const selectAll = () => selected.length === projects.length ? setSelected([]) : setSelected(projects.map(p => p.id));
  const deleteSelected = () => { selected.forEach(id => onDeleteProject(id)); setSelected([]); setSelecting(false); };

  // Project detail view
  if (activeProject) {
    return (
      <div className="luma-page-enter" style={{ flex: 1, background: bg, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="luma-page-pad" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setActiveProject(null)} style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, fontSize: 20, padding: "0 8px 0 0" }}>←</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 22, fontWeight: 400, color: textColor, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeProject.name}</h1>
            {activeProject.desc && <p style={{ fontSize: 13, color: mutedText, margin: "4px 0 0" }}>{activeProject.desc}</p>}
          </div>
          <button onClick={() => onNewChat(activeProject.id)} style={{ padding: "7px 16px", borderRadius: 8, background: accentMain, border: "none", color: "#fff", fontSize: 13, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
            + New chat
          </button>
        </div>
        <div className="luma-list-pad" style={{ height: "0.5px", background: borderColor }} />
        <div className="luma-list-pad" style={{ flex: 1, overflowY: "auto", paddingTop: 16 }}>
          {projectChats.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📁</div>
              <p style={{ color: mutedText, fontSize: 14 }}>No chats in this project yet</p>
              <button onClick={() => onNewChat(activeProject.id)} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, background: accentMain, border: "none", color: "#fff", fontSize: 13, cursor: "pointer" }}>
                Start a chat
              </button>
            </div>
          ) : (
            projectChats.map(chat => (
              <div key={chat.id} onClick={() => onSelectProject(chat.id)}
                style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: `0.5px solid ${borderColor}`, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ flex: 1, fontSize: 14, color: textColor, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.title}</span>
                <span style={{ fontSize: 13, color: mutedText, flexShrink: 0, marginLeft: 8 }}>{new Date(chat.id).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Projects list view
  return (
    <div className="luma-page-enter" style={{ flex: 1, background: bg, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Header */}
      <div className="luma-page-pad luma-page-header">
        <h1 style={{ fontSize: 28, fontWeight: 400, color: textColor, margin: 0 }}>Projects</h1>
        <div className="luma-header-actions">
          {selecting ? (
            <>
              <span style={{ fontSize: 13, color: mutedText, alignSelf: "center" }}>{selected.length} selected</span>
              <ActionBtn label="Select all" onClick={selectAll} borderColor={borderColor} textColor={textColor} />
              <ActionBtn label="Delete" onClick={deleteSelected} borderColor={borderColor} textColor="#f87171" disabled={selected.length === 0} />
              <ActionBtn label="Cancel" onClick={() => { setSelecting(false); setSelected([]); }} borderColor={borderColor} textColor={textColor} />
            </>
          ) : (
            <>
              {projects.length > 0 && <ActionBtn label="Select" onClick={() => setSelecting(true)} borderColor={borderColor} textColor={textColor} />}
              <ActionBtn label="+ New project" onClick={() => setShowNew(true)} borderColor="transparent" textColor="#fff" bg={accentMain} />
            </>
          )}
        </div>
      </div>

      {/* New project form */}
      {showNew && (
        <div className="luma-list-pad" style={{ marginBottom: 20 }}>
          <div style={{ background: cardBg, border: `0.5px solid ${borderColor}`, borderRadius: 12, padding: 20 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name"
              style={{ width: "100%", background: "transparent", border: `0.5px solid ${borderColor}`, borderRadius: 8, padding: "9px 13px", color: textColor, fontSize: 14, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)"
              style={{ width: "100%", background: "transparent", border: `0.5px solid ${borderColor}`, borderRadius: 8, padding: "9px 13px", color: textColor, fontSize: 14, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <ActionBtn label="Cancel" onClick={() => setShowNew(false)} borderColor={borderColor} textColor={mutedText} />
              <ActionBtn label="Create" onClick={handleCreate} borderColor="transparent" textColor="#fff" bg={accentMain} disabled={!newName.trim()} />
            </div>
          </div>
        </div>
      )}

      {/* Projects grid */}
      <div className="luma-page-pad-bottom" style={{ flex: 1, overflowY: "auto" }}>
        {projects.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📂</div>
            <p style={{ color: textColor, fontSize: 18, fontWeight: 400, marginBottom: 8 }}>No projects yet</p>
            <p style={{ color: mutedText, fontSize: 14, marginBottom: 24 }}>Create a project to organize your chats</p>
            <button onClick={() => setShowNew(true)} style={{ padding: "9px 20px", borderRadius: 8, background: accentMain, border: "none", color: "#fff", fontSize: 13, cursor: "pointer" }}>
              Create your first project
            </button>
          </div>
        ) : (
          <div className="luma-projects-grid">
            {projects.map(p => {
              const chatCount = chats.filter(c => c.projectId === p.id).length;
              return (
                <div key={p.id}
                  onClick={() => selecting ? toggleSelect(p.id) : setActiveProject(p)}
                  style={{ background: cardBg, border: `0.5px solid ${selected.includes(p.id) ? accentMain : borderColor}`, borderRadius: 12, padding: 20, cursor: "pointer", position: "relative", transition: "border-color 0.15s" }}
                  onMouseEnter={e => { if (!selecting) e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"; }}
                  onMouseLeave={e => { if (!selecting) e.currentTarget.style.borderColor = selected.includes(p.id) ? accentMain : borderColor; }}>
                  {selecting && (
                    <div style={{ position: "absolute", top: 14, right: 14, width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${selected.includes(p.id) ? accentMain : borderColor}`, background: selected.includes(p.id) ? accentMain : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selected.includes(p.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  )}
                  <div style={{ fontSize: 24, marginBottom: 10 }}>📁</div>
                  {renamingId === p.id ? (
                    <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                      onBlur={() => { onRenameProject(p.id, renameVal); setRenamingId(null); }}
                      onKeyDown={e => { if (e.key === "Enter") { onRenameProject(p.id, renameVal); setRenamingId(null); } }}
                      onClick={e => e.stopPropagation()}
                      style={{ background: "transparent", border: `0.5px solid ${accentLight}`, borderRadius: 4, padding: "2px 6px", color: textColor, fontSize: 15, outline: "none", width: "100%" }} />
                  ) : (
                    <p style={{ fontSize: 15, fontWeight: 500, color: textColor, margin: "0 0 4px" }}>{p.name}</p>
                  )}
                  {p.desc && <p style={{ fontSize: 12, color: mutedText, margin: "0 0 10px" }}>{p.desc}</p>}
                  <p style={{ fontSize: 12, color: mutedText, margin: 0 }}>{chatCount} chat{chatCount !== 1 ? "s" : ""}</p>
                  {!selecting && (
                    <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4 }}>
                      <button onClick={e => { e.stopPropagation(); setRenamingId(p.id); setRenameVal(p.name); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, padding: 4, borderRadius: 4 }}
                        onMouseEnter={e => e.currentTarget.style.color = textColor}
                        onMouseLeave={e => e.currentTarget.style.color = mutedText}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={e => { e.stopPropagation(); onDeleteProject(p.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, padding: 4, borderRadius: 4 }}
                        onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                        onMouseLeave={e => e.currentTarget.style.color = mutedText}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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