import * as React from "react";
import clsx from "classnames";

import { INode } from "@util/fs/type";
import { Icon } from "@components";
import ViewItemWrapper from "./ViewItemWrapper";

type Props = {
  node: INode;
};

const GridViewItem: React.FC<Props> = ({ node }) => {
  return (
    <ViewItemWrapper node={node}>
      <div
        className={clsx(
          "flex flex-col items-center",
          "rounded-md p-2 border-2 border-transparent",
          "select-none cursor-default",
          "hover:bg-gray-300/60 dark:hover:bg-gray-600/40",
          "group-[.selected]:bg-sky-300/40 dark:group-[.selected]:bg-sky-400/40",
          "group-[.selected]:hover:bg-sky-300/60 dark:group-[.selected]:hover:bg-sky-400/60",
          '[[data-state="open"]>&]:border-sky-500 dark:[[data-state="open"]>&]:border-sky-400',
          '[[data-state="open"]>&]:bg-sky-300/30 dark:[[data-state="open"]>&]:bg-sky-400/30',
        )}
      >
        {node.type === 1 ? <Icon.Folder /> : <Icon.PlainText />}
        <span className="line-clamp-2 text-center [overflow-wrap:_anywhere] text-overflow">
          {node.name}
        </span>
      </div>
    </ViewItemWrapper>
  );
};

export default GridViewItem;
