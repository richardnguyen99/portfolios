import * as React from "react";
import clsx from "classnames";

import GridViewItem from "./GridViewItem";
import { type INode } from "@util/fs/type";

type Props = {
  nodes: INode[];
};

const GridView: React.FC<Props> = ({ nodes }) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-[repeat(auto-fill,_minmax(96px,_0fr))]",
        "[grid-gap:_1.5rem]",
        "window-scrollbar",
        "w-full p-4",
      )}
    >
      {nodes.map((node) => {
        return <GridViewItem key={node.id} node={node} />;
      })}
    </div>
  );
};

export default GridView;
