import * as React from "react";

import FileExplorerContext from "./Context";
import {
  FEViewSize,
  FEViewType,
  FileExplorerContextType,
  type FileExplorerProviderProps,
  type FEHistory,
} from "./type";
import { FileType, IDirectory, INode } from "@util/fs/type";
import List from "@util/list";
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
  const [history, setHistory] = React.useState<List<FEHistory>>();

  React.useEffect(() => {
    setHistory((prev) => {
      if (!prev) {
        const list = new List<FEHistory>();
        list.pushBack({
          id: currDir.id,
          name: currDir.name,
          parentId: currDir.parent ? currDir.parent.id : "",
        });

        return list;
      }

      return prev;
    });
  }, [currDir.id, currDir.name, currDir.parent, history]);

  const contextValue = React.useMemo<FileExplorerContextType>(() => {
    return {
      currDir,
      dragging,
      history,
      viewType: view,
      viewSize: size,

      setDragging: setDragging,
      setViewSize: setSize,
      setViewType: setView,
      setCurrDir,
    };
  }, [currDir, dragging, history, size, view]);

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
    console.log(
      "FileExplorerProvider: currDir changed ",
      Object.is(currDir, home),
    );

    const newNode = updateNode(home, currDir as IDirectory);
    setCurrDir(newNode as INode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home, updateNode]);

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export default FileExplorerProvider;
