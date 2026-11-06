import type { STYLES } from "../commands/generate/generate.constants.js";

type AllowedTypes =
  | "string"
  | "number"
  | "boolean"
  | "bigint"
  | "symbol"
  | "object"
  | "null";

export type Config = {
  $schema?: string;
  /** Generate TypeScript files by default. */
  typescript?: boolean;
  /** Default stylesheet format for components and pages. */
  stylesheet?: (typeof STYLES)[number];
};

export type ConfigKeys = Exclude<keyof Config, "$schema">;
export type ConfigPropertyTypes = { [K in ConfigKeys]: AllowedTypes };
