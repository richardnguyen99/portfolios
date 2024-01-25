import { createContext } from "react";

import type { SystemCallContextType } from "./type";

const SystemCallContext = createContext<SystemCallContextType>(
  {} as SystemCallContextType,
);
SystemCallContext.displayName = "SystemCallContext";

export default SystemCallContext;
