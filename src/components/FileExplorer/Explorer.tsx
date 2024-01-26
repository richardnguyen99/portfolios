import * as React from "react";

import AddressBar from "./AddressBar";
import MenuBar from "./MenuBar";
import FSContent from "./FSContent";

const InternalFileExplorer: React.FC = () => {
  return (
    <div id="file-explorer">
      <AddressBar />
      <MenuBar />
      <FSContent />
    </div>
  );
};

export default InternalFileExplorer;
