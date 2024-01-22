import * as React from "react";

import TerminalContext from "./Context";
import { TerminalProviderProps, SystemCommand } from "./type";
import exec from "./exec";
import useModal from "@contexts/Modal/useModal";
import useFileTree from "@contexts/FileTree/useFileTree";
import { IFile, IDirectory, FileType } from "@util/fs/type";
import { ModalProps } from "@contexts/Modal/type";
import useWindow from "@components/Window/useWindow";
import { Editor, Remark } from "@components";

const TerminalProvider: React.FC<TerminalProviderProps> = ({ children }) => {
  const { getId, getSize } = useWindow();
  const { closeModal, addModal } = useModal();
  const { root, home } = useFileTree();

  const [currentFolder, setCurrentFolder] = React.useState({
    previous: home,
    current: home,
  });
  const [prompt, setPrompt] = React.useState("[richard@portlios ~]$ ");
  const [buffer, setBuffer] = React.useState<string[]>([
    "Welcome to Portli-OS!",
    "(Hint): Use `pwd` and start it from there.",
    "\n",
  ]);

  const id = React.useMemo(() => getId(), [getId]);

  const getFileTreeRoot = React.useCallback(() => {
    return root;
  }, [root]);

  const getFileTreeHome = React.useCallback(() => {
    return home;
  }, [home]);

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
    (newDir?: IDirectory | string) => {
      if (typeof newDir === "undefined" || newDir === home) {
        setPrompt("[richard@portlios ~]$ ");
        setCurrentFolder((prev) => ({
          previous: prev.current,
          current: home,
        }));
        return;
      } else if (newDir === root) {
        setPrompt("[richard@portlios /]$ ");
        setCurrentFolder((prev) => ({
          previous: prev.current,
          current: root,
        }));
        return;
      } else if (typeof newDir === "string") {
        let newDirString = "";
        let newDirNode = home;

        if (newDir === "-") {
          // TODO: Clean this up?
          newDirString =
            currentFolder.previous === home
              ? "~"
              : currentFolder.previous === root
                ? "/"
                : currentFolder.previous.name;
          newDirNode = currentFolder.previous;
        } else if (newDir === "~") {
          newDirString = "~";
        } else if (newDir === "/") {
          newDirString = "/";
          newDirNode = root;
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
    [currentFolder.previous, home, root],
  );

  const open = React.useCallback(
    (path: IFile) => {
      const modal: ModalProps = {
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

      if (path.type === FileType.File) {
        if (path.name.endsWith(".md")) {
          modal.type = "reader";
          modal.component = Remark as React.FC;
          modal.componentProps = {
            rawContent: path.content,
          };
        } else {
          modal.type = "editor";
          modal.component = Editor;
          modal.componentProps = {
            file: path,
            initialText: path.content,
            readOnly: true,
          };
        }
      }

      addModal(modal);
    },
    [addModal],
  );

  const openEditor = React.useCallback(
    (path: IFile) => {
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
    (parentNode: IDirectory, filename: string) => {
      //addFile(parentNode, filename);

      console.log("createNewFile", parentNode, filename);
    },
    [],
  );

  const getWindowSize = React.useCallback(() => {
    const { width, height } = getSize();

    return {
      width,
      height,
    };
  }, [getSize]);

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
      open,
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
      open,
      createNewFile,
      getWindowSize,
      getTerminalSize,
      getCharacterSize,
    ],
  );

  const execute = React.useCallback(
    async (command: string) => {
      const bufferedCommand = `> ${command}`;

      addBuffer(bufferedCommand);
      const result = await exec(command, systemCalls, currentFolder.current);

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
