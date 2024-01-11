import { WindowProps } from "@components/Window";
import { FileTreeNode } from "@contexts/FileTree/type";

export type EditorProps = WindowProps & {
  initialText?: string;
  file?: FileTreeNode;
  onSave?: (text: string) => void;
}
