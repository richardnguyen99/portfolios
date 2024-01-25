import type { IFile } from "@util/fs/type";

export type EditorProps = {
  readOnly?: boolean;
  initialText?: string;
  file?: IFile;
  onSave?: (text: string) => void;
};
