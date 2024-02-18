import * as React from "react";

import RecentFilesContext from "./Context";
import { RecentFileMetadata, RecentFilesProviderProps } from "./type";
import { IFile } from "@util/fs/type";

const RecentFilesProvider: React.FC<RecentFilesProviderProps> = ({
  children,
}) => {
  const [recentFiles] = React.useState<RecentFileMetadata[]>([]);

  const addRecentFile = React.useCallback((file: IFile) => {
    console.log("addRecentFile", file);
  }, []);

  const removeRecentFile = React.useCallback((id: string) => {
    console.log("removeRecentFile", id);
  }, []);

  const clearRecentFiles = React.useCallback(() => {
    console.log("clearRecentFiles");
  }, []);

  const value = React.useMemo(() => {
    return {
      recentFiles,
      addRecentFile,
      removeRecentFile,
      clearRecentFiles,
    };
  }, [addRecentFile, clearRecentFiles, recentFiles, removeRecentFile]);

  return (
    <RecentFilesContext.Provider value={value}>
      {children}
    </RecentFilesContext.Provider>
  );
};

export default RecentFilesProvider;
