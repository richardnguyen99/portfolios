import * as React from "react";

import ClipboardContext from "./Context";
import {
  ClipboardProviderProps,
  ClipboardReducerState,
  ClipboardReducerAction,
  ClipBoardAction,
  ClipboardNode,
  ClipboardContextType,
  ClipboardFile,
  ClipboardDirectory,
} from "./type";
import { FileType, IDirectory, IFile, INode } from "@util/fs/type";
import { generateDirectoryId, generateFileId } from "@util/fs/id";
import useFileTree from "@contexts/FileTree/useFileTree";

const ClipboardProvider: React.FC<ClipboardProviderProps> = ({ children }) => {
  const { setHomeFolder, getHomeFolder } = useFileTree();

  /**
   * Get a name for a duplicate file.
   *
   * If a file with the same prefix exists, append " (Copy n)" to the name.
   * If multiple copies exist, append " (Copy n)" where n is the new highest
   * number.
   *
   * @example
   * // Dir: another.1
   * _getNameForDuplicate(dir, "another.1", "another.1");
   * // "another.1 (Copy 1)"
   *
   * @example
   * // Dir: another.1, another.1 (Copy 1)
   * _getNameForDuplicate(dir, "another.1", "another.1");
   * // "another.1 (Copy 2)"
   *
   * @example
   * // Dir: another.1, another.1 (Copy 1), another.1 (Copy 2)
   * _getNameForDuplicate(dir, "another.1 (Copy 1)", "another.1 (Copy 1)");
   * // "another.1 (Copy 1) (Copy 1)"
   *
   *
   * @param {IDirectory} dir - The directory to check for duplicates
   * @param {string} name - The name of the file
   * @param {string} existing - The prefix name of the existing file
   * @returns {string} The new name for the duplicate file
   */
  const _getNameForDuplicate = React.useCallback(
    (dir: IDirectory, name: string, prefix: string) => {
      const prefixFiles = dir.children.filter((child) =>
        child.name.startsWith(prefix + " (Copy"),
      );

      if (prefixFiles.length === 0) {
        return `${name} (Copy 1)`;
      }

      const prefixNumbers = prefixFiles.map((file) => {
        const input = file.name.slice(prefix.length + 1);
        const match = input.match(/\(Copy (\d+)\)$/);

        if (match) {
          const numberMatch = input.match(/\d+/);

          if (!numberMatch) {
            throw new Error("Invalid file name");
          }

          return parseInt(numberMatch[0], 10);
        }

        return 0;
      });

      const highestNumber = Math.max(...prefixNumbers);
      return `${prefix} (Copy ${highestNumber + 1})`;
    },
    [],
  );

  const _getSourceDirectory = React.useCallback(
    (node: IDirectory) => {
      const home = getHomeFolder();
      let homeFolder = node;
      const pathList: string[] = [node.id];

      while (homeFolder.parent !== null && homeFolder.parent !== home.parent) {
        homeFolder = homeFolder.parent as IDirectory;
        pathList.push(homeFolder.id);
      }

      return pathList.reverse();
    },
    [getHomeFolder],
  );

  const _getNodeWithPath = React.useCallback(
    (root: IDirectory, path: string[]) => {
      if (path.length === 0) {
        return root;
      }

      if (root.id !== path[0]) {
        return null;
      }

      let current = root;

      for (let i = 1; i < path.length; i++) {
        const child = current.children.find((child) => child.id === path[i]);

        if (!child) {
          return null;
        }

        current = child as IDirectory;
      }

      return current;
    },
    [],
  );

  const pasteNode = React.useCallback(
    (node: ClipboardNode, destDir: IDirectory) => {
      const existingFile = destDir.children.find(
        (child) => child.name === node.name,
      );

      if (existingFile) {
        node.name = _getNameForDuplicate(destDir, node.name, existingFile.name);
      }

      if (node.type === FileType.File) {
        const file = node as ClipboardFile;

        window.localStorage.setItem(`file-${file.id}`, file.content);
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: `file-${file.id}`,
            newValue: file.content,
            oldValue: null,
          }),
        );

        file.content = "";
      } else {
        const dir = node as ClipboardDirectory;

        for (const child of dir.children) {
          pasteNode(child as ClipboardNode, dir);
        }
      }

      node.parent = destDir;
      destDir.children.push(node);
    },
    [_getNameForDuplicate],
  );

  const moveNode = React.useCallback(
    (node: ClipboardNode, destDir: IDirectory, srcDirPath: string[]) => {
      if (srcDirPath.length === 0) {
        return;
      }

      if (destDir.id === srcDirPath[srcDirPath.length - 1]) {
        return;
      }

      const home = getHomeFolder();
      destDir.children.push(node);
      node.parent = destDir;

      const srcDir = _getNodeWithPath(home, srcDirPath);

      if (srcDir === null) {
        throw new Error("Source directory not found");
      }

      srcDir.children = srcDir.children.filter((child) => child.id !== node.id);
    },
    [_getNodeWithPath, getHomeFolder],
  );

  const copyNode = React.useCallback(async (node: INode) => {
    const newNode = {
      id: "",
      parent: null,

      name: node.name,
      type: node.type,
      lastAccessed: node.lastAccessed,
      lastModified: node.lastModified,
      lastChanged: node.lastChanged,
      lastCreated: node.lastCreated,

      readPermission: node.readPermission,
      writePermission: node.writePermission,
      executePermission: node.executePermission,
      owner: node.owner,
    } as INode;

    if (node.type === FileType.File) {
      const fileContent = window.localStorage.getItem(`file-${node.id}`);

      if (fileContent === null) {
        throw new Error(`File ${node.id} not found`);
      }

      (newNode as IFile).content = fileContent;
      (newNode as IFile).size = (node as IFile).size;
      newNode.id = await generateFileId(fileContent, node.name);
    } else {
      // node is a directory
      const directory = node as IDirectory;
      newNode.id = await generateDirectoryId(directory.name);

      // Recursively copy all children of this directory
      (newNode as IDirectory).children = await Promise.all(
        directory.children.map((child) => {
          return copyNode(child);
        }),
      );
    }

    return newNode;
  }, []);

  const cutNode = React.useCallback((node: INode) => {
    const newNode = {
      ...node,
      parent: null,
    };

    return newNode;
  }, []);

  const [clipboard, dispatchClipboard] = React.useReducer(
    (state: ClipboardReducerState, action: ClipboardReducerAction) => {
      switch (action.type) {
        case ClipBoardAction.COPY:
          return {
            srcDir: [...action.payload.srcDir],
            nodes: action.payload.nodes.map((node) => ({
              ...node,
              action: ClipBoardAction.COPY,
            })) as ClipboardNode[],
          };

        case ClipBoardAction.CUT:
          return {
            srcDir: [...action.payload.srcDir],
            nodes: action.payload.nodes.map((node) => ({
              ...node,
              action: ClipBoardAction.CUT,
            })) as ClipboardNode[],
          };

        case ClipBoardAction.PASTE:
          return {
            srcDir: [] as string[],
            nodes: [] as ClipboardNode[],
          };

        default:
          return state;
      }
    },
    {
      nodes: [] as ClipboardNode[],
      srcDir: [] as string[],
    },
  );

  const copy = React.useCallback(
    async (...nodes: INode[]) => {
      if (nodes.length === 0) {
        return;
      }

      const tempNodes = await Promise.all(nodes.map(copyNode));

      dispatchClipboard({
        type: ClipBoardAction.COPY,
        payload: {
          nodes: tempNodes,
          srcDir: _getSourceDirectory(nodes[0].parent as IDirectory),
        },
      });
    },
    [_getSourceDirectory, copyNode],
  );

  const cut = React.useCallback(
    async (...nodes: INode[]) => {
      if (nodes.length === 0) {
        return;
      }

      const tempNodes = nodes.map(cutNode);

      dispatchClipboard({
        type: ClipBoardAction.CUT,
        payload: {
          nodes: tempNodes,
          srcDir: _getSourceDirectory(nodes[0].parent as IDirectory),
        },
      });
    },
    [_getSourceDirectory, cutNode],
  );

  const paste = React.useCallback(
    (destDir: IDirectory) => {
      for (const node of clipboard.nodes) {
        if (node.action === ClipBoardAction.COPY) {
          pasteNode(node, destDir);
        } else {
          moveNode(node, destDir, clipboard.srcDir);
        }
      }

      const home = getHomeFolder();
      let homeFolder = destDir;

      while (homeFolder.parent !== null && homeFolder.parent !== home.parent) {
        homeFolder = homeFolder.parent as IDirectory;
      }

      // Update the file tree
      setHomeFolder({ ...homeFolder, parent: null });

      dispatchClipboard({
        type: ClipBoardAction.PASTE,
        payload: {
          nodes: [],
          srcDir: [],
        },
      });
    },
    [
      clipboard.nodes,
      clipboard.srcDir,
      getHomeFolder,
      moveNode,
      pasteNode,
      setHomeFolder,
    ],
  );

  const value = React.useMemo<ClipboardContextType>(() => {
    return {
      nodes: clipboard.nodes,
      copy,
      cut,
      paste,
    };
  }, [clipboard.nodes, copy, cut, paste]);

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  );
};

export default ClipboardProvider;
