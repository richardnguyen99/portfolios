import { createContext } from "react";

import { RecentFilesContextType } from "./type";

const RecentFilesContext = createContext<RecentFilesContextType>(
  {} as RecentFilesContextType,
);

export default RecentFilesContext;
