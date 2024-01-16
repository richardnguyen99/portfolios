import minimist from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import type { FileTreeNode } from "@contexts/FileTree/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/clear.ts";
const SUPPORTED_OPTIONS = ["help", "version"];
const SUPPORTED_ALIASES = {};

const clear = (
  args: string[],
  sysCall: SystemCommand,
  _currentDir?: FileTreeNode,
): string | undefined => {
  const { clearBuffer } = sysCall;

  let ans = "";
  let showError = false;
  let showHelp = false;
  let showVersion = false;

  const argv = minimist(args, {
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        showError = true;
        ans = `\
clear: invalid option -- '${arg.slice(1)}'\n\
Try 'clear --help' for more information.\n`;
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

  if (showHelp) {
    ans +=
      "Usage: clear [OPTIONS]...\n\
\n\
Clear the terminal buffer.\n\
\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
  } else if (showVersion) {
    ans += `clear (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
  } else {
    clearBuffer();
  }

  return ans;
};

export default clear;
