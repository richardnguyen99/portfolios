import minimist, { ParsedArgs } from "minimist";

import touch from "./touch";
import mkdir from "./mkdir";
import rm from "./rm";
import cat from "./cat";
import pwd from "./pwd";
import ls from "./ls";
import cd from "./cd";
import clear from "./clear";
import exit from "./exit";

import type { SystemCommand } from "@components/Terminal/type";
import type { FileTreeNode } from "@contexts/FileTree/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE = "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/help.ts";
const SUPPORTED_OPTIONS = ["help", "version",];
const SUPPORTED_ALIASES = {};

const _helpHelp = () => {

  return "Usage: help [COMMAND]\n\
\n\
Display the help message of COMMAND.\n\
\n\
\n\
Options:\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
}

const _helpVersion = () => {
  return `help (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black text-white">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
}


const help = (
  args: string[],
  sysCall: SystemCommand,
  currentDir: FileTreeNode
): string | undefined => {
  let ans = "";

  let showError = false;
  let showHelp = false;
  let showVersion = false;

  const argv: ParsedArgs = minimist(args, {

    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        ans = `\
help: invalid option -- '${arg.slice(1)}'\n\
Try 'help --help' for more information.\n`;
        showError = true;
        return false;
      }

      return true;
    }
  });


  if (showError) {
    return ans;
  }

  for (const option of SUPPORTED_OPTIONS) {
    if (argv[option]) {
      switch (option) {
        case "help":
          showHelp = true;
          break;
        case "version":
          showVersion = true;
          break;
        default: break;
      }
    }
  }


  if (showHelp)
    return _helpHelp();

  if (showVersion)
    return _helpVersion();

  if (!argv._.length) {
    return _helpHelp();
  }

  if (argv._.length > 1) {
    ans = `help: Expected at most 1 arg, but got ${argv._.length}.\n`;
    return ans;
  }

  const command = argv._[0];

  if (command === "help") {
    return _helpHelp();
  }

  if (command === "touch") {
    return touch(["--help"], sysCall, currentDir);
  }

  if (command === "mkdir") {
    return mkdir(["--help"], sysCall, currentDir);
  }

  if (command === "rm") {
    return rm(["--help"], sysCall, currentDir);
  }

  if (command === "cat") {
    return cat(["--help"], sysCall, currentDir);
  }

  if (command === "pwd") {
    return pwd(["--help"], sysCall, currentDir);
  }

  if (command === "ls") {
    return ls(["--help"], sysCall, currentDir);
  }

  if (command === "cd") {
    return cd(["--help"], sysCall, currentDir);
  }

  if (command === "clear") {
    return clear(["--help"], sysCall, currentDir);
  }

  if (command === "exit") {
    return exit(["--help"], sysCall, currentDir);
  }

  ans = `help: '${command}' is not a command.\n`;

  return ans;
};

export default help;


