import path from "path";
import fs from "fs";
import type { Config, ConfigKeys } from "@/types/config.types.js";
import { CONFIG_PROPERTY_TYPES } from "@/constants/config.constants.js";
import { warning } from "./console.js";
import { STYLES } from "@/commands/generate/generate.constants.js";
import type { Style } from "@/commands/generate/types/generate.types.js";

export const hasDependency = (dependency: string) => {
  const packagePath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packagePath)) return false;
  const packageFile = fs.readFileSync(packagePath, "utf-8");
  const packageJson = JSON.parse(packageFile);
  return Boolean(
    packageJson?.dependencies?.[dependency] ||
    packageJson?.devDependencies?.[dependency],
  );
};

export const isTypescriptUsed = () => {
  return fs.existsSync(path.join(process.cwd(), "tsconfig.json"));
};

/** Warns about unknown or invalid properties and drops the invalid ones */
export const validateConfig = (
  raw: Record<string, unknown> | undefined,
): Config => {
  if (raw === undefined) return {};

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
