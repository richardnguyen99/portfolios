import * as React from "react";

import TerminalContext from "./Context";
import { TerminalProviderProps } from "./type";
import exec from "./exec";

const TerminalProvider: React.FC<TerminalProviderProps> = ({
  id,
  children,
}) => {
  const [prompt, setPrompt] = React.useState("[root@portlios ~]$ ");
  const [buffer, setBuffer] = React.useState<string[]>([]);

  const addBuffer = React.useCallback((newBuffer: string) => {
    setBuffer((prevBuffer) => [...prevBuffer, newBuffer]);
  }, []);

  const clearBuffer = React.useCallback(() => {
    setBuffer([]);
  }, []);

  const execute = React.useCallback((command: string) => {
    const bufferedCommand = `> ${command}`;

    const result = exec(command);

    addBuffer(bufferedCommand);

    if (result) {
      addBuffer(result);
    }
  }, []);

  const displayPrompt = React.useCallback(() => {
    return prompt;
  }, [prompt]);

  const renderBuffer = React.useCallback(() => {
    return buffer.map((line, index) => (
      <div key={index}>
        <span dangerouslySetInnerHTML={{ __html: line }}></span>
      </div>
    ));
  }, [buffer]);

  const getWindowId = React.useCallback(() => {
    return id;
  }, [id]);

  const contextValue = React.useMemo(
    () => ({
      addBuffer,
      clearBuffer,
      renderBuffer,
      execute,
      displayPrompt,
      setPrompt,
      getWindowId,
    }),
    [
      addBuffer,
      clearBuffer,
      execute,
      displayPrompt,
      setPrompt,
      renderBuffer,
      getWindowId,
    ],
  );

  return (
    <TerminalContext.Provider value={contextValue}>
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
