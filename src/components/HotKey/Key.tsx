import * as React from "react";
import clsx from "classnames";

type KeyProps = {
  children: string;
};

const Key: React.FC<KeyProps> = ({ children }) => {
  return (
    <span
      className={clsx(
        "rounded-md border",
        "px-2 py-1",
        "dark:border-gray-300 dark:bg-gray-800",
        "border-gray-600 bg-slate-100",
      )}
    >
      {children}
    </span>
  );
};

export default Key;
