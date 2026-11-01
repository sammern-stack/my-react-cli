# React CLI

A simple command-line tool for generating React components.

## Build and link

```bash
npm install
npm run build
npm link
```

## Usage

Generate a component in `src/components/<Name>`:

```bash
ct generate component Button
```

You can also use the `g` shorthand, choose a different target directory, or
create a TypeScript file:

```bash
ct g component Button --dir src/ui --ts
```

Without `--ts`, the CLI asks whether to use TypeScript and creates either a
`.tsx` or `.jsx` file.

## Development

Run the CLI directly from the TypeScript source:

```bash
npm run dev -- generate component Button
```
