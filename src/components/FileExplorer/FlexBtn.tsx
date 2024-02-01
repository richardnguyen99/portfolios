import * as React from "react";
import clsx from "classnames";

import useFileExplorer from "./hook";

type Props = React.PropsWithChildren & React.HTMLAttributes<HTMLButtonElement>;

const FlexBtn: React.FC<Props> = ({ children, ...rest }) => {
  const { dragging } = useFileExplorer();

  return (
    <button
      {...rest}
      type="button"
      className={clsx(
        "inline-flex items-center justify-center flex-nowrap flex-shrink-0",
        "rounded-md px-2 py-1 gap-2",
        "text-slate-900 dark:text-gray-400",
        "bg-[rgba(219,223,229,1)] dark:bg-[rgba(45,55,71,1)]",
        "focus:outline-none",
        "active:bg-gray-300/80 dark:active:bg-gray-700/80",
        {
          "cursor-default": dragging,
          "hover:bg-gray-300 dark:hover:bg-gray-700": !dragging,
          "hover:text-slate-800 dark:hover:text-gray-200": !dragging,
        },
      )}
    >
      {children}
    </button>
  );
};

export default FlexBtn;
