import type { CUSTOM_TEMPLATES, TEMPLATES } from "./new.constants.js";

export type Template = (typeof TEMPLATES)[number];
export type CustomTemplate = (typeof CUSTOM_TEMPLATES)[number];
export interface Options {
  template?: Template | CustomTemplate;
}
