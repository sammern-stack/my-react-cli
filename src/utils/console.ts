import chalk from "chalk";

export const error = (...text: unknown[]) => console.log(chalk.red(text));
export const warning = (...text: unknown[]) => console.log(chalk.yellow(text));
export const info = (...text: unknown[]) => console.log(chalk.green(text));

export function fail(msg: string, hint?: string): never {
  error(msg);
  if (hint) info(hint);
  process.exit(1);
}
