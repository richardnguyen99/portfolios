import * as React from "react";

import { ModalProps, ModalProviderProps } from "./type";
import ModalContext from "./Context";
import { Window, Editor } from "@components";

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
      if (modal.type === "editor") {
        const file = modal.file;

        const initialText = file?.content || "";
        const title = file?.name || "Editor";

        return (
          <Editor
            id={modal.id}
            key={modal.id}
            active={modal.active}
            fullscreen={modal.isFullScreen}
            title={title}
            initialText={initialText}
            file={file}
          />
        );
      }

      const Component = modal.component;
      const props = modal.componentProps;

      return (
        <Window
          key={modal.id}
          title={modal.title}
          id={modal.id}
          active={modal.active}
          fullscreen={modal.isFullScreen}
        >
          <Component {...props} />
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
