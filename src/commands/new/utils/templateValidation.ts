import { CUSTOM_TEMPLATES, TEMPLATES } from "../new.constants.js";

import type { CustomTemplate, Template } from "../new.types.js";

export const isViteTemplate = (template: string): template is Template =>
  TEMPLATES.some((item) => item === template);

export const isCustomTemplate = (
  template: string | undefined,
): template is CustomTemplate =>
  CUSTOM_TEMPLATES.some((item) => item === template);

export const isInvalidTemplate = (template?: string): boolean =>
  template !== undefined &&
  !isCustomTemplate(template) &&
  !isViteTemplate(template);
