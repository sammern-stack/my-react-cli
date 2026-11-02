# React CLI

A simple command-line tool for generating React components and hooks.

## Install

```bash
npm install -g @pavlos-samaras/react-cli
```

## Usage

```bash
ct generate <type> <name> [options]
```

`g` is a shorthand for `generate`.

### Types

| Type        | Output                                                                                  |
| ----------- | --------------------------------------------------------------------------------------- |
| `component` | A folder with the component, a CSS/SCSS module, a hook and a test file                  |
| `hook`      | A single hook file. The name must start with `use` followed by a capital (e.g. `useAuth`) |

### Options

| Option                    | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `-d, --dir <dir>`         | Target folder inside `src/` (or inside the feature). Default depends on the type: `components` or `hooks` |
| `-f, --feature <feature>` | Put the output under `src/features/<feature>/`                           |
| `--ts`                    | Use TypeScript without prompting                                         |
| `-y, --yes`               | Use the defaults (TypeScript, SCSS) and skip all prompts                 |

Without `--ts` or `-y`, the CLI asks whether to use TypeScript and (for
components) which stylesheet to use.

### Output locations

| Command                                  | Output                                       |
| ---------------------------------------- | -------------------------------------------- |
| `ct g component Button`                  | `src/components/Button/`                     |
| `ct g component Button -f auth`          | `src/features/auth/components/Button/`       |
| `ct g component Button -d ui`            | `src/ui/Button/`                             |
| `ct g hook useAuth`                      | `src/shared/hooks/useAuth.ts`                |
| `ct g hook useAuth -f auth`              | `src/features/auth/hooks/useAuth.ts`         |

### Examples

```bash
# Component with all defaults, no prompts
ct g component Button -y

# TypeScript component under a feature
ct g component LoginForm --feature auth --ts

# Hook under a feature
ct g hook useSession -f auth -y
```

## Development

Run the CLI directly from the TypeScript source:

```bash
npm run dev -- generate component Button
```

To link the local build globally instead:

```bash
npm install
npm run build
npm link
```
