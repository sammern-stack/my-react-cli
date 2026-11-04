import fs from "fs";
import chalk from "chalk";
import { info, warning } from "../../../utils/console.js";
import { createDir } from "./general.js";
import { generateComponent } from "./generateComponent.js";
import type { Options } from "../generate.types.js";
import { VALID_COMPONENT_NAME } from "../generate.constants.js";

export const runGenerateComponent = async (
  rootDir: string,
  name: string,
  options: Options,
) => {
  if (!VALID_COMPONENT_NAME.test(name)) {
    warning(`Invalid component name ${name}`);
    process.exitCode = 1;
    return;
  }
  const folder = createDir(`${rootDir}/components/${name}`);
  if (!folder) {
    warning(`Folder ${name} already exists!`);
    process.exitCode = 1;
    return;
  }
  const component = await generateComponent(folder, name, options);
  for (const file of Object.values(component)) {
    fs.writeFileSync(file.path, file.content);
  }
  info(`${name} created at ${chalk.gray(folder)}`);
};
