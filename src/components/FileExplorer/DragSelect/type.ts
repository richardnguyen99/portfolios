import * as React from "react";
import DragSelect from "dragselect";

export type DragSelectProviderProps = {
  children: React.ReactNode;
  settings?: ConstructorParameters<typeof DragSelect>[0];
};
