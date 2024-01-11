import * as React from "react";

import TerminalContext from "./Context";
import { TerminalProviderProps, SystemCommand } from "./type";
import exec from "./exec";
import useModal from "@contexts/Modal/useModal";
import useFileTree from "@contexts/FileTree/useFileTree";
import type { FileTreeNode } from "@contexts/FileTree/type";
import { ModalProps } from "@contexts/Modal/type";

const TerminalProvider: React.FC<TerminalProviderProps> = ({
  id,
  children,
}) => {
  const { closeModal, addModal } = useModal();
  const { getHomeFolder, getRootFolder } = useFileTree();

  const [currentFolder, setCurrentFolder] = React.useState({
    previous: getHomeFolder(),
    current: getHomeFolder(),
  });
  const [prompt, setPrompt] = React.useState("[richard@portlios ~]$ ");
  const [buffer, setBuffer] = React.useState<string[]>([
    "Welcome to Portli-OS!",
    "(Hint): Use `pwd` and start it from there.",
    "\n",
  ]);

  const getFileTreeRoot = React.useCallback(() => {
    return getRootFolder();
  }, [getRootFolder]);

  const addBuffer = React.useCallback((newBuffer: string) => {
    setBuffer((prevBuffer) => [...prevBuffer, newBuffer]);
  }, []);

  const clearBuffer = React.useCallback(() => {
    setBuffer([]);
  }, []);

  const exitTerminal = React.useCallback(() => {
    closeModal(id);
  }, [closeModal, id]);

  const changeDirectory = React.useCallback(
    (newDir?: FileTreeNode | string) => {
      if (typeof newDir === "undefined" || newDir === getHomeFolder()) {
        setPrompt("[richard@portlios ~]$ ");
        setCurrentFolder((prev) => ({
          previous: prev.current,
          current: getHomeFolder(),
        }));
        return;
      } else if (newDir === getRootFolder()) {
        setPrompt("[richard@portlios /]$ ");
        setCurrentFolder((prev) => ({
          previous: prev.current,
          current: getRootFolder(),
        }));
        return;
      } else if (typeof newDir === "string") {
        let newDirString = "";
        let newDirNode = getHomeFolder();

        if (newDir === "-") {
          // TODO: Clean this up?
          newDirString =
            currentFolder.previous === getHomeFolder()
              ? "~"
              : currentFolder.previous === getRootFolder()
                ? "/"
                : currentFolder.previous.name;
          newDirNode = currentFolder.previous;
        } else if (newDir === "~") {
          newDirString = "~";
        } else if (newDir === "/") {
          newDirString = "/";
          newDirNode = getRootFolder();
        }

        setPrompt(`[richard@portlios ${newDirString}]$ `);
        setCurrentFolder((prev) => ({
          previous: prev.current,
          current: newDirNode,
        }));
      } else {
        setPrompt(`[richard@portlios ${newDir.name}]$ `);
        setCurrentFolder((prev) => ({
          previous: prev.current,
          current: newDir,
        }));
      }
    },
    [currentFolder.previous, getHomeFolder, getRootFolder],
  );

  const openEditor = React.useCallback(
    (path: FileTreeNode) => {
      const editorModal: ModalProps = {
        id: crypto.getRandomValues(new Uint32Array(3))[0].toFixed(0),
        title: path.name,
        active: true,
        isFullScreen: false,
        isFullScreenAllowed: true,
        type: "editor",
        file: path,
      };

      addModal(editorModal);
    },
    [addModal],
  );

  const systemCalls = React.useMemo<SystemCommand>(
    () => ({
      getFileTreeRoot,
      changeDirectory,
      clearBuffer,
      exitTerminal,
      openEditor,
    }),
    [getFileTreeRoot, changeDirectory, clearBuffer, exitTerminal, openEditor],
  );

  const execute = React.useCallback(
    (command: string) => {
      const bufferedCommand = `> ${command}`;

      addBuffer(bufferedCommand);
      const result = exec(command, systemCalls, currentFolder.current);

      addBuffer(result || "");
    },
    [addBuffer, systemCalls, currentFolder],
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
