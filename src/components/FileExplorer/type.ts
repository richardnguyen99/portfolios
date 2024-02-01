import * as React from "react";

import { INode } from "@util/fs/type";

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
  currDir: INode;
  dragging: boolean;
  viewType: FEViewType;
  viewSize: FEViewSize;

  setViewSize: React.Dispatch<React.SetStateAction<FEViewSize>>;
  setViewType: React.Dispatch<React.SetStateAction<FEViewType>>;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FileExplorerProviderProps = {
  children: React.ReactNode;
  initialDirectory: INode;
};
