import * as React from "react";
import clsx from "clsx";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import { FileType, IDirectory, INode } from "@util/fs/type";
import { ModalProps } from "@contexts/Modal/type";
import useModal from "@contexts/Modal/useModal";
import useFileExplorer from "../hook";
import DeleteFileDialogModal, {
  DeleteFileModalProps,
} from "../Dialog/DeleteFile";
import PropertyDialog, { PropertyDialogProps } from "../Dialog/Property";
import { FEDirectoryType } from "../type";
import ContextMenuItem from "./ContextMenuItem";
import useClipboard from "@contexts/Clipboard/hook";

const Terminal = React.lazy(() => import("@components/Terminal"));

type Props = {
  node: INode;
};

const ItemContextMenu: React.FC<Props> = ({ node }) => {
  const { addModal } = useModal();
  const { copy, cut } = useClipboard();
  const {
    directoryType,
    selectedNodes,
    setDialog,
    setCurrDir,
    setDirectoryType,
    dispatchHistoryState,
  } = useFileExplorer();

  const handleCloseDialog = React.useCallback(() => {
    setDialog({
      open: false,
      dialog: null,
      props: null,
    });
  }, [setDialog]);

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

  const handleOpenItemLocationClick = React.useCallback(() => {
    const nodeParent = node.parent as IDirectory;
    setCurrDir(nodeParent);
    setDirectoryType(FEDirectoryType.File);

    dispatchHistoryState({
      type: "push",
      payload: {
        id: nodeParent.id,
        name: nodeParent.name,
        parentId: nodeParent.parent?.id ?? "",
      },
    });
  }, [dispatchHistoryState, node, setCurrDir, setDirectoryType]);

  const handleDeleteClick = React.useCallback(() => {
    setDialog({
      open: true,
      dialog: DeleteFileDialogModal,
      props: {
        onCanceled: () => {
          handleCloseDialog();
        },

        onSaved: () => {
          handleCloseDialog();
        },

        node,
      } as DeleteFileModalProps,
    });
  }, [handleCloseDialog, node, setDialog]);

  const handlePropertyClick = React.useCallback(() => {
    setDialog({
      open: true,
      dialog: PropertyDialog,
      props: {
        onClose: () => {
          handleCloseDialog();
        },
        node,
      } as PropertyDialogProps,
    });
  }, [handleCloseDialog, node, setDialog]);

  const handleCopyClick = React.useCallback(() => {
    console.log("selectedNodes", selectedNodes);
    // copy(node);
  }, [copy, node, selectedNodes]);

  const handleCutClick = React.useCallback(() => {
    cut(node);
  }, [cut, node]);

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
      <ContextMenuItem>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4"></div>
          <div>Open "{node.name}"</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuItem>
      {directoryType === FEDirectoryType.Recent && (
        <ContextMenuItem onClick={handleOpenItemLocationClick}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4"></div>
            <div>Open Item Location</div>
          </div>
        </ContextMenuItem>
      )}
      {node.type === FileType.Directory && (
        <ContextMenuItem onClick={handleOpenTerminalClick}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4"></div>
            <div>Open in Temrinal</div>
          </div>
        </ContextMenuItem>
      )}

      <ContextMenuPrimitive.Separator className="my-2 dark:bg-gray-600 h-[1px]" />

      <ContextMenuItem onClick={handleCopyClick}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4"></div>
          <div>Copy</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuItem>
      <ContextMenuItem onClick={handleCutClick}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4"></div>
          <div>Move</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuItem>
      <ContextMenuItem onClick={handleDeleteClick}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4"></div>
          <div>Delete</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuItem>

      <ContextMenuPrimitive.Separator className="my-2 dark:bg-gray-600 h-[1px]" />

      <ContextMenuItem onClick={handlePropertyClick}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4"></div>
          <div>Properties</div>
        </div>
        <div className="ml-auto font-mono font-light text-xs">something</div>
      </ContextMenuItem>
    </ContextMenuPrimitive.Content>
  );
};

export default ItemContextMenu;
