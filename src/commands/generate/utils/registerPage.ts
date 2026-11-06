import path from "path";
import fs from "fs";

import { ROUTES_FILES } from "../generate.constants.js";

import { info, warning } from "../../../utils/console.js";
import { finishProject, getJSX, startProject } from "../../../utils/project.js";
import {
  addLazyDeclaration,
  ensureLazyImport,
  getRouteAnchor,
} from "./pageHelpers.js";

// First candidate file that exists and declares a <Routes> element
const findRoutesFile = () =>
  ROUTES_FILES.map((file) => path.join(process.cwd(), file)).find(
    (file) =>
      fs.existsSync(file) && fs.readFileSync(file, "utf-8").includes("<Routes"),
  );

export const registerPage = (name: string, importPath: string) => {
  const routesPath = findRoutesFile();
  if (!routesPath) {
    return warning(
      "No <Routes> found in src/app/routes or src/App, skipped route.",
    );
  }
  const routesName = path.basename(routesPath);

  const file = startProject(routesPath);

  if (file.getVariableDeclaration(name)) {
    return warning(`${name} is already in ${routesName}.`);
  }

  ensureLazyImport(file);
  addLazyDeclaration(
    file,
    `const ${name}Page = lazy(() => import("${importPath}/${name}"));`,
  );

  const routes = getJSX(file, "Routes");

  if (!routes) {
    return warning(`No <Routes> found in ${routesName}, skipped route.`);
  }

  const urlPath = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  file.insertText(
    getRouteAnchor(routes).getEnd(),
    `\n<Route path="/${urlPath}" element={<${name}Page />} />`,
  );

  finishProject(file, routesPath);
  return info(`Page ${name} registered at ${routesName}`);
};
