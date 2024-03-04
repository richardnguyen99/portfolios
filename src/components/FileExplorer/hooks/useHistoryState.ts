import * as React from "react";

import { FEHistoryAction, FEHistoryState } from "../type";

const useHistoryState = (initialState: FEHistoryState) => {
  const [historyState, setHistoryState] = React.useReducer(
    (state: FEHistoryState, action: FEHistoryAction) => {
      switch (action.type) {
        case "push":
          return {
            index: state.index + 1,
            history: [
              ...state.history.slice(0, state.index + 1),
              action.payload,
            ],
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
    },
    initialState,
  );

  return [historyState, setHistoryState] as const;
};

export default useHistoryState;
