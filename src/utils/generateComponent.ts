import prompts from "prompts";
import buildComponentTemplate from "../templates/component.js";
import type { ComponentOptions } from "../types/component.js";

export const generateComponent = async (
  name: string,
  options: ComponentOptions,
) => {
  let useTs = options.ts;

  if (useTs === undefined) {
    const answer = await prompts({
      type: "select",
      name: "ts",
      message: "Use TypeScript?",
      choices: [
        { title: "Yes", value: true },
        { title: "No", value: false },
      ],
      initial: 0,
    });
    useTs = answer.ts ?? false;
  }

  const ext = useTs ? "tsx" : "jsx";

  const content = buildComponentTemplate(name);

  return { file: `${name}.${ext}`, content };
};
