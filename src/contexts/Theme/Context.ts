import { createContext } from "react";

import { ThemeContextType } from "./type";

const ThemeContext = createContext({} as ThemeContextType);
ThemeContext.displayName = "ThemeContext";

export default ThemeContext;
