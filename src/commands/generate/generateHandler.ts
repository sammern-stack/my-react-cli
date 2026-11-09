import { applyTemplate } from "../../utils/templates.js";
import { loadConfig } from "../../utils/loadConfig.js";
import { projectStyleExt, projectUsesTs } from "./utils/generationOptions.js";
import { registerPage } from "./utils/registerPage.js";
import { writeGeneratedFiles } from "./utils/writeGeneratedFiles.js";
import { getComponentFiles } from "./utils/getComponentFiles.js";
import { getHookFiles } from "./utils/getHookFiles.js";
import {
  verifyCommandArgs,
  verifyCommandExecution,
  verifyCommandOptions,
} from "./validators/verify.js";

import type { File, GenerateOptions, Type } from "./types/generate.types.js";
import { buildTargetPath } from "./utils/buildTargetPath.js";
import { verifyTargetAvailable } from "./validators/target.js";

export const generateHandler = async (
  type: Type,
  name: string,
  options: GenerateOptions,
) => {
  verifyCommandExecution(options.force);
  verifyCommandArgs(type, name);
  verifyCommandOptions(type, options);

  const target = buildTargetPath(type, name, options);
  verifyTargetAvailable(target, options.force);

  const config = loadConfig() ?? {};
  const useTs = projectUsesTs(options.ts, config);

  let files: File[] = [];
  switch (type) {
    case "component":
    case "page":
      files = getComponentFiles(
        target,
        name,
        useTs,
        await projectStyleExt(options.style, config),
        type,
      );
      break;
    case "hook":
      files = getHookFiles(target, name, useTs);
      break;
    case "feature":
      applyTemplate(useTs ? "feature-ts" : "feature", target);
      break;
  }
  writeGeneratedFiles(target, name, files);

  if (type === "page") registerPage(name, `../pages/${name}`);
};
