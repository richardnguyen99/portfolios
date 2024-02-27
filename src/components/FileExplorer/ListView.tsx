import * as React from "react";
import clsx from "classnames";
import { FolderIcon } from "@heroicons/react/24/outline";

import { FileType, IDirectory, IFile, type INode } from "@util/fs/type";
import ListViewItem from "./ListViewItem";
import useFileExplorer from "./hook";
import { FEDirectoryType, FESortType } from "./type";

type Props = {
  nodes: INode[];
};

const ListView: React.FC<Props> = ({ nodes }) => {
  const { directoryType, sortType, setDragging } = useFileExplorer();

  // Default sort type based on the current directory type
  const sortedNodes = React.useMemo(() => {
    return nodes.slice().sort((a, b) => {
      if (sortType === FESortType.NAME_ASC) {
        return a.name.localeCompare(b.name);
      }

      if (sortType === FESortType.NAME_DESC) {
        return b.name.localeCompare(a.name);
      }

      if (sortType === FESortType.DATE_ASC) {
        // Check if lastModified and lastAccessed is a Date object.
        // This property is parsed from the localStorage, so if it is not a
        // Date object (most likely a string), the parser is broken
        // see src/hooks/useLocalStorage.ts

        if (directoryType === FEDirectoryType.Recent) {
          if (
            typeof a.lastAccessed !== "object" ||
            typeof b.lastAccessed !== "object"
          ) {
            console.warn("lastAccessed is not a Date object");
            return -1;
          }

          return a.lastAccessed.getTime() - b.lastAccessed.getTime();
        }

        if (
          typeof a.lastModified !== "object" ||
          typeof b.lastModified !== "object"
        ) {
          console.warn("lastModified is not a Date object");
          return -1;
        }

        return a.lastModified.getTime() - b.lastModified.getTime();
      }

      if (sortType === FESortType.DATE_DESC) {
        // Check if lastModified and lastAccessed is a Date object.
        // This property is parsed from the localStorage, so if it is not a
        // Date object (most likely a string), the parser is broken
        // see src/hooks/useLocalStorage.ts

        if (directoryType === FEDirectoryType.Recent) {
          if (
            typeof a.lastAccessed !== "object" ||
            typeof b.lastAccessed !== "object"
          ) {
            console.warn("lastAccessed is not a Date object");
            return 1;
          }

          return b.lastAccessed.getTime() - a.lastAccessed.getTime();
        }

        if (
          typeof a.lastModified !== "object" ||
          typeof b.lastModified !== "object"
        ) {
          console.warn("lastModified is not a Date object");
          return 1;
        }

        return b.lastModified.getTime() - a.lastModified.getTime();
      }

      if (sortType === FESortType.SIZE_ASC) {
        if (a.type === FileType.Directory && b.type === FileType.Directory) {
          return (
            (a as IDirectory).children.length -
            (b as IDirectory).children.length
          );
        }

        if (a.type === FileType.Directory) {
          return -1;
        }

        if (b.type === FileType.Directory) {
          return 1;
        }

        const aFileSize = (a as IFile).size;
        const bFileSize = (b as IFile).size;

        return aFileSize - bFileSize;
      }

      if (sortType === FESortType.SIZE_DESC) {
        if (a.type === FileType.Directory && b.type === FileType.Directory) {
          return (
            (b as IDirectory).children.length -
            (a as IDirectory).children.length
          );
        }

        if (a.type === FileType.Directory) {
          return 1;
        }

        if (b.type === FileType.Directory) {
          return -1;
        }

        const aFileSize = (a as IFile).size;
        const bFileSize = (b as IFile).size;

        return bFileSize - aFileSize;
      }

      return 0;
    });
  }, [nodes, sortType, directoryType]);

  React.useEffect(() => {
    return () => {
      setDragging(false);
    };
  }, [directoryType, setDragging]);

  return (
    <div className="h-full">
      {sortedNodes.length > 0 ? (
        <div className={clsx("flex flex-col relative", "w-full")}>
          <div id="fe-listView-sort-panel" className={clsx("flex pl-4")}>
            <div className="flex flex-col gap-1 w-full">
              {sortedNodes.map((node) => {
                return <ListViewItem key={node.id} node={node} />;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full opacity-70">
          <FolderIcon className="w-32 h-32" />
          <p className="text-2xl font-extrabold">Folder is empty</p>
        </div>
      )}
    </div>
  );
};

export default ListView;
