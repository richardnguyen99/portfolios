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
import ItemContextMenu from "./ItemContextMenu";

const Editor = React.lazy(() => import("@components/Editor"));

type Props = {
  node: INode;
};

const ListViewItem: React.FC<Props> = ({ node }) => {
  const { ds } = useDragSelect();
  const { addModal } = useModal();
  const { setCurrDir, dispatchHistoryState, setDragging } = useFileExplorer();

  const itemRef = React.useRef<HTMLDivElement>(null);
  const [starred, setStarred] = React.useState(false);
  const [nodeSize, setNodeSize] = React.useState("");

  const handleStarClick = React.useCallback(() => {
    setStarred((prev) => !prev);
  }, []);

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
        addModal(editorModal);

        return;
      }

      dispatchHistoryState({
        type: "push",
        payload: {
          id: node.id,
          name: node.name,
          parentId: node.parent?.id ?? "",
        },
      });

      setCurrDir(node);
      ds?.SelectedSet.clear();
      setDragging(false);
    },
    [
      addModal,
      dispatchHistoryState,
      ds?.SelectedSet,
      node,
      setCurrDir,
      setDragging,
    ],
  );

  const getNodeSize = React.useCallback(() => {
    if (node.type === FileType.Directory) {
      return "";
    }

    const size = (node as IFile).size;

    return `${size} B`;
  }, [node]);

  const itemStorageListener = React.useCallback(
    (e: StorageEvent) => {
      if (e.key === `file-${node.id}`) {
        setNodeSize(getNodeSize());
      }
    },
    [getNodeSize, node],
  );

  React.useEffect(() => {
    console.log("ListViewItem mounted");
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

    window.addEventListener("storage", itemStorageListener);

    // ds.subscribe("DS:end", (e) => {});
    return () => {
      ds.removeSelectables(item);
      ds.SelectedSet.clear();

      window.removeEventListener("storage", itemStorageListener);
    };
  }, [ds, getNodeSize, itemStorageListener, node, nodeSize]);

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger
        asChild
        onContextMenuCapture={() => {
          if (!ds) return;

          ds.SelectedSet.clear();
        }}
      >
        <div
          ref={itemRef}
          key={node.name}
          onDoubleClick={handleDoubleClick}
          className={clsx(
            "selectable",
            "flex items-center border border-transparent",
            "rounded-md",
            "hover:bg-gray-300/60 dark:hover:bg-gray-600/40",
            "[&.selected]:bg-sky-300/40 dark:[&.selected]:bg-sky-400/40",
            "[&.selected]:hover:bg-sky-300/60 dark:[&.selected]:hover:bg-sky-400/60",
            '[&[data-state="open"]]:border-sky-500 dark:[&[data-state="open"]]:border-sky-400',
            '[&[data-state="open"]]:bg-sky-300/30 dark:[&[data-state="open"]]:bg-sky-400/30',
          )}
          data-node-id={node.id}
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
            {new Date(node.lastModified).toLocaleString()}
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
      </ContextMenuPrimitive.Trigger>
      <ItemContextMenu node={node} />
    </ContextMenuPrimitive.Root>
  );
};

export default ListViewItem;
