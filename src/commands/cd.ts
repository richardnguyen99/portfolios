import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import type { IDirectory } from "@util/fs/type";
import { FileType } from "@util/fs/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/cd.ts";
const SUPPORTED_OPTIONS = ["help", "version"];
const SUPPORTED_ALIASES = {};

const _changeDirHelp = () => {
  return 'Usage: cd [OPTION] [DIR]\n\
\n\
Change the current directory to DIR.  The default DIR is the value of the\n\
is the current directory.\n\
\n\
- If DIR begins with a slash <span class="font-black dark:text-yellow-500 text-yellow-600">(/)</span>,\
 then command will redirect to the root of\n\
the file tree and continue from there.\n\
- If DIR is <span class="font-black dark:text-yellow-500 text-yellow-600">(~)</span>, its equivalency\
 in absolute path is <span class="font-black dark:text-yellow-500 text-yellow-600">(/home/guess)</span>.\n\
- If DIR is <span class="font-black dark:text-yellow-500 text-yellow-600">(-)</span>, the command\
 will redirect to the previous directory.\n\
- If DIR is <span class="font-black dark:text-yellow-500 text-yellow-600">(..)</span>, the command\
 will redirect to the parent directory.\n\
\n\
Options:\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n';
};

const _changeDirVersion = () => {
  return `cd (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const _changeDir = (pathList: string[], currentDir: IDirectory): IDirectory => {
  let finalDir = currentDir;

  for (const path of pathList) {
    if (path === "." || path === "") continue;

    if (path === "..") {
      finalDir =
        finalDir && finalDir.parent
          ? (finalDir.parent as unknown as IDirectory)
          : finalDir;
    } else {
      const child = finalDir.children.find((child) => child.name === path);

      if (!child) {
        throw new Error(`portfoli-os: cd: ${path}: No such file or directory`);
      }

      if (child.type !== FileType.Directory) {
        throw new Error(`portfoli-os: cd: ${path}: Not a directory`);
      }

      finalDir = child as unknown as IDirectory;
    }
  }

  return finalDir;
};

const changeDir = (
  args: string[],
  sysCall: SystemCommand,
  currentDir: IDirectory,
): string | undefined => {
  let ans = "";

  let showError = false;
  let showHelp = false;
  let showVersion = false;
  let changeToPreviousDir = false;

  const argv: ParsedArgs = minimist(args, {
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        if (arg === "-") {
          changeToPreviousDir = true;
          return true;
        }

        ans = `\
cd: invalid option -- '${arg.slice(1)}'\n\
Try 'cd --help' for more information.\n`;
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

  if (showHelp) return _changeDirHelp();

  if (showVersion) return _changeDirVersion();

  if (changeToPreviousDir) {
    sysCall.changeDirectory("-");
    return undefined;
  }

  if (!argv._.length) {
    return undefined;
  }

  const pathList = argv._[0]
    .trim()
    .split("/")
    .filter((path) => path !== "." && path !== "");

  if (pathList.length === 1 && pathList[0] === "~") {
    sysCall.changeDirectory();
    return;
  }

  if (pathList.length === 1 && pathList[0] === "-") {
    sysCall.changeDirectory();
    return;
  }

  try {
    const finalDir = argv._[0].startsWith("/")
      ? _changeDir(pathList, sysCall.getFileTreeRoot())
      : _changeDir(pathList, currentDir);

    sysCall.changeDirectory(finalDir);
  } catch (error) {
    return (error as Error).message;
  }

  return undefined;
};

export default changeDir;
