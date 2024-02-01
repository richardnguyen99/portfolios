import React from "react";

import { FileExplorerContextType } from "./type";

const FileExplorerContext = React.createContext<FileExplorerContextType>(
  {} as FileExplorerContextType,
);
FileExplorerContext.displayName = "FileExplorerContext";

export default FileExplorerContext;
