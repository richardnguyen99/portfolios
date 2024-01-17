import * as React from "react";

import useLocalStorage from "@hooks/useLocalStorage";
import ThemeContext from "./Context";

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [themeOnStorage, setThemeOnStorage] = useLocalStorage("theme", "dark");

  const setTheme = React.useCallback(
    (newTheme: string) => {
      console.log("setTheme", newTheme);
      setThemeOnStorage(newTheme);

      const html = document.querySelector("html");
      html?.classList.remove("dark", "light");
      html?.classList.add(newTheme);
    },
    [setThemeOnStorage],
  );

  const contextValue = React.useMemo(() => {
    return {
      theme: themeOnStorage,
      setTheme,
    };
  }, [themeOnStorage, setTheme]);

  React.useEffect(() => {
    const html = document.querySelector("html");
    html?.classList.remove("dark", "light");
    html?.classList.add(themeOnStorage);
  }, [themeOnStorage]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
