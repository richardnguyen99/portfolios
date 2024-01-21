import { FileTreeNode } from "@contexts/FileTree/type";

/**
 * Read a directory and return a list of files and directories
 *
 * @param fileNode A pointer to a file node
 */
const _readDir = (fileNode: FileTreeNode): FileTreeNode[] => {
  const { children } = fileNode;

  return children;
};

export default _readDir;
