#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { createRequire } from "module";
import { Command } from "commander";
import { generateComponent } from "../utils/generateComponent.js";
import type { ComponentOptions } from "../types/component.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command();

const TYPES = ["component"];

program.name("ct").description("My React CLI").version(version);

program
  .command("generate <type> <name>")
  .alias("g")
  .description("Generate a component, e.g. ct g component Button")
  .option("-d, --dir <div>", "target folder", "components")
  .option("-f, --feature <feature>", "put component under a feature")
  .option("--ts", "create a .tsx file")
  .option("-y, --yes", "use default options and skip prompts")
  .action(async (type: string, name: string, options: ComponentOptions) => {
    if (!TYPES.includes(type)) {
      console.log(chalk.red(`Unknown type: ${type}`));
      process.exitCode = 1;
      return;
    }

    if (type === "component") {
      const spinner = ora(`Creating ${name}...`).start();

      try {
        const pathToComponent = options.feature
          ? `src/features/${options.feature}/${options.dir}`
          : `src/${options.dir}`;
        const folder = path.join(process.cwd(), pathToComponent, name);
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

        spinner.succeed(`Created ${chalk.cyan(name)} in ${chalk.gray(folder)}`);
      } catch (error) {
        spinner.fail(chalk.red(`Could not create ${name}`));
        console.error(error);
        process.exitCode = 1;
      }
    }
  });

program.parse();
