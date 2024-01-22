import type { IDirectory } from "@util/fs/type";

export type FileTreeContextType = {
  root: IDirectory;
  home: IDirectory;
  setHomeFolder: (
    prevState: IDirectory | ((prevState: IDirectory) => IDirectory),
  ) => void;
};
