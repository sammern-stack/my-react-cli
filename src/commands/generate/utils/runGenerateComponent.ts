import fs from "fs";
import chalk from "chalk";
import { info, warning } from "../../../utils/console.js";
import { generateComponent } from "./generateComponent.js";
import { VALID_COMPONENT_NAME } from "../generate.constants.js";
import type { Options } from "../generate.types.js";

export const runGenerateComponent = async (
  dir: string,
  name: string,
  options: Options,
) => {
  if (!VALID_COMPONENT_NAME.test(name)) {
    warning(`Invalid component name ${name}`);
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
  const component = await generateComponent(dir, name, options);
  for (const file of Object.values(component)) {
    fs.writeFileSync(file.path, file.content);
  }
  info(`${name} created at ${chalk.gray(dir)}`);
};
