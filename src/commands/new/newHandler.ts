import path from "path";
import fs from "fs";

import { isCustomTemplate } from "./utils/templateValidation.js";
import { runCreateVite } from "./utils/runCreateVite.js";
import { runCustomTemplate } from "./utils/runCustomTemplate.js";
import {
  verifyCommandArgs,
  verifyCommandExecution,
  verifyCommandOptions,
} from "./validators/verify.js";

import type { NewOptions } from "./types/new.types.js";
import { resolveTarget } from "./validators/target.js";

export const newHandler = (name: string, options: NewOptions) => {
  verifyCommandExecution(options.force);
  verifyCommandArgs(name);
  verifyCommandOptions(options);

  const target = resolveTarget(name);

  if (!runCreateVite(name, target, options.template)) return;

  fs.writeFileSync(
    path.join(target, "ct.config.json"),
    JSON.stringify(
      {
        $schema:
          "https://unpkg.com/@pavlos-samaras/react-cli/ct.config.schema.json",
      },
      null,
      2,
    ),
  );
  if (isCustomTemplate(options.template)) {
    runCustomTemplate(target, options);
  }
};
