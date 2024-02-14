import * as React from "react";

import { INode } from "@util/fs/type";

export enum FESortType {
  NAME_ASC = 0,
  NAME_DESC = 1,
  DATE_ASC = 2,
  DATE_DESC = 3,
  SIZE_ASC = 4,
  SIZE_DESC = 5,
}

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

export type FEDialog = {
  open: boolean;
  dialog: React.FC | null;
  props: object | null;
};

export type FileExplorerContextType = {
  currDir: INode;
  dragging: boolean;
  viewType: FEViewType;
  viewSize: FEViewSize;
  doesShowHidden: boolean;
  historyState: FEHistoryState;
  dialog: FEDialog;

  setViewSize: React.Dispatch<React.SetStateAction<FEViewSize>>;
  setViewType: React.Dispatch<React.SetStateAction<FEViewType>>;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrDir: React.Dispatch<React.SetStateAction<INode>>;
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setDialog: React.Dispatch<React.SetStateAction<FEDialog>>;
  dispatchHistoryState: React.Dispatch<FEHistoryAction>;
};

export type FileExplorerProviderProps = {
  children: React.ReactNode;
  initialDirectory: INode;
};
