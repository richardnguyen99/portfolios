import * as React from "react";
import clsx from "classnames";
import { twMerge } from "tailwind-merge";

import useFileExplorer from "./hook";
import Tooltip from "@components/Tooltip";
import useWindow from "@components/Window/useWindow";

type Props = {
  children: React.ReactNode[];
  hideTooltipOnClick?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const IconBtn = React.forwardRef<HTMLButtonElement, Props>(
  (
    { children, className, onClick, hideTooltipOnClick = false, ...rest },
    ref,
  ) => {
    if (React.Children.count(children) !== 2) {
      console.log(children);
      throw new Error("IconBtn must have exactly 2 children");
    }

    const { dragging } = useFileExplorer();

    const { getId } = useWindow();

    const windowRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      const elm = document.querySelector(
        `[x-data-window-id="${getId()}"]`,
      ) as HTMLDivElement;

      windowRef.current = elm;
    }, [getId]);

    return (
      <Tooltip
        boundary={windowRef.current ?? undefined}
        hideOnClick={hideTooltipOnClick}
      >
        <button
          ref={ref as React.RefObject<HTMLButtonElement>}
          {...rest}
          onClick={onClick}
          className={twMerge(
            clsx(
              "flex",
              "items-center",
              "justify-center",
              "w-8",
              "h-8",
              "rounded-md",
              "text-slate-900 dark:text-gray-400",
              "bg-[rgba(219,223,229,1)] dark:bg-[rgba(45,55,71,1)]",
              "focus:outline-none",
              "active:bg-gray-300/80 dark:active:bg-gray-700/80",

              {
                "cursor-default": dragging,
                "cursor-not-allowed": rest["aria-disabled"],
                "hover:bg-gray-300 dark:hover:bg-gray-700":
                  !dragging && !rest["aria-disabled"],
                "hover:text-slate-800 dark:hover:text-gray-200":
                  !dragging && !rest["aria-disabled"],
              },
            ),
            className,
          )}
        >
          {children[0]}
        </button>
        {children[1]}
      </Tooltip>
    );
  },
);
IconBtn.displayName = "IconBtn";

export default IconBtn;
