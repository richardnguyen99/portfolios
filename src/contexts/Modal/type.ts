import { WindowPosition, WindowSize } from "@components/Window/type";
import { FileTreeNode } from "@contexts/FileTree/type";

type ModalType = "explorer" | "terminal" | "editor" | "settings" | "reader";

export type ModalProps = {
  id: string;
  title: string;
  type: ModalType;
  active: boolean;
  isFullScreenAllowed?: boolean;
  isFullScreen?: boolean;

  initialSize?: WindowSize;
  initialPosition?: WindowPosition;

  /**
   * File Object referenced
   */
  file?: FileTreeNode;

  componentProps?: object;

  /**
   * Children component to be rendered inside the modal (window)
   */
  component: React.FC;
};

export type ModalContextType = {
  addModal: (modalProps: ModalProps) => void;
  selectModal: (id: string) => void;
  deselectAllModals: () => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  toggleFullScreen: (id: string) => void;
  renderModals: () => React.ReactNode[];
};

export type ModalProviderProps = {
  children: React.ReactNode;
};
