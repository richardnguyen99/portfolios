import * as React from "react";

import { IDirectory, INode } from "@util/fs/type";
import GridView from "./GridView";
import useFileExplorer from "./hook";
import { FEDirectoryType, FEViewType } from "./type";
import ListView from "./ListView";
import useRecentFiles from "@contexts/RecentFiles/hook";
import useSystemCall from "@contexts/SystemCall/useSystemCall";
import useDragSelect from "./DragSelect/hook";

const FSViewItems: React.FC = () => {
  const { currDir, viewType, directoryType, doesShowHidden, setSelectedNodes } =
    useFileExplorer();
  const { ds } = useDragSelect();
  const { searchNodeWithPath } = useSystemCall();
  const { recentFiles } = useRecentFiles();

  const containerRef = React.useRef<HTMLDivElement>(null);

  const nodes = React.useMemo(() => {
    if (directoryType === FEDirectoryType.Recent) {
      const recentNodes = recentFiles.map((recentFile) => {
        const node = searchNodeWithPath(null, recentFile.path);

        if (!node) return null;

        return node;
      });

      return recentNodes.filter((node) => node !== null) as INode[];
    }

    return (currDir as IDirectory).children;
  }, [currDir, directoryType, recentFiles, searchNodeWithPath]);

  const filterNodes = React.useMemo(() => {
    return nodes.filter((node) => {
      if (node.name.startsWith(".") && !doesShowHidden) return false;

      return true;
    });
  }, [doesShowHidden, nodes]);

  React.useEffect(() => {
    if (!ds) return;

    ds.subscribe("DS:end", (e) => {
      const selectedNodes = e.items.map((item) => {
        const itemId = item.getAttribute("data-node-id");

        if (!itemId)
          throw new Error(
            `FSViewItems: useEffect: DS:end: data-node-id=${itemId} is not found`,
          );

        const node = nodes.find((node) => node.id === itemId);

        if (!node)
          throw new Error(
            `FSViewItems: useEffect: DS:end: node=${itemId} is not found`,
          );

        return node;
      });

      setSelectedNodes(selectedNodes);
    });

    ds.subscribe("DS:start:pre", () => {
      setSelectedNodes([]);
    });
  }, [ds, nodes, setSelectedNodes]);

  return (
    <div ref={containerRef} className="h-full">
      {viewType === FEViewType.Grid ? (
        <GridView nodes={filterNodes} />
      ) : (
        <ListView key={directoryType} nodes={filterNodes} />
      )}
    </div>
  );
};

export default FSViewItems;
