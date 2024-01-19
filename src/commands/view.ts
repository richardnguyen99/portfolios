import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import type { FileTreeNode } from "@contexts/FileTree/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/view.ts";
const SUPPORTED_OPTIONS = ["help", "version"];
const SUPPORTED_ALIASES = {};

const _viewHelp = () => {
  return "Usage: view [OPTION] [DIR]\n\
\n\
Open a file or directory with specified apps.\n\
\n\
Options:\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
};

const _viewVersion = () => {
  return `view (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const getFinalDestion = (
  pathList: string[],
  currentDir: FileTreeNode,
): FileTreeNode => {
  let finalDir = currentDir;

  for (const path of pathList) {
    if (path === "." || path === "") continue;

    if (path === "..") {
      finalDir = finalDir && finalDir.parent ? finalDir.parent : finalDir;
    } else {
      const child = finalDir.children.find((child) => child.name === path);

      if (!child) {
        throw new Error(
          `portfoli-os: view: ${path}: No such file or directory`,
        );
      }

      if (child.type !== "folder") {
        throw new Error(`portfoli-os: view: ${path}: Not a directory`);
      }

      finalDir = child;
    }
  }

  return finalDir;
};

const view = (
  args: string[],
  _sysCall: SystemCommand,
  _currentDir: FileTreeNode,
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
view: invalid option -- '${arg.slice(1)}'\n\
Try 'view --help' for more information.\n`;
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

  if (showHelp) return _viewHelp();

  if (showVersion) return _viewVersion();

  if (!argv._.length) {
    return undefined;
  }

  if (argv._.length === 0) {
    ans =
      "view: missing file operand\n\
Try 'view --help' for more information.\n";

    return ans;
  }

  let finalDir = null;
  let startDir = _currentDir;

  let pathList = argv._[0]
    .trim()
    .split("/")
    .filter((path) => path !== "." && path !== "");

  if (argv._[0].startsWith("/")) {
    startDir = _sysCall.getFileTreeRoot();
  } else if (argv._[0].startsWith("~")) {
    startDir = _sysCall.getFileTreeHome();
    pathList = pathList.slice(1);
  }

  try {
    finalDir = getFinalDestion(pathList.slice(0, -1), startDir);
  } catch (err) {
    return (err as Error).message;
  }

  const file = pathList[pathList.length - 1];
  const child = finalDir.children.find((child) => child.name === file);

  if (!child) {
    return `view: cannot open '${file}': No such file or directory\n`;
  }

  if (child.type === "folder") {
    return `view: cannot open '${file}': Is a directory\n`;
  }

  _sysCall.open(child);

  return undefined;
};

export default view;
