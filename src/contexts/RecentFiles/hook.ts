import { useContext } from "react";

import RecentFilesContext from "./Context";

const useRecentFiles = () => {
  return useContext(RecentFilesContext);
};

export default useRecentFiles;
