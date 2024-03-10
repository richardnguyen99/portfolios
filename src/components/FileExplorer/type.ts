import * as React from "react";
import { DSInputElement } from "dragselect";

import { IDirectory, INode } from "@util/fs/type";

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

export enum FEDirectoryType {
  File = 0,
  Recent = 1,
  Starred = 2,
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

export type FEContextMenuState = {
  open: boolean;
  storedNodes: DSInputElement[] | HTMLElement[];
};

export type FEContextMenuAction =
  | {
      type: "open";
      payload: {
        nodes: DSInputElement[] | HTMLElement[];
      };
    }
  | { type: "close" };

export type FETabState = {
  currDir: INode;
  selectedNodes: INode[];
  dragging: boolean;
  viewType: FEViewType;
  viewSize: FEViewSize;
  showHidden: boolean;
  directoryType: FEDirectoryType;
  sortType: FESortType;
  historyState: FEHistoryState;
  contextMenuState: FEContextMenuState;
};

export type FETabReducerState = {
  currentTabIdx: number;
  tabs: FETabState[];
};

export enum FETabReducerActionType {
  SET_CURR_DIR,
  SET_SELECTED_NODES,
  SET_DRAGGING,
  SET_VIEW_TYPE,
  SET_VIEW_SIZE,
  SET_SHOW_HIDDEN,
  SET_DIRECTORY_TYPE,
  SET_SORT_TYPE,
  UPDATE_HISTORY_STATE,
  UPDATE_CONTEXT_MENU_STATE,
  UPDATE_TABS_HOME,
  UPDATE_BACKWARD_FILE,
  UPDATE_BACKWARD_RECENT,
  UPDATE_FORWARD_FILE,
  UPDATE_FORWARD_RECENT,
}

export type FETabReducerSetCurrDirAction = {
  type: FETabReducerActionType.SET_CURR_DIR;
  payload: {
    tab: number;
    currDir: INode;
    historyAction?: FEHistoryAction;
  };
};

export type FETabReducerSetSelectedNodesAction = {
  type: FETabReducerActionType.SET_SELECTED_NODES;
  payload: {
    tab: number;
    selectedNodes: INode[];
  };
};

export type FETabReducerSetDraggingAction = {
  type: FETabReducerActionType.SET_DRAGGING;
  payload: {
    tab: number;
    dragging: boolean;
  };
};

export type FETabReducerSetViewTypeAction = {
  type: FETabReducerActionType.SET_VIEW_TYPE;
  payload: {
    tab: number;
    viewType: FEViewType;
  };
};

export type FETabReducerSetViewSizeAction = {
  type: FETabReducerActionType.SET_VIEW_SIZE;
  payload: {
    tab: number;
    viewSize: FEViewSize;
  };
};

export type FETabReducerSetShowHiddenAction = {
  type: FETabReducerActionType.SET_SHOW_HIDDEN;
  payload: {
    tab: number;
    showHidden: boolean;
  };
};

export type FETabReducerSetDirectoryTypeAction = {
  type: FETabReducerActionType.SET_DIRECTORY_TYPE;
  payload: {
    tab: number;
    directoryType: FEDirectoryType;
  };
};

export type FETabReducerSetSortTypeAction = {
  type: FETabReducerActionType.SET_SORT_TYPE;
  payload: {
    tab: number;
    sortType: FESortType;
  };
};

export type FETabReducerUpdateHistoryStateAction = {
  type: FETabReducerActionType.UPDATE_HISTORY_STATE;
  payload: {
    tab: number;
    action: FEHistoryAction;
  };
};

export type FETabReducerUpdateContextMenuStateAction = {
  type: FETabReducerActionType.UPDATE_CONTEXT_MENU_STATE;
  payload: {
    tab: number;
    action: FEContextMenuAction;
  };
};

export type FETabReducerUpdateHomeAction = {
  type: FETabReducerActionType.UPDATE_TABS_HOME;
  payload: {
    newHome: IDirectory;
  };
};

export type FETabReducerUpdateBackwardFileAction = {
  type: FETabReducerActionType.UPDATE_BACKWARD_FILE;
  payload: {
    tab: number;
    newDir: IDirectory;
  };
};

export type FETabReducerUpdateForwardFileAction = {
  type: FETabReducerActionType.UPDATE_FORWARD_FILE;
  payload: {
    tab: number;
    newDir: IDirectory;
  };
};

export type FETabReducerUpdateBackwardRecentAction = {
  type: FETabReducerActionType.UPDATE_BACKWARD_RECENT;
  payload: {
    tab: number;
    newDir: IDirectory;
  };
};

export type FETabReducerUpdateForwardRecentAction = {
  type: FETabReducerActionType.UPDATE_FORWARD_RECENT;
  payload: {
    tab: number;
    newDir: IDirectory;
  };
};

export type FETabReducerAction =
  | FETabReducerSetCurrDirAction
  | FETabReducerSetSelectedNodesAction
  | FETabReducerSetDraggingAction
  | FETabReducerSetViewTypeAction
  | FETabReducerSetViewSizeAction
  | FETabReducerSetShowHiddenAction
  | FETabReducerSetDirectoryTypeAction
  | FETabReducerSetSortTypeAction
  | FETabReducerUpdateHistoryStateAction
  | FETabReducerUpdateContextMenuStateAction
  | FETabReducerUpdateBackwardFileAction
  | FETabReducerUpdateForwardFileAction
  | FETabReducerUpdateBackwardRecentAction
  | FETabReducerUpdateForwardRecentAction
  | FETabReducerUpdateHomeAction;

export type FileExplorerContextType = {
  dialog: FEDialog;
  tabState: FETabReducerState;
  currentTab: FETabState;

  setDialog: React.Dispatch<React.SetStateAction<FEDialog>>;
  dispatchTabState: React.Dispatch<FETabReducerAction>;
};

export type FileExplorerProviderProps = {
  children: React.ReactNode;
  initialDirectory: INode;
};
