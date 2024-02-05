import * as React from "react";

import FileExplorerContext from "./Context";
import {
  FEViewSize,
  FEViewType,
  FileExplorerContextType,
  type FileExplorerProviderProps,
  type FEHistory,
  FEHistoryState,
  FEHistoryAction,
} from "./type";
import { FileType, IDirectory, INode } from "@util/fs/type";
import useFileTree from "@contexts/FileTree/useFileTree";

const FileExplorerProvider: React.FC<FileExplorerProviderProps> = ({
  children,
  initialDirectory,
}) => {
  const { home } = useFileTree();
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [size, setSize] = React.useState<FEViewSize>(FEViewSize.Normal);
  const [view, setView] = React.useState<FEViewType>(FEViewType.List);
  const [currDir, setCurrDir] = React.useState<INode>(initialDirectory);

  const [historyState, setHistoryState] = React.useReducer(
    (state: FEHistoryState, action: FEHistoryAction) => {
      switch (action.type) {
        case "push":
          return {
            index: state.index + 1,
            history: [
              ...state.history.slice(0, state.index + 1),
              action.payload,
            ],
          };
        case "pop":
          return {
            index: state.index - 1,
            history: state.history.slice(0, state.index),
          };
        case "previous":
          return {
            index: state.index - 1,
            history: state.history,
          };
        case "next":
          return {
            index: state.index + 1,
            history: state.history,
          };
        case "manual":
          return {
            index: action.payload.index,
            history: [...action.payload.history],
          };
        default:
          return state;
      }
    },
    {
      index: 0,
      history: [
        {
          id: currDir.id,
          name: currDir.name,
          parentId: currDir.parent?.id ?? "",
        },
      ] as FEHistory[],
    },
  );

  const contextValue = React.useMemo<FileExplorerContextType>(() => {
    return {
      currDir,
      dragging,
      viewType: view,
      viewSize: size,
      historyState,

      setDragging: setDragging,
      setViewSize: setSize,
      setViewType: setView,
      setCurrDir,
      dispatchHistoryState: setHistoryState,
    };
  }, [currDir, dragging, historyState, size, view]);

  const updateNode = React.useCallback(
    (startNode: IDirectory, searchNode: IDirectory) => {
      const stack = [startNode];
      const visited = new Set<IDirectory>();
      let foundNode: IDirectory | null = null;

      while (stack.length > 0) {
        const node = stack.pop() as IDirectory;

        if (node.id === searchNode.id) {
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
    [],
  );

  React.useEffect(() => {
    const newNode = updateNode(home, currDir as IDirectory);
    setCurrDir(newNode as INode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home, updateNode]);

  React.useEffect(() => {
    console.log(currDir);
  }, [currDir]);

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export default FileExplorerProvider;
