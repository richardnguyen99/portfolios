import * as React from "react";
import clsx from "classnames";
import { ChevronDownIcon, ChevronUpIcon } from "@primer/octicons-react";
import { FolderIcon } from "@heroicons/react/24/outline";

import { FileType, IDirectory, IFile, type INode } from "@util/fs/type";
import ListViewItem from "./ListViewItem";
import useFileExplorer from "./hook";
import { FEDirectoryType, FESortType } from "./type";

type Props = {
  nodes: INode[];
};

type SortType = {
  type: "asc" | "desc" | "unset";
};

const ListViewSortAction: React.FC<
  React.PropsWithChildren<SortType> & React.HTMLAttributes<HTMLButtonElement>
> = ({ children, type, ...rest }) => {
  const { dragging } = useFileExplorer();

  return (
    <button
      {...rest}
      type="button"
      className={clsx(
        "first:flex-grow first:flex-shrink first:min-w-32",
        "basis-20 [&:nth-child(3)]:basis-44",
        "[&:not(:first-child)]:flex-grow-0 [&:not(:first-child)]:flex-shrink-0",
        "flex items-center gap-2",
        "px-2 py-1",
        "text-left last:text-center",
        {
          "cursor-default": dragging,
          "hover:bg-gray-300/60 dark:hover:bg-gray-600/40": !dragging,
        },
      )}
    >
      {children}
      {type === "unset" ? null : type === "asc" ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      )}
    </button>
  );
};

const ListView: React.FC<Props> = ({ nodes }) => {
  const { directoryType, setDragging } = useFileExplorer();

  // Default sort type based on the current directory type
  const [sortType, setSortType] = React.useState(() => {
    return directoryType === FEDirectoryType.Recent
      ? FESortType.DATE_DESC
      : FESortType.NAME_ASC;
  });

  const handleNameClick = React.useCallback(() => {
    if (sortType === FESortType.NAME_ASC) {
      setSortType(FESortType.NAME_DESC);
    } else if (sortType === FESortType.NAME_DESC) {
      setSortType(FESortType.NAME_ASC);
    } else {
      setSortType(FESortType.NAME_ASC);
    }
  }, [sortType]);

  const handleSizeClick = React.useCallback(() => {
    if (sortType === FESortType.SIZE_ASC) {
      setSortType(FESortType.SIZE_DESC);
    } else if (sortType === FESortType.SIZE_DESC) {
      setSortType(FESortType.SIZE_ASC);
    } else {
      setSortType(FESortType.SIZE_ASC);
    }
  }, [sortType]);

  const handleDateClick = React.useCallback(() => {
    if (sortType === FESortType.DATE_ASC) {
      setSortType(FESortType.DATE_DESC);
    } else if (sortType === FESortType.DATE_DESC) {
      setSortType(FESortType.DATE_ASC);
    } else {
      setSortType(FESortType.DATE_ASC);
    }
  }, [sortType]);

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
        <div
          className={clsx(
            "flex flex-col",
            "window-scrollbar",
            "w-full px-4 pb-4",
          )}
        >
          <div id="fe-listView-sort-panel" className={clsx("flex")}>
            <ListViewSortAction
              onClick={handleNameClick}
              type={
                sortType === FESortType.NAME_ASC
                  ? "asc"
                  : sortType === FESortType.NAME_DESC
                    ? "desc"
                    : "unset"
              }
            >
              Name
            </ListViewSortAction>
            <ListViewSortAction
              onClick={handleSizeClick}
              type={
                sortType === FESortType.SIZE_ASC
                  ? "asc"
                  : sortType === FESortType.SIZE_DESC
                    ? "desc"
                    : "unset"
              }
            >
              Size
            </ListViewSortAction>
            <ListViewSortAction
              onClick={handleDateClick}
              type={
                sortType === FESortType.DATE_ASC
                  ? "asc"
                  : sortType === FESortType.DATE_DESC
                    ? "desc"
                    : "unset"
              }
            >
              {directoryType === FEDirectoryType.Recent
                ? "Accessed"
                : "Modified"}
            </ListViewSortAction>
            <ListViewSortAction type="unset">Starred</ListViewSortAction>
          </div>
          <div className="h-[1px] -ml-4 -mr-1 bg-gray-300 dark:bg-gray-700" />
          <div className="flex flex-col gap-1">
            {sortedNodes.map((node) => {
              return <ListViewItem key={node.id} node={node} />;
            })}
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
