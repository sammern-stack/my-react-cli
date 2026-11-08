import { PATTERNS } from "./generate.constants.js";
import { isReactProject } from "../../utils/validators.js";
import { applyTemplate } from "../../utils/templates.js";
import { loadConfig } from "../../utils/loadConfig.js";
import { projectStyleExt, projectUsesTs } from "./utils/generationOptions.js";
import { registerPage } from "./utils/registerPage.js";
import { writeGeneratedFiles } from "./utils/writeGeneratedFiles.js";
import { getComponentFiles } from "./utils/getComponentFiles.js";
import { getHookFiles } from "./utils/getHookFiles.js";
import { resolveDestination } from "./utils/resolveDestination.js";

import type { File, Options, Type } from "./types/generate.types.js";
import { error, info } from "../../utils/console.js";

export const generateHandler = async (
  type: Type,
  name: string,
  options: Options,
) => {
  if (!isReactProject() && !options.force) {
    error("This isn't a React project");
    info("Create one with 'ct new <name>' or use --force");
    process.exit(1);
  }

  if (!PATTERNS[type].test(name)) {
    error(`"${name}" is not a valid ${type} name`);
    process.exit(1);
  }

  const dir = resolveDestination(type, name, options);
  const config = loadConfig() ?? {};
  const useTs = projectUsesTs(options.ts, config);

  let files: File[] = [];
  switch (type) {
    case "component":
    case "page":
      files = getComponentFiles(
        dir,
        name,
        useTs,
        await projectStyleExt(options.style, config),
        type,
      );
      break;
    case "hook":
      files = getHookFiles(dir, name, useTs);
      break;
    case "feature":
      applyTemplate(useTs ? "feature-ts" : "feature", dir);
      break;
  }
  writeGeneratedFiles(dir, name, files);

  if (type === "page") registerPage(name, `../pages/${name}`);
};
