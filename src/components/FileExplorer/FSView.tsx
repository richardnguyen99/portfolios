import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Transition } from "@headlessui/react";

import DragSelect from "./DragSelect";
import FSViewItems from "./FSViewItems";
import FSFooter from "./FSFooter";
import useFileExplorer from "./hook";
import useWindow from "@components/Window/useWindow";
import { FEDirectoryType } from "./type";
import FileContextMenu from "./ContextMenu/FileContextMenu";
import RecentContextMenu from "./ContextMenu/RecentContextMenu";

const MemoFileContextMenu = React.memo(FileContextMenu);
const MemoRecentContextMenu = React.memo(RecentContextMenu);

const FSView: React.FC = () => {
  const { dialog, directoryType } = useFileExplorer();
  const { getId } = useWindow();

  const windowRef = React.useRef<HTMLElement | null>(null);

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
        <ContextMenuPrimitive.Trigger
          className={clsx(
            "relative flex flex-col justify-between",
            "w-full select-none overflow-x-hidden",
          )}
        >
          <DragSelect.Provider initialSettings={{ selectedClass: "selector" }}>
            <FSViewItems />
            <FSFooter />
          </DragSelect.Provider>
        </ContextMenuPrimitive.Trigger>
        {directoryType === FEDirectoryType.File ? (
          <MemoFileContextMenu />
        ) : (
          <MemoRecentContextMenu />
        )}
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
