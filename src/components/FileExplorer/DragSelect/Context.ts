import * as React from "react";
import DragSelect, { type DSInputElement } from "dragselect";

const DragSelectContext = React.createContext<
  DragSelect<DSInputElement> | undefined
>(undefined);
DragSelectContext.displayName = "DragSelectContext";

export default DragSelectContext;
