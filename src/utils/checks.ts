import { error } from "./console.js";

type Check = { condition: boolean | undefined; message: string };

export const exit = (message: string) => {
  error(message);
  process.exit(1);
};

export const runChecks = (checks: Check[]) => {
  for (const { condition, message } of checks) if (condition) exit(message);
};
