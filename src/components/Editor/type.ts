import { FileTreeNode } from "@contexts/FileTree/type";

export type EditorProps = {
  readOnly?: boolean;
  initialText?: string;
  file?: FileTreeNode;
  onSave?: (text: string) => void;
};
