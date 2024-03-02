import * as React from "react";
import { DSInputElement, DSPubCallback } from "dragselect";

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

  // Nodes of the current directory
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

  /**
   * Filtered nodes based on the current configuration
   */
  const filterNodes = React.useMemo(() => {
    return nodes.filter((node) => {
      if (node.name.startsWith(".") && !doesShowHidden) return false;

      return true;
    });
  }, [doesShowHidden, nodes]);

  /**
   * DragSelect callback when drag select ends
   *
   * @param {DSPubCallback<"DS:end", DSInputElement>} e - DragSelect end event
   */
  const dsEndCallback = React.useCallback<
    DSPubCallback<"DS:end", DSInputElement>
  >(
    (e) => {
      const selectedNodes = e.items.map((item) => {
        // Get the node id from the selected item, which is an actual DOM
        // element
        const itemId = item.getAttribute("data-node-id");

        if (!itemId)
          throw new Error(
            `FSViewItems: useEffect: DS:end: data-node-id=${itemId} is not found`,
          );

        const node = filterNodes.find((node) => node.id === itemId);

        if (!node)
          throw new Error(
            `FSViewItems: useEffect: DS:end: node=${itemId} is not found`,
          );

        return node;
      });

      // Append memoized selected nodes to FileExplorer context's state
      setSelectedNodes(selectedNodes);
    },
    [filterNodes, setSelectedNodes],
  );

  /**
   * DragSelect callback when dragselect starts
   *
   * @param {DSPubCallback<"DS:start:pre", DSInputElement>} _e - DragSelect start event
   */
  const dsStartCallback = React.useCallback<
    DSPubCallback<"DS:start:pre", DSInputElement>
  >(
    (_e) => {
      // Clear all temporary selected nodes every time drag select starts
      setSelectedNodes([]);
    },
    [setSelectedNodes],
  );

  React.useEffect(() => {
    if (!ds) return;

    ds.subscribe("DS:end", dsEndCallback);
    ds.subscribe("DS:start:pre", dsStartCallback);

    return () => {
      ds.unsubscribe("DS:end", dsEndCallback);
      ds.unsubscribe("DS:start:pre", dsStartCallback);
    };
  }, [currDir, ds, dsEndCallback, dsStartCallback, setSelectedNodes]);

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
