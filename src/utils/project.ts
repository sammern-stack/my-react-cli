import {
  JsxElement,
  JsxSelfClosingElement,
  Project,
  SourceFile,
  SyntaxKind,
} from "ts-morph";

import { formatFile } from "./formatFile.js";

export const startProject = (filePath: string) => {
  const project = new Project();
  return project.addSourceFileAtPath(filePath);
};

export const finishProject = (file: SourceFile, filePath: string) => {
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
