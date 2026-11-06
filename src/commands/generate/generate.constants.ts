import type { Type } from "./generate.types.js";

export const TYPES = ["component", "hook", "page"] as const;
export const STYLES = ["css", "scss"] as const;

export const DEFAULT_DIRS: Record<Type, string> = {
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

export const VALID_COMPONENT_NAME = /^[A-Z][a-zA-Z]*$/;
export const VALID_HOOK_NAME = /^use[A-Z][a-zA-Z]*$/;
