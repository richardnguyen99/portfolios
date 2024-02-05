import * as React from "react";

import useFileTree from "@contexts/FileTree/useFileTree";
import { FileType, IFile, type IDirectory, type INode } from "@util/fs/type";
import { generateDirectoryId, generateFileId } from "@util/fs/id";

import { SystemCallProviderProps as Props } from "./type";
import SystemCallContext from "./Context";
import _readDir from "./calls/_readDir";
import _addNode from "./calls/_addNode";
import _removeNode from "./calls/_removeNode";
import _walkNode from "./calls/_walkNode";

const SystemCallProvider: React.FC<Props> = ({ children }) => {
  const { getHomeFolder, setHomeFolder } = useFileTree();

  const addINode = React.useCallback(
    (parentNode: IDirectory, newNode: INode) => {
      _addNode(parentNode, newNode);

      const home = getHomeFolder();
      let homeFolder = parentNode;

      while (homeFolder.parent !== null && homeFolder.parent !== home.parent) {
        homeFolder = homeFolder.parent as IDirectory;
      }

      setHomeFolder({ ...homeFolder, parent: null });
    },
    [getHomeFolder, setHomeFolder],
  );

  const addFile = React.useCallback(
    async (parentNode: IDirectory, name: string, initialContent?: string) => {
      if (name === "." || name === "..") {
        return;
      }

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
      if (name === "." || name === "..") {
        return;
      }

      const createdDate = new Date();
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

        lastAccessed: createdDate,
        lastChanged: createdDate,
        lastCreated: createdDate,
        lastModified: createdDate,
      };

      addINode(parentNode, newDirectory as INode);
    },
    [addINode],
  );

  const updateFile = React.useCallback(
    (fileNode: IFile, fileMeta: Partial<IFile>) => {
      const updateMeta = Object.keys(fileMeta).filter(Boolean);

      updateMeta.forEach((key) => {
        const fileKey = key as keyof IFile;
        const value = fileMeta[fileKey];

        fileNode[fileKey] = value as never;
      });

      fileNode.lastModified = new Date();

      setHomeFolder({ ...getHomeFolder(), parent: null });
    },
    [getHomeFolder, setHomeFolder],
  );

  const removeINode = React.useCallback(
    (parentNode: IDirectory, node: INode) => {
      _removeNode(parentNode, node);

      const fileId = node.id;
      const home = getHomeFolder();
      let homeFolder = parentNode;

      // Find the home folder and remount
      while (homeFolder.parent !== null && homeFolder.parent !== home.parent) {
        homeFolder = homeFolder.parent as IDirectory;
      }

      setHomeFolder({ ...homeFolder, parent: null });

      // Only files with content are stored in localStorage
      if (node.type === FileType.Directory) {
        return;
      }

      window.localStorage.removeItem(`file-${fileId}`);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: fileId,
          newValue: null,
        }),
      );
    },
    [getHomeFolder, setHomeFolder],
  );

  const walkNode = React.useCallback(
    (currentNode: IDirectory, pathList: string[]) => {
      const finalNode = _walkNode(currentNode, pathList);

      return finalNode;
    },
    [],
  );

  const searchNodeFromRoot = React.useCallback(
    (nodeId: string) => {
      const root = getHomeFolder();
      const stack = [root];
      const visited = new Set<IDirectory>();
      let foundNode: INode | null = null;

      while (stack.length > 0) {
        const node = stack.pop() as IDirectory;

        if (node.id === nodeId) {
          foundNode = node;
          break;
        }

        if (visited.has(node)) {
          continue;
        }

        visited.add(node);

        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i];

          if (child.type === FileType.Directory) {
            stack.push(child as IDirectory);
          }
        }
      }

      return foundNode;
    },
    [getHomeFolder],
  );

  const readDir = React.useCallback(_readDir, []);

  const contextValue = React.useMemo(() => {
    return {
      addINode,
      addFile,
      addDirectory,
      updateFile,
      removeINode,
      walkNode,
      readDir,
      searchNodeFromRoot,
    };
  }, [
    addDirectory,
    addFile,
    addINode,
    readDir,
    removeINode,
    updateFile,
    walkNode,
    searchNodeFromRoot,
  ]);

  return (
    <SystemCallContext.Provider value={contextValue}>
      {children}
    </SystemCallContext.Provider>
  );
};

export default SystemCallProvider;
