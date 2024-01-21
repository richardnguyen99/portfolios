import { useContext } from "react";

import SystemCallContext from "./Context";

const useSystemCall = () => {
  return useContext(SystemCallContext);
};

export default useSystemCall;
