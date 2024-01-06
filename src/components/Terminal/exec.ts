import listDir from "@commands/ls";

const COMMANDS = {
  "ls": listDir
}

const exec = (cmdStr: string) => {
  if (!cmdStr) {
    return "";
  }

  const cmd = cmdStr.toLowerCase().trim().split(" ");
  const command = cmd[0];
  const args = cmd.slice(1);

  if (command in COMMANDS) {
    return COMMANDS[command as keyof typeof COMMANDS](args);
  }


  return `portfoli-os: ${command}: command not found...`;
};

export default exec;
