import { WindowProps } from "@components/Window";

export type EditorProps = WindowProps & {
  initialText?: string;
  onSave?: (text: string) => void;
}
