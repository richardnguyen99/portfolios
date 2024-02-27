import * as React from "react";
import clsx from "classnames";
import { browserName, BrowserTypes } from "react-device-detect";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Transition } from "@headlessui/react";

import FSViewItems from "./FSViewItems";
import FSFooter from "./FSFooter";
import useFileExplorer from "./hook";
import useWindow from "@components/Window/useWindow";
import { FEDirectoryType, FEViewType } from "./type";
import FileContextMenu from "./ContextMenu/FileContextMenu";
import RecentContextMenu from "./ContextMenu/RecentContextMenu";
import ListViewSort from "./ListViewSort";
import useDragSelect from "./DragSelect/hook";
import { DSCallbackObject, DSInputElement } from "dragselect";

const MemoFileContextMenu = React.memo(FileContextMenu);
const MemoRecentContextMenu = React.memo(RecentContextMenu);

const FSView: React.FC = () => {
  const { dialog, viewType, directoryType, setDragging } = useFileExplorer();
  const { getId } = useWindow();
  const { ds } = useDragSelect();

  const windowRef = React.useRef<HTMLElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [, setItemCount] = React.useState(0);

  React.useEffect(() => {
    const windowContainer = document.querySelector(
      `[x-data-window-id="${getId()}"]`,
    ) as HTMLElement;

    windowRef.current = windowContainer;
  }, [getId]);

  // This useEffect is used to update the dimension and position of the
  // selector area. DragSelect uses an actual DOM element, which is done
  // through `containerRef.current`. to calculate the position of the selector
  // area. However, React won't update the actual DOM element.
  React.useEffect(() => {
    const containerRefCurrent = containerRef.current;
    const windowContainer = document.querySelector(
      `[x-data-window-id="${getId()}"]`,
    ) as HTMLElement;

    // This selector area is the actual DOM element that DragSelect creates and
    // uses to render the selector component.
    const selectorArea = document.querySelector(
      ".ds-selector-area",
    ) as HTMLElement;

    if (!containerRefCurrent || !windowContainer || !selectorArea || !ds)
      return;

    const mutationObserver = new MutationObserver((entries) => {
      if (!entries[0]) return;

      const fsContent = windowContainer.querySelector(
        "#fe-fs-content > div:nth-child(2) > div:nth-child(2)",
      );

      if (!fsContent) return;

      ds.setSettings({
        area: containerRef.current!,
        draggability: false,
        selectableClass: "selectable",
        selectorClass: "selector",
        selectedClass: "selected",
      });
    });

    if (containerRefCurrent) {
      mutationObserver.observe(windowContainer as Node, {
        attributes: true,
      });
    }

    return () => {
      if (containerRefCurrent) {
        mutationObserver.disconnect();
      }
    };
  }, [ds, containerRef, getId]);

  React.useEffect(() => {
    if (!containerRef.current || !ds) return;

    ds.setSettings({
      area: containerRef.current!,
      draggability: false,
      selectableClass: "selectable",
      selectorClass: "selector",
      selectedClass: "selected",
    });

    const dsCallback = ({
      items,
      isDragging,
      dropTarget,
    }: DSCallbackObject<DSInputElement>) => {
      setDragging(false);
      if (!isDragging || !dropTarget || !items) return;
    };

    ds.subscribe("DS:start", () => setDragging(true));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds.subscribe("DS:end", dsCallback);

    const add = ({ value = 1 }) => setItemCount((prev) => prev + value);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds.subscribe("__add", add);

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ds.unsubscribe("DS:end", dsCallback);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ds.unsubscribe("__add", add);
    };
  }, [containerRef, ds, setDragging, viewType]);

  const Dialog = dialog.dialog;

  return (
    <AlertDialog.Root open={dialog.open}>
      <ContextMenuPrimitive.Root>
        <ContextMenuPrimitive.Trigger asChild>
          <div className="w-full flex flex-col items-center">
            {viewType === FEViewType.List && <ListViewSort />}
            <div
              ref={containerRef}
              className={clsx("relative", "h-full w-full window-scrollbar", {
                // Evil hack to fix the scrollbar padding issue between
                // Firefox and Chrome.
                // 15px is the scrollbar width in Chrome.
                "pr-[15px]": browserName === BrowserTypes.Firefox,
              })}
            >
              <FSViewItems />
              <FSFooter />
            </div>
          </div>
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
