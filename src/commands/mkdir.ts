import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import { FileType, type IDirectory } from "@util/fs/type";
import { generateDirectoryId } from "@util/fs/id";

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

const _mkdir = async (
  path: string,
  currentDir: IDirectory,
): Promise<IDirectory> => {
  const createdDate = new Date();

  const newDir: IDirectory = {
    id: await generateDirectoryId(path, currentDir),
    name: path,
    type: FileType.Directory,
    children: [],
    parent: currentDir,
    owner: currentDir.owner,

    executePermission: true,
    readPermission: true,
    writePermission: true,

    lastAccessed: createdDate,
    lastModified: createdDate,
    lastChanged: createdDate,
    lastCreated: createdDate,
  };

  currentDir.children.push(newDir);

  return newDir;
};

const mkdir = (
  args: string[],
  _sysCall: SystemCommand,
  currentDir: IDirectory,
): string | undefined => {
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

  let currentDirectory = currentDir;

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

    const child = currentDirectory.children.find(
      (child) =>
        child.name === path && child.name !== "." && child.name !== "..",
    );

    if (child) {
      if (child.type === FileType.File) {
        return `mkdir: cannot create directory '${path}': Not a directory\n`;
      }

      if (i === pathList.length - 1 && child.type === FileType.Directory) {
        return `mkdir: cannot create directory '${path}': File exists\n`;
      }

      currentDirectory = child as unknown as IDirectory;
    } else if (i < pathList.length - 1) {
      if (!createParents) {
        return `mkdir: cannot create directory '${path}': No such file or directory\n`;
      }

      const newDir = _mkdir(path, currentDirectory);
      currentDirectory = newDir as unknown as IDirectory;

      if (verbose) {
        ans += `mkdir: created directory '${path}'\n`;
      }
    } else {
      if (currentDirectory.writePermission === false) {
        return `mkdir: cannot create directory '${path}': Permission denied\n`;
      }

      const newDir = _mkdir(path, currentDirectory);
      currentDirectory = newDir as unknown as IDirectory;

      if (verbose) {
        ans += `mkdir: created directory '${path}'\n`;
      }
    }
  }

  return ans;
};

export default mkdir;
