import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";

import { INode } from "@util/fs/type";
import DragSelect from "./DragSelect";
import GridViewItems from "./GridViewItems";

type GridViewProps = {
  nodes: INode[];
};

const GridView: React.FC<GridViewProps> = ({ nodes }) => {
  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger className="relative flex flex-col w-full justify-between select-none">
        <DragSelect.Provider initialSettings={{ selectedClass: "selector" }}>
          <GridViewItems nodes={nodes} />
          <div className="flex fixed bottom-0 right-0">
            <div
              className={clsx(
                "relative ml-auto",
                "p-1 rounded-tl-lg text-xs",
                "border-t border-l",
                "border-gray-400/45 dark:border-gray-600",
                "bg-gray-300/45 dark:bg-gray-700",
              )}
            >
              Hello, World
            </div>
          </div>
        </DragSelect.Provider>
      </ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Content
        className={clsx(
          "flex flex-col gap-1",
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
            <div>New Folder</div>
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
            <div>New File</div>
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
    </ContextMenuPrimitive.Root>
  );
};

export default GridView;
