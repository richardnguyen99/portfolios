import * as React from "react";
import clsx from "classnames";

import { type INode } from "@util/fs/type";
import ListViewItem from "./ListViewItem";
import useFileExplorer from "./hook";

type Props = {
  nodes: INode[];
};

const ListViewSortAction: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { dragging } = useFileExplorer();

  return (
    <button
      type="button"
      className={clsx(
        "first:flex-grow first:flex-shrink first:min-w-32",
        "basis-20 [&:nth-child(3)]:basis-44",
        "[&:not(:first-child)]:flex-grow-0 [&:not(:first-child)]:flex-shrink-0",
        "px-2 py-1",
        "text-left last:text-center",
        {
          "cursor-default": dragging,
          "hover:bg-gray-300/60 dark:hover:bg-gray-600/40": !dragging,
        },
      )}
    >
      {children}
    </button>
  );
};

const ListView: React.FC<Props> = ({ nodes }) => {
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
          <ListViewSortAction>Name</ListViewSortAction>
          <ListViewSortAction>Size</ListViewSortAction>
          <ListViewSortAction>Modifed</ListViewSortAction>
          <ListViewSortAction>Starred</ListViewSortAction>
        </div>
        <div className="h-[1px] -ml-4 -mr-1 bg-gray-300 dark:bg-gray-700" />
        <div className="flex flex-col gap-1">
          {nodes.map((node) => {
            return <ListViewItem key={node.id} node={node} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ListView;
