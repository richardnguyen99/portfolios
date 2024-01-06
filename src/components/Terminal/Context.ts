import { createContext } from "react";

import { TerminalContextType } from "./type";

const TerminalContext = createContext<TerminalContextType>({} as TerminalContextType);
TerminalContext.displayName = "TerminalContext";

export default TerminalContext;
