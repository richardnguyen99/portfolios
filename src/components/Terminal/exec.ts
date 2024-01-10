import { FileTreeNode } from "@contexts/FileTree/type";
import clear from "@commands/clear";
import exit from "@commands/exit";
import listDir from "@commands/ls";
import changeDir from "@commands/cd";

import { SystemCommand } from "./type";
import pwd from "@commands/pwd";
import mkdir from "@commands/mkdir";
import touch from "@commands/touch";
import rm from "@commands/rm";
import concat from "@commands/cat";
import help from "@commands/help";

const COMMANDS = {
  "ls": listDir,
  "clear": clear,
  "exit": exit,
  "cd": changeDir,
  "pwd": pwd,
  "mkdir": mkdir,
  "touch": touch,
  "rm": rm,
  "cat": concat,
  "help": help,
}

const exec = (cmdStr: string, sysCall: SystemCommand, currentDir: FileTreeNode) => {
  if (!cmdStr) {
    return "";
  }

  const cmd = cmdStr.toLowerCase().trim().split(" ");
  const command = cmd[0];
  const args = cmd.slice(1);

  if (command in COMMANDS) {
    return COMMANDS[command as keyof typeof COMMANDS](args, sysCall, currentDir);
  }


  return `portfoli-os: ${command}: command not found...`;
};

export default exec;
