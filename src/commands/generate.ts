import path from "path";
import fs from "fs";
import { Command } from "commander";
import { error, warning } from "../utils/console.js";
import { applySpinner } from "../utils/applySpinner.js";
import {
  generateComponent,
  type Component,
} from "../utils/generate/component.js";

const TYPES = ["component", "hook"] as const;

interface Options {
  feature?: string;
}

type Type = (typeof TYPES)[number];

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
    .option(
      "-f, --feature <feature>",
      "generate the given <type> inside a feature",
    )
    .action((type: Type, name: string, options: Options) => {
      if (!TYPES.includes(type)) {
        error(`Invalid type: ${type}`);
        process.exitCode = 1;
        return;
      }

      const rootDir = options.feature
        ? `src/features/${options.feature}`
        : "src";

      if (type === "component") {
        const folder = createDir(`${rootDir}/components/${name}`);
        if (!folder) {
          warning(`Folder ${name} already exists!`);
          process.exitCode = 1;
          return;
        }
        applySpinner({ name, folder }, async () => {
          const component = await generateComponent(folder, name);
          createComponentFiles(component);
        });
      }

      if (type === "hook") {
      }
    });
};
