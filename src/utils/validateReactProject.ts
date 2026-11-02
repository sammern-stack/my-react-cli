import path from "path";
import fs from "fs";

export const isReactProject = () => {
  const pkgPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) return false;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  return Boolean(pkg.dependencies?.react || pkg.devDependencies?.react);
};
