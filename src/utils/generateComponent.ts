import prompts from "prompts";
import buildComponentTemplate from "../templates/component.js";
import type { ComponentOptions } from "../types/component.js";
import buildStylesheetTemplate from "../templates/stylesheet.js";
import buildHookTemplate from "../templates/hook.js";

export const generateComponent = async (
  name: string,
  options: ComponentOptions,
) => {
  let componentExt;

  if (options.ts === undefined) {
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

  const stylesheetExt = await prompts({
    type: "select",
    name: "style",
    message: "What stylesheet to use",
    choices: [
      { title: "CSS", value: "css" },
      { title: "SCSS", value: "scss" },
    ],
    initial: 1,
  });

  const componentLanguage = componentExt?.replace("x", "")!;

  return {
    JSX: {
      file: `${name}.${componentExt}`,
      content: buildComponentTemplate(
        name,
        stylesheetExt.style,
        componentLanguage,
      ),
    },
    stylesheet: {
      file: `${name}.module.${stylesheetExt.style}`,
      content: buildStylesheetTemplate(name),
    },
    hook: {
      file: `use${name}.${componentLanguage}`,
      content: buildHookTemplate(name),
    },
    test: {
      file: `${name}.test.${componentLanguage}`,
      content: "",
    },
  };
};
