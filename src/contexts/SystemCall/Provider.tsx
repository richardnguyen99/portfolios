import * as React from "react";

import useFileTree from "@contexts/FileTree/useFileTree";
import { SystemCallProviderProps as Props } from "./type";
import SystemCallContext from "./Context";
import _readDir from "./calls/_readDir";

const SystemCallProvider: React.FC<Props> = ({ children }) => {
  const { getRootFolder } = useFileTree();

  const readDir = React.useCallback(_readDir, [getRootFolder]);

  const contextValue = React.useMemo(() => {
    return {
      readDir,
    };
  }, [readDir]);

  return (
    <SystemCallContext.Provider value={contextValue}>
      {children}
    </SystemCallContext.Provider>
  );
};

export default SystemCallProvider;
