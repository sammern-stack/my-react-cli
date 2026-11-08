import prompts from "prompts";

import { isTypescriptUsed } from "../../../utils/validators.js";
import type { Config } from "../../../types/config.types.js";

export const projectUsesTs = (tsOption: boolean | undefined, config: Config) => {
  return tsOption ?? config.typescript ?? isTypescriptUsed();
};

export const projectStyleExt = async (
  styleOption: string | undefined,
  config: Config,
) => {
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

  return styleOption ?? config.stylesheet ?? (await askForStyle());
};
