import * as React from "react";
import clsx from "classnames";

import useFileExplorer from "./hook";
import { FEDirectoryType, FESortType } from "./type";
import ListViewSortAction from "./ListViewSortAction";

const ListViewSort: React.FC = () => {
  const { sortType, directoryType, setSortType } = useFileExplorer();

  const handleNameClick = React.useCallback(() => {
    if (sortType === FESortType.NAME_ASC) {
      setSortType(FESortType.NAME_DESC);
    } else if (sortType === FESortType.NAME_DESC) {
      setSortType(FESortType.NAME_ASC);
    } else {
      setSortType(FESortType.NAME_ASC);
    }
  }, [setSortType, sortType]);

  const handleSizeClick = React.useCallback(() => {
    if (sortType === FESortType.SIZE_ASC) {
      setSortType(FESortType.SIZE_DESC);
    } else if (sortType === FESortType.SIZE_DESC) {
      setSortType(FESortType.SIZE_ASC);
    } else {
      setSortType(FESortType.SIZE_ASC);
    }
  }, [setSortType, sortType]);

  const handleDateClick = React.useCallback(() => {
    if (sortType === FESortType.DATE_ASC) {
      setSortType(FESortType.DATE_DESC);
    } else if (sortType === FESortType.DATE_DESC) {
      setSortType(FESortType.DATE_ASC);
    } else {
      setSortType(FESortType.DATE_ASC);
    }
  }, [setSortType, sortType]);

  return (
    <div
      id="fe-listView-sort-panel"
      className={clsx(
        "flex sticky",
        "w-full pl-4 pr-[15px]",
        "border-b border-gray-200 dark:border-gray-700",
      )}
    >
      <ListViewSortAction
        onClick={handleNameClick}
        position={1}
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
        position={2}
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
        position={3}
        type={
          sortType === FESortType.DATE_ASC
            ? "asc"
            : sortType === FESortType.DATE_DESC
              ? "desc"
              : "unset"
        }
      >
        {directoryType === FEDirectoryType.Recent ? "Accessed" : "Modified"}
      </ListViewSortAction>
      <ListViewSortAction type="unset" position={4}>
        Starred
      </ListViewSortAction>
    </div>
  );
};

export default ListViewSort;
