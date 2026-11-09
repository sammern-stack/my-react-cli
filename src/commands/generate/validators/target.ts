import fs from "fs";
import { fail } from "@/utils/console.js";

export const verifyTargetAvailable = (target: string, force?: boolean) => {
  if (fs.existsSync(target) && !force) {
    fail(`Directory '${target}' already exists`, "Use --force to overwrite it");
  }
};
