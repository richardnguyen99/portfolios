import * as React from "react";
import clsx from "classnames";
import { ChevronDownIcon, ChevronUpIcon } from "@primer/octicons-react";
import useFileExplorer from "./hook";

type Props = {
  type: "asc" | "desc" | "unset";
  position: number;
};

const ListViewSortAction: React.FC<
  React.PropsWithChildren<Props> & React.HTMLAttributes<HTMLButtonElement>
> = ({ children, type, position, ...rest }) => {
  const { dragging } = useFileExplorer();

  return (
    <button
      {...rest}
      type="button"
      className={clsx(
        "flex items-center gap-2",
        "px-2 py-1",
        "text-left last:text-center",
        {
          "cursor-default": dragging,
          "hover:bg-gray-300/60 dark:hover:bg-gray-600/40": !dragging,
          "flex-grow flex-shrink basis-20 min-w-32": position === 1,
          "flex-grow-0 flex-shrink-0 basis-20": position !== 1,
          "basis-44": position === 3,
          "justify-center": position === 4,
        },
      )}
    >
      {children}
      {type === "unset" ? null : type === "asc" ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      )}
    </button>
  );
};

export default ListViewSortAction;
