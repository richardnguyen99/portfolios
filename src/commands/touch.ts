import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import { FileType, IFile, type IDirectory } from "@util/fs/type";
import { generateFileId } from "@util/fs/id";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/touch.ts";
const SUPPORTED_OPTIONS = ["help", "version", "no-create"];
const SUPPORTED_ALIASES = {
  "no-create": ["c"],
};

const _touchHelp = () => {
  return "Usage: touch [OPTION]... FILE...\n\
\n\
Update the access and modification times of each FILE to the current time\n\
\n\
Options:\n\
      --help        display this help and exit\n\
      --version     output version information and exit\n";
};

const _touchVersion = () => {
  return `touch (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const touch = async (
  args: string[],
  _sysCall: SystemCommand,
  _currentDir: IDirectory,
): Promise<string | undefined> => {
  let ans = "";

  let showError = false;
  let showHelp = false;
  let showVersion = false;
  let noCreate = false;

  const argv: ParsedArgs = minimist(args, {
    stopEarly: true,
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        ans = `\
touch: invalid option -- '${arg.slice(1)}'\n\
Try 'touch --help' for more information.\n`;
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
        case "no-create":
          noCreate = true;
          break;
        default:
          break;
      }
    }
  }

  if (showHelp) return _touchHelp();

  if (showVersion) return _touchVersion();

  if (argv._.length === 0) {
    ans =
      "touch: missing file operand\n\
Try 'touch --help' for more information.\n";

    return ans;
  }

  const pathList = argv._[0].split("/").filter((path) => path !== "");

  if (pathList.length === 0) {
    ans =
      "touch: missing file operand\n\
Try 'touch --help' for more information.\n";

    return ans;
  }

  let currentDir = _currentDir;

  for (let i = 0; i < pathList.length - 1; i++) {
    const path = pathList[i];

    if (path === ".") {
      continue;
    }

    if (path === "..") {
      if (currentDir.parent) {
        currentDir = currentDir.parent as unknown as IDirectory;
      }
      continue;
    }

    const child = currentDir.children.find(
      (child) =>
        child.name === path && child.name !== "." && child.name !== "..",
    );

    if (child) {
      if (child.type === FileType.File) {
        ans = `touch: cannot touch '${path}': Not a directory\n`;
        return ans;
      }

      currentDir = child as unknown as IDirectory;
    } else {
      ans = `touch: cannot touch '${path}': No such file or directory\n`;
      return ans;
    }
  }

  const file = pathList[pathList.length - 1];
  const child = currentDir.children.find((child) => child.name === file);

  if (child) {
    child.lastAccessed = new Date();
  } else {
    if (noCreate) {
      return ans;
    }

    if (!currentDir.writePermission) {
      ans = `touch: cannot touch '${file}': Permission denied\n`;
      return ans;
    }

    const date = new Date();

    const newFile: IFile = {
      id: await generateFileId("", file, currentDir),
      name: file,
      type: FileType.File,
      parent: currentDir,
      content: "",
      size: 0,
      owner: currentDir.owner,

      executePermission: false,
      readPermission: true,
      writePermission: true,

      lastAccessed: date,
      lastModified: date,
      lastChanged: date,
      lastCreated: date,
    };

    currentDir.children.push(newFile);
  }

  return ans;
};

export default touch;
