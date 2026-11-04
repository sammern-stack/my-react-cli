type AllowedTypes =
  | "string"
  | "number"
  | "boolean"
  | "bigint"
  | "symbol"
  | "object"
  | "null";

export type Config = {
  typescript?: boolean;
  stylesheet?: string;
};

export type ConfigKeys = keyof Config;
export type ConfigPropertyTypes = { [K in ConfigKeys]: AllowedTypes };
