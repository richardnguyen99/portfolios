import * as React from "react";

import { SystemCallProviderProps as Props } from "./type";
import SystemCallContext from "./Context";

const SystemCallProvider: React.FC<Props> = ({ children }) => {
  const readDir = React.useCallback(() => {
    console.log("readDir");
  }, []);

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
