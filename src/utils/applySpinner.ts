import chalk from "chalk";
import ora from "ora";

export const applySpinner = (
  options: { name: string; folder: string },
  callback: () => void,
) => {
  const { name, folder } = options;
  const spinner = ora(`Creating ${name}...`).start();

  try {
    callback();
    spinner.succeed(`Created ${chalk.cyan(name)} in ${chalk.gray(folder)}`);
  } catch (error) {
    spinner.fail(chalk.red(`Could not create ${name}`));
    console.error(error);
    process.exitCode = 1;
  }
};
