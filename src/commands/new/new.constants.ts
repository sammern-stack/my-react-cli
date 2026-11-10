import type { Config } from "@/types/config.types.js";

export const VALID_REACT_NAME = /^[a-z0-9][a-z0-9-_]*$/i;

export const TEMPLATES = [
  "react",
  "react-ts",
  "react-swc",
  "react-swc-ts",
] as const;

export const CUSTOM_TEMPLATES = ["custom-js", "custom-ts"] as const;

export const CONFIG: Config = {
  $schema: "https://unpkg.com/@pavlos-samaras/react-cli/ct.config.schema.json",
  typescript: true,
  stylesheet: "scss",
};
