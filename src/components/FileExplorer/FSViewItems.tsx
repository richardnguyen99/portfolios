import * as React from "react";

import { IDirectory, INode } from "@util/fs/type";
import GridView from "./GridView";
import useFileExplorer from "./hook";
import { FEDirectoryType, FEViewType } from "./type";
import ListView from "./ListView";
import useRecentFiles from "@contexts/RecentFiles/hook";
import useSystemCall from "@contexts/SystemCall/useSystemCall";

const FSViewItems: React.FC = () => {
  const { currDir, viewType, directoryType, doesShowHidden } =
    useFileExplorer();
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
