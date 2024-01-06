import * as React from "react";

import TerminalContext from "./Context";
import { TerminalProviderProps } from "./type";
import exec, { SystemCommand } from "./exec";
import useModal from "@contexts/Modal/useModal";

const TerminalProvider: React.FC<TerminalProviderProps> = ({
  id,
  children,
}) => {
  const { closeModal } = useModal();

  const [prompt, setPrompt] = React.useState("[richard@portlios ~]$ ");
  const [buffer, setBuffer] = React.useState<string[]>([]);

  const addBuffer = React.useCallback((newBuffer: string) => {
    setBuffer((prevBuffer) => [...prevBuffer, newBuffer]);
  }, []);

  const clearBuffer = React.useCallback(() => {
    setBuffer([]);
  }, []);

  const exitTerminal = React.useCallback(() => {
    closeModal(id);
  }, [closeModal, id]);

  const systemCalls = React.useMemo<SystemCommand>(
    () => ({
      clearBuffer,
      exitTerminal,
    }),
    [clearBuffer, exitTerminal],
  );

  const execute = React.useCallback(
    (command: string) => {
      const bufferedCommand = `> ${command}`;

      addBuffer(bufferedCommand);
      const result = exec(command, systemCalls);

      if (result) {
        addBuffer(result);
      }
    },
    [addBuffer, systemCalls],
  );

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
