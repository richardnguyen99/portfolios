import * as React from "react";

import { WindowProps } from "@components/Window";
import { FileTreeNode } from "@contexts/FileTree/type";

export type SystemCommand = {
  clearBuffer: () => void;
  exitTerminal: () => void;
  getFileTreeRoot: () => FileTreeNode;
  changeDirectory: (path?: FileTreeNode | string) => void;
  openEditor: (path: FileTreeNode) => void;
  createNewFile: (path: FileTreeNode, name: string) => void;
  getWindowSize: () => { width: number; height: number };
  getTerminalSize: () => { width: number; height: number };
  getCharacterSize: () => { width: number; height: number };
}

export type TerminalContextType = {
  addBuffer: (buffer: string) => void;
  clearBuffer: () => void;
  renderBuffer: () => React.ReactNode[];
  execute: (command: string) => void;
  setPrompt: (prompt: string) => void;
  displayPrompt: () => string;
  getWindowId: () => string;
  getWindowSize: () => { width: number; height: number };
}

export type TerminalProviderProps = {
  id: string;
  children: React.ReactNode;
};

export type TerminalProps = WindowProps;
