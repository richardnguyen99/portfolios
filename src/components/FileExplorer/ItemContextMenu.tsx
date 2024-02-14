import * as React from "react";
import clsx from "clsx";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import { FileType, INode } from "@util/fs/type";
import { ModalProps } from "@contexts/Modal/type";
import useModal from "@contexts/Modal/useModal";
import useFileExplorer from "./hook";
import DeleteFileDialogModal, {
  DeleteFileModalProps,
} from "./Dialog/DeleteFile";

const Terminal = React.lazy(() => import("@components/Terminal"));

type Props = {
  node: INode;
};

const ItemContextMenu: React.FC<Props> = ({ node }) => {
  const { addModal } = useModal();
  const { setDialog } = useFileExplorer();

  const handleOpenTerminalClick = React.useCallback(() => {
    const newTerminal: ModalProps = {
      id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
      title: node.name,
      active: true,
      isFullScreen: false,
      isFullScreenAllowed: true,
      type: "terminal",
      component: Terminal,
      componentProps: {
        initialDir: node,
      },
    };

    addModal(newTerminal);
  }, [addModal, node]);

  const handleDeleteClick = React.useCallback(() => {
    setDialog({
      open: true,
      dialog: DeleteFileDialogModal,
      props: {
        onCanceled: () => {
          setDialog({
            open: false,
            dialog: null,
            props: null,
          });
        },

        onSaved: () => {
          setDialog({
            open: false,
            dialog: null,
            props: null,
          });
        },

        node,
      } as DeleteFileModalProps,
    });
  }, [node, setDialog]);

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
      {node.type === FileType.Directory && (
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
            <div>Open in Temrinal</div>
          </div>
        </ContextMenuPrimitive.Item>
      )}

      <ContextMenuPrimitive.Separator className="my-2 dark:bg-gray-600 h-[1px]" />

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
          <div>Copy</div>
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
          <div>Move</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuPrimitive.Item>
      <ContextMenuPrimitive.Item
        onClick={handleDeleteClick}
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

      <ContextMenuPrimitive.Separator className="my-2 dark:bg-gray-600 h-[1px]" />

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
          <div>Property</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuPrimitive.Item>
    </ContextMenuPrimitive.Content>
  );
};

export default ItemContextMenu;
