import * as React from "react";

import { ModalProps, ModalProviderProps } from "./type";
import ModalContext from "./Context";
import { Window } from "@components";

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = React.useState<ModalProps[]>([]);

  const addModal = React.useCallback(
    (modal: ModalProps) => {
      const filteredModal = modals.map((modal) => ({
        ...modal,
        active: false,
      }));

      setModals(() => [...filteredModal, modal]);
    },
    [modals],
  );

  const closeModal = React.useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAllModals = React.useCallback(() => {}, []);

  const selectModal = React.useCallback(
    (id: string) => {
      const targetModal = modals.filter((modal) => modal.id === id)[0];

      const filteredModal = modals
        .filter((modal) => modal.id !== id)
        .map((modal) => ({
          ...modal,
          active: false,
        }));

      targetModal.active = true;

      setModals(() => [...filteredModal, targetModal]);
    },
    [modals],
  );

  const deselectAllModals = React.useCallback(() => {
    setModals((prev) =>
      prev.map((modal) => ({
        ...modal,
        active: false,
      })),
    );
  }, []);

  const toggleFullScreen = React.useCallback(
    (id: string) => {
      const targetModal = modals.filter((modal) => modal.id === id)[0];

      if (targetModal.isFullScreenAllowed === true) {
        targetModal.isFullScreen = !targetModal.isFullScreen;
      }

      const filteredModals = modals.filter((modal) => modal.id !== id);

      setModals(() => [...filteredModals, targetModal]);
    },
    [modals],
  );

  const renderModals = React.useCallback(() => {
    return modals.map((modal) => {
      return (
        <Window
          key={modal.id}
          title={modal.title}
          id={modal.id}
          active={modal.active}
          fullscreen={modal.isFullScreen}
        />
      );
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
      deselectAllModals,
    }),
    [
      addModal,
      closeModal,
      closeAllModals,
      selectModal,
      toggleFullScreen,
      renderModals,
      deselectAllModals,
    ],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
