import path from "path";
import fs from "fs";
import {
  CUSTOM_TEMPLATES,
  TEMPLATES,
  VALID_REACT_NAME,
} from "./new.constants.js";
import { error, info, warning } from "../../utils/console.js";
import {
  isCustomTemplate,
  isInvalidTemplate,
} from "./utils/templateValidation.js";
import { runCreateVite } from "./utils/runCreateVite.js";
import { runCustomTemplate } from "./utils/runCustomTemplate.js";
import type { Options } from "./types/new.types.js";

export const newHandler = (name: string, options: Options) => {
  if (!VALID_REACT_NAME.test(name)) {
    error(`Invalid name ${name}`);
    process.exitCode = 1;
    return;
  }

  if (isInvalidTemplate(options.template)) {
    const templates = [...TEMPLATES, ...CUSTOM_TEMPLATES].join(", ");
    error(`Invalid template ${options.template}`);
    info(`You can choose between: ${templates}`);
    process.exitCode = 1;
    return;
  }

  const target = path.join(process.cwd(), name);
  if (fs.existsSync(target)) {
    warning(`Folder ${name} already exists!`);
    process.exitCode = 1;
    return;
  }

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
