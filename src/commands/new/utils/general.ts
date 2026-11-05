import { CUSTOM_TEMPLATES, TEMPLATES } from "../new.constants.js";
import type { CustomTemplate, Template } from "../new.types.js";

export const isInvalidTemplate = (template?: string) =>
  template &&
  !CUSTOM_TEMPLATES.includes(template as CustomTemplate) &&
  !TEMPLATES.includes(template as Template);

export const isCustomTemplate = (template?: string) =>
  template && CUSTOM_TEMPLATES.includes(template as CustomTemplate);
