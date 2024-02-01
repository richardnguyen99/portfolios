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
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [size, setSize] = React.useState<FEViewSize>(FEViewSize.Normal);
  const [view, setView] = React.useState<FEViewType>(FEViewType.List);

  const contextValue = React.useMemo<FileExplorerContextType>(() => {
    return {
      dragging,
      viewType: view,
      viewSize: size,

      setDragging: setDragging,
      setViewSize: setSize,
      setViewType: setView,
    };
  }, [dragging, size, view]);

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export default FileExplorerProvider;
