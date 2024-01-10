import minimist, { ParsedArgs } from "minimist";

import type { SystemCommand } from "@components/Terminal/type";
import type { FileTreeNode } from "@contexts/FileTree/type";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE = "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/touch.ts";
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
}

const _touchVersion = () => {
  return `touch (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black text-white">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
}

const touch = (
  args: string[],
  _sysCall: SystemCommand,
  _currentDir: FileTreeNode
): string | undefined => {
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
        case "no-create":
          noCreate = true;
          break;
        default: break;
      }
    }
  }


  if (showHelp)
    return _touchHelp();

  if (showVersion)
    return _touchVersion();

  if (argv._.length === 0) {
    ans = "touch: missing file operand\n\
Try 'touch --help' for more information.\n";

    return ans;
  }

  const pathList = argv._[0].split("/").filter((path) => path !== "");

  if (pathList.length === 0) {
    ans = "touch: missing file operand\n\
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
        currentDir = currentDir.parent;
      }
      continue;
    }

    const child = currentDir.children.find((child) => child.name === path && child.name !== "." && child.name !== "..");

    if (child) {
      if (child.type === "file") {
        ans = `touch: cannot touch '${path}': Not a directory\n`;
        return ans;
      }

      currentDir = child;
    } else {
      ans = `touch: cannot touch '${path}': No such file or directory\n`;
      return ans;
    }
  }

  const file = pathList[pathList.length - 1];
  const child = currentDir.children.find((child) => child.name === file);

  if (child) {
    // TODO: Update last modified
    // child.lastModified = new Date();
  }
  else {
    if (noCreate) {
      return ans;
    }

    if (!currentDir.writePermission) {
      ans = `touch: cannot touch '${file}': Permission denied\n`;
      return ans;
    }

    const newFile: FileTreeNode = {
      name: file,
      type: "file",
      parent: currentDir,
      executePermission: false,
      readPermission: true,
      writePermission: true,
      id: crypto.getRandomValues(new Uint32Array(2))[0].toFixed(0),
      createdAt: new Date(),
      updatedAt: new Date(),
      accessedAt: new Date(),
      children: []
    };

    currentDir.children.push(newFile);
  }

  return ans;
};

export default touch;

