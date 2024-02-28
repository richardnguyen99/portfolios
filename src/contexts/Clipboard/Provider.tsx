import * as React from "react";

import ClipboardContext from "./Context";
import {
  ClipboardProviderProps,
  ClipboardReducerState,
  ClipboardReducerAction,
  ClipBoardAction,
  ClipboardNode,
  ClipboardContextType,
} from "./type";
import { INode } from "@util/fs/type";

const ClipboardProvider: React.FC<ClipboardProviderProps> = ({ children }) => {
  const [clipboard, dispatchClipboard] = React.useReducer(
    (state: ClipboardReducerState, action: ClipboardReducerAction) => {
      switch (action.type) {
        case ClipBoardAction.COPY:
          return {
            nodes: action.payload.map((node) => ({
              ...node,
              action: ClipBoardAction.COPY,
            })) as ClipboardNode[],
          };

        case ClipBoardAction.CUT:
          return {
            nodes: action.payload.map((node) => ({
              ...node,
              action: ClipBoardAction.CUT,
            })) as ClipboardNode[],
          };

        case ClipBoardAction.PASTE:
          return {
            nodes: [] as ClipboardNode[],
          };

        default:
          return state;
      }
    },
    {
      nodes: [] as ClipboardNode[],
    },
  );

  const copy = React.useCallback((...nodes: INode[]) => {
    dispatchClipboard({ type: ClipBoardAction.COPY, payload: nodes });
  }, []);

  const cut = React.useCallback((...nodes: INode[]) => {
    dispatchClipboard({ type: ClipBoardAction.CUT, payload: nodes });
  }, []);

  const paste = React.useCallback(() => {
    dispatchClipboard({ type: ClipBoardAction.PASTE, payload: [] });
  }, []);

  const value = React.useMemo<ClipboardContextType>(() => {
    return {
      nodes: clipboard.nodes,
      copy,
      cut,
      paste,
    };
  }, [clipboard.nodes, copy, cut, paste]);

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  );
};

export default ClipboardProvider;
