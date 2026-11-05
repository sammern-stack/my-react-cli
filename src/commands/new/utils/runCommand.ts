import { spawnSync } from "child_process";

export const runCommand = (command: string, target?: string) =>
  spawnSync(command, {
    ...(target && { cwd: target }),
    stdio: "inherit",
    shell: true,
  });
