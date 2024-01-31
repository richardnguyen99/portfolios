import * as React from "react";
import clsx from "classnames";

import { type INode } from "@util/fs/type";
import ListViewItem from "./ListViewItem";

type Props = {
  nodes: INode[];
};

const ListView: React.FC<Props> = ({ nodes }) => {
  return (
    <div>
      <div
        className={clsx(
          "flex flex-col gap-2",
          "window-scrollbar",
          "w-full p-4",
        )}
      >
        {nodes.map((node) => {
          return <ListViewItem key={node.id} node={node} />;
        })}
      </div>
    </div>
  );
};

export default ListView;
