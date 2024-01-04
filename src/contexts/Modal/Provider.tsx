import * as React from "react";

import { ModalProps, ModalProviderProps } from "./type";
import ModalContext from "./Context";
import { Window } from "@components";

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = React.useState<ModalProps[]>([]);

  const addModal = React.useCallback((modal: ModalProps) => {
    setModals((prev) => [...prev, modal]);
  }, []);

  const closeModal = React.useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAllModals = React.useCallback(() => {}, []);

  const selectModal = React.useCallback((id: string) => {
    console.log(id);
  }, []);

  const toggleFullScreen = React.useCallback((id: string) => {
    console.log(id);
  }, []);

  const renderModals = React.useCallback(() => {
    return modals.map((modal) => {
      return <Window key={modal.id} title={modal.title} />;
    });
  }, [modals]);

  const contextValue = React.useMemo(
    () => ({
      addModal,
      closeModal,
      closeAllModals,
      selectModal,
      toggleFullScreen,
      renderModals,
    }),
    [
      addModal,
      closeModal,
      closeAllModals,
      selectModal,
      toggleFullScreen,
      renderModals,
    ],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
