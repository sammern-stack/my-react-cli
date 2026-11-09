import path from "path";
import fs from "fs";
import chalk from "chalk";

import { info } from "@/utils/console.js";
import { getTemplate } from "@/utils/templates.js";

import type {
  File,
  GenerateProperties,
  Type,
} from "../types/generate.types.js";

const render = (template: string, name: string) =>
  template
    .replace(/__NAME__/g, name)
    .replace(/__CLASSNAME__/g, name.toLowerCase());

const assertNever = (x: never): never => {
  throw new Error(`Unhandled type: ${x}`);
};

export const assembleFilePackage = (
  target: string,
  name: string,
  type: Type,
  exts: GenerateProperties["exts"],
): File[] => {
  const file = (fileName: string, content = ""): File => ({
    path: path.join(target, fileName),
    content,
  });

  const hookFile = () =>
    file(`use${name}.${exts.lang}`, render(getTemplate("hook"), name));

  switch (type) {
    case "feature":
      return [];

    case "hook":
      return [hookFile()];

    case "component":
    case "page":
      return [
        file(
          `${name}.${exts.jsx}`,
          render(getTemplate(type), name).replace(/\.scss/g, `.${exts.style}`),
        ),
        file(
          `${name}.module.${exts.style}`,
          render(getTemplate("stylesheet"), name),
        ),
        hookFile(),
        file(`${name}.test.${exts.lang}`),
      ];

    default:
      return assertNever(type);
  }
};

export const writeGeneratedFiles = (
  dir: string,
  name: string,
  files: File[],
) => {
  fs.mkdirSync(dir, { recursive: true });
  for (const { path, content } of files) fs.writeFileSync(path, content);
  info(`${name} created at ${chalk.gray(dir)}`);
};
