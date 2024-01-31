import * as React from "react";

export enum FEViewType {
  List = 0,
  Grid = 1,
}

export enum FEViewSize {
  Tiny = 0,
  Small = 1,
  Normal = 2,
  Large = 3,
  ExtraLarge = 4,
}

export type FileExplorerContextType = {
  viewType: FEViewType;
  viewSize: FEViewSize;

  setViewSize: React.Dispatch<React.SetStateAction<FEViewSize>>;
  setViewType: React.Dispatch<React.SetStateAction<FEViewType>>;
};

export type FileExplorerProviderProps = {
  children: React.ReactNode;
};
