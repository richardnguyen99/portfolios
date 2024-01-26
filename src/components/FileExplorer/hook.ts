import { useContext } from "react";

import FileExplorerContext from "./Context";

const useFileExplorer = () => {
  const context = useContext(FileExplorerContext);

  if (!context) {
    throw new Error(
      "useFileExplorer must be used within a FileExplorerContext",
    );
  }

  return context;
};

export default useFileExplorer;
