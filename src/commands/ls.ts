import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import type { IDirectory, INode } from "@util/fs/type";
import { FileType } from "@util/fs/type";

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
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black dark:text-white text-black">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
};

// Format the file node to be displayed in the terminal. Primarily focus on
// styling for the correct file type, padding and word wrapping. The reason why
// names are broken down into individual letters is to allow for word wrapping
// to work correctly, which breaks down one row into individual letters when
// overflowing instead of breaking down one row into individual words.
const formatStyleFileNode = (
  node: INode,
  maxLength: number,
  isLastInRow: boolean,
): string => {
  const { name, type } = node;

  if (type === FileType.Directory) {
    return `${name
      .split("")
      .map(
        (letter) => `\
<span \
class="\
[[x-data-active-tab='true']_&]:dark:text-blue-400 \
[[x-data-active-tab='false']_&]:dark:text-blue-400/50 \
[[x-data-active-tab='true']_&]:text-blue-600 \
[[x-data-active-tab='false']_&]:text-blue-600/50 \
">\
${letter}\
</span>`,
      )
      .join("")}\
<span \
class="\
[[x-data-active-tab='true']_&]:dark:text-white \
[[x-data-active-tab='false']_&]:dark:text-slate-400 \
[[x-data-active-tab='true']_&]:text-black \
[[x-data-active-tab='false']_&]:text-gray-600 \
">\
/\
</span>\
${
  isLastInRow
    ? ""
    : ""
        .padEnd(maxLength - name.length + 1, "\u00A0")
        .split("")
        .map((letter) => `<span>${letter}</span>`)
        .join("")
}\
`;
  }

  return `${name
    .split("")
    .map(
      (letter) => `\
<span class="\
[[x-data-active-tab='true']_&]:dark:text-white \
[[x-data-active-tab='false']_&]:dark:text-slate-400 \
[[x-data-active-tab='true']_&]:text-black \
[[x-data-active-tab='false']_&]:text-gray-600 \
">${letter}</span>\
`,
    )
    .join("")}\
${
  isLastInRow
    ? ""
    : ""
        .padEnd(maxLength - name.length + 2, "\u00A0")
        .split("")
        .map((letter) => `<span>${letter}</span>`)
        .join("")
}\
`;
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
  currentDir: IDirectory,
): IDirectory => {
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
        throw new Error(`portfoli-os: ls: ${path}: No such file or directory`);
      }

      if (child.type !== FileType.Directory) {
        throw new Error(`portfoli-os: ls: ${path}: Not a directory`);
      }

      finalDir = child as unknown as IDirectory;
    }
  }

  return finalDir;
};

const listDir = (
  args: string[],
  sysCall: SystemCommand,
  currentDir?: IDirectory,
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
    pathList = argv._[0]
      .trim()
      .split("/")
      .filter((path) => path !== "." && path !== "");
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
    const curr: IDirectory = {
      id: "current",
      name: ".",
      type: FileType.Directory,
      children: [],
      parent: null,
      owner: finalDir.owner,
      executePermission: true,
      readPermission: true,
      writePermission: true,
      lastAccessed: new Date(),
      lastChanged: new Date(),
      lastModified: new Date(),
      lastCreated: new Date(),
    };

    const parent: IDirectory = {
      id: "parent",
      name: "..",
      type: FileType.Directory,
      children: [],
      parent: finalDir.parent,
      owner: finalDir.parent ? finalDir.parent.owner : "richard",
      executePermission: true,
      readPermission: true,
      writePermission: true,
      lastAccessed: new Date(),
      lastChanged: new Date(),
      lastModified: new Date(),
      lastCreated: new Date(),
    };

    children.unshift(curr, parent);
  }

  const maxLength =
    children.length > 0
      ? Math.max(
          ...children.map((child) => {
            if (child.type === FileType.Directory) {
              return child.name.length + 1;
            }

            return child.name.length;
          }),
        )
      : 0;

  // Calculate the maximum number of columns that can be displayed on the
  // terminal based on the maximum length of the file name (+2 for padding)
  // based on the number of characters.
  const { width: maxChWidth } = sysCall.getTerminalSize();
  const maxCols = Math.ceil(maxChWidth / (maxLength + 2));

  // However, the correct format of the table is that every column should be
  // filled evenly, except for the last column which can be partially filled.
  const { numFilledCols, numFilledRows } = bestDimensions(
    children.length,
    maxCols,
  );

  // Calculate the width of the table based on the number of columns and the
  // maximum length of the file name in pixels.

  let childIdx = 0;
  const rows: string[][] = [];

  for (let i = 0; i < numFilledRows; i++) {
    rows.push([]);
  }

  // Build columns
  for (let i = 0; i < numFilledCols && childIdx < children.length; i++) {
    // Build rows
    const isLastInRow =
      i === numFilledCols - 1 || childIdx === children.length - 1;

    for (
      let j = 0;
      j < numFilledRows && childIdx < children.length;
      j++, childIdx++
    ) {
      const child = formatStyleFileNode(
        children[childIdx],
        maxLength,
        isLastInRow,
      );
      rows[j].push(child);
    }
  }

  // Build table
  const cells = rows.reduce((acc, row) => {
    const rowContent = row.reduce((acc, cell) => {
      return `${acc}${cell}`;
    }, "");

    return `${acc}\
<div class="w-full">\
<div class="flex flex-row flex-wrap">\
${rowContent}\
</div>\
</div>`;
  }, "");

  const table = `\
<div class="relative break-words w-full">\
${cells}\
</div>`;

  return table;
};

export default listDir;
