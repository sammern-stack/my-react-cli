import path from "path";
import fs from "fs";
import chalk from "chalk";
import { Command } from "commander";
import { error, info, warning } from "../utils/console.js";
import { isReactProject } from "../utils/validators.js";
import { generateHook } from "../utils/generate/hook.js";
import { generateComponent } from "../utils/generate/component.js";
import type { Component } from "../utils/generate/component.js";

const TYPES = ["component", "hook"] as const;
const STYLES = ["css", "scss"] as const;

type Type = (typeof TYPES)[number];
export type Style = (typeof STYLES)[number];
export interface Options {
  dir?: string;
  feature?: string;
  style?: Style;
  ts?: boolean;
  force?: boolean;
}

// Utilities
const createDir = (pathToFolder: string) => {
  const folder = path.join(process.cwd(), pathToFolder);
  if (fs.existsSync(folder)) return;
  fs.mkdirSync(folder, { recursive: true });
  return folder;
};

const createComponentFiles = (component: Component) => {
  const { JSX, stylesheet, hook, test } = component;
  fs.writeFileSync(JSX.path, JSX.content);
  fs.writeFileSync(stylesheet.path, stylesheet.content);
  fs.writeFileSync(hook.path, hook.content);
  fs.writeFileSync(test.path, test.content);
};

export const registerGenerateCommand = (program: Command) => {
  program
    .command("generate <type> <name>")
    .alias("g")
    .description("generate the given <type> content")
    .option("-d, --dir <dir>", "target folder for the <type> folder", (value) =>
      value.replace(/=/, ""),
    )
    .option(
      "-f, --feature <feature>",
      "generate the given <type> inside a feature",
      (value) => value.replace(/=/, ""),
    )
    .option(
      "-s, --style <style>",
      "use the specified stylesheet style",
      (value) => value.replace(/=/, ""),
    )
    .option("--ts", "Use typescript")
    .option("--force", "skip safety checks and overwrite")
    .action(async (type: Type, name: string, options: Options) => {
      if (!isReactProject() && !options.force) {
        error(
          "This is not a React project\ncreate one with 'ct new <name>' or use --force",
        );
        process.exitCode = 1;
        return;
      }

      if (!TYPES.includes(type)) {
        error(`Invalid type: ${type}`);
        process.exitCode = 1;
        return;
      }

      if (options.style && !STYLES.includes(options.style)) {
        error(`Invalid style: ${options.style}`);
        process.exitCode = 1;
        return;
      }

      const rootDir = options.feature
        ? `src/features/${options.feature}/${options.dir ?? ""}`
        : `src/${options.dir ?? ""}`;

      if (type === "component") {
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
      }

      if (type === "hook") {
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
      }
    });
};
