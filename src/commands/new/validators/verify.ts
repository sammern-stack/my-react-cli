import { TYPES } from "@/commands/generate/generate.constants.js";
import {
  CUSTOM_TEMPLATES,
  TEMPLATES,
  VALID_REACT_NAME,
} from "../new.constants.js";

import { fail } from "@/utils/console.js";
import { hasDependency } from "@/utils/validators.js";
import { isInvalidTemplate } from "../utils/templateValidation.js";

import type { Flag } from "@/types/command.types.js";
import type { NewOptions } from "../types/new.types.js";

export const verifyCommandExecution = (forced: Flag) => {
  if (hasDependency("react") && !forced) {
    fail(
      "This is already a React project",
      "Use --force if you wish to overwrite it",
    );
  }
};

export const verifyCommandArgs = (name: string) => {
  if (!VALID_REACT_NAME.test(name)) {
    fail(`Invalid React name: ${name}`, `Valid options: [${TYPES.join(", ")}]`);
  }
};

export const verifyCommandOptions = (options: NewOptions) => {
  const templates = [...TEMPLATES, ...CUSTOM_TEMPLATES].join(", ");

  if (isInvalidTemplate(options.template)) {
    fail(
      `Invalid template ${options.template}`,
      `You can choose between: ${templates}`,
    );
  }
};
