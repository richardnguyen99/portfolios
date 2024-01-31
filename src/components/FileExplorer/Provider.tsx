import * as React from "react";

import FileExplorerContext from "./Context";
import {
  FEViewSize,
  FEViewType,
  FileExplorerContextType,
  type FileExplorerProviderProps,
} from "./type";

const FileExplorerProvider: React.FC<FileExplorerProviderProps> = ({
  children,
}) => {
  const [size, setSize] = React.useState<FEViewSize>(FEViewSize.Normal);
  const [view, setView] = React.useState<FEViewType>(FEViewType.List);

  const contextValue = React.useMemo<FileExplorerContextType>(() => {
    return {
      viewType: view,
      viewSize: size,

      setViewSize: setSize,
      setViewType: setView,
    };
  }, [size, view]);

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export default FileExplorerProvider;
