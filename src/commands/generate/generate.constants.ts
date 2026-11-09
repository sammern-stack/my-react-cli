import type { DefaultDirs, Type } from "./types/generate.types.js";

export const TYPES = ["component", "hook", "page", "feature"] as const;
export const STYLES = ["css", "scss"] as const;

export const PATTERNS: Record<Type, [RegExp, string]> = {
  component: [/^[A-Z][a-zA-Z]*$/, "PascalCase"],
  hook: [/^use[A-Z][a-zA-Z]*$/, "prefix 'use' follow PascalCase"],
  page: [/^[A-Z][a-zA-Z]*$/, "PascalCase"],
  feature: [/^[A-Z][a-zA-Z]*$/, "PascalCase"],
};

export const DEFAULT_DIRS: Record<DefaultDirs, string> = {
  component: "components",
  hook: "hooks",
  page: "pages",
};

export const ROUTES_FILES = [
  "src/app/routes.tsx",
  "src/app/routes.jsx",
  "src/App.tsx",
  "src/App.jsx",
];
