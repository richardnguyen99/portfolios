import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import { FileType, type IDirectory } from "@util/fs/type";

const VERSION = "0.0.2";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/mkdir.ts";
const SUPPORTED_OPTIONS = ["help", "version", "parents", "verbose"];
const SUPPORTED_ALIASES = {
  parents: ["p"],
  verbose: ["v"],
};

const _mkdirHelp = () => {
  return "Usage: mkdir [OPTION]... DIRECTORY...\n\
\n\
Create the DIRECTORY(ies), if they do not already exist.\n\
\n\
Options:\n\
  -p, --parents     no error if existing, make parent directories as needed\n\
  -v, --verbose     print a message for each created directory\n\
      --help        display this help and exit\n\
      --version     output version information and exit\n";
};

const _mkdirVersion = () => {
  return `mkdir (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const mkdir = async (
  args: string[],
  _sysCall: SystemCommand,
  currentDir: IDirectory,
): Promise<string | undefined> => {
  let ans = "";

  let showError = false;
  let showHelp = false;
  let showVersion = false;
  let createParents = false;
  let verbose = false;

  const argv: ParsedArgs = minimist(args, {
    stopEarly: true,
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        ans = `\
mkdir: invalid option -- '${arg.slice(1)}'\n\
Try 'mkdir --help' for more information.\n`;
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
        case "parents":
          createParents = true;
          break;
        case "verbose":
          verbose = true;
          break;
        default:
          break;
      }
    }
  }

  if (showHelp) return _mkdirHelp();

  if (showVersion) return _mkdirVersion();

  if (argv._.length === 0) {
    return "mkdir: missing operand\n\
Try 'mkdir --help' for more information.\n";
  }

  const pathList = argv._[0].split("/").filter((path) => path !== "");

  if (pathList.length === 0) {
    return "mkdir: missing operand\n\
Try 'mkdir --help' for more information.\n";
  }

  let currentDirectory = argv._[0].startsWith("/")
    ? _sysCall.getFileTreeRoot()
    : currentDir;

  // Walk through all the paths one by one in the path list.
  // The reason is that it needs to support creating missing parent directories.
  // with option `createParents` set to true.
  for (let i = 0; i < pathList.length; i++) {
    const path = pathList[i];

    if (path === ".") {
      continue;
    }

    if (path === "..") {
      if (currentDirectory.parent) {
        currentDirectory = currentDirectory.parent as unknown as IDirectory;
      }

      continue;
    }

    // Check if the path exists in the current directory before moving on.
    const child = currentDirectory.children.find(
      (child) => child.name === path,
    );

    if (child) {
      // Path walking only supports directories in the path list.
      if (child.type === FileType.File) {
        return `mkdir: cannot create directory '${path}': Not a directory\n`;
      }

      // The path to be created already exists and is a directory.
      if (i === pathList.length - 1 && child.type === FileType.Directory) {
        return `mkdir: cannot create directory '${path}': File exists\n`;
      }

      // Continue to walk through the path list.
      currentDirectory = child as unknown as IDirectory;
    } else if (i < pathList.length - 1) {
      // The path does not exist in the current directory. If the option
      // `createParents` is not set, stop here and return an error
      if (!createParents) {
        return `mkdir: cannot create directory '${path}': No such file or directory\n`;
      }

      try {
        await _sysCall.addDirectory(currentDirectory, path);
      } catch (err) {
        return `mkdir: cannot create directory ${(err as Error).message}\n`;
      }

      // Move to the newly created directory.
      currentDirectory = currentDirectory.children[
        currentDirectory.children.length - 1
      ] as unknown as IDirectory;

      if (verbose) {
        ans += `mkdir: created directory '${path}'\n`;
      }
    } else {
      // The final path, which is the one to be created.
      try {
        await _sysCall.addDirectory(currentDirectory, path);
      } catch (err) {
        return `mkdir: cannot create directory ${(err as Error).message}\n`;
      }

      if (verbose) {
        ans += `mkdir: created directory '${path}'\n`;
      }
    }
  }

  return ans;
};

export default mkdir;
