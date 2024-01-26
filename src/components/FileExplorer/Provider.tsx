import * as React from "react";

import FileExplorerContext from "./Context";
import {
  FileExplorerContextType,
  type FileExplorerProviderProps,
} from "./type";

const FileExploreProvider: React.FC<FileExplorerProviderProps> = ({
  children,
}) => {
  const hello = () => {
    console.log("hello");
  };

  const contextValue = React.useMemo<FileExplorerContextType>(() => {
    return {
      hello,
    };
  }, []);

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export default FileExploreProvider;
