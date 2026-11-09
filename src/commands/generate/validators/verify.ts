import fs from "fs";
import path from "path";

import { PATTERNS, STYLES, TYPES } from "../generate.constants.js";

import { isNameValid, isTypeValid } from "./arguments.js";
import { resolveDir } from "@/utils/path.js";
import { fail } from "@/utils/console.js";
import { hasDependency } from "@/utils/validators.js";

import type { Flag } from "@/types/command.types.js";
import type { GenerateOptions, Type } from "../types/generate.types.js";

export const verifyCommandExecution = (forced: Flag) => {
  if (!hasDependency("react") && !forced) {
    fail(
      "This isn't a React project",
      "Create one with 'ct new <name>' or use --force",
    );
  }
};

export const verifyCommandArgs = (type: Type, name: string) => {
  if (!isTypeValid(type)) {
    fail(
      `Invalid type argument: ${type}`,
      `Valid options: [${TYPES.join(", ")}]`,
    );
  }

  if (!isNameValid(type, name)) {
    fail(
      `"${name}" is not a valid ${type} name`,
      `A valid ${type} must follow the rule: ${PATTERNS[type][1]}`,
    );
  }
};

export const verifyCommandOptions = (options: GenerateOptions) => {
  if (options.dir !== undefined) {
    const dir = options.dir.trim();
    if (dir === "") fail("Option --dir can't be an empty string");

    try {
      options.dir = resolveDir(dir);
    } catch (e) {
      fail(`Option --dir: ${(e as Error).message}`);
    }
  }

  if (options.feature !== undefined) {
    if (options.feature.trim() === "") {
      fail("Option --feature can't be an empty string");
    }

    if (!isNameValid("feature", options.feature)) {
      fail(
        `Invalid feature: ${options.feature}`,
        `Valid name must follow the rule: ${PATTERNS["feature"][1]}`,
      );
    }

    const featurePath = path.join(
      process.cwd(),
      "src",
      "features",
      options.feature,
    );

    if (!fs.statSync(featurePath, { throwIfNoEntry: false })?.isDirectory()) {
      fail(
        `Feature ${options.feature} doesn't exist`,
        `Create it first with 'ct g feature ${options.feature}'`,
      );
    }
  }

  if (options.style !== undefined && !STYLES.includes(options.style)) {
    fail(
      `Invalid style option: ${options.style}`,
      `Valid style options: [${STYLES.join(", ")}]`,
    );
  }
};
