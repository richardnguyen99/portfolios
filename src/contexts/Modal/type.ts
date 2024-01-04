type ModalType = "explorer" | "terminal" | "editor" | "settings";

export type ModalProps = {
  id: string;
  title: string;
  type: ModalType;
  active: boolean;

  isFullScreenAllowed?: boolean;
  isFullScreen?: boolean;

};

export type ModalContextType = {
  addModal: (modalProps: ModalProps) => void;
  selectModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  toggleFullScreen: (id: string) => void;
  renderModals: () => React.ReactNode[];
};


export type ModalProviderProps = {
  children: React.ReactNode;
};
