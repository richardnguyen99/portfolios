import * as React from "react";

import ClipboardContext from "./Context";

const useClipboard = () => {
  const context = React.useContext(ClipboardContext);

  if (!context) {
    throw new Error("useClipboard must be used within a ClipboardProvider");
  }

  return context;
};

export default useClipboard;
