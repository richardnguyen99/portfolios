import * as React from "react";

import FileExplorerProvider from "./Provider";
import InternalFileExplorer from "./Explorer";

const FileExplorer: React.FC = () => {
  return (
    <FileExplorerProvider>
      <InternalFileExplorer />
    </FileExplorerProvider>
  );
};

export default FileExplorer;
