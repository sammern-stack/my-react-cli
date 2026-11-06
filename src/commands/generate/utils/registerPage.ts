import path from "path";
import fs from "fs";
import { Project, SyntaxKind } from "ts-morph";
import { formatFile } from "../../../utils/formatFile.js";

export const registerPage = (name: string, importPath: string) => {
  const routesPath = path.join(process.cwd(), "src/app/routes.tsx");
  if (!fs.existsSync(routesPath)) return "no-app";

  const project = new Project();
  const file = project.addSourceFileAtPath(routesPath);

  if (file.getVariableDeclaration(name)) return "exists";

  const reactImport = file.getImportDeclaration("react");

  if (!reactImport)
    file.addImportDeclaration({
      namedImports: ["lazy"],
      moduleSpecifier: "react",
    });
  else if (!reactImport.getNamedImports().some((n) => n.getName() === "lazy"))
    reactImport.addNamedImport("lazy");

  const imports = file.getImportDeclarations();
  const lastImport = imports[imports.length - 1];
  const index = file.getStatements().indexOf(lastImport!) + 2;

  file.insertStatements(
    index,
    `\nconst ${name}Page = lazy(() => import("${importPath}"));`,
  );

  const routes = file
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .find(
      (el) => el.getOpeningElement().getTagNameNode().getText() === "Routes",
    );

  if (!routes) return "no-routes";

  const urlPath = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  file.insertText(
    routes.getOpeningElement().getEnd(),
    `\n<Route path="/${urlPath}" element={<${name}Page />} />`,
  );

  file.saveSync();
  formatFile(routesPath);
  return "done";
};
