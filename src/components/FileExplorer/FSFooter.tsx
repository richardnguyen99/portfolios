import * as React from "react";
import clsx from "classnames";

const FSFooter: React.FC = () => {
  return (
    <div className="flex fixed bottom-0 right-0">
      <div
        className={clsx(
          "relative ml-auto",
          "p-1 rounded-tl-lg text-xs",
          "border-t border-l",
          "border-gray-400/45 dark:border-gray-600",
          "bg-gray-300/45 dark:bg-gray-700",
        )}
      >
        Hello, World
      </div>
    </div>
  );
};

export default FSFooter;
