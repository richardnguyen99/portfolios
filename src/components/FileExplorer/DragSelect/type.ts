import * as React from "react";
import DragSelect, { DSInputElement, Settings } from "dragselect";

export type DSSettings = Settings<DSInputElement>;

export type DragSelectContextType = {
  ds: DragSelect<DSInputElement> | undefined;
};

export type DragSelectProviderProps = {
  children: React.ReactNode;
  initialSettings?: DSSettings;
};
