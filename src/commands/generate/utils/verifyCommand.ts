import fs from "fs";
import path from "path";

import { PATTERNS, STYLES, TYPES } from "../generate.constants.js";

import { error, info } from "@/utils/console.js";
import { hasDependency } from "@/utils/validators.js";

import type { Flag } from "@/types/command.types.js";
import type { GenerateOptions, Type } from "../types/generate.types.js";

// Utilities
const isNameValid = (type: Type, name: string) => {
  const pattern = PATTERNS[type][0];
  return pattern.test(name);
};

const isTypeValid = (type: Type) => TYPES.includes(type);

export const verifyCommandExecution = (forced: Flag) => {
  if (!hasDependency("react") || !forced) {
    error("This isn't a React project");
    info("Create one with 'ct new <name>' or use --force");
    process.exit(1);
  }
};

export const verifyCommandArgs = (type: Type, name: string) => {
  if (!isTypeValid(type)) {
    error(`Invalid type argument: ${type}`);
    info(`Valid options: [${TYPES.join(", ")}]`);
    process.exit(1);
  }

  if (!isNameValid(type, name)) {
    error(`"${name}" is not a valid ${type} name`);
    info(`A valid ${type} must follow the rule: ${PATTERNS[type][1]}`);
    process.exit(1);
  }
};

export const verifyCommandOptions = (options: GenerateOptions) => {
  if (options.dir !== undefined && options.dir.trim() === "") {
    error("Option --dir can't be an empty string");
    process.exit(1);
  }

  if (options.feature !== undefined) {
    if (options.feature.trim() === "") {
      error("Option --feature can't be an empty string");
      process.exit(1);
    }

    if (!isNameValid("feature", options.feature)) {
      error(`Invalid feature: ${options.feature}`);
      info(`Valid name must follow the rule: ${PATTERNS["feature"][1]}`);
      process.exit(1);
    }

    const featurePath = path.join(
      process.cwd(),
      "src",
      "features",
      options.feature,
    );

    if (!fs.statSync(featurePath, { throwIfNoEntry: false })?.isDirectory()) {
      error(`Feature ${options.feature} doesn't exist`);
      info(`Create it first with 'ct g feature ${options.feature}'`);
      process.exit(1);
    }
  }

  if (options.style !== undefined && !STYLES.includes(options.style)) {
    error(`Invalid style option: ${options.style}`);
    info(`Valid style options: [${STYLES.join(", ")}]`);
    process.exit(1);
  }
};
