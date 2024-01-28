import * as React from "react";
import clsx from "classnames";

import AddressBar from "./AddressBar";
import MenuBar from "./MenuBar";
import FSContent from "./FSContent";

const InternalFileExplorer: React.FC = () => {
  return (
    <div
      id="file-explorer"
      className={clsx("flex flex-col", "font-sans h-full")}
    >
      <AddressBar />
      <MenuBar />
      <FSContent />
    </div>
  );
};

export default InternalFileExplorer;
