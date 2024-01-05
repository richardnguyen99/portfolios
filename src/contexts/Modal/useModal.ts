import { useContext } from "react";

import ModalContext from "./Context";

const useModal = () => useContext(ModalContext);

export default useModal;
