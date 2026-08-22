import { useState, useRef, useEffect } from "react";
import { useBackClose } from "../useBackClose";

function getGroup(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Previous 7 Days";
  if (diffDays <= 30) return "Previous 30 Days";
  return "Older";
}

const GROUP_ORDER = ["Today", "Yesterday", "Previous 7 Days", "Previous 30 Days", "Older"];

export default function Sidebar({
  chats, folders, projects = [], activeChatId,
  onSelectChat, onNewChat, onCustomize, onChatsPage, onProjectsPage, onArtifactsPage,
  onRenameChat, onDeleteChat, onPinChat, onExportChat, onMoveChatToFolder,
  onCreateFolder, onDeleteFolder, onRenameFolder,
  sidebarBg, textColor, accent, theme,
  user, onLogout
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  useBackClose(showUserMenu, () => setShowUserMenu(false));

  const isDark = theme !== "light";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const mutedText = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const activeChatBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const accentLight = accent?.light || "#a78bfa";
  const accentMain = accent?.main || "#7c5fe6";

  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChats = {};
  chats.filter(c => !c.folderId).forEach(chat => {
    const group = getGroup(chat.id);
    if (!groupedChats[group]) groupedChats[group] = [];
    groupedChats[group].push(chat);
  });

  const startRename = (chatId, currentTitle) => {
    setRenamingChatId(chatId);
    setRenameValue(currentTitle);
  };

  const submitRename = (chatId) => {
    if (renameValue.trim()) onRenameChat(chatId, renameValue.trim());
    setRenamingChatId(null);
  };

  return (
    <aside style={{ width: "min(260px, 80vw)", height: "100%", background: sidebarBg || "#161612", borderRight: `0.5px solid ${borderColor}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px" }}>
        <span style={{ fontSize: 17, fontWeight: 500, color: textColor, letterSpacing: "-0.01em" }}>
          Luma<span style={{ color: accentLight }}>AI</span>
        </span>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, padding: 4, borderRadius: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div style={{ padding: "0 12px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: hoverBg, border: `0.5px solid ${borderColor}`, borderRadius: 8, padding: "6px 12px" }}>
            <SearchIcon color={mutedText} />
            <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: textColor, fontSize: 13 }} />
            {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, fontSize: 12 }}>✕</button>}
          </div>
        </div>
      )}

      {/* Nav */}
      {!showSearch && (
        <nav style={{ padding: "0 8px" }}>
          <SidebarItem icon={<PlusIcon />} label="New chat" shortcut="Ctrl+N" onClick={onNewChat} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} />
          <SidebarItem icon={<SearchIcon />} label="Search" onClick={() => setShowSearch(true)} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} />
          <SidebarItem icon={<SettingsIcon />} label="Customize" onClick={onCustomize} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} />
        </nav>
      )}
      {showSearch && (
        <div style={{ padding: "0 8px 4px" }}>
          <SidebarItem icon={<span style={{ fontSize: 11 }}>✕</span>} label="Close search"
            onClick={() => { setShowSearch(false); setSearchQuery(""); }} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} />
        </div>
      )}

      {!showSearch && <div style={{ height: "0.5px", background: borderColor, margin: "8px 16px" }} />}

      {!showSearch && (
        <nav style={{ padding: "0 8px" }}>
          <SidebarItem icon={<ChatIcon />} label="Chats" onClick={onChatsPage} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} />
          <SidebarItem icon={<FolderIcon />} label="Projects" onClick={onProjectsPage} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} />
          <SidebarItem icon={<GridIcon />} label="Artifacts" onClick={onArtifactsPage} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} />
          <SidebarItem icon={<span style={{ fontSize: 13 }}>⚡</span>} label="Agent" onClick={() => window.location.assign("/agent")} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} />
        </nav>
      )}

      {/* Chat list */}
      <div style={{ flex: 1, overflowY: "auto", marginTop: 8 }}>
        {showSearch ? (
          <>
            <p style={{ fontSize: 11, color: mutedText, padding: "8px 20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {searchQuery ? `Results (${filteredChats.length})` : "All chats"}
            </p>
            {filteredChats.length === 0 && searchQuery
              ? <p style={{ fontSize: 13, color: mutedText, padding: "8px 20px" }}>No chats found</p>
              : filteredChats.map(chat => (
                <ChatItem key={chat.id} chat={chat} activeChatId={activeChatId}
                  renamingChatId={renamingChatId} renameValue={renameValue} setRenameValue={setRenameValue}
                  hoveredChatId={hoveredChatId} setHoveredChatId={setHoveredChatId}
                  onSelect={() => { onSelectChat(chat.id); setShowSearch(false); setSearchQuery(""); }}
                  onRename={() => startRename(chat.id, chat.title)}
                  onDelete={() => onDeleteChat(chat.id)}
                  onSubmitRename={submitRename}
                  activeChatBg={activeChatBg} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} accentLight={accentLight} />
              ))
            }
          </>
        ) : (
          GROUP_ORDER.map(group => {
            const groupChats = groupedChats[group];
            if (!groupChats || groupChats.length === 0) return null;
            return (
              <div key={group}>
                <p style={{ fontSize: 11, color: mutedText, padding: "10px 16px 4px", letterSpacing: "0.01em" }}>{group}</p>
                {groupChats.map(chat => (
                  <ChatItem key={chat.id} chat={chat} activeChatId={activeChatId}
                    renamingChatId={renamingChatId} renameValue={renameValue} setRenameValue={setRenameValue}
                    hoveredChatId={hoveredChatId} setHoveredChatId={setHoveredChatId}
                    onSelect={() => onSelectChat(chat.id)}
                    onRename={() => startRename(chat.id, chat.title)}
                    onDelete={() => onDeleteChat(chat.id)}
                    onSubmitRename={submitRename}
                    projects={projects}
                    activeChatBg={activeChatBg} hoverBg={hoverBg} textColor={textColor} mutedText={mutedText} accentLight={accentLight} />
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* User — click to open profile menu (Claude-style dropdown) */}
      <div style={{ position: "relative" }}>
        {showUserMenu && (
          <UserMenu
            user={user}
            onClose={() => setShowUserMenu(false)}
            onSettings={() => { setShowUserMenu(false); onCustomize?.(); }}
            onLogout={() => { setShowUserMenu(false); onLogout?.(); }}
            isDark={isDark}
            borderColor={borderColor}
            textColor={textColor}
            mutedText={mutedText}
            hoverBg={hoverBg}
            sidebarBg={sidebarBg}
          />
        )}
        <button
          onClick={() => setShowUserMenu(v => !v)}
          className="luma-safe-bottom"
          style={{
            width: "100%", borderTop: `0.5px solid ${borderColor}`, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 10, background: showUserMenu ? hoverBg : "transparent",
            border: "none", borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: borderColor,
            cursor: "pointer", textAlign: "left"
          }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }} />
          ) : (
            <div style={{ position: "relative", width: 28, height: 28, borderRadius: "50%", background: accentMain, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>
              {user?.displayName?.[0] || "A"}
              <span style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, background: "#22c55e", borderRadius: "50%", border: `1.5px solid ${sidebarBg || "#161612"}` }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, color: textColor, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.displayName || "User"}</p>
            <p style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>Free plan</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={mutedText} strokeWidth="1.8" style={{ flexShrink: 0, transform: showUserMenu ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}

// Claude-style profile dropdown: email header, menu items, divider, log out.
// Opens upward since the trigger sits at the bottom of the sidebar.
function UserMenu({ user, onClose, onSettings, onLogout, isDark, borderColor, textColor, mutedText, hoverBg, sidebarBg }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const items = [
    { icon: <MenuSettingsIcon />, label: "Settings", onClick: onSettings },
    { icon: <LanguageIcon />, label: "Language", onClick: () => {} },
    { icon: <HelpIcon />, label: "Get help", onClick: () => window.open("mailto:support@lumaai.app", "_blank") },
  ];

  return (
    <div ref={menuRef} style={{
      position: "absolute", bottom: "100%", left: 8, right: 8, marginBottom: 6,
      background: isDark ? "#1e1e1a" : "#f0f0eb", border: `0.5px solid ${borderColor}`,
      borderRadius: 10, boxShadow: "0 12px 32px rgba(0,0,0,0.4)", overflow: "hidden", zIndex: 60,
    }}>
      <div style={{ padding: "12px 14px 10px", fontSize: 12.5, color: mutedText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {user?.email || user?.displayName || "Account"}
      </div>
      <div style={{ padding: "0 6px 6px" }}>
        {items.map((item, i) => (
          <button key={i} onClick={item.onClick}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: "transparent", border: "none", cursor: "pointer", color: textColor, fontSize: 13.5 }}
            onMouseEnter={e => e.currentTarget.style.background = hoverBg}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ opacity: 0.75, flexShrink: 0, display: "flex" }}>{item.icon}</span>
            <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
          </button>
        ))}
      </div>
      <div style={{ height: "0.5px", background: borderColor, margin: "0 14px" }} />
      <div style={{ padding: "6px" }}>
        <button onClick={onLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: "transparent", border: "none", cursor: "pointer", color: textColor, fontSize: 13.5 }}
          onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = textColor; }}>
          <span style={{ opacity: 0.75, flexShrink: 0, display: "flex" }}><LogoutMenuIcon /></span>
          <span style={{ flex: 1, textAlign: "left" }}>Log out</span>
        </button>
      </div>
    </div>
  );
}

function ChatItem({ chat, activeChatId, renamingChatId, renameValue, setRenameValue, hoveredChatId, setHoveredChatId, onSelect, onRename, onDelete, onSubmitRename, projects = [], activeChatBg, hoverBg, textColor, mutedText, accentLight }) {
  const isActive = chat.id === activeChatId;
  const isHovered = hoveredChatId === chat.id;
  const isRenaming = renamingChatId === chat.id;
  const projectName = chat.projectId ? (projects.find(p => p.id === chat.projectId)?.name || null) : null;

  return (
    <div style={{ padding: "1px 8px", position: "relative" }}
      onMouseEnter={() => setHoveredChatId(chat.id)}
      onMouseLeave={() => setHoveredChatId(null)}>
      {isRenaming ? (
        <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)}
          onBlur={() => onSubmitRename(chat.id)}
          onKeyDown={e => { if (e.key === "Enter") onSubmitRename(chat.id); if (e.key === "Escape") onSubmitRename(chat.id); }}
          style={{ width: "100%", background: "transparent", border: `0.5px solid ${accentLight}`, borderRadius: 6, padding: "6px 10px", color: textColor, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      ) : (
        <div style={{ display: "flex", alignItems: "center", borderRadius: 6, background: isActive ? activeChatBg : isHovered ? hoverBg : "transparent", padding: "6px 10px", cursor: "pointer" }} onClick={onSelect}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13, color: isActive ? textColor : mutedText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
              {chat.title}
            </span>
            {projectName && (
              <span style={{ fontSize: 10, color: accentLight, opacity: 0.8 }}>{projectName}</span>
            )}
          </div>
          {(isHovered || isActive) && (
            <div style={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: 4 }}>
              <button onClick={e => { e.stopPropagation(); onRename(); }} title="Rename"
                style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, padding: "2px 4px", borderRadius: 4, display: "flex", alignItems: "center" }}
                onMouseEnter={e => e.currentTarget.style.color = textColor}
                onMouseLeave={e => e.currentTarget.style.color = mutedText}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete"
                style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, padding: "2px 4px", borderRadius: 4, display: "flex", alignItems: "center" }}
                onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                onMouseLeave={e => e.currentTarget.style.color = mutedText}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, shortcut, onClick, hoverBg, textColor, mutedText }) {
  return (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6, background: "transparent", border: "none", cursor: "pointer", color: mutedText, fontSize: 14 }}
      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textColor; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = mutedText; }}>
      <span style={{ opacity: 0.7, flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
      {shortcut && <span style={{ fontSize: 11, opacity: 0.5 }}>{shortcut}</span>}
    </button>
  );
}

const PlusIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SearchIcon = ({ color }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const SettingsIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>;
const ChatIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const FolderIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>;
const GridIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;