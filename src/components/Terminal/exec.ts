import clear from "@commands/clear";
import listDir from "@commands/ls";

export type SystemCommand = {
  clearBuffer: () => void;
}

const COMMANDS = {
  "ls": listDir,
  "clear": clear,
}

const exec = (cmdStr: string, sysCall: SystemCommand) => {
  if (!cmdStr) {
    return "";
  }

  const cmd = cmdStr.toLowerCase().trim().split(" ");
  const command = cmd[0];
  const args = cmd.slice(1);

  if (command in COMMANDS) {
    return COMMANDS[command as keyof typeof COMMANDS](args, sysCall);
  }


  return `portfoli-os: ${command}: command not found...`;
};

export default exec;
