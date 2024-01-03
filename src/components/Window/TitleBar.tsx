import * as React from "react";
import clsx from "classnames";

import ActionBtn from "./ActionBtn";

const TitleBar: React.FC = () => {
  return (
    <div
      className={clsx(
        "flex items-center justify-between",
        "px-2 py-1",
        "bg-slate-950",
        "border-b border-gray-700",
        "rounded-t-lg",
        "text-slate-100",
      )}
    >
      <div className="flex gap-2">
        <div>icon</div>
        <div>title</div>
      </div>
      <div className="flex items-center gap-2">
        <ActionBtn />
        <ActionBtn />
        <ActionBtn />
      </div>
    </div>
  );
};

export default TitleBar;
