import * as React from "react";
import clsx from "classnames";
import { FolderIcon } from "@heroicons/react/24/outline";

import GridViewItem from "./GridViewItem";
import { type INode } from "@util/fs/type";
import useFileExplorer from "./hook";

type Props = {
  nodes: INode[];
};

const GridView: React.FC<Props> = ({ nodes }) => {
  const { setDragging } = useFileExplorer();

  React.useEffect(() => {
    return () => {
      setDragging(false);
    };
  }, [setDragging]);

  return nodes.length > 0 ? (
    <div
      id="fe-view-panel"
      className={clsx(
        "grid grid-cols-[repeat(auto-fill,_minmax(88px,_0fr))]",
        "[grid-gap:_1.5rem]",
        "window-scrollbar",
        "w-full p-4",
      )}
    >
      {nodes.map((node) => {
        return <GridViewItem key={node.id} node={node} />;
      })}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full opacity-70">
      <FolderIcon className="w-32 h-32" />
      <p className="text-2xl font-extrabold">Folder is empty</p>
    </div>
  );
};

export default GridView;
