import * as React from "react";

import TerminalContext from "./Context";
import { TerminalProviderProps, SystemCommand } from "./type";
import exec from "./exec";
import useModal from "@contexts/Modal/useModal";
import useFileTree from "@contexts/FileTree/useFileTree";
import type { FileTreeNode } from "@contexts/FileTree/type";
import { ModalProps } from "@contexts/Modal/type";
import useWindow from "@components/Window/useWindow";
import { Editor } from "@components";

const TerminalProvider: React.FC<TerminalProviderProps> = ({ children }) => {
  const { getId } = useWindow();
  const { closeModal, addModal } = useModal();
  const { getHomeFolder, getRootFolder, addFile } = useFileTree();

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

  const id = React.useMemo(() => getId(), [getId]);

  const getFileTreeRoot = React.useCallback(() => {
    return getRootFolder();
  }, [getRootFolder]);

  const getFileTreeHome = React.useCallback(() => {
    return getHomeFolder();
  }, [getHomeFolder]);

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
        id: path.id,
        title: path.name,
        active: true,
        isFullScreen: false,
        isFullScreenAllowed: true,
        type: "editor",
        file: path,
        component: Editor,
        initialPosition: {
          x: 80,
          y: 40,
        },
        initialSize: {
          width: 800,
          height: 600,
        },

        componentProps: {
          file: path,
          initialText: path.content,
          readOnly: path.writePermission === false,
        },
      };

      addModal(editorModal);
    },
    [addModal],
  );

  const createNewFile = React.useCallback(
    (parentNode: FileTreeNode, filename: string) => {
      addFile(parentNode, filename);
    },
    [addFile],
  );

  const getCharacterSize = React.useCallback(() => {
    const terminalId = document.querySelector(`[x-data-window-id="${id}"]`);
    const terminalCaret = terminalId
      ?.querySelector("#text")
      ?.querySelector("span");

    const rect = terminalCaret?.getBoundingClientRect();
    if (rect) {
      return {
        width: rect.width,
        height: rect.height,
      };
    }

    return {
      width: 0,
      height: 0,
    };
  }, [id]);

  const getWindowSize = React.useCallback(() => {
    const terminalId = document.querySelector(`[x-data-window-id="${id}"]`);
    const windowContent = terminalId?.querySelector("#window-content");

    if (windowContent) {
      return {
        width: windowContent.clientWidth,
        height: windowContent.clientHeight,
      };
    }

    return {
      width: 0,
      height: 0,
    };
  }, [id]);

  const getTerminalSize = React.useCallback(() => {
    const windowSize = getWindowSize();
    const characterSize = getCharacterSize();

    return {
      width: Math.floor(windowSize.width / characterSize.width),
      height: Math.floor(windowSize.height / characterSize.height),
    };

    // convert px to ch units
  }, [getCharacterSize, getWindowSize]);

  const systemCalls = React.useMemo<SystemCommand>(
    () => ({
      getFileTreeRoot,
      getFileTreeHome,
      changeDirectory,
      clearBuffer,
      exitTerminal,
      openEditor,
      createNewFile,
      getWindowSize,
      getTerminalSize,
      getCharacterSize,
    }),
    [
      getFileTreeRoot,
      getFileTreeHome,
      changeDirectory,
      clearBuffer,
      exitTerminal,
      openEditor,
      createNewFile,
      getWindowSize,
      getTerminalSize,
      getCharacterSize,
    ],
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
      getWindowSize,
    }),
    [
      addBuffer,
      clearBuffer,
      execute,
      displayPrompt,
      setPrompt,
      renderBuffer,
      getWindowId,
      getWindowSize,
    ],
  );

  return (
    <TerminalContext.Provider value={contextValue}>
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
