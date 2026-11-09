import { PATTERNS, TYPES } from "../generate.constants.js";
import type { Type } from "../types/generate.types.js";

export const isTypeValid = (type: Type) => TYPES.includes(type);

export const isNameValid = (type: Type, name: string) => {
  const pattern = PATTERNS[type][0];
  return pattern.test(name);
};
