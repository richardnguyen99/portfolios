import * as React from "react";
import clsx from "classnames";

const FSQuickAccess: React.FC = () => {
  return (
    <div
      id="fe-fs-quick-access"
      className={clsx(
        "flex-grow-0 flex-shrink-0 basis-48 p-3",
        "flex flex-col",
        "bg-gray-100/40 dark:bg-gray-700/60",
        "h-full overflow-y-scroll overflow-x-hidden",
        "select-none",
      )}
    >
      <h1 className="text-lg font-extrabold">Quick Access</h1>
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold">Recent</h2>
          <h2 className="text-base font-bold">Starred</h2>
          <h2 className="text-base font-bold">Home</h2>
          <div className="flex flex-col gap-1 ml-3">
            <h3 className="text-sm">Documents</h3>
            <h3 className="text-sm">Downloads</h3>
            <h3 className="text-sm">Music</h3>
            <h3 className="text-sm">Pictures</h3>
            <h3 className="text-sm">Videos</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FSQuickAccess;
