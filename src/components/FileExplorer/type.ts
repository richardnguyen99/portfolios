import * as React from "react";

import { INode } from "@util/fs/type";
import List from "@util/list";

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

export type FEHistory = {
  id: string;
  parentId: string;
  name: string;
};

export type FileExplorerContextType = {
  currDir: INode;
  dragging: boolean;
  viewType: FEViewType;
  viewSize: FEViewSize;
  history: List<FEHistory> | undefined;

  setViewSize: React.Dispatch<React.SetStateAction<FEViewSize>>;
  setViewType: React.Dispatch<React.SetStateAction<FEViewType>>;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrDir: React.Dispatch<React.SetStateAction<INode>>;
};

export type FileExplorerProviderProps = {
  children: React.ReactNode;
  initialDirectory: INode;
};
