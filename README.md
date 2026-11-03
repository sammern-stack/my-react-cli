# React CLI

A command-line tool to scaffold React projects, components, and hooks.

## Install

```bash
npm install -g @pavlos-samaras/react-cli
```

## Create a React project

```bash
ct new my-app
```

This runs the Vite project creator in a new `my-app/` directory and writes a
`ct.config.json` file with the CLI defaults. Vite's prompts let you choose the
framework and template. Dependencies are not installed automatically; install
them before starting the project:

```bash
cd my-app
npm install
npm run dev
```

## Generate code

```bash
ct generate <type> <name> [options]
```

`g` is an alias for `generate`.

### Types

| Type | Name format | Generated files |
| --- | --- | --- |
| `component` | PascalCase (for example, `Button`) | A component, CSS/SCSS module, hook, and test file in a component folder |
| `hook` | `use` followed by PascalCase (for example, `useAuth`) | A hook file in its own folder |

### Options

| Option | Description |
| --- | --- |
| `-f, --feature <feature>` | Generate under `src/features/<feature>/` |
| `-s, --style <style>` | Component stylesheet format: `css` or `scss`. If omitted, the CLI prompts you. |
| `--ts` | Generate TypeScript files. Otherwise, TypeScript is selected automatically when the project has a `tsconfig.json`. |
| `--force` | Skip the check that requires the current directory to be detected as a React project. |

For example:

```bash
# Create a component; choose the stylesheet format when prompted
ct g component Button

# Create a TypeScript component with a SCSS module
ct g component LoginForm --feature auth --style scss --ts

# Create a hook in a feature folder
ct g hook useSession -f auth
```

### Output locations

| Command | Output |
| --- | --- |
| `ct g component Button` | `src/components/Button/` |
| `ct g component Button -f auth` | `src/features/auth/components/Button/` |
| `ct g hook useAuth` | `src/hooks/useAuth/useAuth.js` (or `.ts` when TypeScript is enabled) |
| `ct g hook useAuth -f auth` | `src/features/auth/hooks/useAuth/useAuth.js` (or `.ts` when TypeScript is enabled) |

## Development

Run the CLI directly from the TypeScript source:

```bash
npm run dev -- generate component Button
```

Build and link the local CLI globally:

```bash
npm install
npm run build
npm link
```
