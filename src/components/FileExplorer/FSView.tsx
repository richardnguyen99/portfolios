import * as React from "react";
import clsx from "classnames";
import { browserName, BrowserTypes } from "react-device-detect";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Transition } from "@headlessui/react";
import { DSInputElement, DSPubCallback } from "dragselect";

import FSViewItems from "./FSViewItems";
import FSFooter from "./FSFooter";
import useFileExplorer from "./hook";
import useWindow from "@components/Window/useWindow";
import { FEDirectoryType, FEViewType } from "./type";
import FileContextMenu from "./ContextMenu/FileContextMenu";
import RecentContextMenu from "./ContextMenu/RecentContextMenu";
import ListViewSort from "./ListViewSort";
import useDragSelect from "./DragSelect/hook";
import { useHotkeys } from "react-hotkeys-hook";
import useClipboard from "@contexts/Clipboard/hook";
import { IDirectory, INode } from "@util/fs/type";

const MemoFileContextMenu = React.memo(FileContextMenu);
const MemoRecentContextMenu = React.memo(RecentContextMenu);

const FSView: React.FC = () => {
  const {
    selectedNodes,
    dialog,
    viewType,
    directoryType,
    currDir,
    setDragging,
    setSelectedNodes,
  } = useFileExplorer();
  const { getId } = useWindow();
  const { ds } = useDragSelect();
  const { copy, paste } = useClipboard();

  /**
   * Window reference to the current window DOM node. This is used to render
   * the dialog component when the window is ready.
   */
  const windowRef = React.useRef<HTMLElement | null>(null);

  /**
   * Container reference to the File Explorer view. This is used to control the
   * DragSelect area.
   */
  const containerRef = React.useRef<HTMLDivElement>(null);

  /**
   * Handler for the File Explorer Context Menu change in open state
   *
   * @param {boolean} open - The open state of the context menu
   */
  const handleContextMenuChange = React.useCallback(
    (open: boolean) => {
      if (ds && open) {
        setDragging(false);
        setSelectedNodes([]);
        ds.SelectedSet.clear();
      }
    },
    [ds, setDragging, setSelectedNodes],
  );

  /**
   * Handler for the DragSelect end event
   */
  const dsEndCallback = React.useCallback<
    DSPubCallback<"DS:end", DSInputElement>
  >(
    ({ isDragging, dropTarget, items }) => {
      setDragging(false);
      if (!isDragging || !dropTarget || !items) return;
    },
    [setDragging],
  );

  useHotkeys("mod+a", (e) => {
    e.preventDefault();
    if (!ds || !containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".selectable");
    const nodes: INode[] = [];

    items.forEach((item) => {
      ds.addSelection(item as HTMLElement);

      const itemId = item.getAttribute("data-node-id");
      if (!itemId)
        throw new Error(
          `FSView: useHotkeys: mod+a: data-node-id=${itemId} is not found`,
        );

      const node = (currDir as IDirectory).children.find(
        (node) => node.id === itemId,
      );

      if (!node)
        throw new Error(
          `FSView: useHotkeys: mod+a: node=${itemId} is not found`,
        );

      nodes.push(node);
    });

    setSelectedNodes(nodes);
  });

  useHotkeys("mod+c", () => {
    copy(...selectedNodes);
  });

  useHotkeys("mod+v", () => {
    paste(currDir as IDirectory);
  });

  useHotkeys("delete", () => {
    console.log("delete");
  });

  // Update the window reference when the window is ready
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
    const windowRefCurrent = windowRef.current;

    /** This selector area is the actual DOM element that DragSelect creates and
     * uses to render the selector component.
     */
    const selectorArea = document.querySelector(
      ".ds-selector-area",
    ) as HTMLElement;

    if (!containerRefCurrent || !windowRefCurrent || !selectorArea || !ds)
      return;

    /**
     * Observe the window DOM node for changes and update the DragSelect
     * selector area dynamically.
     *
     * This is used to observe the window DOM node change in size and positions.
     */
    const mutationObserver = new MutationObserver((entries) => {
      if (!entries[0]) return;

      ds.setSettings({
        area: containerRef.current!,
        draggability: false,
        selectableClass: "selectable",
        selectorClass: "selector",
        selectedClass: "selected",
      });
    });

    if (containerRefCurrent) {
      mutationObserver.observe(windowRefCurrent as Node, {
        attributes: true,
      });
    }

    return () => {
      if (containerRefCurrent) {
        mutationObserver.disconnect();
      }
    };
  }, [ds, containerRef, getId]);

  // Set DragSelect settings when the file explorer view is updated
  React.useEffect(() => {
    if (!containerRef.current || !ds) return;

    ds.setSettings({
      area: containerRef.current,
      draggability: false,
      selectableClass: "selectable",
      selectorClass: "selector",
      selectedClass: "selected",
    });

    ds.subscribe("DS:start", () => setDragging(true));
    ds.subscribe("DS:end", dsEndCallback);

    return () => {
      ds.unsubscribe("DS:end", dsEndCallback);
    };
  }, [containerRef, ds, dsEndCallback, setDragging, viewType]);

  const Dialog = dialog.dialog;

  return (
    <AlertDialog.Root open={dialog.open}>
      <ContextMenuPrimitive.Root onOpenChange={handleContextMenuChange}>
        <ContextMenuPrimitive.Trigger asChild>
          <div className="w-full flex flex-col items-center">
            {viewType === FEViewType.List && <ListViewSort />}
            <div
              id="fe-fs-view"
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
