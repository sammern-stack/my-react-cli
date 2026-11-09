import path from "path";

const DIR_REGEX = /^[a-z0-9-]+(?:([\/\\])[a-z0-9-]+(?:\1[a-z0-9-]+)*)?$/i;

/** Validates the raw option and returns its segments: ["folder", "folder2"] */
export const parseDir = (input: string) => {
  if (!DIR_REGEX.test(input)) {
    throw new Error(
      `Invalid dir "${input}". Use letters, numbers and dashes, ` +
        `separated by "/" or "\\" (e.g. folder/folder2).`,
    );
  }
  return input.split(/[\\/]/);
};

/** Returns an absolute path guaranteed to be inside `base`. */
export const resolveDir = (input: string, base = process.cwd()) => {
  const segments = parseDir(input);
  const target = path.resolve(base, ...segments);
  const rel = path.relative(base, target);

  // Safety net in case the regex is loosened later
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("dir must stay inside the project folder");
  }
  return target;
};
