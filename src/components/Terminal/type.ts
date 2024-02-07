import * as React from "react";

import type { IDirectory, IFile, INode } from "@util/fs/type";

export type SystemCommand = {
  addFile: (path: IDirectory, name: string) => Promise<void>;
  addDirectory: (path: IDirectory, name: string) => Promise<void>;
  updateFile: (path: IFile, file: Partial<IFile>) => void;
  removeINode: (path: IDirectory, name: INode) => void;
  walkNode: (currentDir: IDirectory, pathList: string[]) => IDirectory;

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
  initialDir?: IDirectory;
  children: React.ReactNode;
};

export type TerminalProps = {
  initialDir?: IDirectory;
};
