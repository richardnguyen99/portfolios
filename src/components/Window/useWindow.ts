import { useContext } from "react";

import WindowContext from "./Context";

const useWindow = () => {
  return useContext(WindowContext);
};

export default useWindow;
