import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import { FileType, type IDirectory } from "@util/fs/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/code.ts";
const SUPPORTED_OPTIONS = ["help", "version"];
const SUPPORTED_ALIASES = {};

const _monacoEditorHelp = () => {
  return "Usage: code [OPTION] [DIR]\n\
\n\
Open the Monaco Editor.\n\
\n\
Options:\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
};

const _monacoEditorVersion = () => {
  return `code (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const monacoEditor = (
  args: string[],
  _sysCall: SystemCommand,
  _currentDir: IDirectory,
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
code: invalid option -- '${arg.slice(1)}'\n\
Try 'code --help' for more information.\n`;
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

  if (showHelp) return _monacoEditorHelp();

  if (showVersion) return _monacoEditorVersion();

  if (!argv._.length) {
    return undefined;
  }

  if (argv._.length === 0) {
    ans =
      "code: missing file operand\n\
Try 'code --help' for more information.\n";

    return ans;
  }

  const pathList = argv._[0].split("/").filter((path) => path !== "");

  if (pathList.length === 0) {
    ans =
      "code: missing file operand\n\
Try 'code --help' for more information.\n";

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
        ans = `code: cannot open '${path}': Not a directory\n`;
        return ans;
      }

      currentDir = child as unknown as IDirectory;
    } else {
      ans = `touch: cannot open '${path}': No such file or directory\n`;
      return ans;
    }
  }

  const file = pathList[pathList.length - 1];
  const child = currentDir.children.find((child) => child.name === file);

  if (typeof child === "undefined") {
    if (file === ".") {
      return `code: cannot open '${file}': Is a directory\n`;
    }

    if (file === "..") {
      return `code: cannot open '${file}': Is a directory\n`;
    }

    if (currentDir.writePermission === false) {
      return `code: cannot open '${file}': Permission denied\n`;
    }

    _sysCall.createNewFile(currentDir, file);

    _sysCall.openEditor(currentDir.children[currentDir.children.length - 1]);

    return undefined;
  }

  if (child.type === FileType.Directory) {
    return `code: cannot open '${file}': Is a directory\n`;
  }

  _sysCall.openEditor(child);

  return undefined;
};

export default monacoEditor;
