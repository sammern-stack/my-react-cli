import { PATTERNS } from "./generate.constants.js";
import { isReactProject } from "../../utils/validators.js";
import { applyTemplate } from "../../utils/templates.js";
import { runChecks } from "../../utils/checks.js";
import { projectStyleExt, projectUsesTs } from "./utils/generationOptions.js";
import { registerPage } from "./utils/registerPage.js";
import { writeGeneratedFiles } from "./utils/writeGeneratedFiles.js";
import { getComponentFiles } from "./utils/getComponentFiles.js";
import { getHookFiles } from "./utils/getHookFiles.js";
import { resolveDestination } from "./utils/resolveDestination.js";

import type { File, Options, Type } from "./types/generate.types.js";

export const generateHandler = async (
  type: Type,
  name: string,
  options: Options,
) => {
  runChecks([
    {
      condition: !isReactProject() && !options.force,
      message:
        "This is not a React project\ncreate one with 'ct new <name>' or use --force",
    },
    {
      condition: !PATTERNS[type].test(name),
      message: `"${name}" is not a valid ${type} name`,
    },
  ]);

  const dir = resolveDestination(type, name, options);
  const useTs = projectUsesTs(options.ts);
  const style = await projectStyleExt(options.style);

  let files: File[] = [];
  switch (type) {
    case "component":
    case "page":
      files = getComponentFiles(dir, name, useTs, style);
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
