import { createContext } from "react";

import type { FileTreeContextType } from "./type";

const FileTreeContext = createContext<FileTreeContextType>({} as FileTreeContextType);
FileTreeContext.displayName = "FileTreeContext";

export default FileTreeContext;
