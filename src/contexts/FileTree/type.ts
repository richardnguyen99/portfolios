export type FileNodeType = 'file' | 'folder';

/**
 * FileTreeNode interface represents a node in the file tree.
 *
 * @interface FileTreeNode
 */
export interface FileTreeNode {
  id: string;
  name: string;
  parent: FileTreeNode | null;
  type: FileNodeType;
  children: FileTreeNode[];
  readPermission: boolean;
  writePermission: boolean;
  executePermission: boolean;
}


export type FileTreeContextType = {
  addFile: (parentNode: FileTreeNode, filename: string) => void;
  removeFile: (parentNode: FileTreeNode, filename: string) => void;
  addFolder: (parentNode: FileTreeNode, foldername: string) => void;
  removeFolder: (parentNode: FileTreeNode, foldername: string) => void;
  renameFile: (parentNode: FileTreeNode, filename: string, newFilename: string) => void;
  renameFolder: (parentNode: FileTreeNode, foldername: string, newFoldername: string) => void;
  moveFile: (parentNode: FileTreeNode, filename: string, newParentNode: FileTreeNode) => void;
  moveFolder: (parentNode: FileTreeNode, foldername: string, newParentNode: FileTreeNode) => void;
  copyFile: (parentNode: FileTreeNode, filename: string, newParentNode: FileTreeNode) => void;
  copyFolder: (parentNode: FileTreeNode, foldername: string, newParentNode: FileTreeNode) => void;
  getHomeFolder: () => FileTreeNode;
}
