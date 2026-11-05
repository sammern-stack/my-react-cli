# React CLI

A command-line tool to scaffold React projects, components, and hooks.

## Table of contents

- [Install](#install)
- [Create a React project](#create-a-react-project)
- [Generate code](#generate-code)
  - [Types](#types)
  - [Options](#options)
  - [Examples](#examples)
  - [Output locations](#output-locations)
- [Configure generation defaults](#configure-generation-defaults)

## Install

```bash
npm install -g @pavlos-samaras/react-cli
```

## Create a React project

```bash
ct new <name> [options]
```

By default, Vite prompts you to choose a framework and template. Use
`--template` (or `-t`) to select a React template directly:

| Template | Description |
| --- | --- |
| `react` | React with JavaScript |
| `react-ts` | React with TypeScript |
| `react-swc` | React with JavaScript and SWC |
| `react-swc-ts` | React with TypeScript and SWC |
| `custom-js` | React with JavaScript and the CLI's custom source layout |
| `custom-ts` | React with TypeScript and the CLI's custom source layout |

When a template is specified, Vite runs without its interactive prompts. The
`custom-js` and `custom-ts` templates apply the CLI's custom layout over the
corresponding JavaScript or TypeScript React starter.

```bash
# Use Vite's prompts
ct new my-app

# Select a Vite React template
ct new my-app --template react-swc-ts

# Use the CLI's custom TypeScript layout
ct new my-app -t custom-ts
```

The command creates a `ct.config.json` file in the project. After scaffolding,
follow Vite's output to install dependencies if needed and start the dev server:

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
| `-d, --dir <dir>` | Choose the folder for the generated type. Defaults to `components` for components and `hooks` for hooks. |
| `-f, --feature <feature>` | Generate under `src/features/<feature>/` instead of directly under `src/`. |
| `-s, --style <style>` | Component stylesheet format: `css` or `scss`. Overrides `ct.config.json`; if neither is set, the CLI prompts. |
| `--ts` | Force TypeScript output. Otherwise, uses `ct.config.json` when set, then detects TypeScript from `tsconfig.json`. |
| `--force` | Skip the check that requires the current directory to be detected as a React project. It does not overwrite existing output folders. |

Components and hooks are generated only if their destination folder does not
already exist. The CLI recognizes a React project by the `react` dependency in
its `package.json`.

### Examples

```bash
# Create a component; choose the stylesheet format when prompted
ct g component Button

# Create a TypeScript component with a SCSS module
ct g component LoginForm --feature auth --style scss --ts

# Use a custom folder name for a component
ct g component Button --dir ui

# Create a hook in a feature folder
ct g hook useSession -f auth
```

### Output locations

The default component and hook folders can be changed with `--dir`; `--feature`
places those folders under `src/features/<feature>/`.

| Command | Output |
| --- | --- |
| `ct g component Button` | `src/components/Button/` |
| `ct g component Button -f auth` | `src/features/auth/components/Button/` |
| `ct g component Button -d ui` | `src/ui/Button/` |
| `ct g hook useAuth` | `src/hooks/useAuth/useAuth.js` (or `.ts` when TypeScript is enabled) |
| `ct g hook useAuth -f auth` | `src/features/auth/hooks/useAuth/useAuth.js` (or `.ts` when TypeScript is enabled) |

### Configure generation defaults

Set optional defaults in the project's `ct.config.json`. The `ct new` command
creates this file as `{}`.

```json
{
  "typescript": true,
  "stylesheet": "scss"
}
```

`typescript` can be `true` or `false`; when omitted, the CLI checks for
`tsconfig.json`. The `--ts` option overrides this setting to enable TypeScript.
`stylesheet` can be `css` or `scss`, and `--style` overrides it for components.
