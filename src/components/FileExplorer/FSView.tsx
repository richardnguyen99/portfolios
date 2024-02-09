import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";

import DragSelect from "./DragSelect";
import FSViewItems from "./FSViewItems";
import FSFooter from "./FSFooter";
import { ModalProps } from "@contexts/Modal/type";
import { Terminal } from "@components";
import useFileExplorer from "./hook";
import useModal from "@contexts/Modal/useModal";

const FSView: React.FC = () => {
  const { currDir } = useFileExplorer();
  const { addModal } = useModal();

  const handleOpenTerminalClick = React.useCallback(() => {
    const newTerminal: ModalProps = {
      id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
      title: currDir.name,
      active: true,
      isFullScreen: false,
      isFullScreenAllowed: true,
      type: "terminal",
      component: Terminal,
      componentProps: {
        initialDir: currDir,
      },
    };

    addModal(newTerminal);
  }, [addModal, currDir]);

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger className="relative flex flex-col w-full justify-between select-none overflow-x-hidden">
        <DragSelect.Provider initialSettings={{ selectedClass: "selector" }}>
          <FSViewItems />
          <FSFooter />
        </DragSelect.Provider>
      </ContextMenuPrimitive.Trigger>
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
            <div>New Folder</div>
          </div>
          <div className="ml-auto font-mono font-light text-xs">something</div>
        </ContextMenuPrimitive.Item>
        <ContextMenuPrimitive.Item
          onClick={handleOpenTerminalClick}
          className={clsx(
            "flex items-center",
            "px-3 py-2 rounded-md",
            "hover:bg-gray-400 dark:hover:bg-gray-600",
            "outline-none focus:outline-none border-none",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4"></div>
            <div>Open in Terminal</div>
          </div>
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

export default FSView;
