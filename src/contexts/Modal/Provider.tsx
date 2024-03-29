import * as React from "react";

import { ModalProps, ModalProviderProps } from "./type";
import ModalContext from "./Context";
import { Window } from "@components";

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = React.useState<ModalProps[]>([]);

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

  const addModal = React.useCallback(
    (modal: ModalProps) => {
      const existingModal = modals.filter(
        (existingModal) => modal.id === existingModal.id,
      );

      if (existingModal.length > 0) {
        selectModal(modal.id);
        return;
      }

      setModals((_modals) => {
        const filteredModal = _modals.map((modal) => ({
          ...modal,
          active: false,
        }));

        const newModals = [...filteredModal, modal];

        return newModals;
      });
    },
    [modals, selectModal],
  );

  const closeModal = React.useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAllModals = React.useCallback(() => {}, []);

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
      const Component = modal.component;
      const props = modal.componentProps;

      return (
        <Window
          key={modal.id}
          title={modal.title}
          id={modal.id}
          active={modal.active}
          fullscreen={modal.isFullScreen}
          initialPosition={modal.initialPosition}
          initialSize={modal.initialSize}
          minimumSize={modal.minimumSize}
        >
          <React.Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
          </React.Suspense>
        </Window>
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
