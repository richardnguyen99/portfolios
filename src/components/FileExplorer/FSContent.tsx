import * as React from "react";
import clsx from "classnames";

import FSQuickAccess from "./FSQuickAcess";
import FSView from "./FSView";

const FSContent: React.FC = () => {
  return (
    <div
      id="fe-fs-content"
      className={clsx("flex flex-grow", "h-[calc(100%_-_100px)]")}
    >
      <FSQuickAccess />
      <FSView />
    </div>
  );
};

export default FSContent;
