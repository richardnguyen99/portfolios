import * as React from "react";
import clsx from "clsx";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

const ContextMenuItemRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ContextMenuPrimitive.ContextMenuItemProps
> = (props, ref) => {
  const { onClick, children, disabled, ...rest } = props;

  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      {...rest}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center",
        "px-3 py-2 rounded-md",
        "hover:bg-gray-400 dark:hover:bg-gray-600",
        "outline-none focus:outline-none border-none",
        {
          "cursor-pointer": !disabled,
          "opacity-50 cursor-not-allowed": disabled,
        },
      )}
    >
      {children}
    </ContextMenuPrimitive.Item>
  );
};

const ContextMenuItem = React.forwardRef(ContextMenuItemRenderer);
ContextMenuItem.displayName = "ContextMenuItem";

export default ContextMenuItem;
