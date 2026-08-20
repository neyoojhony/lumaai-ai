import { tools } from "./agentTools";
import {
  listFiles,
  readFile,
  writeFile,
  runCommand,
  startDevServer,
} from "./webcontainerService";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";
const MAX_STEPS = 14;
const MAX_FIX_ATTEMPTS = 2;

const SYSTEM_PROMPT = `You are a coding agent working inside a live sandbox.
The sandbox already has a working Vite + React project: package.json, vite.config.js,
index.html, src/main.jsx, src/App.jsx.

Rules:
- Use list_files and read_file first to see what already exists before changing anything.
- Use write_file to create or edit files. Only use React and plain CSS (inline styles,
  or a single src/App.css that you import from App.jsx). Do not add any new npm
  dependencies, they will not be installed.
- Keep the project small: App.jsx plus a handful of components under src/components/
  is enough for most requests.
- Once the site is fully written and there is nothing left to change, reply with a short
  plain text summary and do NOT call any more tools. That reply ends the build step.`;

async function callModel(messages) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools,
      tool_choice: "auto",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Model call failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.choices[0].message;
}

// One full "reason -> act -> observe" cycle, repeated until the model
// stops calling tools (or we hit the step limit).
async function agentWriteLoop(messages, onEvent) {
  for (let step = 0; step < MAX_STEPS; step++) {
    const msg = await callModel(messages);
    messages.push(msg);

    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      onEvent({ type: "thought", text: msg.content });
      return messages;
    }

    for (const call of msg.tool_calls) {
      const name = call.function.name;
      let args = {};
      try {
        args = JSON.parse(call.function.arguments || "{}");
      } catch {
        // model sent malformed JSON args, treat as empty
      }

      onEvent({ type: "tool_call", name, args });

      let result;
      try {
        if (name === "list_files") {
          result = await listFiles();
        } else if (name === "read_file") {
          result = await readFile(args.path);
        } else if (name === "write_file") {
          await writeFile(args.path, args.content);
          result = `Saved ${args.path}`;
        } else {
          result = `Unknown tool: ${name}`;
        }
      } catch (e) {
        result = `Error: ${e.message}`;
      }

      onEvent({ type: "tool_result", name, args, result });

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: typeof result === "string" ? result : JSON.stringify(result),
      });
    }
  }

  onEvent({ type: "thought", text: "Reached the step limit." });
  return messages;
}

async function installAndBuild(onEvent) {
  onEvent({ type: "step", label: "Running: npm install" });
  let output = "";
  const installCode = await runCommand("npm", ["install"], (chunk) => {
    output += chunk;
  });
  if (installCode !== 0) {
    onEvent({ type: "step_error", label: "npm install failed" });
    return { ok: false, log: output };
  }
  onEvent({ type: "step_done", label: "npm install" });

  onEvent({ type: "step", label: "Running: npm run build" });
  output = "";
  const buildCode = await runCommand("npm", ["run", "build"], (chunk) => {
    output += chunk;
  });
  if (buildCode !== 0) {
    onEvent({ type: "step_error", label: "Build error found" });
    return { ok: false, log: output };
  }
  onEvent({ type: "step_done", label: "npm run build" });
  return { ok: true, log: output };
}

// The full flow: write the site, install, build-check, auto-fix on
// failure, then start the live dev server. This is what the UI calls.
export async function buildWebsite(userPrompt, onEvent) {
  if (!GROQ_API_KEY) {
    onEvent({
      type: "step_error",
      label: "Missing VITE_GROQ_API_KEY in your environment",
    });
    return;
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  onEvent({ type: "step", label: "Planning" });
  await agentWriteLoop(messages, onEvent);
  onEvent({ type: "step_done", label: "Planning" });

  let attempt = 0;
  let buildResult = await installAndBuild(onEvent);

  while (!buildResult.ok && attempt < MAX_FIX_ATTEMPTS) {
    attempt++;
    onEvent({ type: "step", label: `Fixing error (attempt ${attempt})` });

    messages.push({
      role: "user",
      content: `The build failed with this output:\n\n${buildResult.log.slice(
        -4000
      )}\n\nRead whichever file(s) you need with read_file, then fix the problem with write_file. When you are done, reply with plain text and no more tool calls.`,
    });

    await agentWriteLoop(messages, onEvent);
    onEvent({ type: "step_done", label: `Fixing error (attempt ${attempt})` });

    buildResult = await installAndBuild(onEvent);
  }

  if (!buildResult.ok) {
    onEvent({
      type: "step_error",
      label: "Could not get a clean build, showing the last version anyway",
    });
  }

  onEvent({ type: "step", label: "Starting preview server" });
  const url = await startDevServer(() => {});
  onEvent({ type: "step_done", label: "Website is live" });
  onEvent({ type: "preview_ready", url });
}
