import minimist, { ParsedArgs } from "minimist";

import { SystemCommand } from "@components/Terminal/type";
import { FileTreeNode } from "@contexts/FileTree/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE = "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/ls.ts";
const SUPPORTED_OPTIONS = ["help", "version", "all"];
const SUPPORTED_ALIASES = {
  "all": ["a"],
};

const _listDirHelp = () => {

  return "Usage: ls [OPTION]... [FILE]...\n\
\n\
List information about the FILEs (the current directory by default).\n\
  \n\
  -a, --all                 do not ignore entries starting with '.'.\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
}

const _listDirVersion = () => {
  return `ls (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black text-white">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
}


const format = (name: string, maxLength: number) => {
  return name.padEnd(maxLength + 2, "\u00A0");
}


const listDir = (args: string[], sysCall?: SystemCommand, currentDir?: FileTreeNode) => {
  let ans = "";

  if (!sysCall) {
    console.warn("System call not provided");
  }

  let showError = false;
  let showHelp = false;
  let showVersion = false;
  let showAll = false;

  const argv: ParsedArgs = minimist(args, {
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        ans += `\
ls: invalid option -- '${arg.slice(1)}'\n\
Try 'ls --help' for more information.\n`;
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
        case "all":
          showAll = true;
          break;
        default: break;
      }
    }
  }


  if (showHelp)
    return _listDirHelp();

  if (showVersion)
    return _listDirVersion();

  if (!currentDir) {
    console.warn("Current directory not provided");
    return ans;
  }

  const children = currentDir.children.sort((a, b) => a.name.localeCompare(b.name));

  const maxLength = children.length > 0
    ? Math.max(...children.map((child) => child.name.length))
    : 0;

  if (showAll) {
    ans += format(".", maxLength);
    ans += format("..", maxLength);
  }

  for (const child of children) {
    if (child.name.startsWith(".") && !showAll) {
      continue;
    }

    const formatedWhiteSpace = format(child.name, maxLength)

    const formatedType = child.type === "folder"
      ? `<span class="text-blue-500">${formatedWhiteSpace}</span>`
      : formatedWhiteSpace;

    ans += formatedType;

  }

  return ans;
};

export default listDir;
