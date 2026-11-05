import path from "path";
import fs from "fs";
import type { Options } from "../new.types.js";

// Utility
const removeDefaultFiles = (target: string, files: string[]) => {
  for (const file of files) fs.rmSync(path.join(target, file), { force: true });
  fs.rmSync(path.join(target, "src/assets"), { recursive: true, force: true });
};

export const runCustomTemplate = (target: string, options: Options) => {
  if (!options.template) return;

  const isTs = options.template.endsWith("-ts");

  const variant = isTs ? "react-ts" : "react";
  const overlay = new URL(`../../../../templates/${variant}`, import.meta.url);
  const ext = isTs ? "tsx" : "jsx";

  const filesToRemove = [
    `src/App.${ext}`,
    "src/App.css",
    "src/index.css",
    ".oxlintrc.json",
  ];
  removeDefaultFiles(target, filesToRemove);

  fs.cpSync(overlay, target, { recursive: true });
};
