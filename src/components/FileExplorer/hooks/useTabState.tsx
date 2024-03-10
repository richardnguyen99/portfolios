import * as React from "react";

import { FileType, IDirectory, INode } from "@util/fs/type";
import {
  FEContextMenuAction,
  FEContextMenuState,
  FEDirectoryType,
  FEHistory,
  FEHistoryAction,
  FEHistoryState,
  FESortType,
  FETabReducerAction,
  FETabReducerActionType,
  FETabReducerSetCurrDirAction,
  FETabReducerSetDirectoryTypeAction,
  FETabReducerSetDraggingAction,
  FETabReducerSetSelectedNodesAction,
  FETabReducerSetShowHiddenAction,
  FETabReducerSetSortTypeAction,
  FETabReducerSetViewSizeAction,
  FETabReducerSetViewTypeAction,
  FETabReducerState,
  FETabReducerUpdateBackwardFileAction,
  FETabReducerUpdateContextMenuStateAction,
  FETabReducerUpdateHistoryStateAction,
  FETabReducerUpdateHomeAction,
  FEViewSize,
  FEViewType,
} from "../type";

const getInitialTabState = (initialDirectory: INode): FETabReducerState => {
  return {
    currentTabIdx: 0,
    tabs: [
      {
        currDir: initialDirectory,
        selectedNodes: [],
        dragging: false,
        showHidden: false,
        viewType: FEViewType.List,
        viewSize: FEViewSize.Normal,
        directoryType: FEDirectoryType.File,
        sortType: FESortType.NAME_ASC,
        historyState: {
          index: 0,
          history: [
            {
              id: initialDirectory.id,
              name: initialDirectory.name,
              parentId: initialDirectory.parent?.id ?? "",
            },
          ] as FEHistory[],
        },
        contextMenuState: {
          open: false,
          storedNodes: [],
        },
      },
    ],
  };
};

const updateCurrDirState = (
  state: FETabReducerState,
  payload: FETabReducerSetCurrDirAction["payload"],
): FETabReducerState => {
  const { tab, currDir, historyAction } = payload;

  let historyState = state.tabs[tab].historyState;
  if (historyAction) {
    historyState = _getUpdatedHistoryState(historyState, historyAction);
  }

  return {
    ...state,
    tabs: state.tabs.map((t, i) =>
      i === tab ? { ...t, currDir, historyState } : t,
    ),
  };
};

const updateSelectedNodesState = (
  state: FETabReducerState,
  payload: FETabReducerSetSelectedNodesAction["payload"],
): FETabReducerState => {
  const { tab, selectedNodes } = payload;

  return {
    ...state,
    tabs: state.tabs.map((t, i) => (i === tab ? { ...t, selectedNodes } : t)),
  };
};

const updateDraggingState = (
  state: FETabReducerState,
  payload: FETabReducerSetDraggingAction["payload"],
): FETabReducerState => {
  const { tab, dragging } = payload;

  return {
    ...state,
    tabs: state.tabs.map((t, i) => (i === tab ? { ...t, dragging } : t)),
  };
};

const updateViewTypeState = (
  state: FETabReducerState,
  payload: FETabReducerSetViewTypeAction["payload"],
): FETabReducerState => {
  const { tab, viewType } = payload;

  return {
    ...state,
    tabs: state.tabs.map((t, i) => (i === tab ? { ...t, viewType } : t)),
  };
};

const updateViewSizeState = (
  state: FETabReducerState,
  payload: FETabReducerSetViewSizeAction["payload"],
): FETabReducerState => {
  const { tab, viewSize } = payload;

  return {
    ...state,
    tabs: state.tabs.map((t, i) => (i === tab ? { ...t, viewSize } : t)),
  };
};

const updateShowHiddenState = (
  state: FETabReducerState,
  payload: FETabReducerSetShowHiddenAction["payload"],
): FETabReducerState => {
  const { tab, showHidden } = payload;

  return {
    ...state,
    tabs: state.tabs.map((t, i) => (i === tab ? { ...t, showHidden } : t)),
  };
};

const updateSortTypeState = (
  state: FETabReducerState,
  payload: FETabReducerSetSortTypeAction["payload"],
): FETabReducerState => {
  const { tab, sortType } = payload;

  return {
    ...state,
    tabs: state.tabs.map((t, i) => (i === tab ? { ...t, sortType } : t)),
  };
};

const updateDirectoryTypeState = (
  state: FETabReducerState,
  payload: FETabReducerSetDirectoryTypeAction["payload"],
): FETabReducerState => {
  const { tab, directoryType } = payload;
  let newSortType = state.tabs[tab].sortType;
  const currDirType = state.tabs[tab].directoryType;

  if (directoryType !== currDirType && currDirType === FEDirectoryType.File) {
    newSortType = FESortType.NAME_ASC;
  }

  if (directoryType !== currDirType && currDirType === FEDirectoryType.Recent) {
    newSortType = FESortType.DATE_DESC;
  }

  return {
    ...state,
    tabs: state.tabs.map((t, i) =>
      i === tab ? { ...t, directoryType, sortType: newSortType } : t,
    ),
  };
};
const _getUpdatedContextMenuState = (
  state: FEContextMenuState,
  action: FEContextMenuAction,
) => {
  switch (action.type) {
    case "open":
      return { open: true, storedNodes: action.payload.nodes };
    case "close":
      return { open: false, storedNodes: [] };
    default:
      return state;
  }
};

const updateContextMenuState = (
  state: FETabReducerState,
  payload: FETabReducerUpdateContextMenuStateAction["payload"],
): FETabReducerState => {
  const { tab, action } = payload;
  const currentContextMenuState = state.tabs[tab].contextMenuState;

  const newContextMenuState = _getUpdatedContextMenuState(
    currentContextMenuState,
    action,
  );

  return {
    ...state,
    tabs: state.tabs.map((t, i) =>
      i === tab ? { ...t, contextMenuState: newContextMenuState } : t,
    ),
  };
};

const _getUpdatedHistoryState = (
  state: FEHistoryState,
  action: FEHistoryAction,
) => {
  switch (action.type) {
    case "push":
      return {
        index: state.index + 1,
        history: [...state.history.slice(0, state.index + 1), action.payload],
      };
    case "pop":
      return {
        index: state.index - 1,
        history: state.history.slice(0, state.index),
      };
    case "previous":
      return {
        index: state.index - 1,
        history: state.history,
      };
    case "next":
      return {
        index: state.index + 1,
        history: state.history,
      };
    case "manual":
      return {
        index: action.payload.index,
        history: [...action.payload.history],
      };
    default:
      return state;
  }
};

const updateHistoryState = (
  state: FETabReducerState,
  payload: FETabReducerUpdateHistoryStateAction["payload"],
) => {
  const { tab, action } = payload;
  const currentHistoryState = state.tabs[tab].historyState;

  const newHistoryState = _getUpdatedHistoryState(currentHistoryState, action);

  return {
    ...state,
    tabs: state.tabs.map((t, i) =>
      i === tab ? { ...t, historyState: newHistoryState } : t,
    ),
  };
};

const _getUpdatedNode = (startDir: IDirectory, searchDir: IDirectory) => {
  const stack = [startDir];
  const visited = new Set<IDirectory>();
  let foundNode: IDirectory | null = null;

  while (stack.length > 0) {
    const node = stack.pop() as IDirectory;

    if (node.id === searchDir.id) {
      foundNode = node;
      break;
    }

    if (visited.has(node)) {
      continue;
    }

    visited.add(node);

    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];

      if (child.type === FileType.Directory) {
        stack.push(child as IDirectory);
      }
    }
  }

  return foundNode;
};

const updateHomeState = (
  state: FETabReducerState,
  payload: FETabReducerUpdateHomeAction["payload"],
) => {
  const { newHome } = payload;

  return {
    ...state,
    tabs: state.tabs.map((t) => {
      const newCurrDir = _getUpdatedNode(newHome, t.currDir as IDirectory);

      return newCurrDir ? { ...t, currDir: newCurrDir } : t;
    }),
  };
};

const updateBackwardFileState = (
  state: FETabReducerState,
  payload: FETabReducerUpdateBackwardFileAction["payload"],
) => {
  const { tab, newDir } = payload;
  const newHistoryState = _getUpdatedHistoryState(
    state.tabs[tab].historyState,
    {
      type: "previous",
    },
  );

  return {
    ...state,
    tabs: state.tabs.map((t, i) =>
      i === tab ? { ...t, currDir: newDir, historyState: newHistoryState } : t,
    ),
  };
};

const updateBackwardRecentState = (
  state: FETabReducerState,
  payload: FETabReducerUpdateBackwardFileAction["payload"],
) => {
  const { tab, newDir } = payload;
  const newHistoryState = _getUpdatedHistoryState(
    state.tabs[tab].historyState,
    {
      type: "previous",
    },
  );

  return {
    ...state,
    tabs: state.tabs.map((t, i) =>
      i === tab ? { ...t, currDir: newDir, historyState: newHistoryState } : t,
    ),
  };
};

const updateForwardFileState = (
  state: FETabReducerState,
  payload: FETabReducerUpdateBackwardFileAction["payload"],
) => {
  const { tab, newDir } = payload;
  const newHistoryState = _getUpdatedHistoryState(
    state.tabs[tab].historyState,
    {
      type: "next",
    },
  );

  return {
    ...state,
    tabs: state.tabs.map((t, i) =>
      i === tab ? { ...t, currDir: newDir, historyState: newHistoryState } : t,
    ),
  };
};

const updateForwardRecentState = (
  state: FETabReducerState,
  payload: FETabReducerUpdateBackwardFileAction["payload"],
) => {
  const { tab, newDir } = payload;
  const newHistoryState = _getUpdatedHistoryState(
    state.tabs[tab].historyState,
    {
      type: "previous",
    },
  );

  return {
    ...state,
    tabs: state.tabs.map((t, i) =>
      i === tab ? { ...t, currDir: newDir, historyState: newHistoryState } : t,
    ),
  };
};

const useTabState = (initialDirectory: INode) => {
  const [tabState, dispatchTabState] = React.useReducer(
    (state: FETabReducerState, action: FETabReducerAction) => {
      switch (action.type) {
        case FETabReducerActionType.SET_CURR_DIR: {
          return updateCurrDirState(state, action.payload);
        }

        case FETabReducerActionType.SET_SELECTED_NODES: {
          return updateSelectedNodesState(state, action.payload);
        }

        case FETabReducerActionType.SET_DRAGGING: {
          return updateDraggingState(state, action.payload);
        }

        case FETabReducerActionType.SET_VIEW_TYPE: {
          return updateViewTypeState(state, action.payload);
        }

        case FETabReducerActionType.SET_VIEW_SIZE: {
          return updateViewSizeState(state, action.payload);
        }

        case FETabReducerActionType.SET_SHOW_HIDDEN: {
          return updateShowHiddenState(state, action.payload);
        }

        case FETabReducerActionType.SET_DIRECTORY_TYPE: {
          return updateDirectoryTypeState(state, action.payload);
        }

        case FETabReducerActionType.SET_SORT_TYPE: {
          return updateSortTypeState(state, action.payload);
        }

        case FETabReducerActionType.UPDATE_HISTORY_STATE: {
          return updateHistoryState(state, action.payload);
        }

        case FETabReducerActionType.UPDATE_CONTEXT_MENU_STATE: {
          return updateContextMenuState(state, action.payload);
        }

        case FETabReducerActionType.UPDATE_TABS_HOME: {
          return updateHomeState(state, action.payload);
        }

        case FETabReducerActionType.UPDATE_BACKWARD_FILE: {
          return updateBackwardFileState(state, action.payload);
        }

        case FETabReducerActionType.UPDATE_BACKWARD_RECENT: {
          return updateBackwardRecentState(state, action.payload);
        }

        case FETabReducerActionType.UPDATE_FORWARD_FILE: {
          return updateForwardFileState(state, action.payload);
        }

        case FETabReducerActionType.UPDATE_FORWARD_RECENT: {
          return updateForwardRecentState(state, action.payload);
        }

        default: {
          return state;
        }
      }
    },
    getInitialTabState(initialDirectory),
  );

  return [tabState, dispatchTabState] as const;
};

export default useTabState;