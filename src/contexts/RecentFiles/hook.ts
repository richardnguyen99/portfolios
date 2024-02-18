import { useContext } from "react";

import RecentFilesContext from "./Context";

const useRecentFiles = () => {
  useContext(RecentFilesContext);
};

export default useRecentFiles;
