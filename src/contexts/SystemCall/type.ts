import { FileTreeNode } from "@contexts/FileTree/type";
import * as React from "react";

export type SystemCallContextType = {
  readDir: (fileTree: FileTreeNode) => FileTreeNode[];
};

export type SystemCallProviderProps = {
  children: React.ReactNode;
};
