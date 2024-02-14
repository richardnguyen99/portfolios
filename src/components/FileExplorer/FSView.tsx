import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { Transition } from "@headlessui/react";

import DragSelect from "./DragSelect";
import FSViewItems from "./FSViewItems";
import FSFooter from "./FSFooter";
import { ModalProps } from "@contexts/Modal/type";
import useFileExplorer from "./hook";
import useModal from "@contexts/Modal/useModal";
import useWindow from "@components/Window/useWindow";
import AddNewFileDialog from "./Dialog/AddNewFile";
import AddNewFolderDialog from "./Dialog/AddNewFolder";

const Terminal = React.lazy(() => import("@components/Terminal"));

const FSView: React.FC = () => {
  const { currDir, dialog, setDialog } = useFileExplorer();
  const { addModal } = useModal();
  const { getId } = useWindow();

  const windowRef = React.useRef<HTMLElement | null>(null);

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
          console.log("new folder canceled");
          handleCloseDialog();
        },
        onSaved: () => {
          console.log("new folder saved");
          handleCloseDialog();
        },
      },
    });
  }, [handleCloseDialog, setDialog]);

  const handleNewFileClick = React.useCallback(() => {
    setDialog({
      open: true,
      dialog: AddNewFileDialog,
      props: {
        onCanceled: () => {
          console.log("new file canceled");
          handleCloseDialog();
        },
        onSaved: () => {
          console.log("new file saved");
          handleCloseDialog();
        },
        initialName: "new file.txt",
      },
    });
  }, [handleCloseDialog, setDialog]);

  React.useEffect(() => {
    const windowContainer = document.querySelector(
      `[x-data-window-id="${getId()}"]`,
    ) as HTMLElement;

    windowRef.current = windowContainer;
  }, [getId]);

  const Dialog = dialog.dialog;

  return (
    <AlertDialog.Root open={dialog.open}>
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
            <div className="ml-auto font-mono font-light text-xs">
              something
            </div>
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
            <div className="ml-auto font-mono font-light text-xs">
              something
            </div>
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
            <div className="ml-auto font-mono font-light text-xs">
              something
            </div>
          </ContextMenuPrimitive.Item>
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Root>
      {windowRef.current ? (
        <AlertDialog.Portal container={windowRef.current} forceMount>
          <Transition.Root show={dialog.open}>
            <Transition.Child as={React.Fragment} leave="delay-100">
              <AlertDialog.Overlay
                className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
                forceMount
              />
            </Transition.Child>
            {Dialog && (
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-out duration-100 delay-0"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Dialog {...dialog.props} />
              </Transition.Child>
            )}
          </Transition.Root>
        </AlertDialog.Portal>
      ) : null}
    </AlertDialog.Root>
  );
};

export default FSView;
