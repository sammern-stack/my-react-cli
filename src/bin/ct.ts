#!/usr/bin/env node
import { createRequire } from "module";
import { spawnSync } from "child_process";
import { Command } from "commander";
import { registerGenerateCommand } from "../commands/generate.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command();

program.name("ct").description("My React CLI").version(version);

registerGenerateCommand(program);

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
