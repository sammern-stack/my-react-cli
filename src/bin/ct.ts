#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { createRequire } from "module";
import { spawnSync } from "child_process";
import { Command } from "commander";
import { generateComponent } from "../utils/generateComponent.js";
import { applySpinner } from "../utils/applySpinner.js";
import { TYPES } from "../constants/generator.js";
import { generateHook } from "../utils/generateHook.js";
import { isReactProject } from "../utils/validators.js";
import { loadConfig } from "../utils/loadConfig.js";
import type { GeneratorOptions } from "../types/generator.js";
import { DEFAULT_CONFIG } from "../constants/ct.config.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command();

program.name("ct").description("My React CLI").version(version);

program
  .command("generate <type> <name>")
  .alias("g")
  .description("Generate a <type>, e.g. ct g component Button")
  .option("-d, --dir <dir>", "target folder")
  .option("-f, --feature <feature>", "put <type> under a feature")
  .option("--ts", "use Typescript")
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

    const config = loadConfig() ?? {};

    if (!TYPES.includes(type)) {
      console.log(chalk.red(`Unknown type: ${type}`));
      process.exitCode = 1;
      return;
    }

    if (type === "component") {
      const dir = options.dir ?? config.dir?.component ?? "components";
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
          config,
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

      const dir = options.dir ?? config.dir?.hook ?? "hooks";
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
        const hook = await generateHook(folder, name, options, config);
        fs.writeFileSync(hook.pathToFile, hook.content);
      });
    }
  });

program
  .command("new <name>")
  .description("Create a new React project with Vite")
  .action((name: string) => {
    if (!/^[a-z0-9][a-z0-9-_]*$/i.test(name)) {
      console.log(chalk.red(`Invalid name ${name}`));
      process.exitCode = 1;
      return;
    }

    const target = path.join(process.cwd(), name);
    if (fs.existsSync(target)) {
      console.log(chalk.yellow(`Folder ${name} already exists!`));
      process.exitCode = 1;
      return;
    }

    const result = spawnSync(`npm create vite@latest ${name} -- --no-install`, {
      stdio: "inherit",
      shell: true,
    });

    const vitePassed = result.status === 0;

    if (!vitePassed && !fs.existsSync(target)) {
      console.log(chalk.red("Vite failed before creating the project."));
      process.exitCode = 1;
      return;
    }

    fs.writeFileSync(
      path.join(target, "ct.config.json"),
      JSON.stringify(DEFAULT_CONFIG, null, 2),
    );

    if (!vitePassed) {
      console.log(
        chalk.yellow(
          "Install failed (dependency conflict). Retrying with --legacy-peer-deps...",
        ),
      );

      const retry = spawnSync("npm install --legacy-peer-deps", {
        cwd: target,
        stdio: "inherit",
        shell: true,
      });

      if (retry.status !== 0) {
        console.log(chalk.red("Install failed again. Finish it manually:"));
        console.log(chalk.green(`cd ${name}`));
        console.log(chalk.green("npm install --legacy-peer-deps"));
        process.exitCode = 1;
        return;
      }
    }

    console.log(`\nDone! Next steps:\n`);
    console.log(chalk.green(`cd ${name}`));
    console.log(chalk.green("npm run dev"));
  });

program.parse();
