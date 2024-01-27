import * as React from "react";
import clsx from "classnames";

type Props = React.PropsWithChildren & React.HTMLAttributes<HTMLButtonElement>;

const IconBtn: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <button
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
        "bg-gray-300/45 dark:bg-gray-700/45",
        "hover:bg-gray-300/100 dark:hover:bg-gray-700/100",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-offset-2",
        "focus:ring-gray-500",
        "transition-colors",
        "duration-200",
        "ease-in-out",
      )}
    >
      {children}
    </button>
  );
};

export default IconBtn;
