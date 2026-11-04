import fs from "fs";
import chalk from "chalk";
import { info, warning } from "../../../utils/console.js";
import { createDir } from "./general.js";
import { generateComponent } from "./generateComponent.js";
import type { Component, Options } from "../generate.types.js";

// Utility
const createComponentFiles = (component: Component) => {
  const { JSX, stylesheet, hook, test } = component;
  fs.writeFileSync(JSX.path, JSX.content);
  fs.writeFileSync(stylesheet.path, stylesheet.content);
  fs.writeFileSync(hook.path, hook.content);
  fs.writeFileSync(test.path, test.content);
};

export const runGenerateComponent = async (
  rootDir: string,
  name: string,
  options: Options,
) => {
  if (!/^[A-Z][a-zA-Z]*$/.test(name)) {
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
  createComponentFiles(component);
  info(`${name} created at ${chalk.gray(folder)}`);
};
