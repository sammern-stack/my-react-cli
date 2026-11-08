import path from "path";
import fs from "fs";
import { error, warning } from "./console.js";
import { CONFIG_PROPERTY_TYPES } from "../constants/config.constants.js";
import { STYLES } from "../commands/generate/generate.constants.js";
import type { Style } from "../commands/generate/types/generate.types.js";
import type { Config, ConfigKeys } from "../types/config.types.js";

// Utilities
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Warns about unknown or invalid properties and drops the invalid ones
const validateConfig = (raw: Record<string, unknown>): Config => {
  const knownKeys = Object.keys(CONFIG_PROPERTY_TYPES) as ConfigKeys[];
  const config: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (key === "$schema") continue;
    if (!knownKeys.includes(key as ConfigKeys)) {
      warning(
        `Unknown property '${key}' in ct.config.json, ignoring it. Valid properties: ${knownKeys.join(", ")}`,
      );
      continue;
    }
    config[key] = value;
  }

  for (const property of knownKeys) {
    const type = CONFIG_PROPERTY_TYPES[property];
    const value = config[property];
    if (value === undefined) {
      warning(`Missing '${property}' of type ${type}, using fallback`);
    } else if (typeof value !== type) {
      warning(`'${property}' must be of type ${type}, using fallback`);
      delete config[property];
    }
  }

  const { stylesheet } = config;
  if (stylesheet !== undefined && !STYLES.includes(stylesheet as Style)) {
    warning(
      `Invalid stylesheet '${String(stylesheet)}', expected one of: ${STYLES.join(", ")}. Using fallback`,
    );
    delete config.stylesheet;
  }

  return config as Config;
};

export const loadConfig = (): Config | undefined => {
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
    return validateConfig(raw);
  } catch {
    warning("ct.config.json is not valid JSON, ignoring it.");
    return;
  }
};
