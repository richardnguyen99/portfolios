import { createContext } from "react";

import { ModalContextType } from "./type";

const ModalContext = createContext<ModalContextType>({} as ModalContextType);
ModalContext.displayName = "ModalContext";

export default ModalContext;
