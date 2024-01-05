import * as React from "react";

import TerminalContext from "./Context";
import { TerminalProviderProps } from "./type";

const TerminalProvider: React.FC<TerminalProviderProps> = ({ children }) => {
  const [prompt, setPrompt] = React.useState("[root@portlios ~]$ ");
  const [buffer, setBuffer] = React.useState<string[]>([]);

  const addBuffer = React.useCallback((newBuffer: string) => {
    setBuffer((prevBuffer) => [...prevBuffer, newBuffer]);
  }, []);

  const clearBuffer = React.useCallback(() => {
    setBuffer([]);
  }, []);

  const execute = React.useCallback((command: string) => {
    console.log(command);
  }, []);

  const displayPrompt = React.useCallback(() => {
    return prompt;
  }, [prompt]);

  const renderBuffer = React.useCallback(() => {
    return buffer.map((line, index) => (
      <div key={index}>
        <span>{line}</span>
      </div>
    ));
  }, [buffer]);

  const contextValue = React.useMemo(
    () => ({
      addBuffer,
      clearBuffer,
      renderBuffer,
      execute,
      displayPrompt,
      setPrompt,
    }),
    [addBuffer, clearBuffer, execute, displayPrompt, setPrompt, renderBuffer],
  );

  return (
    <TerminalContext.Provider value={contextValue}>
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
