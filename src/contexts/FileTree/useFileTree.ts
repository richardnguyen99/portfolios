import { useContext } from "react";

import FileTreeContext from "./Context";

const useFileTree = () => {
  return useContext(FileTreeContext);
};

export default useFileTree;
