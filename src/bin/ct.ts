#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { createRequire } from "module";
import { Command } from "commander";
import { generateComponent } from "../utils/generateComponent.js";
import { applySpinner } from "../utils/applySpinner.js";
import { DEFAULT_DIRS, TYPES } from "../constants/generator.js";
import { generateHook } from "../utils/generateHook.js";
import { isReactProject } from "../utils/validators.js";
import type { GeneratorOptions } from "../types/generator.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command();

program.name("ct").description("My React CLI").version(version);

program
  .command("generate <type> <name>")
  .alias("g")
  .description("Generate a <type>, e.g. ct g component Button")
  .option("-d, --dir <dir>", "target folder (default depends on type)")
  .option("-f, --feature <feature>", "put <type> under a feature")
  .option("--ts", "use Typescript")
  .option("-y, --yes", "use default options and skip prompts")
  .option("--force", "skip safety checks and overwrite")
  .action((type: string, name: string, options: GeneratorOptions) => {
    if (!isReactProject() && !options.force) {
      console.log(
        chalk.yellow(
          "This doesn't look like a React project (no react in package.json).",
        ),
      );
      console.log(chalk.gray("Run ct from your project root, or use --force."));
      process.exitCode = 1;
      return;
    }

    if (!TYPES.includes(type)) {
      console.log(chalk.red(`Unknown type: ${type}`));
      process.exitCode = 1;
      return;
    }

    const dir = options.dir ?? DEFAULT_DIRS[type]!;

    if (type === "component") {
      const pathToComponent = options.feature
        ? `src/features/${options.feature}/${dir}`
        : `src/${dir}`;
      const folder = path.join(process.cwd(), pathToComponent, name);

      if (fs.existsSync(folder) && !options.force) {
        console.log(
          chalk.yellow(`${name} already exists. Use --force to overwrite it.`),
        );
        process.exitCode = 1;
        return;
      }

      applySpinner({ name, folder }, async () => {
        fs.mkdirSync(folder, { recursive: true });

        const { JSX, stylesheet, hook, test } = await generateComponent(
          folder,
          name,
          options,
        );

        fs.writeFileSync(JSX.pathToFile, JSX.content);
        fs.writeFileSync(stylesheet.pathToFile, stylesheet.content);
        fs.writeFileSync(hook.pathToFile, hook.content);
        fs.writeFileSync(test.pathToFile, test.content);
      });
    }

    if (type === "hook") {
      if (!/^use[A-Z]\w+$/.test(name)) {
        console.log(
          chalk.red("Hook must start with 'use' followed by a capital letter"),
        );
        process.exitCode = 1;
        return;
      }

      const pathToHook = options.feature
        ? `src/features/${options.feature}/${dir}`
        : `src/shared/${dir}`;
      const folder = path.join(process.cwd(), pathToHook);

      if (fs.existsSync(folder) && !options.force) {
        console.log(
          chalk.yellow(`${name} already exists. Use --force to overwrite it.`),
        );
        process.exitCode = 1;
        return;
      }

      applySpinner({ name, folder }, async () => {
        fs.mkdirSync(folder, { recursive: true });
        const hook = await generateHook(folder, name, options);
        fs.writeFileSync(hook.pathToFile, hook.content);
      });
    }
  });

program.parse();
