import * as React from "react";

import { SystemCallProviderProps as Props } from "./type";
import SystemCallContext from "./Context";
import _readDir from "./calls/_readDir";
import useFileTree from "@contexts/FileTree/useFileTree";
import { type IDirectory, type INode } from "@util/fs/type";

const SystemCallProvider: React.FC<Props> = ({ children }) => {
  const { getHomeFolder, setHomeFolder } = useFileTree();

  const addINode = React.useCallback(
    (parentNode: IDirectory, newNode: INode) => {
      const home = getHomeFolder();

      parentNode.children.push(newNode);

      const newHomeFolder: IDirectory = { ...home, parent: null };
      setHomeFolder(newHomeFolder);
    },
    [getHomeFolder, setHomeFolder],
  );

  const readDir = React.useCallback(_readDir, []);

  const contextValue = React.useMemo(() => {
    return {
      addINode,
      readDir,
    };
  }, [addINode, readDir]);

  return (
    <SystemCallContext.Provider value={contextValue}>
      {children}
    </SystemCallContext.Provider>
  );
};

export default SystemCallProvider;
