import { type INode, type IDirectory } from "@util/fs/type";

/**
 * Read a directory and return a list of files and directories
 *
 * @param fileNode A pointer to a file node
 */
const _readDir = (fileNode: IDirectory): INode[] => {
  const { children } = fileNode;

  return children;
};

export default _readDir;
