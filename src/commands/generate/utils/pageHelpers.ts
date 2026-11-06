import {
  JsxElement,
  JsxSelfClosingElement,
  SyntaxKind,
  type SourceFile,
} from "ts-morph";

import { getPathValue, getTagName } from "../../../utils/project.js";

export const ensureLazyImport = (file: SourceFile) => {
  const reactImport = file.getImportDeclaration("react");

  if (!reactImport)
    file.addImportDeclaration({
      namedImports: ["lazy"],
      moduleSpecifier: "react",
    });
  else if (!reactImport.getNamedImports().some((n) => n.getName() === "lazy"))
    reactImport.addNamedImport("lazy");
};

export const addLazyDeclaration = (file: SourceFile, declaration: string) => {
  const statements = file.getStatements();
  const lastLazy = statements
    .filter(
      (s) =>
        s.isKind(SyntaxKind.VariableStatement) &&
        s.getText().includes("= lazy("),
    )
    .pop();

  if (lastLazy) {
    // Keep new lazy imports grouped with the existing ones
    file.insertStatements(statements.indexOf(lastLazy) + 1, declaration);
    return;
  }

  const lastImport = file.getImportDeclarations().pop();
  file.insertStatements(
    statements.indexOf(lastImport!) + 1,
    `\n${declaration}`,
  );
};

export const getRouteAnchor = (routes: JsxElement) => {
  const routeElements = routes
    .getJsxChildren()
    .filter(
      (child): child is JsxSelfClosingElement | JsxElement =>
        (child.isKind(SyntaxKind.JsxSelfClosingElement) ||
          child.isKind(SyntaxKind.JsxElement)) &&
        getTagName(child) === "Route",
    );

  // Insert after the last route, or before it when it's the catch-all path="*"
  const last = routeElements.at(-1);
  const isCatchAll = last ? getPathValue(last) === '"*"' : false;
  return isCatchAll
    ? (routeElements.at(-2) ?? routes.getOpeningElement())
    : (last ?? routes.getOpeningElement());
};
