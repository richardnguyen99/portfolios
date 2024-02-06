import * as React from "react";
import clsx from "classnames";

import { FileType, IDirectory, type INode } from "@util/fs/type";
import ListViewItem from "./ListViewItem";
import useFileExplorer from "./hook";
import { FESortType } from "./type";
import { ChevronDownIcon, ChevronUpIcon } from "@primer/octicons-react";

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
  const [sortType, setSortType] = React.useState(FESortType.NAME_ASC);

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
        return -1;
      }

      if (sortType === FESortType.DATE_DESC) {
        return -1;
      }

      const aFile = localStorage.getItem(`file-${a.id}`)!;
      const bFile = localStorage.getItem(`file-${b.id}`)!;

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

        return aFile.length - bFile.length;
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

        return bFile.length - aFile.length;
      }

      return 0;
    });
  }, [sortType, nodes]);

  return (
    <div>
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
            Modifed
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
    </div>
  );
};

export default ListView;
