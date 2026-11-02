import path from "path";
import type { GeneratorOptions } from "../types/generator.js";
import prompts from "prompts";
import buildHookTemplate from "../templates/hook.js";

const DEFAULTS = { componentExt: "tsx", style: "scss" };

export const generateHook = async (
  folder: string,
  name: string,
  options: GeneratorOptions,
) => {
  let componentExt: string | undefined;

  if (options.ts !== undefined) {
    componentExt = options.ts ? "tsx" : "jsx";
  } else if (options.yes) {
    componentExt = DEFAULTS.componentExt;
  } else {
    const answer = await prompts({
      type: "select",
      name: "ts",
      message: "Use TypeScript?",
      choices: [
        { title: "Yes", value: "tsx" },
        { title: "No", value: "jsx" },
      ],
      initial: 0,
    });
    componentExt = answer.ts as string;
  }
  const componentLanguage = componentExt?.replace("x", "")!;

  return {
    pathToFile: path.join(folder, `${name}.${componentLanguage}`),
    content: buildHookTemplate(name),
  };
};
