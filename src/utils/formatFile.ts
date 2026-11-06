import { spawnSync } from "child_process";
import { warning } from "./console.js";

// Formats with the project's own Prettier; warns when it isn't installed.
export const formatFile = (filePath: string) => {
  const result = spawnSync(`npx --no-install prettier --write ${filePath}`, {
    stdio: "ignore",
    shell: true,
  });
  const formatted = result.status === 0;
  if (!formatted)
    warning(
      "Prettier is not installed (or failed), skipping formatting.\nInstall it with 'npm i -D prettier' to format generated files.",
    );
  return formatted;
};
