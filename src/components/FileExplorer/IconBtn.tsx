import * as React from "react";
import clsx from "classnames";

type Props = React.PropsWithChildren & React.HTMLAttributes<HTMLButtonElement>;

const IconBtn = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, ...rest }, ref) => {
    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        {...rest}
        className={clsx(
          "flex",
          "items-center",
          "justify-center",
          "w-8",
          "h-8",
          "rounded-md",
          "text-slate-900 dark:text-gray-400",
          "hover:text-slate-800 dark:hover:text-gray-200",
          "bg-[rgba(219,223,229,1)] dark:bg-[rgba(45,55,71,1)]",
          "hover:bg-gray-300 dark:hover:bg-gray-700",
          "focus:outline-none",
          "active:bg-gray-300/80 dark:active:bg-gray-700/80",
        )}
      >
        {children}
      </button>
    );
  },
);
IconBtn.displayName = "IconBtn";

export default IconBtn;
