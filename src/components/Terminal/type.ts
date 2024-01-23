import * as React from "react";

import type { IDirectory, IFile } from "@util/fs/type";

export type SystemCommand = {
  clearBuffer: () => void;
  exitTerminal: () => void;
  getFileTreeRoot: () => IDirectory;
  getFileTreeHome: () => IDirectory;
  changeDirectory: (path?: IDirectory | string) => void;
  openEditor: (path: IFile) => void;
  open: (path: IFile) => void;
  createNewFile: (path: IDirectory, name: string) => Promise<void>;
  getWindowSize: () => { width: number; height: number };
  getTerminalSize: () => { width: number; height: number };
  getCharacterSize: () => { width: number; height: number };
};

export type TerminalContextType = {
  addBuffer: (buffer: string) => void;
  clearBuffer: () => void;
  renderBuffer: () => React.ReactNode[];
  execute: (command: string) => void;
  setPrompt: (prompt: string) => void;
  displayPrompt: () => string;
  getWindowId: () => string;
  getWindowSize: () => { width: number; height: number };
};

export type TerminalProviderProps = {
  children: React.ReactNode;
};
