import * as React from "react";
import clsx from "classnames";

const FSContent: React.FC = () => {
  return (
    <div id="fe-fs-content" className={clsx("flex")}>
      <div id="fe-fs-quick-access">
        <h1>Quick access</h1>
      </div>
      <div id="fe-fs">
        <h1>File System</h1>
      </div>
    </div>
  );
};

export default FSContent;
