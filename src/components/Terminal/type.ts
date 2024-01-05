import * as React from "react";

import { WindowProps } from "@components/Window";

export type TerminalContextType = {
  addBuffer: (buffer: string) => void;
  clearBuffer: () => void;
  renderBuffer: () => React.ReactNode[];
  execute: (command: string) => void;
  setPrompt: (prompt: string) => void;
  displayPrompt: () => string;
}

export type TerminalProviderProps = {
  children: React.ReactNode;
};

export type TerminalProps = WindowProps;
