import * as React from "react";
import clsx from "classnames";

import { FileType, IFile, INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import { Editor, Icon } from "@components";
import useFileExplorer from "./hook";
import useModal from "@contexts/Modal/useModal";
import { ModalProps } from "@contexts/Modal/type";

type Props = {
  node: INode;
};

const GridViewItem: React.FC<Props> = ({ node }) => {
  const { ds } = useDragSelect();
  const { addModal } = useModal();
  const { dispatchHistoryState, setCurrDir } = useFileExplorer();

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

  React.useEffect(() => {
    if (!itemRef.current || !ds) return;

    if (!ds.SelectableSet.has(itemRef.current)) {
      console.log("add selectables");
      ds.addSelectables(itemRef.current);
    }

    ds.subscribe("DS:end", (e) => {
      console.log(e);
    });
  }, [ds]);

  return (
    <div
      ref={itemRef}
      key={node.name}
      onDoubleClick={handleDoubleClick}
      className={clsx(
        "selectable",
        "flex flex-col items-center",
        "rounded-md p-2",
        "hover:bg-gray-300/60 dark:hover:bg-gray-600/40",
        "[&.selected]:bg-sky-300/40 dark:[&.selected]:bg-sky-400/40",
        "[&.selected]:hover:bg-sky-300/60 dark:[&.selected]:hover:bg-sky-400/60",
      )}
      data-node-id={node.id}
    >
      {node.type === 1 ? <Icon.Folder /> : <Icon.PlainText />}
      <span className="line-clamp-2 text-center [overflow-wrap:_anywhere] text-overflow">
        {node.name}
      </span>
    </div>
  );
};

export default GridViewItem;
