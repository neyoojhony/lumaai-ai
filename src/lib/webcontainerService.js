import { WebContainer } from "@webcontainer/api";

// A minimal, already-working Vite + React project.
// The agent edits/adds files on top of this, it never has to set up
// the project from scratch, so it can't get that part wrong.
const template = {
  "package.json": {
    file: {
      contents: JSON.stringify(
        {
          name: "agent-site",
          private: true,
          version: "0.0.1",
          type: "module",
          scripts: { dev: "vite --host", build: "vite build" },
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
          },
          devDependencies: {
            "@vitejs/plugin-react": "^4.0.0",
            vite: "^4.3.9",
          },
        },
        null,
        2
      ),
    },
  },
  "vite.config.js": {
    file: {
      contents: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()] });
`,
    },
  },
  "index.html": {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Agent Site</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
    },
  },
  src: {
    directory: {
      "main.jsx": {
        file: {
          contents: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
`,
        },
      },
      "App.jsx": {
        file: {
          contents: `export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 40, color: "#333" }}>
      Waiting for the agent to build your site...
    </div>
  );
}
`,
        },
      },
    },
  },
};

let containerInstance = null;
let bootPromise = null;

// WebContainer.boot() can only be called once per browser tab.
// This makes sure every part of the app shares the same instance.
export async function getContainer() {
  if (containerInstance) return containerInstance;
  if (!bootPromise) {
    bootPromise = WebContainer.boot();
  }
  containerInstance = await bootPromise;
  await containerInstance.mount(template);
  return containerInstance;
}

export async function listFiles(dir = ".") {
  const container = await getContainer();

  async function walk(path) {
    const entries = await container.fs.readdir(path, { withFileTypes: true });
    let out = [];
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const full = path === "." ? entry.name : `${path}/${entry.name}`;
      if (entry.isDirectory()) {
        out.push(full + "/");
        out = out.concat(await walk(full));
      } else {
        out.push(full);
      }
    }
    return out;
  }

  return walk(dir);
}

export async function readFile(path) {
  const container = await getContainer();
  try {
    return await container.fs.readFile(path, "utf-8");
  } catch (e) {
    return `Error reading ${path}: ${e.message}`;
  }
}

export async function writeFile(path, content) {
  const container = await getContainer();
  const dir = path.split("/").slice(0, -1).join("/");
  if (dir) {
    await container.fs.mkdir(dir, { recursive: true }).catch(() => {});
  }
  await container.fs.writeFile(path, content);
}

// Runs a shell command inside the sandbox (npm install, npm run build, ...)
// and streams its output back through onOutput as it happens.
export async function runCommand(cmd, args = [], onOutput) {
  const container = await getContainer();
  const process = await container.spawn(cmd, args);

  process.output.pipeTo(
    new WritableStream({
      write(chunk) {
        onOutput?.(chunk);
      },
    })
  );

  const exitCode = await process.exit;
  return exitCode;
}

// Starts the Vite dev server in the background and resolves with its
// preview URL once it's actually ready to be shown in an iframe.
export async function startDevServer(onOutput) {
  const container = await getContainer();
  const process = await container.spawn("npm", ["run", "dev"]);

  process.output.pipeTo(
    new WritableStream({
      write(chunk) {
        onOutput?.(chunk);
      },
    })
  );

  return new Promise((resolve) => {
    container.on("server-ready", (port, url) => {
      resolve(url);
    });
  });
}
