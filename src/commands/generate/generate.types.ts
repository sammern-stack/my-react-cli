import type { STYLES, TYPES } from "./generate.constants.js";

export type Check = { condition: boolean | undefined; message: string };

export type Type = (typeof TYPES)[number];
export type Style = (typeof STYLES)[number];

export interface Options {
  dir?: string;
  feature?: string;
  style?: Style;
  ts?: boolean;
  force?: boolean;
}

export type ComponentFile = "JSX" | "stylesheet" | "hook" | "test";

export type Component = {
  [K in ComponentFile]: { path: string; content: string };
};
