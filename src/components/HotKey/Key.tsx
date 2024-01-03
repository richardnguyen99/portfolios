import * as React from "react";
import clsx from "classnames";

type KeyProps = {
  children: string;
};

const Key: React.FC<KeyProps> = ({ children }) => {
  return (
    <span
      className={clsx(
        "rounded-md border border-gray-300 bg-gray-800 px-2 py-1",
      )}
    >
      {children}
    </span>
  );
};

export default Key;
