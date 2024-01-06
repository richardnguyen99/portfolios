import minimist, { ParsedArgs } from "minimist";

const VERSION = "0.0.1";
const AUTHOR = "Richard H. Nguyen";
const SOURCE = "https://github.com/richardnguyen99/portfolios/tree/main/src/commands/ls.ts";
const SUPPORTED_OPTIONS = ["help", "version", "all"];
const SUPPORTED_ALIASES = {
  "all": ["a"],
};

const listDir = (args: string[]) => {
  let ans = "";

  let showError = false;
  let showHelp = false;
  let showVersion = false;

  const argv: ParsedArgs = minimist(args, {
    boolean: SUPPORTED_OPTIONS,
    alias: SUPPORTED_ALIASES,
    unknown: (arg) => {
      if (arg.startsWith("-")) {
        ans += `\
ls: invalid option -- '${arg.slice(1)}'\n\
Try 'ls --help' for more information.\n`;
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


  if (showHelp) {
    ans += "Usage: ls [OPTION]... [FILE]...\n\
\n\
List information about the FILEs (the current directory by default).\n\
  \n\
  -a, --all                 do not ignore entries starting with '.'.\n\
      --help                display this help and exit.\n\
      --version             output version information and exit.\n";

  } else if (showVersion) {
    ans += `ls (portfoli-os) ${VERSION}\n\
This is free software: you are free to change and redistribute it.\n\
A copy of this command can found at:\n\
\n\
<a href="${SOURCE}" target="_blank" rel="noreferrer" class="underline font-black text-white">${SOURCE}</a>\n\
\n\
Written by ${AUTHOR}.\n`;
  }

  return ans;
};

export default listDir;
