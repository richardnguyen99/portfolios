import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import type { FileTreeNode } from "@contexts/FileTree/type";

const VERSION = "0.0.3";
const AUTHOR = "Richard H. Nguyen";
const SOURCE =
  "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/ls.ts";
const SUPPORTED_OPTIONS = ["help", "version", "all"];
const SUPPORTED_ALIASES = {
  all: ["a"],
};

const _listDirHelp = () => {
  return "\
Usage: ls [OPTION]... [FILE]...\n\
\n\
List information about the FILEs (the current directory by default).\n\
  \n\
  -a, --all                 do not ignore entries starting with '.'.\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";
};

const _listDirVersion = () => {
  return `ls (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black text-white">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

const formatStyleFileNode = (node: FileTreeNode): string => {
  const { name, type } = node;

  if (type === "folder") {
    return `\
<span>\
<span class="[[x-data-active-tab='true']_&]:text-blue-400 [[x-data-active-tab='false']_&]:text-blue-400/50">${name}</span>\
<span class="[[x-data-active-tab='true']_&]:text-white [[x-data-active-tab='false']_&]:text-slate-400">/</span>\
</span>`;
  }

  return `\
<span>\
<span class="[[x-data-active-tab='true']_&]:text-white [[x-data-active-tab='false']_&]:text-slate-400">${name}</span>\
</span>`;
};

const bestDimensions = (numItems: number, numColumns: number) => {
  let numFilledCols = numColumns;
  let numFilledRows = Math.floor(numItems / numColumns);
  let lastRowItems = numItems % numColumns;

  while (numFilledRows > 0 && lastRowItems < numFilledCols - 1) {
    numFilledCols--;

    const totalLastRowItems = lastRowItems + numFilledRows;
    lastRowItems =
      totalLastRowItems < numFilledCols ? totalLastRowItems : numFilledCols;

    if (totalLastRowItems % numFilledCols > 0) {
      numFilledCols++;
    }
  }

  if (lastRowItems > 0) {
    numFilledRows++;
  }

  return { numFilledCols, numFilledRows };
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
        throw new Error(`portfoli-os: ls: ${path}: No such file or directory`);
      }

      if (child.type !== "folder") {
        throw new Error(`portfoli-os: ls: ${path}: Not a directory`);
      }

      finalDir = child;
    }
  }

  return finalDir;
};

const listDir = (
  args: string[],
  sysCall: SystemCommand,
  currentDir?: FileTreeNode,
) => {
  let ans = "";

  let showError = false;
  let showHelp = false;
  let showVersion = false;
  let showAll = false;

  const argv: ParsedArgs = minimist(args, {
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        ans += `\
ls: invalid option-- '${arg.slice(1)}'\n\
Try 'ls --help' for more information.\n`;
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
        case "all":
          showAll = true;
          break;
        default:
          break;
      }
    }
  }

  if (showHelp) return _listDirHelp();

  if (showVersion) return _listDirVersion();

  if (!currentDir) {
    console.warn("Current directory not provided");
    return ans;
  }

  let finalDir = null;
  let pathList: string[] = [];
  let startDir = currentDir;

  if (argv._.length > 0) {

    pathList = argv._[0].trim().split("/").filter((path) => path !== "." && path !== "");
    if (argv._[0].startsWith("/")) {
      startDir = sysCall.getFileTreeRoot();
    } else if (argv._[0].startsWith("~")) {
      startDir = sysCall.getFileTreeHome();
      pathList = pathList.slice(1);
    }
  }

  try {
    finalDir = getFinalDestion(pathList, startDir);
  } catch (err) {
    return (err as Error).message;
  }

  const children = finalDir.children
    .map((child) => child) // Clone the children array
    .sort((a, b) => a.name.localeCompare(b.name));

  if (showAll) {
    children.unshift(
      {
        id: "current",
        name: ".",
        type: "folder",
        children: [],
        parent: null,
        accessedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        executePermission: true,
        readPermission: true,
        writePermission: true,
      },
      {
        id: "up",
        name: "..",
        type: "folder",
        children: [],
        parent: null,
        accessedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        executePermission: true,
        readPermission: true,
        writePermission: true,
      },
    );
  }

  const maxLength =
    children.length > 0
      ? Math.max(...children.map((child) => child.name.length))
      : 0;

  // Calculate the maximum number of columns that can be displayed on the
  // terminal based on the maximum length of the file name (+2 for padding)
  // based on the number of characters.
  const { width: maxChWidth } = sysCall.getTerminalSize();
  const { width: maxLetterWidth } = sysCall.getCharacterSize();
  const maxCols = Math.ceil(maxChWidth / (maxLength + 2));

  // However, the correct format of the table is that every column should be
  // filled evenly, except for the last column which can be partially filled.
  const { numFilledCols, numFilledRows } = bestDimensions(
    children.length,
    maxCols,
  );

  // Calculate the width of the table based on the number of columns and the
  // maximum length of the file name in pixels.
  const tableWidth = numFilledCols * (maxLength + 2) * maxLetterWidth;

  let childIdx = 0;
  let cols = "";

  // Build columns
  for (let i = 0; i < numFilledCols && childIdx < children.length; i++) {
    let rows = "";

    // Build rows
    for (let j = 0; j < numFilledRows && childIdx < children.length; j++) {
      const child = formatStyleFileNode(children[childIdx]);
      rows += child;
      childIdx++;
    }

    cols += `\
<div class="flex flex-col" style="width: ${(1 / numFilledCols) * 100}%">\
${rows}\
</div>`;
  }

  const table = `\
<div class="flex" style="width: ${tableWidth}px">\
${cols}\
</div>`;

  return table;
};

export default listDir;
