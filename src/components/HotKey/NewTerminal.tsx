import * as React from "react";

import Key from "./Key";

const NewTerminalHotkey: React.FC = () => {
  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      <Key>Ctrl</Key>
      <span>+</span>
      <Key>Alt</Key>
      <span>+</span>
      <Key>t</Key>
    </div>
  );
};

export default NewTerminalHotkey;
