import path from "path";
import fs from "fs";
import { error, warning } from "./console.js";
import { CONFIG_PROPERTY_TYPES } from "../constants/config.constants.js";
import type { Config, ConfigKeys } from "../types/config.types.js";

// Utility
const warnMissingProperties = (config: Config) => {
  const configKeys = Object.keys(CONFIG_PROPERTY_TYPES) as ConfigKeys[];
  for (const property of configKeys) {
    const type = CONFIG_PROPERTY_TYPES[property];
    if (!config[property]) {
      warning(`Missing '${property}' of type ${type}, using fallback`);
    }
  }
};

export const loadConfig = (): Config | undefined => {
  const configPath = path.join(process.cwd(), "ct.config.json");
  if (!fs.existsSync(configPath)) {
    error("ts.config.json is missing!");
    return;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as Config;
    warnMissingProperties(config);
    return config;
  } catch {
    warning("ct.config.json is not valid JSON, ignoring it.");
    return;
  }
};
