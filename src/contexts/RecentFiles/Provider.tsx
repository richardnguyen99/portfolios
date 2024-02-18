import * as React from "react";

import RecentFilesContext from "./Context";
import { RecentFileMetadata, RecentFilesProviderProps } from "./type";
import { IFile } from "@util/fs/type";
import useLocalStorage from "@hooks/useLocalStorage";

const RecentFilesProvider: React.FC<RecentFilesProviderProps> = ({
  children,
}) => {
  // const [recentFiles] = React.useState<RecentFileMetadata[]>([]);
  const [recentFiles, setRecentFiles] = useLocalStorage<RecentFileMetadata[]>(
    "recentFiles",
    [],
  );

  const getFilePath = React.useCallback((file: IFile) => {
    let parent = file.parent;
    const pathList = [file.name];

    while (parent && parent.parent) {
      pathList.unshift(parent.name);
      parent = parent.parent;
    }

    return `/${pathList.join("/")}`;
  }, []);

  const addRecentFile = React.useCallback(
    (file: IFile) => {
      console.log("addRecentFile", file);
      const fileIndex = recentFiles.findIndex(
        (recentFile) => recentFile.id === file.id,
      );

      // The file has not been opened before
      if (fileIndex === -1) {
        const newRecentFiles: RecentFileMetadata[] = [
          {
            id: file.id,
            name: file.name,
            path: getFilePath(file),
            size: file.size,
            lastAccessed: file.lastAccessed,
            lastModified: file.lastModified,
          },
          ...recentFiles,
        ];

        // Only keep the 10 most recent files
        if (newRecentFiles.length > 10) {
          newRecentFiles.pop();
        }

        setRecentFiles(newRecentFiles);
        return;
      }

      // If the file is already in the recent files, move it to the top
      const newRecentFiles = recentFiles.slice();
      const [removedFile] = newRecentFiles.splice(fileIndex, 1);
      newRecentFiles.unshift(removedFile);

      setRecentFiles(newRecentFiles);
    },
    [getFilePath, recentFiles, setRecentFiles],
  );

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
