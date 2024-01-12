import { WindowProps } from "@components/Window";
import { FileTreeNode } from "@contexts/FileTree/type";

export type EditorProps = WindowProps & {
  readOnly?: boolean;
  initialText?: string;
  file?: FileTreeNode;
  onSave?: (text: string) => void;
}
