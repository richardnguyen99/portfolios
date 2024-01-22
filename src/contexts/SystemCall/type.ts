import { type INode, type IDirectory } from "@util/fs/type";
import * as React from "react";

export type SystemCallContextType = {
  readDir: (fileTree: IDirectory) => INode[];
};

export type SystemCallProviderProps = {
  children: React.ReactNode;
};
