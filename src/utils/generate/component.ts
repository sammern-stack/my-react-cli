import path from "path";
import buildComponentTemplate from "../../templates/component.js";
import buildStylesheetTemplate from "../../templates/stylesheet.js";
import buildHookTemplate from "../../templates/hook.js";

type ComponentFile = "JSX" | "stylesheet" | "hook" | "test";

export type Component = {
  [K in ComponentFile]: { path: string; content: string };
};

export const generateComponent = async (
  folder: string,
  name: string,
): Promise<Component> => {
  return {
    JSX: {
      path: path.join(folder, `${name}.tsx`),
      content: buildComponentTemplate(name, "scss", "ts"),
    },
    stylesheet: {
      path: path.join(folder, `${name}.module.scss`),
      content: buildStylesheetTemplate(name),
    },
    hook: {
      path: path.join(folder, `use${name}.ts`),
      content: buildHookTemplate(name),
    },
    test: {
      path: path.join(folder, `${name}.test.ts`),
      content: "",
    },
  };
};
