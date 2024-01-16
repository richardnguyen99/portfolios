import { useContext } from "react";

import ThemeContext from "./Context";

const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme;
};

export default useTheme;
