import type { IDirectory } from "@util/fs/type";

export type FileTreeContextType = {
  getRootFolder: () => IDirectory;
  getHomeFolder: () => IDirectory;
  setHomeFolder: (
    prevState: IDirectory | ((prevState: IDirectory) => IDirectory),
  ) => void;
};
