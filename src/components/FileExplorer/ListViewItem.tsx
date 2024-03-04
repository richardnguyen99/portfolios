import * as React from "react";
import clsx from "classnames";
import { StarFillIcon, StarIcon } from "@primer/octicons-react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import { FileType, IDirectory, IFile, INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import { Icon } from "@components";
import useFileExplorer from "./hook";
import useModal from "@contexts/Modal/useModal";
import { ModalProps } from "@contexts/Modal/type";
import ItemContextMenu from "./ContextMenu/ItemContextMenu";
import useSystemCall from "@contexts/SystemCall/useSystemCall";
import useRecentFiles from "@contexts/RecentFiles/hook";
import { FEDirectoryType } from "./type";
import formatBytesSigFig from "@util/formatBytesSigFig";

const Editor = React.lazy(() => import("@components/Editor"));

type Props = {
  node: INode;
};

const ListViewItem: React.FC<Props> = ({ node }) => {
  const { ds } = useDragSelect();
  const { addModal } = useModal();
  const {
    directoryType,
    contextMenuState,
    setCurrDir,
    dispatchHistoryState,
    setDragging,
    dispatchContextMenuState,
  } = useFileExplorer();
  const { updateDirectory, updateFile } = useSystemCall();
  const { addRecentFile } = useRecentFiles();

  const itemRef = React.useRef<HTMLDivElement>(null);
  const [starred, setStarred] = React.useState(false);
  const [nodeSize, setNodeSize] = React.useState("");

  const handleStarClick = React.useCallback(() => {
    setStarred((prev) => !prev);
  }, []);

  /**
   * Handler when ListItem is right-clicked.
   *
   * This handler is used to handle selecting items when the item context menu
   * is opened.
   * - If the right-clicked item is not in the selected item set, it will clear
   *   the set and add itself to the set.
   * - If the right-clicked item is in the selected item set already, the
   *   selected item set will remain the same.
   *
   * @param {React.MouseEvent<HTMLSpanElement, MouseEvent>} _e - The event object.
   */
  const handleContextMenuCapture = React.useCallback(
    (_e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (!ds) return;

      const nodeElement = document.querySelector(`[data-node-id="${node.id}"]`);

      if (!nodeElement) return;

      if (!ds.SelectedSet.has(nodeElement as HTMLDivElement)) {
        ds.SelectedSet.clear();
        ds.SelectedSet.add(nodeElement as HTMLDivElement);
      }
    },
    [ds, node.id],
  );

  /**
   * Handler when ListItem is double-clicked.
   *
   * This handler is used to either open the file or change the directory.
   * - If a node is a file, it will be opened in the editor.
   * - If a node is a directory, it will change the current directory to
   *   the selected directory.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e - The event object.
   */
  const handleDoubleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();

      if (node.type === FileType.File) {
        const editorModal: ModalProps = {
          id: node.id,
          title: node.name,
          active: true,
          isFullScreen: false,
          isFullScreenAllowed: true,
          type: "editor",
          file: node as IFile,
          component: Editor,

          componentProps: {
            file: node as IFile,
            initialText: (node as IFile).content,
            readOnly: node.writePermission === false,
          },
        };

        ds?.SelectedSet.clear();
        setDragging(false);
        addModal(editorModal);
        updateFile(node as IFile, { lastAccessed: new Date() });
        addRecentFile(node as IFile);

        return;
      }

      // Update the history state.
      dispatchHistoryState({
        type: "push",
        payload: {
          id: node.id,
          name: node.name,
          parentId: node.parent?.id ?? "",
        },
      });

      ds?.SelectedSet.clear();
      setDragging(false);
      updateDirectory(node as IDirectory, { lastAccessed: new Date() });

      // Update the current directory.
      setCurrDir(node);
    },
    [
      node,
      dispatchHistoryState,
      setCurrDir,
      ds?.SelectedSet,
      setDragging,
      updateDirectory,
      addModal,
      updateFile,
      addRecentFile,
    ],
  );

  /**
   * Handler for Item Context Menu open change.
   *
   * The main reason for this handler is to handle overlapping context menu
   * and drag select. When an option is selected from the context menu, drag
   * select will pick up the event and select the item under the cursor. This
   * handler will clear all selectable items when context menu is open.
   *
   * @param {boolean} open - Whether the context menu is open or not.
   */
  const handleContextMenuChange = React.useCallback(
    (open: boolean) => {
      if (!ds) return;

      if (open) {
        // context menu is open
        dispatchContextMenuState({
          type: "open",
          payload: {
            nodes: Array.from(ds.SelectableSet),
          },
        });

        ds.SelectableSet.clear();
      } else {
        // context menu is closed
        dispatchContextMenuState({ type: "close" });

        for (const node of contextMenuState.storedNodes) {
          ds.addSelectables(node);
        }
      }
    },
    [contextMenuState.storedNodes, dispatchContextMenuState, ds],
  );

  /**
   * Get the size representation of the node.
   *
   * If the node is a file, the file size will be returned. If the node is
   * a directory, the number of items in the directory will be returned.
   */
  const getNodeSize = React.useCallback(() => {
    if (node.type === FileType.Directory) {
      return "";
    }

    const size = (node as IFile).size;

    const [num, unit] = formatBytesSigFig(size, 3);

    return `${num} ${unit}`;
  }, [node]);

  React.useEffect(() => {
    if (!itemRef.current || !ds) return;

    const item = itemRef.current;

    if (!ds.SelectableSet.has(itemRef.current)) {
      ds.addSelectables(itemRef.current);
    }

    if (node.type === FileType.Directory) {
      const numChild = (node as IDirectory).children.length;

      setNodeSize(`${numChild} item${numChild > 1 ? "s" : ""}`);
    } else {
      setNodeSize(getNodeSize());
    }

    return () => {
      ds.removeSelectables(item);
      ds.SelectedSet.clear();
    };
  }, [ds, getNodeSize, node, nodeSize]);

  return (
    <ContextMenuPrimitive.Root onOpenChange={handleContextMenuChange}>
      <ContextMenuPrimitive.Trigger
        asChild
        onContextMenuCapture={handleContextMenuCapture}
      >
        <div
          ref={itemRef}
          key={node.name}
          onDoubleClick={handleDoubleClick}
          className={clsx("selectable", "group")}
          data-node-id={node.id}
        >
          <div
            className={clsx(
              "flex items-center border border-transparent",
              "rounded-md",
              "cursor-default select-none",
              "hover:bg-gray-300/60 dark:hover:bg-gray-600/40",
              "group-[.selected]:bg-sky-300/40 dark:group-[.selected]:bg-sky-400/40",
              "group-[.selected]:hover:bg-sky-300/60 dark:group-[.selected]:hover:bg-sky-400/60",
              {
                // These classes are for context menu when only one item is
                // selected.
                '[&[data-state="open"]]:border-sky-500 dark:[&[data-state="open"]]:border-sky-400':
                  ds?.SelectedSet.size === 1,
                '[&[data-state="open"]]:bg-sky-300/30 dark:[&[data-state="open"]]:bg-sky-400/30':
                  ds?.SelectedSet.size === 1,
              },
            )}
          >
            <div
              className={clsx(
                "flex-grow flex-shrink basis-20 min-w-32",
                "flex items-center gap-2",
                "overflow-hidden",
                "px-2 py-1",
              )}
            >
              {node.type === 1 ? (
                <Icon.Folder className="w-8 h-8 flex-grow-0 flex-shrink-0" />
              ) : (
                <Icon.PlainText className="w-8 h-8 flex-grow-0 flex-shrink-0" />
              )}
              <span className="flex-grow flex-shrink basis-auto text-ellipsis overflow-hidden whitespace-nowrap">
                {node.name}
              </span>
            </div>
            <div className="flex-grow-0 flex-shrink-0 basis-20 px-2 py-1">
              {nodeSize}
            </div>
            <div className="flex-grow-0 flex-shrink-0 basis-44 px-2 py-1">
              {new Date(
                directoryType === FEDirectoryType.Recent
                  ? node.lastAccessed
                  : node.lastModified,
              ).toLocaleString()}
            </div>
            <div
              className={clsx(
                "flex-grow-0 flex-shrink-0 basis-20",
                "flex flex-col items-center",
                "px-2 py-1",
              )}
            >
              <div
                onClick={handleStarClick}
                className={clsx(
                  "p-1 rounded-md",
                  "hover:bg-gray-400/25 dark:hover:bg-gray-500/45",
                  "[.selected_&]:hover:bg-sky-300/40 dark:[.selected_&]:hover:bg-sky-400/40",
                )}
              >
                {starred ? (
                  <StarFillIcon className="fill-amber-500 dark:fill-yellow-500" />
                ) : (
                  <StarIcon />
                )}
              </div>
            </div>
          </div>
        </div>
      </ContextMenuPrimitive.Trigger>
      <ItemContextMenu node={node} />
    </ContextMenuPrimitive.Root>
  );
};

export default ListViewItem;
