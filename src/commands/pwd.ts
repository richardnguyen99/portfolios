import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import type { IDirectory } from "@util/fs/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/pwd.ts";
const SUPPORTED_OPTIONS = ["help", "version"];
const SUPPORTED_ALIASES = {};

const _pwdHelp = () => {
  return "Usage: pwd [OPTION]\n\
\n\
Output the absolute path name of the current working directory.\n\
\n\
Options:\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
};

const _pwdVersion = () => {
  return `pwd (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const pwd = (
  args: string[],
  _sysCall: SystemCommand,
  currentDir: IDirectory,
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
pwd: invalid option -- '${arg.slice(1)}'\n\
Try 'pwd --help' for more information.\n`;
        showError = true;
        return false;
      }

      return true;
    },
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
        default:
          break;
      }
    }
  }

  if (showHelp) return _pwdHelp();

  if (showVersion) return _pwdVersion();

  const pathList = [];

  while (currentDir.parent) {
    pathList.push(currentDir.name);
    currentDir = currentDir.parent as unknown as IDirectory;
  }

  return `/${pathList.reverse().join("/")}`;
};

export default pwd;
