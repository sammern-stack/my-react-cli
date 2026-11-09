import path from "path";
import fs from "fs";

import { fail } from "@/utils/console.js";

export const resolveTarget = (name: string) => {
  const target = path.join(process.cwd(), name);
  if (fs.existsSync(target)) fail(`Folder ${name} already exists!`);
  return target;
};
