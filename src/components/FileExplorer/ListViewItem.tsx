import * as React from "react";
import clsx from "classnames";
import { StarFillIcon, StarIcon } from "@primer/octicons-react";

import { FileType, IDirectory, IFile, INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import { Icon } from "@components";
import useFileExplorer from "./hook";
import { FEDirectoryType } from "./type";
import formatBytesSigFig from "@util/formatBytesSigFig";
import ViewItemWrapper from "./ViewItemWrapper";

type Props = {
  node: INode;
};

const ListViewItem: React.FC<Props> = ({ node }) => {
  const { ds } = useDragSelect();
  const { directoryType } = useFileExplorer();

  const [starred, setStarred] = React.useState(false);
  const [nodeSize, setNodeSize] = React.useState("");

  const handleStarClick = React.useCallback(() => {
    setStarred((prev) => !prev);
  }, []);

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
    if (node.type === FileType.Directory) {
      const numChild = (node as IDirectory).children.length;

      setNodeSize(`${numChild} item${numChild > 1 ? "s" : ""}`);
    } else {
      setNodeSize(getNodeSize());
    }
  }, [getNodeSize, node]);

  return (
    <ViewItemWrapper node={node}>
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
    </ViewItemWrapper>
  );
};

export default ListViewItem;
