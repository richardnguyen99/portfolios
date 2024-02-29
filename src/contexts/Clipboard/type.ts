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
  srcDir: INode | null;
};

export type ClipboardReducerAction = {
  type: ClipBoardAction;
  payload: {
    nodes: INode[];
    srcDir?: INode;
  };
};

export type ClipboardContextType = {
  nodes: ClipboardNode[];

  copy: (...nodes: INode[]) => void;
  cut: (...nodes: INode[]) => void;
  paste: (destDir: IDirectory) => void;
};

export type ClipboardProviderProps = {
  children: React.ReactNode;
};
