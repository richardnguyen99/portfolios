import React from "react";

import { IFile } from "@util/fs/type";

export type RecentFileMetadata = {
  id: string;
  path: string;
  name: string;
  size: number;
  lastAccessed: Date;
  lastModified: Date;
};

export type RecentFilesContextType = {
  recentFiles: RecentFileMetadata[];
  addRecentFile: (file: IFile) => void;
  removeRecentFile: (id: string) => void;
  clearRecentFiles: () => void;
};

export type RecentFilesProviderProps = {
  children: React.ReactNode;
};
