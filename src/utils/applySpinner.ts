import chalk from "chalk";
import ora from "ora";

export const applySpinner = (
  startMsg: string,
  finishMsg: string,
  errorMsg: string,
  callback: () => void,
) => {
  const spinner = ora(startMsg).start();
  try {
    callback();
    spinner.succeed(finishMsg);
  } catch (error) {
    spinner.fail(chalk.red(errorMsg));
    console.error(error);
    process.exit(1);
  }
};
