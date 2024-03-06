import * as React from "react";

import { FEContextMenuAction, FEContextMenuState } from "../type";

const useContextMenuState = (initialState: FEContextMenuState) => {
  const [ctx, dispatchCtx] = React.useReducer(
    (state: FEContextMenuState, action: FEContextMenuAction) => {
      switch (action.type) {
        case "open":
          return { open: true, storedNodes: action.payload.nodes };
        case "close":
          return { open: false, storedNodes: [] };
        default:
          return state;
      }
    },
    initialState,
  );

  return [ctx, dispatchCtx] as const;
};

export default useContextMenuState;
