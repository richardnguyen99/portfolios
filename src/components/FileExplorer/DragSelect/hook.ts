import * as React from "react";

import DragSelectContext from "./Context";

const useDragSelect = () => {
  const dsContext = React.useContext(DragSelectContext);

  return dsContext;
};

export default useDragSelect;
