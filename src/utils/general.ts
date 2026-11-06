import fs from "fs";

type Template = "component" | "hook" | "stylesheet" | "main" | "page";

export const getTemplate = (template: Template) =>
  fs.readFileSync(
    new URL(`../../templates/${template}.tpl`, import.meta.url),
    "utf-8",
  );
