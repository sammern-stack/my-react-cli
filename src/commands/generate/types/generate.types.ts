import type { STYLES, TYPES } from "../generate.constants.js";
import type { buildGenerateProperties } from "../utils/buildGenerateProperties.js";

export type Type = (typeof TYPES)[number];
export type Style = (typeof STYLES)[number];

export interface GenerateOptions {
  dir?: string;
  feature?: string;
  style?: Style;
  ts?: boolean;
  force?: boolean;
}

export type GenerateProperties = Awaited<
  ReturnType<typeof buildGenerateProperties>
>;

export type File = { path: string; content: string };

export type DefaultDirs = Exclude<Type, "feature">;
