import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import type { FileTreeNode } from "@contexts/FileTree/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE = "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/code.ts";
const SUPPORTED_OPTIONS = ["help", "version",];
const SUPPORTED_ALIASES = {};

const _monacoEditorHelp = () => {

  return "Usage: code [OPTION] [DIR]\n\
\n\
Open the Monaco Editor.\n\
\n\
Options:\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
}

const _monacoEditorVersion = () => {
  return `code (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black text-white">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
}

const monacoEditor = (
  args: string[],
  _sysCall: SystemCommand,
  _currentDir: FileTreeNode
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
        default: break;
      }
    }
  }


  if (showHelp)
    return _monacoEditorHelp();

  if (showVersion)
    return _monacoEditorVersion();

  if (!argv._.length) {
    return undefined;
  }

  if (argv._.length === 0) {
    ans = "code: missing file operand\n\
Try 'code --help' for more information.\n";

    return ans;
  }

  const pathList = argv._[0].split("/").filter((path) => path !== "");

  if (pathList.length === 0) {
    ans = "code: missing file operand\n\
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
        currentDir = currentDir.parent;
      }
      continue;
    }

    const child = currentDir.children.find((child) => child.name === path && child.name !== "." && child.name !== "..");

    if (child) {
      if (child.type === "file") {
        ans = `code: cannot open '${path}': Not a directory\n`;
        return ans;
      }

      currentDir = child;
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

    const newFile: FileTreeNode = {
      id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
      name: file,
      type: "file",
      parent: currentDir,
      children: [],
      content: "",
      accessedAt: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
      writePermission: true,
      readPermission: true,
      executePermission: false,
    };

    currentDir.children.push(newFile);

    _sysCall.openEditor(newFile);

    return undefined;
  }

  if (child.type === "folder") {
    return `code: cannot open '${file}': Is a directory\n`;
  }

  _sysCall.openEditor(child);

  return undefined;
};

export default monacoEditor;


