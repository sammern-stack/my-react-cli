import {
  ImportDeclaration,
  JsxElement,
  JsxSelfClosingElement,
  Project,
  SourceFile,
  SyntaxKind,
} from "ts-morph";

import { formatFile } from "./formatFile.js";

export const runProject = (
  filePath: string,
  callback: (options: {
    file: SourceFile;
    ensureNamedImport: (importName: string, from: string) => void;
  }) => void,
) => {
  const project = new Project();
  const file = project.addSourceFileAtPath(filePath);

  const getNamedImport = (declaration: ImportDeclaration, name: string) => {
    return declaration.getNamedImports().some((n) => n.getName() === name);
  };

  const insertNamedImport = (names: string[], from: string) => {
    file.addImportDeclaration({ namedImports: names, moduleSpecifier: from });
  };

  const ensureNamedImport = (importName: string, from: string) => {
    const importDeclaration = file.getImportDeclaration(from);
    if (!importDeclaration) return insertNamedImport([importName], from);
    if (getNamedImport(importDeclaration, importName)) return;
    importDeclaration.addNamedImport(importName);
  };

  callback({ file, ensureNamedImport });

  file.saveSync();
  formatFile(filePath);
};

export const getJSX = (
  file: SourceFile,
  name: string,
): JsxElement | undefined =>
  file
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .find((el) => el.getOpeningElement().getTagNameNode().getText() === name);

export const getOpening = (el: JsxSelfClosingElement | JsxElement) =>
  el.isKind(SyntaxKind.JsxElement) ? el.getOpeningElement() : el;

export const getTagName = (el: JsxSelfClosingElement | JsxElement) =>
  getOpening(el).getTagNameNode().getText();

export const getPathValue = (el: JsxSelfClosingElement | JsxElement) =>
  getOpening(el)
    .getAttribute("path")
    ?.asKind(SyntaxKind.JsxAttribute)
    ?.getInitializer()
    ?.getText();
