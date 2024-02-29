import * as React from "react";

import { IDirectory, IFile, INode } from "@util/fs/type";

export enum ClipBoardAction {
  COPY,
  CUT,
  PASTE,
}

export type ClipboardNode = INode & {
  action: ClipBoardAction.COPY | ClipBoardAction.CUT;
};

export type ClipboardFile = IFile & {
  action: ClipBoardAction.COPY | ClipBoardAction.CUT;
};

export type ClipboardDirectory = IDirectory & {
  action: ClipBoardAction.COPY | ClipBoardAction.CUT;
};

export type ClipboardReducerState = {
  nodes: ClipboardNode[];
};

export type ClipboardReducerAction = {
  type: ClipBoardAction;
  payload: INode[];
};

export type ClipboardContextType = {
  nodes: ClipboardNode[];

  copy: (...nodes: INode[]) => void;
  cut: (...nodes: INode[]) => void;
  paste: (parent: INode) => void;
};

export type ClipboardProviderProps = {
  children: React.ReactNode;
};
