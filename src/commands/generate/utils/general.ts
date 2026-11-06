import { isReactProject } from "../../../utils/validators.js";
import { STYLES, TYPES } from "../generate.constants.js";
import type { Check, Options, Type } from "../generate.types.js";

export const buildPreActionChecks = (type: Type, options: Options): Check[] => [
  {
    condition: !isReactProject() && !options.force,
    message:
      "This is not a React project\ncreate one with 'ct new <name>' or use --force",
  },
  { condition: !TYPES.includes(type), message: `Invalid type: ${type}` },
  {
    condition: options.style && !STYLES.includes(options.style),
    message: `Invalid style: ${options.style}`,
  },
];
