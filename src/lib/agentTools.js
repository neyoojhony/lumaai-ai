// These are the only "hands" the agent has. It can only affect the
// sandbox through one of these — nothing else.
export const tools = [
  {
    type: "function",
    function: {
      name: "list_files",
      description:
        "List every file and folder currently in the project, recursively.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the full contents of one file.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Path relative to the project root, e.g. src/App.jsx",
          },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description:
        "Create a new file, or completely overwrite an existing file, with the given content.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Path relative to the project root, e.g. src/App.jsx",
          },
          content: {
            type: "string",
            description: "The full new contents of the file.",
          },
        },
        required: ["path", "content"],
      },
    },
  },
];
