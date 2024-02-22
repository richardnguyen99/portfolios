import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import useRecentFiles from "@contexts/RecentFiles/hook";

const RecentContextMenuRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ContextMenuPrimitive.ContextMenuContentProps
> = (props, ref) => {
  const { clearRecentFiles } = useRecentFiles();

  const handleClearAllItemsClick = React.useCallback(() => {
    clearRecentFiles();
  }, [clearRecentFiles]);

  const handleSelectAllItemsClick = React.useCallback(() => {
    console.log("Select all items");
  }, []);

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
      <ContextMenuPrimitive.Item
        onClick={handleClearAllItemsClick}
        className={clsx(
          "flex items-center",
          "px-3 py-2 rounded-md",
          "hover:bg-gray-400 dark:hover:bg-gray-600",
          "outline-none focus:outline-none border-none",
        )}
      >
        <div className="flex items-center gap-2">
          <div>Clear all items</div>
        </div>
      </ContextMenuPrimitive.Item>
      <ContextMenuPrimitive.Item
        onClick={handleSelectAllItemsClick}
        className={clsx(
          "flex items-center",
          "px-3 py-2 rounded-md",
          "hover:bg-gray-400 dark:hover:bg-gray-600",
          "outline-none focus:outline-none border-none",
        )}
      >
        <div className="flex items-center gap-2">
          <div>Select all items</div>
        </div>
      </ContextMenuPrimitive.Item>
    </ContextMenuPrimitive.Content>
  );
};

const RecentContextMenu = React.forwardRef(RecentContextMenuRenderer);
RecentContextMenu.displayName = "RecentContextMenu";

export default RecentContextMenu;
