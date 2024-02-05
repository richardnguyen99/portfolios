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

export type FEHistory = {
  id: string;
  parentId: string;
  name: string;
};

export type FEHistoryState = {
  index: number;
  history: FEHistory[];
};

export type FEHistoryAction =
  | { type: "push"; payload: FEHistory }
  | { type: "pop" }
  | { type: "previous" }
  | { type: "next" }
  | { type: "manual"; payload: FEHistoryState };

export type FileExplorerContextType = {
  currDir: INode;
  dragging: boolean;
  viewType: FEViewType;
  viewSize: FEViewSize;
  historyState: FEHistoryState;

  setViewSize: React.Dispatch<React.SetStateAction<FEViewSize>>;
  setViewType: React.Dispatch<React.SetStateAction<FEViewType>>;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrDir: React.Dispatch<React.SetStateAction<INode>>;
  dispatchHistoryState: React.Dispatch<FEHistoryAction>;
};

export type FileExplorerProviderProps = {
  children: React.ReactNode;
  initialDirectory: INode;
};
