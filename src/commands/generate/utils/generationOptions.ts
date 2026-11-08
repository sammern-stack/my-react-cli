import prompts from "prompts";

import { loadConfig } from "../../../utils/loadConfig.js";
import { isTypescriptUsed } from "../../../utils/validators.js";

export const projectUsesTs = (tsOption: boolean | undefined) => {
  const config = loadConfig() ?? {};
  return tsOption ?? config.typescript ?? isTypescriptUsed();
};

export const projectStyleExt = async (styleOption: string | undefined) => {
  const config = loadConfig() ?? {};

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
