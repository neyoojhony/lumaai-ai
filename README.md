# LumaAI - Chat Interface

Ek modern AI chat app React + Tailwind CSS mein.

## Setup

```bash
# 1. Dependencies install karo
npm install

# 2. Dev server start karo
npm run dev

# 3. Browser mein open karo
# http://localhost:5173
```

## Build for Production

```bash
npm run build
```

## API Connect Karne Ke Liye

`src/App.jsx` mein `sendMessage` function ko update karo:

```js
async function sendMessage(text, chatId) {
  // User message add karo
  setChats(prev => prev.map(c =>
    c.id === chatId
      ? { ...c, messages: [...c.messages, { role: "user", text }] }
      : c
  ));

  // API call karo (Gemini ya Claude)
  const response = await fetch("YOUR_API_ENDPOINT", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });
  const data = await response.json();

  // AI response add karo
  setChats(prev => prev.map(c =>
    c.id === chatId
      ? { ...c, messages: [...c.messages, { role: "ai", text: data.reply }] }
      : c
  ));
}
```

## Project Structure

```
lumaai/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx      # Left sidebar
│   │   ├── HomeScreen.jsx   # Home page with greeting
│   │   └── ChatScreen.jsx   # Chat messages UI
│   ├── App.jsx              # Main app + state
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```
