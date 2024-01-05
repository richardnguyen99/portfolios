import { useContext } from "react";

import TerminalContext from "./Context";

const useTerminal = () => {
  return useContext(TerminalContext);
};

export default useTerminal;
