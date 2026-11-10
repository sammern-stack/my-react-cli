import path from "path";
import fs from "fs";

import { CONFIG } from "../new.constants.js";

export const writeConfig = (target: string) => {
  const configPath = path.join(target, "ct.config.json");
  const configJson = JSON.stringify(CONFIG, null, 2);
  fs.writeFileSync(configPath, configJson);
};
