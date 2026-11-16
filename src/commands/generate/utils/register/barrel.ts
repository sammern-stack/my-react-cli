import { fail } from "../../../../utils/console.js";
import { writeSourceFile } from "../../../../utils/project.js";

export const registerInBarrel = (
  target: string,
  specifier: string,
  name: string,
) => {
  writeSourceFile(target, ({ file }) => {
    const hasExport = file
      .getExportDeclarations()
      .some((d) => d.getModuleSpecifierValue() === specifier);
    if (hasExport) {
      return fail(`Export ${specifier} already exists at ${target}`);
    }

    file.addExportDeclaration({
      namedExports: [{ name }],
      moduleSpecifier: specifier,
    });
  });
};
