#!/usr/bin/env node
import fs from "fs";
import path from "path";
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
  .action(async (type: string, name: string, options: ComponentOptions) => {
    if (!TYPES.includes(type)) return console.log(`Unknown type: ${type}`);

    if (type === "component") {
      const pathToComponent = options.feature
        ? `src/features/${options.feature}/${options.dir}`
        : `src/${options.dir}`;
      const folder = path.join(process.cwd(), pathToComponent, name);
      fs.mkdirSync(folder, { recursive: true });

      const { JSX, stylesheet, hook, test } = await generateComponent(
        name,
        options,
      );

      fs.writeFileSync(path.join(folder, JSX.file), JSX.content);
      fs.writeFileSync(path.join(folder, stylesheet.file), stylesheet.content);
      fs.writeFileSync(path.join(folder, hook.file), hook.content);
      fs.writeFileSync(path.join(folder, test.file), test.content);
    }
  });

program.parse();
