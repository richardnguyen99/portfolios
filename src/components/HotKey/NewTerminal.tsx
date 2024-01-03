import * as React from "react";

const NewTerminalHotkey: React.FC = () => {
  const isMacOS = navigator.platform.toLowerCase().includes("MAC");

  const macOSKey = isMacOS ? "⌘" : "Ctrl";

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      <span>{macOSKey}</span>
      <span>+</span>
      <span>Shift</span>
      <span>+</span>
      <span>T</span>
    </div>
  );
};

export default NewTerminalHotkey;
