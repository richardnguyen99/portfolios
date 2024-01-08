import * as React from "react";

import type { FileTreeNode, FileTreeContextType } from "./type";
import FileTreeContext from "./Context";

const root: FileTreeNode = {
  name: "root",
  type: "folder",
  readPermission: true,
  writePermission: false,
  executePermission: false,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: null,
};

const home: FileTreeNode = {
  name: "home",
  type: "folder",
  readPermission: true,
  writePermission: false,
  executePermission: false,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: root,
};

const guess: FileTreeNode = {
  name: "guess",
  type: "folder",
  readPermission: true,
  writePermission: true,
  executePermission: true,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: home,
};

const author: FileTreeNode = {
  name: "richard",
  type: "folder",
  readPermission: true,
  writePermission: false,
  executePermission: false,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: home,
};

root.children.push(home);
home.children.push(guess, author);

const FileTreeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [fileTree] = React.useState<FileTreeNode>(root);

  const addFile = React.useCallback(
    (parentNode: FileTreeNode, filename: string) => {
      console.log(parentNode, filename);
    },
    [],
  );

  const removeFile = React.useCallback(
    (parentNode: FileTreeNode, filename: string) => {
      console.log(parentNode, filename);
    },
    [],
  );

  const addFolder = React.useCallback(
    (parentNode: FileTreeNode, foldername: string) => {
      console.log(parentNode, foldername);
    },
    [],
  );

  const removeFolder = React.useCallback(
    (parentNode: FileTreeNode, foldername: string) => {
      console.log(parentNode, foldername);
    },
    [],
  );

  const renameFile = React.useCallback(
    (parentNode: FileTreeNode, filename: string, newFilename: string) => {
      console.log(parentNode, filename, newFilename);
    },
    [],
  );

  const renameFolder = React.useCallback(
    (parentNode: FileTreeNode, foldername: string, newFoldername: string) => {
      console.log(parentNode, foldername, newFoldername);
    },
    [],
  );

  const moveFile = React.useCallback(
    (
      parentNode: FileTreeNode,
      filename: string,
      newParentNode: FileTreeNode,
    ) => {
      console.log(parentNode, filename, newParentNode);
    },
    [],
  );
  const moveFolder = React.useCallback(
    (
      parentNode: FileTreeNode,
      foldername: string,
      newParentNode: FileTreeNode,
    ) => {
      console.log(parentNode, foldername, newParentNode);
    },
    [],
  );

  const copyFile = React.useCallback(
    (
      parentNode: FileTreeNode,
      filename: string,
      newParentNode: FileTreeNode,
    ) => {
      console.log(parentNode, filename, newParentNode);
    },
    [],
  );

  const copyFolder = React.useCallback(
    (
      parentNode: FileTreeNode,
      foldername: string,
      newParentNode: FileTreeNode,
    ) => {
      console.log(parentNode, foldername, newParentNode);
    },
    [],
  );

  const getHomeFolder = React.useCallback(() => {
    return author;
  }, []);

  const contextValue: FileTreeContextType = React.useMemo(() => {
    return {
      addFile,
      removeFile,
      addFolder,
      removeFolder,
      renameFile,
      renameFolder,
      moveFile,
      moveFolder,
      copyFile,
      copyFolder,
      getHomeFolder,
    };
  }, [
    addFile,
    addFolder,
    moveFile,
    moveFolder,
    removeFile,
    removeFolder,
    renameFile,
    renameFolder,
    copyFile,
    copyFolder,
    getHomeFolder,
  ]);

  React.useEffect(() => {}, [fileTree]);

  return (
    <FileTreeContext.Provider value={contextValue}>
      {children}
    </FileTreeContext.Provider>
  );
};

export default FileTreeProvider;
