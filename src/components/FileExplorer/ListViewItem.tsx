import * as React from "react";
import clsx from "classnames";
import { StarFillIcon, StarIcon } from "@primer/octicons-react";

import { FileType, IFile, INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import { Editor, Icon } from "@components";
import useFileExplorer from "./hook";
import useModal from "@contexts/Modal/useModal";
import { ModalProps } from "@contexts/Modal/type";

type Props = {
  node: INode;
};

const ListViewItem: React.FC<Props> = ({ node }) => {
  const { ds } = useDragSelect();
  const { addModal } = useModal();
  const { setCurrDir, dispatchHistoryState } = useFileExplorer();

  const itemRef = React.useRef<HTMLDivElement>(null);
  const [starred, setStarred] = React.useState(false);

  const handleStarClick = React.useCallback(() => {
    setStarred((prev) => !prev);
  }, []);

  const handleDoubleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();

      if (node.type === FileType.File) {
        console.log(node.id);
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
    },
    [dispatchHistoryState, ds, node, setCurrDir],
  );

  React.useEffect(() => {
    if (!itemRef.current || !ds) return;

    if (!ds.SelectableSet.has(itemRef.current)) {
      ds.addSelectables(itemRef.current);
    }

    // ds.subscribe("DS:end", (e) => {});
  }, [ds]);

  return (
    <div
      ref={itemRef}
      key={node.name}
      onDoubleClick={handleDoubleClick}
      className={clsx(
        "selectable",
        "flex items-center",
        "rounded-md",
        "hover:bg-gray-300/60 dark:hover:bg-gray-600/40",
        "[&.selected]:bg-sky-300/40 dark:[&.selected]:bg-sky-400/40",
        "[&.selected]:hover:bg-sky-300/60 dark:[&.selected]:hover:bg-sky-400/60",
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
        {node.type === FileType.File ? "0 bytes" : "0 items"}
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
  );
};

export default ListViewItem;
