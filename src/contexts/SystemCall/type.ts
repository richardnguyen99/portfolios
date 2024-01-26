import { type INode, type IDirectory, type IFile } from "@util/fs/type";
import * as React from "react";

export type SystemCallContextType = {
  /**
   * Add new `INode` to the file tree under the given `parent` directory.
   *
   * On success, the function will append the new `INode` to the `parent`'s
   * `children` array.
   *
   * On failure, the function will throw an error with a following message.
   *
   * @param parent
   *  The parent directory to add the new `INode` to.
   *
   * @param node
   *  The new `INode` to add to the file tree.
   *
   * @throws {Error}
   *  If the `parent` directory does not have write permission.
   *
   * @throws {Error}
   *  If the `parent` directory already has a child with the same name as the
   * `node` to add.
   *
   * @throws {Error}
   *  If the `node` to add is a directory and already has a child with the same
   */
  addINode: (parent: IDirectory, node: INode) => void;
  addFile: (
    parent: IDirectory,
    name: string,
    initalContent?: string,
  ) => Promise<void>;
  addDirectory: (parent: IDirectory, name: string) => Promise<void>;
  updateFile: (fileNode: IFile, fileMeta: Partial<IFile>) => void;

  removeINode: (parent: IDirectory, node: INode) => void;
  walkNode: (currentDir: IDirectory, pathList: string[]) => IDirectory;
  readDir: (fileTree: IDirectory) => INode[];
};

export type SystemCallProviderProps = {
  children: React.ReactNode;
};
