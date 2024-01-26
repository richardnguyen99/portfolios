import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import { FileType, type IDirectory, type IFile } from "@util/fs/type";

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

const monacoEditor = async (
  args: string[],
  _sysCall: SystemCommand,
  _currentDir: IDirectory,
): Promise<string | undefined> => {
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
      "\
code: missing file operand\n\
Try 'code --help' for more information.\n";

    return ans;
  }

  const pathList = argv._[0].split("/").filter((path) => path !== "");

  if (pathList.length === 0) {
    ans =
      "\
code: missing file operand\n\
Try 'code --help' for more information.\n";

    return ans;
  }

  let currentDir = argv._[0].startsWith("/")
    ? _sysCall.getFileTreeRoot()
    : argv._[0].startsWith("~")
      ? _sysCall.getFileTreeHome()
      : _currentDir;

  // Get to the destination directory for insertion
  currentDir = _sysCall.walkNode(currentDir, pathList.slice(0, -1));

  // Find the file to open
  const file = pathList[pathList.length - 1];
  let child = currentDir.children.find((child) => child.name === file);

  if (child) {
    if (child.type === FileType.Directory) {
      return `code: cannot open '${file}': Is a directory\n`;
    }
  } else {
    // Create the file if it doesn't exist
    try {
      await _sysCall.addFile(currentDir, file);
      child = currentDir.children[currentDir.children.length - 1];
    } catch (err) {
      return `code: cannot open '${file}': ${(err as Error).message}\n`;
    }
  }

  _sysCall.openEditor(child as unknown as IFile);

  return undefined;
};

export default monacoEditor;
