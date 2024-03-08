import * as React from "react";

import FileExplorerContext from "./Context";
import {
  FEViewSize,
  FEViewType,
  FileExplorerContextType,
  type FileExplorerProviderProps,
  type FEHistory,
  FESortType,
  FEDirectoryType,
} from "./type";
import { FileType, IDirectory, INode } from "@util/fs/type";
import useFileTree from "@contexts/FileTree/useFileTree";
import useSystemCall from "@contexts/SystemCall/useSystemCall";
import useHistoryState from "./hooks/useHistoryState";
import useContextMenuState from "./hooks/useContextMenuState";

const FileExplorerProvider: React.FC<FileExplorerProviderProps> = ({
  children,
  initialDirectory,
}) => {
  const { home } = useFileTree();
  const { searchNodeFromRoot } = useSystemCall();

  const [selectedNodes, setSelectedNodes] = React.useState<INode[]>([]);
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [size, setSize] = React.useState<FEViewSize>(FEViewSize.Normal);
  const [view, setView] = React.useState<FEViewType>(FEViewType.List);
  const [doesShowHidden, setShowHidden] = React.useState<boolean>(false);
  const [currDir, setCurrDir] = React.useState<INode>(initialDirectory);
  const [directoryType, setDirectoryType] = React.useState<FEDirectoryType>(
    FEDirectoryType.File,
  );
  const [sortType, setSortType] = React.useState(() => {
    return directoryType === FEDirectoryType.Recent
      ? FESortType.DATE_DESC
      : FESortType.NAME_ASC;
  });
  const [historyState, dispatchHistoryState] = useHistoryState({
    index: 0,
    history: [
      {
        id: currDir?.id ?? "",
        name: currDir?.name ?? "",
        parentId: currDir?.parent?.id ?? "",
      },
    ] as FEHistory[],
  });
  const [dialog, setDialog] = React.useState<FileExplorerContextType["dialog"]>(
    {
      open: false,
      dialog: null,
      props: null,
    },
  );

  const [contextMenuState, dispatchContextMenuState] = useContextMenuState({
    open: false,
    storedNodes: [],
  });

  const contextValue = React.useMemo<FileExplorerContextType>(() => {
    return {
      currDir,
      dragging,
      viewType: view,
      viewSize: size,
      doesShowHidden,
      historyState,
      directoryType,
      sortType,
      dialog,
      selectedNodes,
      contextMenuState,

      setDragging,
      setViewSize: setSize,
      setViewType: setView,
      setSelectedNodes: setSelectedNodes,
      setCurrDir,
      setShowHidden,
      setDialog,
      setDirectoryType,
      setSortType,
      dispatchHistoryState,
      dispatchContextMenuState,
    };
  }, [
    currDir,
    dragging,
    view,
    size,
    doesShowHidden,
    historyState,
    directoryType,
    sortType,
    dialog,
    selectedNodes,
    contextMenuState,
    dispatchHistoryState,
    dispatchContextMenuState,
  ]);

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

    if (!newNode) {
      setCurrDir((prev) => ({ ...prev }));

      return;
    }

    setCurrDir(newNode as INode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home, updateNode]);

  React.useEffect(() => {
    if (!currDir) {
      const prevTab = historyState.history[historyState.index - 1];
      const newNode = searchNodeFromRoot(prevTab.id);

      if (newNode) {
        setCurrDir(newNode);
        dispatchHistoryState({
          type: "pop",
        });
      }
    }

    setDragging(false);
  }, [currDir, dispatchHistoryState, historyState, searchNodeFromRoot]);

  if (!currDir) return null;

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export default FileExplorerProvider;
