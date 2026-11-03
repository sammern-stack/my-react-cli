#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { createRequire } from "module";
import { Command } from "commander";
import { generateComponent } from "../utils/generateComponent.js";
import { applySpinner } from "../utils/applySpinner.js";
import { DEFAULT_DIRS, TYPES } from "../constants/generator.js";
import { generateHook } from "../utils/generateHook.js";
import { isReactProject } from "../utils/validators.js";
import type { GeneratorOptions } from "../types/generator.js";
import { loadConfig } from "../utils/loadConfig.js";
import { registerGenerateCommand } from "../commands/generate.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command();

program.name("ct").description("My React CLI").version(version);

registerGenerateCommand(program);

program.parse();
