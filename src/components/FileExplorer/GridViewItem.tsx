import * as React from "react";
import clsx from "classnames";

import { INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import { Icon } from "@components";

type Props = {
  node: INode;
};

const GridViewItem: React.FC<Props> = ({ node }) => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const { ds } = useDragSelect();

  React.useEffect(() => {
    if (!itemRef.current || !ds) return;

    if (!ds.SelectableSet.has(itemRef.current)) {
      console.log("add selectables");
      ds.addSelectables(itemRef.current);
    }

    ds.subscribe("DS:end", (e) => {
      console.log(e);
    });
  }, [ds]);

  return (
    <div
      ref={itemRef}
      key={node.name}
      className={clsx(
        "selectable",
        "flex flex-col items-center",
        "rounded-md p-2",
        "hover:bg-gray-300/60 dark:hover:bg-gray-600/40",
        "[&.selected]:bg-sky-300/40 dark:[&.selected]:bg-sky-400/40",
        "[&.selected]:hover:bg-sky-300/60 dark:[&.selected]:hover:bg-sky-400/60",
      )}
    >
      {node.type === 1 ? <Icon.Folder /> : <Icon.PlainText />}
      <span className="line-clamp-2 text-center [overflow-wrap:_anywhere] text-overflow">
        {node.name}
      </span>
    </div>
  );
};

export default GridViewItem;
