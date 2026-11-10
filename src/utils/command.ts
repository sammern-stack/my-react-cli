import { spawnSync } from "child_process";

export const executeCommand = (command: string, target?: string) => {
  return spawnSync(command, {
    ...(target && { cwd: target }),
    stdio: "inherit",
    shell: true,
  });
};
