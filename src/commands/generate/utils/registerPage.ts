import path from "path";
import fs from "fs";
import { info, warning } from "../../../utils/console.js";
import { finishProject, getJSX, startProject } from "../../../utils/project.js";
import {
  addLazyDeclaration,
  ensureLazyImport,
  getRouteAnchor,
} from "./pageHelpers.js";

export const registerPage = (name: string, importPath: string) => {
  const routesPath = path.join(process.cwd(), "src/app/routes.tsx");
  if (!fs.existsSync(routesPath)) {
    return warning("routes.tsx not found, skipped route.");
  }

  const file = startProject(routesPath);

  if (file.getVariableDeclaration(name)) {
    return warning(`${name} is already in routes.tsx.`);
  }

  ensureLazyImport(file);
  addLazyDeclaration(
    file,
    `const ${name}Page = lazy(() => import("${importPath}/${name}"));`,
  );

  const routes = getJSX(file, "Routes");

  if (!routes) {
    return warning("No <Routes> found in routes.tsx, skipped route.");
  }

  const urlPath = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  file.insertText(
    getRouteAnchor(routes).getEnd(),
    `\n<Route path="/${urlPath}" element={<${name}Page />} />`,
  );

  finishProject(file, routesPath);
  return info(`Page ${name} registered at routes.tsx`);
};
