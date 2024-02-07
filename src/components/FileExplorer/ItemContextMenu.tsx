import * as React from "react";
import clsx from "clsx";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";

import { INode } from "@util/fs/type";

type Props = {
  node: INode;
};

const ItemContextMenu: React.FC<Props> = ({ node }) => {
  return (
    <ContextMenuPrimitive.Content
      className={clsx(
        "flex flex-col gap-1",
        "!z-[999]",
        "min-w-[18rem]",
        "p-2 rounded-md",
        "font-extrabold",
        "bg-gray-300 dark:bg-gray-700",
        "border border-gray-400 dark:border-gray-600",
        "shadow-lg",
        "shadow-gray-400 dark:shadow-gray-900",
      )}
    >
      <ContextMenuPrimitive.Item
        className={clsx(
          "flex items-center",
          "px-3 py-2 rounded-md",
          "hover:bg-gray-400 dark:hover:bg-gray-600",
          "outline-none focus:outline-none border-none",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4"></div>
          <div>Open "{node.name}"</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuPrimitive.Item>
      <ContextMenuPrimitive.Item
        className={clsx(
          "flex items-center",
          "px-3 py-2 rounded-md",
          "hover:bg-gray-400 dark:hover:bg-gray-600",
          "outline-none focus:outline-none border-none",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4"></div>
          <div>Delete</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuPrimitive.Item>
      <ContextMenuPrimitive.Item
        className={clsx(
          "flex items-center",
          "px-3 py-2 rounded-md",
          "hover:bg-gray-400 dark:hover:bg-gray-600",
          "outline-none focus:outline-none border-none",
        )}
      >
        <div className="flex items-center gap-2">
          <CheckBadgeIcon className="w-4 h-4" />
          <div>Open</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuPrimitive.Item>
    </ContextMenuPrimitive.Content>
  );
};

export default ItemContextMenu;
