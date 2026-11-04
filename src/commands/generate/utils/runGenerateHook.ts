import fs from "fs";
import chalk from "chalk";
import { info, warning } from "../../../utils/console.js";
import { createDir } from "./general.js";
import { generateHook } from "./generateHook.js";
import type { Options } from "../generate.types.js";

export const runGenerateHook = async (
  rootDir: string,
  name: string,
  options: Options,
) => {
  if (!/^use[A-Z][a-zA-Z]*$/.test(name)) {
    warning(`Invalid hook name ${name}`);
    process.exitCode = 1;
    return;
  }
  const folder = createDir(`${rootDir}/hooks/${name}`);
  if (!folder) {
    warning(`Folder ${name} already exists!`);
    process.exitCode = 1;
    return;
  }
  const hook = await generateHook(folder, name, options);
  fs.writeFileSync(hook.path, hook.content);
  info(`${name} created at ${chalk.gray(folder)}`);
};
