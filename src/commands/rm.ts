import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import { FileType, type IDirectory } from "@util/fs/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/rm.ts";
const SUPPORTED_OPTIONS = ["help", "version", "recursive", "verbal", "force"];
const SUPPORTED_ALIASES = {
  recursive: ["r", "R"],
  verbal: ["v"],
  force: ["f"],
};

const _rmHelp = () => {
  return "Usage: rm [OPTION]... FILE...\n\
\n\
Remove files or directories\n\
\n\
Options:\n\
  -r, -R, --recursive   remove directories and their contents recursively\n\
      -f, --force       ignore nonexistent files and arguments, never prompt\n\
      -v, --verbal      explain what is being done\n\
          --help        display this help and exit\n\
          --version     output version information and exit\n\
\n\
By default, rm does not remove directories.  Use the --recursive (-r or -R)\n\
option to remove each listed directory, too, along with all of its contents\n";
};

const _rmVersion = () => {
  return `rm (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const rm = (
  args: string[],
  _sysCall: SystemCommand,
  currentDir: IDirectory,
): string | undefined => {
  let ans = "";

  let showError = false;
  let showHelp = false;
  let showVersion = false;
  let verbal = false;
  let force = false;
  let recursive = false;

  const argv: ParsedArgs = minimist(args, {
    stopEarly: true,
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        ans = `\
rm: invalid option -- '${arg.slice(1)}'\n\
Try 'rm --help' for more information.\n`;
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
        case "recursive":
          recursive = true;
          break;
        case "force":
          force = true;
          break;
        case "verbal":
          verbal = true;
          break;
        default:
          break;
      }
    }
  }

  if (showHelp) return _rmHelp();

  if (showVersion) return _rmVersion();

  if (argv._.length === 0) {
    return "rm: missing operand\n\
Try 'rm --help' for more information.\n";
  }

  const pathList = argv._[0].split("/").filter((path) => path !== "");

  if (pathList.length === 0) {
    return "rm: missing operand\n\
Try 'rm --help' for more information.\n";
  }

  let currentDirectory = currentDir;

  for (let i = 0; i < pathList.length - 1; i++) {
    const path = pathList[i];

    if (path === "..") {
      if (currentDirectory.parent) {
        currentDirectory = currentDirectory.parent as unknown as IDirectory;
      }
    } else if (path === ".") {
      continue;
    } else {
      const child = currentDirectory.children.find(
        (child) => child.name === path,
      );

      if (child && child.type === FileType.Directory) {
        currentDirectory = child as unknown as IDirectory;
      } else {
        return `rm: cannot remove '${path}': No such file or directory\n`;
      }
    }
  }

  const path = pathList[pathList.length - 1];
  const child = currentDirectory.children.find((child) => child.name === path);

  if (child) {
    if (child.type === FileType.File) {
      if (child.writePermission === false) {
        return `rm: cannot remove '${path}': Permission denied\n`;
      }

      currentDirectory.children = currentDirectory.children.filter(
        (child) => child.name !== path,
      );

      if (verbal) {
        return "rm: removed file '" + path + "'\n";
      }

      return "";
    } else {
      if (recursive) {
        if (child.writePermission === false) {
          return `rm: cannot remove '${path}': Permission denied\n`;
        }

        currentDirectory.children = currentDirectory.children.filter(
          (child) => child.name !== path,
        );

        if (verbal) {
          return "rm: removed directory '" + path + "'\n";
        }

        return "";
      }

      return `rm: cannot remove '${path}': Is a directory\n`;
    }
  } else if (!force) {
    return `rm: cannot remove '${path}': No such file or directory\n`;
  }

  return ans;
};

export default rm;
