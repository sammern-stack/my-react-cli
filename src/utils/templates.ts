import fs from "fs";

type Template = "component" | "hook" | "stylesheet" | "main" | "page";
type TemplateDirectory = "react-ts" | "react" | "feature-ts" | "feature";

export const getTemplate = (template: Template) =>
  fs.readFileSync(
    new URL(`../../templates/${template}.tpl`, import.meta.url),
    "utf-8",
  );

export const getTemplateUrl = (template: TemplateDirectory) =>
  new URL(`../../templates/${template}`, import.meta.url);

export const applyTemplate = (template: TemplateDirectory, target: string) => {
  const templateUrl = getTemplateUrl(template);
  fs.cpSync(templateUrl, target, { recursive: true, force: true });
};
