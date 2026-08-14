import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthContext";
import { db } from "./firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { useBackClose } from "./useBackClose";
import Sidebar from "./components/Sidebar";
import HomeScreen from "./components/HomeScreen";
import ChatScreen from "./components/ChatScreen";
import ChatsPage from "./components/ChatsPage";
import ProjectsPage from "./components/ProjectsPage";
import ArtifactsPage from "./components/ArtifactsPage";
import LoginSection from "./components/LoginSection";
import PlansSection from "./components/PlansSection";
import { FAQSection, Footer } from "./components/FAQFooter";
import CustomizePanel from "./components/CustomizePanel";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

function LandingPage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/chat" replace />;
  return (
    <div style={{ background: "#080809", color: "#e8e4d9", minHeight: "100vh" }}>
      <LoginSection />
      <PlansSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

function ChatApp() {
  const { user, logout } = useAuth();

  // Auth guard - agar login nahi hai toh landing pe bhejo
  if (!user) return <Navigate to="/" replace />;

  const [chats, setChats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [activeChatId, setActiveChatId] = useState(() => localStorage.getItem("lastChatId") || null);
  const [pendingProjectId, setPendingProjectId] = useState(null); // project context for a not-yet-started chat
  const [pendingArtifactPrompt, setPendingArtifactPrompt] = useState(""); // pre-filled prompt from artifact category
  const [suggestions, setSuggestions] = useState([]);
  const [showCustomize, setShowCustomize] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // home | chats | projects

  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (activeChatId) localStorage.setItem("lastChatId", activeChatId);
    else localStorage.removeItem("lastChatId");
  }, [activeChatId]);

  // ---- In-app back button handling (like Claude's app) ----
  // Pehli baar mount hone par ek "home" state set karo, aur phone/browser
  // ke back button ka listen karo taaki wo pehle app ke andar navigate kare,
  // GitHub/purane page pe seedha na le jaye.
  const isPoppingRef = useRef(false);

  function pushView(view) {
    if (isPoppingRef.current) return;
    window.history.pushState(view, "");
  }

  useEffect(() => {
    window.history.replaceState({ view: "home" }, "");

    const onPopState = (e) => {
      isPoppingRef.current = true;
      const state = e.state || { view: "home" };

      setShowCustomize(false);
      if (isMobile) setSidebarOpen(false);

      if (state.view === "chat") {
        setCurrentPage("home");
        setActiveChatId(state.id);
      } else if (state.view === "chats" || state.view === "projects" || state.view === "artifacts") {
        setCurrentPage(state.view);
        setActiveChatId(null);
      } else if (state.view === "customize") {
        setShowCustomize(true);
      } else {
        // home
        setCurrentPage("home");
        setActiveChatId(null);
      }

      setTimeout(() => { isPoppingRef.current = false; }, 0);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Mobile sidebar drawer also closes on back button
  useBackClose(isMobile && sidebarOpen, () => setSidebarOpen(false));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("medium");
  const [accentColor, setAccentColor] = useState("purple");
  const [bubbleStyle, setBubbleStyle] = useState("rounded");
  const [selectedModel, setSelectedModel] = useState("groq"); // "groq" | "gemini"

  const activeChat = chats.find(c => String(c.id) === String(activeChatId)) || null;

  const accent = {
    purple: { main: "#7c5fe6", light: "#a78bfa", bg: "rgba(124,95,230,0.2)", border: "rgba(124,95,230,0.3)" },
    blue:   { main: "#3b82f6", light: "#93c5fd", bg: "rgba(59,130,246,0.2)", border: "rgba(59,130,246,0.3)" },
    green:  { main: "#22c55e", light: "#86efac", bg: "rgba(34,197,94,0.2)",  border: "rgba(34,197,94,0.3)"  },
  }[accentColor];

  const fontSizeMap = { small: "13px", medium: "15px", large: "17px" };
  const bgColor = theme === "dark" ? "#1a1915" : "#f5f5f0";
  const sidebarBg = theme === "dark" ? "#161612" : "#e8e8e3";
  const textColor = theme === "dark" ? "#e8e4d9" : "#1a1a1a";

  // Only chats with at least one message should be visible anywhere (sidebar, Chats page, Projects)
  const visibleChats = chats.filter(c => c.messages && c.messages.length > 0);

  // Firestore - load chats in real-time
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "chats"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const loaded = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      setChats(prev => {
        // Agar active chat hai toh uski loading state preserve karo
        return loaded.map(chat => {
          const existing = prev.find(c => String(c.id) === String(chat.id));
          // Agar existing chat mein loading message hai toh woh rakhlo
          if (existing && existing.messages.some(m => m.loading)) return existing;
          return chat;
        });
      });
    });
    return unsub;
  }, [user]);

  // Save chat to Firestore
  async function saveChat(chat) {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid, "chats", String(chat.id)), {
        ...chat,
        id: String(chat.id),
        createdAt: chat.createdAt || Date.now(),
      });
    } catch (e) { console.error("Save error:", e); }
  }

  // Chat functions
  function renameChat(chatId, newTitle) {
    setChats(prev => {
      const updated = prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c);
      const chat = updated.find(c => c.id === chatId);
      if (chat) saveChat(chat);
      return updated;
    });
  }

  function deleteChat(chatId) {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
    if (user) deleteDoc(doc(db, "users", user.uid, "chats", String(chatId))).catch(console.error);
  }

  function pinChat(chatId) {
    setChats(prev => {
      const updated = prev.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c);
      const chat = updated.find(c => c.id === chatId);
      if (chat) saveChat(chat);
      return updated;
    });
  }

  function exportChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    const content = chat.messages.map(m => `${m.role === "ai" ? "LumaAI" : "You"}: ${m.text}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${chat.title}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  function moveChatToFolder(chatId, folderId) { setChats(prev => prev.map(c => c.id === chatId ? { ...c, folderId } : c)); }

  // Project Firestore functions
  async function saveProject(project) {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid, "projects", String(project.id)), {
        ...project,
        id: String(project.id),
        createdAt: project.createdAt || Date.now(),
      });
    } catch (e) { console.error("Project save error:", e); }
  }

  // Load projects from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "projects"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const loaded = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      setProjects(loaded);
    });
    return unsub;
  }, [user]);

  // Project functions
  function createProject(name, desc) {
    const id = String(Date.now());
    const newProject = { id, name, desc, createdAt: Date.now() };
    setProjects(prev => [...prev, newProject]);
    saveProject(newProject);
  }
  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id));
    setChats(prev => prev.map(c => c.projectId === id ? { ...c, projectId: null } : c));
    if (user) deleteDoc(doc(db, "users", user.uid, "projects", String(id))).catch(console.error);
  }
  function renameProject(id, name) {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, name } : p);
      const project = updated.find(p => p.id === id);
      if (project) saveProject(project);
      return updated;
    });
  }

  // Artifact functions
  function deleteArtifact(id) { setArtifacts(prev => prev.filter(a => a.id !== id)); }
  function selectArtifact(id) {
    const art = artifacts.find(a => a.id === id);
    if (art?.chatId) handleSelectChat(art.chatId);
  }

  // Starts a new chat pre-filled with a category prompt (used by Artifacts category cards)
  function startArtifactPrompt(promptPrefix) {
    setActiveChatId(null);
    setPendingProjectId(null);
    setPendingArtifactPrompt(promptPrefix || " ");
    setCurrentPage("home");
  }

  async function fetchSuggestions(userText, aiReply) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: `Based on this conversation:\nUser: "${userText}"\nAI: "${aiReply}"\n\nGenerate exactly 3 short follow-up questions the user might want to ask next.\nReturn ONLY a JSON array of 3 strings, nothing else.` }] })
      });
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || "[]";
      const clean = content.replace(/```json|```/g, "").trim();
      setSuggestions(JSON.parse(clean));
    } catch { setSuggestions([]); }
  }

  async function generateChatTitle(chatId, userText, aiReply) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: `Generate a very short title (3-6 words max) for this conversation:\nUser: "${userText}"\nAI: "${aiReply.slice(0, 200)}"\n\nReturn ONLY the title, nothing else. No quotes, no punctuation at end.` }]
        })
      });
      const data = await res.json();
      const title = data?.choices?.[0]?.message?.content?.trim() || userText.slice(0, 40);
      setChats(prev => {
        const updated = prev.map(c => c.id === chatId ? { ...c, title } : c);
        const chat = updated.find(c => c.id === chatId);
        if (chat) saveChat(chat);
        return updated;
      });
    } catch { /* keep original title */ }
  }

  // Creates the actual chat record (with first message) — this is the ONLY place chats get created
  function createChatWithMessage(text, projectId) {
    const id = String(Date.now());
    const newChat = { id, title: text.slice(0, 40), messages: [], pinned: false, folderId: null, projectId: projectId || null, createdAt: Date.now() };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
    setPendingProjectId(null);
    return id;
  }

  async function sendMessage(text, chatId) {
    setSuggestions([]);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { role: "user", text }, { role: "ai", text: "...", loading: true }] } : c));
    try {
      const currentChat = chats.find(c => c.id === chatId);
      const history = (currentChat?.messages || [])
        .filter(m => !m.loading && m.text && m.text !== "..." && m.text.trim() !== "")
        .map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
      history.push({ role: "user", content: text });

      const systemPrompt = `You are LumaAI, an advanced AI assistant like Claude or ChatGPT. Follow these rules:

1. Give clear, detailed, well-structured answers
2. Use markdown formatting — headings, bullet points, bold, code blocks where appropriate
3. For coding questions: always provide complete, working code with comments
4. For vague requests: ask 1-2 clarifying questions with numbered options
5. Be conversational and friendly but professional
6. Support Hindi, English, and Hinglish naturally
7. For creative tasks: be imaginative and thorough
8. Always think step by step for complex problems
9. Never give incomplete or vague answers — always be specific and helpful`;

      let reply = "";

      if (selectedModel === "gemini") {
        const geminiMessages = history.map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));
        const res = await fetch(
         "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": GEMINI_API_KEY
            },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: geminiMessages,
              generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
            })
          }
        );
        const data = await res.json();
        reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Kuch galat ho gaya.";
      } else if (["gpt4o-mini", "deepseek", "mixtral", "gemma2", "llama31fast"].includes(selectedModel)) {
        const modelMap = {
          "gpt4o-mini": "openai/gpt-4o-mini",
          "mixtral": "mixtral-8x7b-32768",
          "gemma2": "gemma2-9b-it",
          "llama31fast": "llama-3.1-8b-instant",
          "deepseek": "deepseek/deepseek-chat-v3-5:free",
        };

        // Groq models
        if (["mixtral", "gemma2", "llama31fast"].includes(selectedModel)) {
          const cleanHistory = history.filter(m => m.content && m.content.trim() !== "" && m.content !== "...");
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
            body: JSON.stringify({
              model: modelMap[selectedModel],
              temperature: 0.7,
              max_tokens: 4096,
              messages: [{ role: "system", content: systemPrompt }, ...cleanHistory]
            })
          });
          const data = await res.json();
          if (data?.error) throw new Error(data.error.message);
          reply = data?.choices?.[0]?.message?.content || "Kuch galat ho gaya.";
        } else {
          // OpenRouter models (GPT-4o-mini, DeepSeek)
          const fetchOpenRouter = async () => {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://lumaai.app",
                "X-Title": "LumaAI"
              },
              body: JSON.stringify({
                model: modelMap[selectedModel],
                temperature: 0.7,
                max_tokens: 4096,
                messages: [{ role: "system", content: systemPrompt }, ...history]
              })
            });
            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content;
            if (!content || content.trim() === "" || data?.error) throw new Error("Empty response");
            return content;
          };

          let attempts = 0;
          while (attempts < 5) {
            try {
              reply = await fetchOpenRouter();
              break;
            } catch (e) {
              attempts++;
              if (attempts >= 5) reply = "Model busy hai. Thoda wait karke dobara try karo.";
              else await new Promise(r => setTimeout(r, 2000));
            }
          }
        }
      } else {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 4096,
            messages: [{ role: "system", content: systemPrompt }, ...history]
          })
        });
        const data = await res.json();
        reply = data?.choices?.[0]?.message?.content || "Kuch galat ho gaya.";
      }

      setChats(prev => {
        const updated = prev.map(c => c.id === chatId ? { ...c, messages: c.messages.map((m, i) => i === c.messages.length - 1 ? { role: "ai", text: reply } : m) } : c);
        const chat = updated.find(c => c.id === chatId);
        if (chat && chat.messages.length > 0) saveChat(chat);
        return updated;
      });
      fetchSuggestions(text, reply);
      if (!currentChat || currentChat.messages.length === 0) {
        generateChatTitle(chatId, text, reply);
      }
    } catch {
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: c.messages.map((m, i) => i === c.messages.length - 1 ? { role: "ai", text: "Error! API key check karo." } : m) } : c));
    }
  }

  function handleSend(text) {
    if (!text.trim()) return;
    setSuggestions([]);
    if (!activeChatId) {
      // Brand new chat — gets created NOW, with the project context if any was pending
      const id = createChatWithMessage(text, pendingProjectId);
      setTimeout(() => sendMessage(text, id), 0);
    } else {
      sendMessage(text, activeChatId);
    }
  }

  function handleSelectChat(id) {
    setActiveChatId(String(id));
    setPendingProjectId(null);
    setSuggestions([]);
    setCurrentPage("home");
    if (isMobile) setSidebarOpen(false);
    pushView({ view: "chat", id: String(id) });
  }

  // projectId is passed when starting a new chat from within a project; null/undefined for a plain new chat
  function handleNewChat(projectId = null) {
    setActiveChatId(null);
    setPendingProjectId(projectId || null);
    setSuggestions([]);
    setCurrentPage("home");
    if (isMobile) setSidebarOpen(false);
    pushView({ view: "home" });
  }

  function renderMain() {
    if (currentPage === "chats") {
      return <ChatsPage chats={visibleChats} projects={projects} onSelectChat={handleSelectChat} onDeleteChat={deleteChat} onNewChat={() => handleNewChat()} theme={theme} textColor={textColor} accent={accent} />;
    }
    if (currentPage === "projects") {
      return <ProjectsPage projects={projects} chats={visibleChats} onCreateProject={createProject} onDeleteProject={deleteProject} onRenameProject={renameProject} onSelectProject={handleSelectChat} onNewChat={handleNewChat} theme={theme} textColor={textColor} accent={accent} />;
    }
    if (currentPage === "artifacts") {
      return <ArtifactsPage artifacts={artifacts} onSelectArtifact={selectArtifact} onDeleteArtifact={deleteArtifact} onStartWithPrompt={startArtifactPrompt} theme={theme} textColor={textColor} accent={accent} />;
    }
    if (activeChat) {
  async function handleRegenerate() {
    if (!activeChat) return;
    const messages = activeChat.messages;
    // Find last user message
    let lastUserMsg = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") { lastUserMsg = messages[i].text; break; }
    }
    if (!lastUserMsg) return;
    // Remove last AI message and resend
    const chatId = String(activeChatId);
    setChats(prev => prev.map(c => c.id === chatId
      ? { ...c, messages: [...c.messages.slice(0, -1), { role: "ai", text: "...", loading: true }] }
      : c
    ));
    setSuggestions([]);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: lastUserMsg }] })
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || "Kuch galat ho gaya.";
      setChats(prev => {
        const updated = prev.map(c => c.id === chatId
          ? { ...c, messages: c.messages.map((m, i) => i === c.messages.length - 1 ? { role: "ai", text: reply } : m) }
          : c
        );
        const chat = updated.find(c => c.id === chatId);
        if (chat) saveChat(chat);
        return updated;
      });
      fetchSuggestions(lastUserMsg, reply);
    } catch {
      setChats(prev => prev.map(c => c.id === chatId
        ? { ...c, messages: c.messages.map((m, i) => i === c.messages.length - 1 ? { role: "ai", text: "Error! Try again." } : m) }
        : c
      ));
    }
  }

      return <ChatScreen chat={activeChat} onSend={handleSend} onRegenerate={handleRegenerate} suggestions={suggestions} accent={accent} bubbleStyle={bubbleStyle} theme={theme} textColor={textColor} selectedModel={selectedModel} onModelChange={setSelectedModel} />;
    }
    return <HomeScreen onSend={handleSend} accent={accent} theme={theme} textColor={textColor} prefill={pendingArtifactPrompt} onPrefillUsed={() => setPendingArtifactPrompt("")} user={user} selectedModel={selectedModel} onModelChange={setSelectedModel} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: bgColor, color: textColor, overflow: "hidden", fontSize: fontSizeMap[fontSize], position: "relative" }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      <div style={{
        position: isMobile ? "fixed" : "relative",
        top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "transform 0.25s ease",
        height: isMobile ? "100vh" : "100%",
        display: "flex"
      }}>
        <Sidebar
          chats={visibleChats} activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={() => handleNewChat()}
          onCustomize={() => { setShowCustomize(true); if (isMobile) setSidebarOpen(false); pushView({ view: "customize" }); }}
          onChatsPage={() => { setCurrentPage("chats"); setActiveChatId(null); if (isMobile) setSidebarOpen(false); pushView({ view: "chats" }); }}
          onProjectsPage={() => { setCurrentPage("projects"); setActiveChatId(null); if (isMobile) setSidebarOpen(false); pushView({ view: "projects" }); }}
          onArtifactsPage={() => { setCurrentPage("artifacts"); setActiveChatId(null); if (isMobile) setSidebarOpen(false); pushView({ view: "artifacts" }); }}
          onRenameChat={renameChat} onDeleteChat={deleteChat} onPinChat={pinChat} onExportChat={exportChat} onMoveChatToFolder={moveChatToFolder}
          projects={projects}
          sidebarBg={sidebarBg} textColor={textColor} accent={accent} theme={theme}
        user={user} onLogout={logout}
        />
      </div>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, width: "100%" }}>
        {isMobile && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
            borderBottom: `0.5px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
            flexShrink: 0
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: textColor, padding: 4, display: "flex", alignItems: "center" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span style={{ fontSize: 16, fontWeight: 500, color: textColor }}>
              Luma<span style={{ color: accent.light }}>AI</span>
            </span>
          </div>
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {renderMain()}
        </div>
      </main>

      {showCustomize && (
        <CustomizePanel theme={theme} setTheme={setTheme} fontSize={fontSize} setFontSize={setFontSize} accentColor={accentColor} setAccentColor={setAccentColor} bubbleStyle={bubbleStyle} setBubbleStyle={setBubbleStyle} onClose={() => { if (window.history.state?.view === "customize") window.history.back(); else setShowCustomize(false); }} accent={accent} sidebarBg={sidebarBg} textColor={textColor} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}