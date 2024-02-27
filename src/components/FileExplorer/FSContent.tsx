import * as React from "react";
import clsx from "classnames";

import FSQuickAccess from "./FSQuickAcess";
import FSView from "./FSView";
import DragSelect from "./DragSelect";

const FSContent: React.FC = () => {
  return (
    <div
      id="fe-fs-content"
      className={clsx("flex flex-grow", "h-[calc(100%_-_100px)]")}
    >
      <FSQuickAccess />
      <DragSelect.Provider initialSettings={{ selectedClass: "selector" }}>
        <FSView />
      </DragSelect.Provider>
    </div>
  );
};

export default FSContent;
