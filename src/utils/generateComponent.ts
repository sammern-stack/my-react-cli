import prompts from "prompts";
import buildComponentTemplate from "../templates/component.js";
import type { ComponentOptions } from "../types/component.js";
import buildStylesheetTemplate from "../templates/stylesheet.js";

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
    componentExt = answer.ts;
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

  const content = buildComponentTemplate(name, stylesheetExt.style);
  const styles = buildStylesheetTemplate(name);

  return {
    file: `${name}.${componentExt}`,
    stylesheet: `${name}.module.${stylesheetExt.style}`,
    content,
    styles,
  };
};
