import path from "path";
import fs from "fs";
import chalk from "chalk";

export interface CtConfig {
  typescript?: boolean;
  stylesheet?: string;
}

export const loadConfig = (): CtConfig | undefined => {
  const configPath = path.join(process.cwd(), "ct.config.json");
  if (!fs.existsSync(configPath)) return;

  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch {
    console.log(chalk.yellow("ct.config.json is not valid JSON, ignoring it."));
    return;
  }
};
