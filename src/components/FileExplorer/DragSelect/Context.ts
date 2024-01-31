import * as React from "react";
import { DragSelectContextType } from "./type";

const DragSelectContext = React.createContext<DragSelectContextType>(
  {} as DragSelectContextType,
);
DragSelectContext.displayName = "DragSelectContext";

export default DragSelectContext;
