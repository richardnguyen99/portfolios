import { createContext } from "react";

import type { WindowContextType } from "./type";

const WindowContext = createContext<WindowContextType>({} as WindowContextType);
WindowContext.displayName = "WindowContext";

export default WindowContext;
