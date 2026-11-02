import prompts from "prompts";
import buildComponentTemplate from "../templates/component.js";
import type { ComponentOptions } from "../types/component.js";
import buildStylesheetTemplate from "../templates/stylesheet.js";
import buildHookTemplate from "../templates/hook.js";

const DEFAULTS = { componentExt: "tsx", style: "scss" };

export const generateComponent = async (
  name: string,
  options: ComponentOptions,
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

  const stylesheetExt = options.yes
    ? { style: DEFAULTS.style }
    : await prompts({
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
