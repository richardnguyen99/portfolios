import * as React from "react";

import { SystemCallProviderProps as Props } from "./type";
import SystemCallContext from "./Context";
import _readDir from "./calls/_readDir";
import useFileTree from "@contexts/FileTree/useFileTree";
import { FileType, IFile, type IDirectory, type INode } from "@util/fs/type";
import _addNode from "./calls/_addNode";
import _removeNode from "./calls/_removeNode";
import _walkNode from "./calls/_walkNode";
import { generateDirectoryId, generateFileId } from "@util/fs/id";

const SystemCallProvider: React.FC<Props> = ({ children }) => {
  const { getHomeFolder, setHomeFolder } = useFileTree();

  const updateFs = React.useCallback(
    (callback?: () => unknown) => {
      const home = getHomeFolder();

      if (callback) {
        callback();
      }

      const newHomeFolder: IDirectory = { ...home, parent: null };
      setHomeFolder(newHomeFolder);
    },
    [getHomeFolder, setHomeFolder],
  );

  const addINode = React.useCallback(
    (parentNode: IDirectory, newNode: INode) => {
      updateFs(() => {
        _addNode(parentNode, newNode);
      });
    },
    [updateFs],
  );

  const addFile = React.useCallback(
    async (parentNode: IDirectory, name: string, initialContent?: string) => {
      const content = initialContent ?? "";

      const newFile: IFile = {
        id: await generateFileId(content, name, parentNode),
        name,
        type: FileType.File,
        content: "",
        size: content.length,
        parent: parentNode,
        owner: "richard",

        readPermission: true,
        writePermission: true,
        executePermission: true,

        lastAccessed: new Date(),
        lastChanged: new Date(),
        lastCreated: new Date(),
        lastModified: new Date(),
      };

      addINode(parentNode, newFile as INode);
    },
    [addINode],
  );

  const addDirectory = React.useCallback(
    async (parentNode: IDirectory, name: string) => {
      const newDirectory: IDirectory = {
        id: await generateDirectoryId(name, parentNode),
        name,
        type: FileType.Directory,
        children: [],
        parent: parentNode,
        owner: "richard",

        readPermission: true,
        writePermission: true,
        executePermission: true,

        lastAccessed: new Date(),
        lastChanged: new Date(),
        lastCreated: new Date(),
        lastModified: new Date(),
      };

      addINode(parentNode, newDirectory as INode);
    },
    [addINode],
  );

  const removeINode = React.useCallback(
    (parentNode: IDirectory, node: INode) => {
      updateFs(() => {
        _removeNode(parentNode, node);
      });
    },
    [updateFs],
  );

  const walkNode = React.useCallback(
    (currentNode: IDirectory, pathList: string[]) => {
      const finalNode = _walkNode(currentNode, pathList);

      return finalNode;
    },
    [],
  );

  const readDir = React.useCallback(_readDir, []);

  const contextValue = React.useMemo(() => {
    return {
      addINode,
      addFile,
      addDirectory,
      removeINode,
      walkNode,
      readDir,
    };
  }, [addDirectory, addFile, addINode, readDir, removeINode, walkNode]);

  return (
    <SystemCallContext.Provider value={contextValue}>
      {children}
    </SystemCallContext.Provider>
  );
};

export default SystemCallProvider;
