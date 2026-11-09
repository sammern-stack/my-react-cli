import path from "path";
import fs from "fs";
import prompts from "prompts";

import type { Config } from "../../../types/config.types.js";
import type { GenerateOptions } from "../types/generate.types.js";

const askForStyle = async (): Promise<string> => {
  const answer = await prompts({
    type: "select",
    name: "style",
    message: "What stylesheet to use?",
    choices: [
      { title: "CSS", value: "css" },
      { title: "SCSS", value: "scss" },
    ],
    initial: 1,
  });
  return answer.style ?? "css";
};

export const buildGenerateProperties = async (
  options: GenerateOptions,
  config: Config,
) => {
  const useTs =
    options.ts ??
    config.typescript ??
    fs.existsSync(path.join(process.cwd(), "tsconfig.json"));

  const lang = useTs ? "ts" : "js";
  const jsx = useTs ? "tsx" : "jsx";
  const style =
    options.style ?? config.stylesheet ?? (await askForStyle()) ?? "css";

  return { exts: { lang, jsx, style } };
};
