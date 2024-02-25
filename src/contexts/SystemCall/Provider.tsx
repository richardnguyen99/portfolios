import * as React from "react";

import useFileTree from "@contexts/FileTree/useFileTree";
import {
  FileType,
  IFile,
  INodeOption,
  type IDirectory,
  type INode,
} from "@util/fs/type";
import { generateDirectoryId, generateFileId } from "@util/fs/id";

import { SystemCallProviderProps as Props } from "./type";
import SystemCallContext from "./Context";
import _readDir from "./calls/_readDir";
import _addNode from "./calls/_addNode";
import _removeNode from "./calls/_removeNode";
import _walkNode from "./calls/_walkNode";
import _updateNode from "./calls/_updateNode";

const SystemCallProvider: React.FC<Props> = ({ children }) => {
  const { getHomeFolder, getRootFolder, setHomeFolder } = useFileTree();

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

  const updateINode = React.useCallback(
    (node: INode, option: INodeOption) => {
      _updateNode(node, option);

      const home = getHomeFolder();
      let currNode = node as IDirectory;

      while (currNode !== null && currNode.parent !== home.parent) {
        currNode = currNode.parent as IDirectory;
      }

      setHomeFolder({ ...currNode, parent: null });
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
      window.localStorage.setItem(`file-${newFile.id}`, content);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: newFile.id,
          oldValue: null,
          newValue: content,
        }),
      );
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
    (currNode: IFile, option: INodeOption) => {
      updateINode(currNode, option);
    },
    [updateINode],
  );

  const updateDirectory = React.useCallback(
    (currNode: IDirectory, option: INodeOption) => {
      updateINode(currNode, option);
    },
    [updateINode],
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
      if (node.type === FileType.Directory) return;

      // Remove file content from local storage
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

  const searchNodeWithPath = React.useCallback(
    (from: IDirectory | null, path: string) => {
      const startNode = from ?? getRootFolder();
      const pathList = path.split("/").filter((p) => p.length > 0);

      if (pathList.length === 0) {
        return null;
      }

      let currNode: INode = startNode;

      for (const p of pathList) {
        if (startNode.type !== FileType.Directory) {
          return null;
        }

        const index = (currNode as IDirectory).children.findIndex(
          (child) => child.name === p,
        );

        if (index === -1) {
          return null;
        }

        currNode = (currNode as IDirectory).children[index];
      }

      return currNode;
    },
    [getRootFolder],
  );

  const readDir = React.useCallback(_readDir, []);

  const contextValue = React.useMemo(() => {
    return {
      addINode,
      addFile,
      addDirectory,
      updateFile,
      updateDirectory,
      removeINode,
      walkNode,
      readDir,
      searchNodeFromRoot,
      searchNodeWithPath,
    };
  }, [
    addDirectory,
    addFile,
    addINode,
    readDir,
    removeINode,
    updateFile,
    updateDirectory,
    walkNode,
    searchNodeFromRoot,
    searchNodeWithPath,
  ]);

  return (
    <SystemCallContext.Provider value={contextValue}>
      {children}
    </SystemCallContext.Provider>
  );
};

export default SystemCallProvider;
