import path from "path";
import fs from "fs";

export const hasDependency = (dependency: string) => {
  const packagePath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packagePath)) return false;
  const packageFile = fs.readFileSync(packagePath, "utf-8");
  const packageJson = JSON.parse(packageFile);
  return Boolean(
    packageJson?.dependencies?.[dependency] ||
    packageJson?.devDependencies?.[dependency],
  );
};

export const isTypescriptUsed = () => {
  return fs.existsSync(path.join(process.cwd(), "tsconfig.json"));
};
