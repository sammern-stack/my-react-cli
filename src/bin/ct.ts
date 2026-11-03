#!/usr/bin/env node
import { createRequire } from "module";
import { Command } from "commander";
import { registerGenerateCommand } from "../commands/generate.js";
import { registerNewCommand } from "../commands/new.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command();

program.name("ct").description("My React CLI").version(version);

registerGenerateCommand(program);
registerNewCommand(program);

program.parse();
