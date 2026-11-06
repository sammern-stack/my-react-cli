# React CLI

A command-line tool to scaffold React projects, components, hooks, and pages.

## Table of contents

- [Install](#install)
- [Create a React project](#create-a-react-project)
- [Generate code](#generate-code)
  - [Types](#types)
  - [Options](#options)
  - [Examples](#examples)
  - [Output locations](#output-locations)
  - [Pages and routes](#pages-and-routes)
  - [Formatting with Prettier](#formatting-with-prettier)
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

The command creates a `ct.config.json` file in the project (see
[Configure generation defaults](#configure-generation-defaults)). After scaffolding,
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
| `page` | PascalCase (for example, `Settings`) | The same files as a component, in `src/pages/`, plus a lazy-loaded route (see [Pages and routes](#pages-and-routes)) |

### Options

| Option | Description |
| --- | --- |
| `-d, --dir <dir>` | Choose the folder for the generated type. Defaults to `components` for components and `hooks` for hooks. Not used for pages. |
| `-f, --feature <feature>` | Generate under `src/features/<feature>/` instead of directly under `src/`. Not used for pages. |
| `-s, --style <style>` | Component stylesheet format: `css` or `scss`. Overrides `ct.config.json`; if neither is set, the CLI prompts. |
| `--ts` | Force TypeScript output. Otherwise, uses `ct.config.json` when set, then detects TypeScript from `tsconfig.json`. |
| `--force` | Skip the React project check and overwrite the output folder if it already exists. |

If the destination folder already exists, the command stops unless you pass
`--force`. The CLI recognizes a React project by the `react` dependency in its
`package.json`.

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

# Create a page and register its route
ct g page Settings

# Regenerate an existing component
ct g component Button --force
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
| `ct g page Settings` | `src/pages/Settings/` |

### Pages and routes

`ct g page <Name>` creates the page in `src/pages/<Name>/` and then registers
it in your router:

1. Finds the routes file: the first of `src/app/routes.tsx`,
   `src/app/routes.jsx`, `src/App.tsx`, or `src/App.jsx` that contains a
   `<Routes>` element.
2. Adds `lazy` to the `react` import if needed and adds
   `const <Name>Page = lazy(() => import("../pages/<Name>/<Name>"));` below
   the existing lazy imports.
3. Adds `<Route path="/<kebab-name>" element={<<Name>Page />} />` inside
   `<Routes>`, after the last route. If the last route is the catch-all
   `path="*"`, the new route is placed before it.

For example, `ct g page UserSettings` adds the `/user-settings` route. If no
routes file is found, the page files are still created and the CLI warns that
route registration was skipped. If `<Name>Page` is already declared in the
routes file, it is not added again.

### Formatting with Prettier

After the routes file is updated, the CLI runs the project's own Prettier on it
(`npx --no-install prettier --write`). If Prettier is not installed, the CLI
prints a warning and leaves the file unformatted; install it with
`npm i -D prettier`.

### Configure generation defaults

Set optional defaults in the project's `ct.config.json`. The `ct new` command
creates this file with a `$schema` reference, which gives your editor
autocomplete, hover documentation, and warnings for unknown properties:

```json
{
  "$schema": "https://unpkg.com/@pavlos-samaras/react-cli/ct.config.schema.json",
  "typescript": true,
  "stylesheet": "scss"
}
```

For a `ct.config.json` created before this was added, add the `$schema` line
yourself.

| Property | Type | Description |
| --- | --- | --- |
| `typescript` | `boolean` | Generate TypeScript files by default. When omitted, the CLI checks for `tsconfig.json`. The `--ts` option overrides it. |
| `stylesheet` | `"css"` or `"scss"` | Default stylesheet format for components and pages. The `--style` option overrides it. |

The CLI also validates the file when it runs. Unknown properties, values of the
wrong type, and invalid values (for example, `"stylesheet": "sass"`) print a
warning and are ignored, so the fallback behavior is used instead. Missing
properties also print a warning. A file that is not valid JSON, or not a JSON
object, is ignored.
