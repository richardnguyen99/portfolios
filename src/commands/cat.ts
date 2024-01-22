import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import { type IFile, type IDirectory, FileType } from "@util/fs/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/cat.ts";
const SUPPORTED_OPTIONS = ["help", "version"];
const SUPPORTED_ALIASES = {};

const _concatHelp = () => {
  return "Usage: cat [OPTION]... [FILE]...\n\
\n\
Concatenate FILE(s) to standard output.\n\
\n\
Options:\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
};

const _concatVersion = () => {
  return `concat (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const concat = (
  args: string[],
  _sysCall: SystemCommand,
  _currentDir: IDirectory,
) => {
  let ans = "";

  let showError = false;
  let showHelp = false;
  let showVersion = false;

  const argv: ParsedArgs = minimist(args, {
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        ans += `\
cat: invalid option -- '${arg.slice(1)}'\n\
Try 'cat--help' for more information.\n`;
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

  if (showHelp) return _concatHelp();

  if (showVersion) return _concatVersion();

  if (argv._.length > 0) {
    for (let i = 0; i < argv._.length; i++) {
      const pathList = argv._[i]
        .trim()
        .split("/")
        .filter((path) => path !== "");

      let currentNode = _currentDir;
      let breakEarly = false;

      for (let j = 0; j < pathList.length - 1; j++) {
        const path = pathList[j];

        if (path === "..") {
          if (currentNode.parent) {
            currentNode = currentNode.parent as unknown as IDirectory;
          }
        } else if (path === ".") {
          continue;
        } else {
          const childNode = currentNode.children.find(
            (child) => child.name === path,
          );

          if (childNode && childNode.type === FileType.Directory) {
            currentNode = childNode as unknown as IDirectory;
          } else if (childNode && childNode.type === FileType.File) {
            ans += `cat: ${argv._[i]}: Not a directory\n`;
            breakEarly = true;
            break;
          } else {
            ans += `cat: ${argv._[i]}: No such file or directory\n`;
            breakEarly = true;
            break;
          }
        }
      }

      if (breakEarly) {
        continue;
      }

      const filename = pathList[pathList.length - 1];
      const fileNode = currentNode.children.find(
        (child) => child.name === filename,
      );

      if (fileNode && fileNode.type === FileType.File) {
        ans += (fileNode as unknown as IFile).content;
      } else {
        ans += `cat: ${argv._[i]}: No such file or directory\n`;
      }
    }
  }

  return ans;
};

export default concat;
