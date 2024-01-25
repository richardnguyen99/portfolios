import type { IDirectory } from "@util/fs/type";
import type { SystemCommand } from "./type";

import clear from "@commands/clear";
import exit from "@commands/exit";
import listDir from "@commands/ls";
import changeDir from "@commands/cd";
import pwd from "@commands/pwd";
import mkdir from "@commands/mkdir";
import touch from "@commands/touch";
import rm from "@commands/rm";
import concat from "@commands/cat";
import help from "@commands/help";
import monacoEditor from "@commands/code";
import view from "@commands/view";

const COMMANDS = {
  ls: listDir,
  clear: clear,
  exit: exit,
  cd: changeDir,
  pwd: pwd,
  mkdir: mkdir,
  touch: touch,
  rm: rm,
  cat: concat,
  help: help,
  code: monacoEditor,
  view: view,
};

const exec = async (
  cmdStr: string,
  sysCall: SystemCommand,
  currentDir: IDirectory,
) => {
  if (!cmdStr) {
    return "";
  }

  const cmd = cmdStr.toLowerCase().trim().split(" ");
  const command = cmd[0];
  const args = cmd.slice(1);

  if (command in COMMANDS) {
    return await COMMANDS[command as keyof typeof COMMANDS](
      args,
      sysCall,
      currentDir,
    );
  }

  return `portfoli-os: ${command}: command not found...`;
};

export default exec;
