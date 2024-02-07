import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import { FileType, IFile, INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import { Editor, Icon } from "@components";
import useFileExplorer from "./hook";
import useModal from "@contexts/Modal/useModal";
import { ModalProps } from "@contexts/Modal/type";
import ItemContextMenu from "./ItemContextMenu";

type Props = {
  node: INode;
};

const GridViewItem: React.FC<Props> = ({ node }) => {
  const { ds } = useDragSelect();
  const { addModal } = useModal();
  const { dispatchHistoryState, setCurrDir, setDragging } = useFileExplorer();

  const itemRef = React.useRef<HTMLDivElement>(null);

  const handleDoubleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();

      if (node.type !== FileType.Directory) {
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
        setDragging(false);

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

  React.useEffect(() => {
    if (!itemRef.current || !ds) return;

    const item = itemRef.current;

    if (!ds.SelectableSet.has(itemRef.current)) {
      ds.addSelectables(itemRef.current);
    }

    // ds.subscribe("DS:end", (e) => {});

    return () => {
      ds.removeSelectables(item);
      ds.SelectedSet.clear();
    };
  }, [ds]);

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
          className={clsx("selectable", "group")}
          data-node-id={node.id}
        >
          <div
            className={clsx(
              "flex flex-col items-center",
              "rounded-md p-2 border-2 border-transparent",
              "hover:bg-gray-300/60 dark:hover:bg-gray-600/40",
              "group-[.selected]:bg-sky-300/40 dark:group-[.selected]:bg-sky-400/40",
              "group-[.selected]:hover:bg-sky-300/60 dark:group-[.selected]:hover:bg-sky-400/60",
              '[[data-state="open"]>&]:border-sky-500 dark:[[data-state="open"]>&]:border-sky-400',
              '[[data-state="open"]>&]:bg-sky-300/30 dark:[[data-state="open"]>&]:bg-sky-400/30',
            )}
          >
            {node.type === 1 ? <Icon.Folder /> : <Icon.PlainText />}
            <span className="line-clamp-2 text-center [overflow-wrap:_anywhere] text-overflow">
              {node.name}
            </span>
          </div>
        </div>
      </ContextMenuPrimitive.Trigger>

      <ItemContextMenu node={node} />
    </ContextMenuPrimitive.Root>
  );
};

export default GridViewItem;
