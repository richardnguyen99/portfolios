import * as React from "react";

import FileExplorerProvider from "./Provider";
import InternalFileExplorer from "./Explorer";
import { INode } from "@util/fs/type";
import useFileTree from "@contexts/FileTree/useFileTree";

type FileExplorerProps = {
  initialDirectory?: INode;
};

const FileExplorer: React.FC<FileExplorerProps> = ({
  initialDirectory = undefined,
}) => {
  const { home } = useFileTree();

  if (!initialDirectory) {
    initialDirectory = home;
  }

  return (
    <FileExplorerProvider initialDirectory={initialDirectory}>
      <InternalFileExplorer />
    </FileExplorerProvider>
  );
};

export default FileExplorer;
