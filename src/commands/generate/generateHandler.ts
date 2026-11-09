import { validateConfig } from "@/utils/validators.js";
import { retrieveRawConfig } from "@/utils/retrieveRawConfig.js";
import { buildGenerateProperties } from "./utils/buildGenerateProperties.js";
import { registerPage } from "./utils/registerPage.js";
import { buildTargetPath } from "./utils/buildTargetPath.js";
import { verifyTargetAvailable } from "./validators/target.js";
import {
  verifyCommandArgs,
  verifyCommandExecution,
  verifyCommandOptions,
} from "./validators/verify.js";
import { assembleFilePackage, writeGeneratedFiles } from "./utils/file.js";
import type { GenerateOptions, Type } from "./types/generate.types.js";

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

  const config = validateConfig(retrieveRawConfig());
  const { exts } = await buildGenerateProperties(options, config);
  const files = assembleFilePackage(target, name, type, exts);
  if (files.length > 0) writeGeneratedFiles(target, name, files);

  if (type === "page") registerPage(name, `../pages/${name}`);
};
