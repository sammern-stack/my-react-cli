import path from "path";
import fs from "fs";

import { getTemplateUrl } from "@/utils/templates.js";

// Utility
const removeDefaultFiles = (target: string, files: string[]) => {
  for (const file of files) fs.rmSync(path.join(target, file), { force: true });
  fs.rmSync(path.join(target, "src/assets"), { recursive: true, force: true });
};

export const executeCustomTemplate = (target: string, useTs: boolean) => {
  const overlay = getTemplateUrl(useTs ? "react-ts" : "react");
  const ext = useTs ? "tsx" : "jsx";

  removeDefaultFiles(target, [
    `src/App.${ext}`,
    "src/App.css",
    "src/index.css",
    ".oxlintrc.json",
  ]);

  fs.cpSync(overlay, target, { recursive: true });
};
