import * as React from "react";

import ClipboardContext from "./Context";
import {
  ClipboardProviderProps,
  ClipboardReducerState,
  ClipboardReducerAction,
  ClipBoardAction,
  ClipboardNode,
  ClipboardContextType,
} from "./type";
import { FileType, IDirectory, IFile, INode } from "@util/fs/type";
import { generateDirectoryId, generateFileId } from "@util/fs/id";

const ClipboardProvider: React.FC<ClipboardProviderProps> = ({ children }) => {
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

      if (!fileContent) {
        throw new Error(`File ${node.id} not found`);
      }

      (newNode as IFile).content = fileContent;
      (newNode as IFile).size = fileContent.length;
      newNode.id = await generateFileId(fileContent, node.name);
    } else {
      // node is a directory
      const directory = node as IDirectory;
      directory.id = await generateDirectoryId(directory.name);

      directory.children = await Promise.all(
        directory.children.map((child) => {
          return copyNode(child);
        }),
      );
    }

    return newNode;
  }, []);

  const [clipboard, dispatchClipboard] = React.useReducer(
    (state: ClipboardReducerState, action: ClipboardReducerAction) => {
      switch (action.type) {
        case ClipBoardAction.COPY:
          return {
            nodes: action.payload.map((node) => ({
              ...node,
              action: ClipBoardAction.COPY,
            })) as ClipboardNode[],
          };

        case ClipBoardAction.CUT:
          return {
            nodes: action.payload.map((node) => ({
              ...node,
              id: "",
              action: ClipBoardAction.CUT,
            })) as ClipboardNode[],
          };

        case ClipBoardAction.PASTE:
          return {
            nodes: [] as ClipboardNode[],
          };

        default:
          return state;
      }
    },
    {
      nodes: [] as ClipboardNode[],
    },
  );

  const copy = React.useCallback(
    async (...nodes: INode[]) => {
      const tempNodes = await Promise.all(nodes.map(copyNode));

      dispatchClipboard({ type: ClipBoardAction.COPY, payload: tempNodes });
    },
    [copyNode],
  );

  const cut = React.useCallback(
    async (...nodes: INode[]) => {
      const tempNodes = await Promise.all(nodes.map(copyNode));

      dispatchClipboard({ type: ClipBoardAction.CUT, payload: tempNodes });
    },
    [copyNode],
  );

  const paste = React.useCallback(() => {
    dispatchClipboard({ type: ClipBoardAction.PASTE, payload: [] });
  }, []);

  React.useEffect(() => {
    console.log(clipboard.nodes);
  }, [clipboard]);

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
