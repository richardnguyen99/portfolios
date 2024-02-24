import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import useRecentFiles from "@contexts/RecentFiles/hook";
import ContextMenuItem from "./ContextMenuItem";
import useDragSelect from "../DragSelect/hook";

const RecentContextMenuRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ContextMenuPrimitive.ContextMenuContentProps
> = (props, ref) => {
  const { recentFiles, clearRecentFiles } = useRecentFiles();
  const { ds } = useDragSelect();

  const handleClearAllItemsClick = React.useCallback(() => {
    clearRecentFiles();
  }, [clearRecentFiles]);

  const handleSelectAllItemsClick = React.useCallback(() => {
    console.log("Select all items");

    if (!ds) return;

    recentFiles.forEach((file) => {
      const item = document.querySelector(`[data-node-id="${file.id}"]`);

      if (!item) return;

      console.log(item);
      ds.SelectedSet.add(item as HTMLElement);
    });
  }, [ds, recentFiles]);

  return (
    <ContextMenuPrimitive.Content
      ref={ref}
      {...props}
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
      <ContextMenuItem onClick={handleClearAllItemsClick}>
        <div className="flex items-center gap-2">
          <div>Clear &quot;Recent&quot;</div>
        </div>
      </ContextMenuItem>
      <ContextMenuItem onClick={handleSelectAllItemsClick}>
        <div className="flex items-center gap-2">
          <div>Select all</div>
        </div>
      </ContextMenuItem>
    </ContextMenuPrimitive.Content>
  );
};

const RecentContextMenu = React.forwardRef(RecentContextMenuRenderer);
RecentContextMenu.displayName = "RecentContextMenu";

export default RecentContextMenu;
