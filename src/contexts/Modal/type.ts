import { WindowPosition, WindowSize } from "@components/Window/type";
import { IFile } from "@util/fs/type";

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
  minimumSize?: WindowSize;

  /**
   * File Object referenced
   */
  file?: IFile;

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
