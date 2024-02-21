import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import { ModalProps } from "@contexts/Modal/type";
import useModal from "@contexts/Modal/useModal";
import useFileExplorer from "../hook";
import AddNewFolderDialog from "../Dialog/AddNewFolder";
import AddNewFileDialog from "../Dialog/AddNewFile";
import PropertyDialog, { PropertyDialogProps } from "../Dialog/Property";

const Terminal = React.lazy(() => import("@components/Terminal"));

const FileContextMenuRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ContextMenuPrimitive.ContextMenuContentProps
> = (props, ref) => {
  const { addModal } = useModal();
  const { currDir, setDialog } = useFileExplorer();

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

  const handleCloseDialog = React.useCallback(() => {
    setDialog({
      open: false,
      dialog: null,
      props: null,
    });
  }, [setDialog]);

  const handleNewFolderClick = React.useCallback(() => {
    setDialog({
      open: true,
      dialog: AddNewFolderDialog,
      props: {
        onCanceled: () => {
          handleCloseDialog();
        },
        onSaved: () => {
          handleCloseDialog();
        },
        initialName: "new_folder",
      },
    });
  }, [handleCloseDialog, setDialog]);

  const handleNewFileClick = React.useCallback(() => {
    setDialog({
      open: true,
      dialog: AddNewFileDialog,
      props: {
        onCanceled: () => {
          handleCloseDialog();
        },
        onSaved: () => {
          handleCloseDialog();
        },
        initialName: "new_file.txt",
      },
    });
  }, [handleCloseDialog, setDialog]);

  const handlePropertyClick = React.useCallback(() => {
    setDialog({
      open: true,
      dialog: PropertyDialog,
      props: {
        onClose: () => {
          handleCloseDialog();
        },
        node: currDir,
      } as PropertyDialogProps,
    });
  }, [currDir, handleCloseDialog, setDialog]);

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
        onClick={handleNewFolderClick}
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
        onClick={handleNewFileClick}
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

      <ContextMenuPrimitive.Separator className="my-2 dark:bg-gray-600 h-[1px]" />

      <ContextMenuPrimitive.Item
        onClick={handlePropertyClick}
        className={clsx(
          "flex items-center",
          "px-3 py-2 rounded-md",
          "hover:bg-gray-400 dark:hover:bg-gray-600",
          "outline-none focus:outline-none border-none",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4"></div>
          <div>Properties</div>
        </div>
      </ContextMenuPrimitive.Item>
    </ContextMenuPrimitive.Content>
  );
};

const FileContextMenu = React.forwardRef(FileContextMenuRenderer);
FileContextMenu.displayName = "FileContextMenu";

export default FileContextMenu;
