import chalk from "chalk";

export const error = (text: string) => console.log(chalk.red(text));
export const warning = (text: string) => console.log(chalk.yellow(text));
export const info = (text: string) => console.log(chalk.green(text));
