import * as React from "react";

import { ClipboardContextType } from "./type";

const ClipboardContext = React.createContext<ClipboardContextType>(
  {} as ClipboardContextType,
);

export default ClipboardContext;
