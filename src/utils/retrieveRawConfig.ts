import path from "path";
import fs from "fs";

import { error, warning } from "./console.js";

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const retrieveRawConfig = () => {
  const configPath = path.join(process.cwd(), "ct.config.json");
  if (!fs.existsSync(configPath)) {
    error("ct.config.json is missing!");
    return;
  }

  try {
    const raw: unknown = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (!isPlainObject(raw)) {
      warning("ct.config.json must contain a JSON object, ignoring it.");
      return;
    }
    return raw;
  } catch {
    warning("ct.config.json is not valid JSON, ignoring it.");
    return;
  }
};
