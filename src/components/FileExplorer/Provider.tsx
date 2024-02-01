import * as React from "react";

import FileExplorerContext from "./Context";
import {
  FEViewSize,
  FEViewType,
  FileExplorerContextType,
  type FileExplorerProviderProps,
} from "./type";
import { INode } from "@util/fs/type";

const FileExplorerProvider: React.FC<FileExplorerProviderProps> = ({
  children,
  initialDirectory,
}) => {
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [size, setSize] = React.useState<FEViewSize>(FEViewSize.Normal);
  const [view, setView] = React.useState<FEViewType>(FEViewType.List);
  const [currDir] = React.useState<INode>(initialDirectory);

  const contextValue = React.useMemo<FileExplorerContextType>(() => {
    return {
      currDir,
      dragging,
      viewType: view,
      viewSize: size,

      setDragging: setDragging,
      setViewSize: setSize,
      setViewType: setView,
    };
  }, [currDir, dragging, size, view]);

  React.useEffect(() => {
    console.log(currDir);
  }, [currDir]);

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export default FileExplorerProvider;
