import fs from "fs";

import { executeCustomTemplate } from "./utils/template.js";
import {
  verifyCommandArgs,
  verifyCommandExecution,
  verifyCommandOptions,
} from "./validators/verify.js";
import { resolveTarget } from "./validators/target.js";
import { fail } from "@/utils/console.js";
import { buildViteCommand, retryInstallDependencies } from "./utils/vite.js";
import { isCustomTemplate } from "./validators/template.js";
import { writeConfig } from "./utils/writeConfig.js";
import { executeCommand } from "@/utils/command.js";

import type { NewOptions } from "./types/new.types.js";

export const newHandler = (name: string, options: NewOptions) => {
  verifyCommandExecution(options.force);
  verifyCommandArgs(name);
  verifyCommandOptions(options);

  const target = resolveTarget(name);
  if (!fs.existsSync(target)) fail("Vite failed before creating the project.");

  const command = buildViteCommand(name, options.template);
  const result = executeCommand(command);
  if (result.status !== 0) retryInstallDependencies(name, target);
  writeConfig(target);

  if (isCustomTemplate(options.template)) {
    const useTs = options.template.endsWith("-ts");
    executeCustomTemplate(target, useTs);
  }
};
