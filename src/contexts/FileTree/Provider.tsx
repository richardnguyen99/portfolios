import * as React from "react";

import type { FileTreeNode, FileTreeContextType } from "./type";
import FileTreeContext from "./Context";

import content from "../../assets/README.md?raw";
import useLocalStorage from "@hooks/useLocalStorage";

const date = new Date("2024-01-01T00:00:00.000Z");

const root: FileTreeNode = {
  name: "root",
  type: "folder",
  readPermission: true,
  writePermission: false,
  executePermission: false,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: null,
  accessedAt: date,
  createdAt: date,
  updatedAt: date,
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
  accessedAt: date,
  createdAt: date,
  updatedAt: date,
};

const guess: FileTreeNode = {
  name: "guess",
  type: "folder",
  readPermission: true,
  writePermission: true,
  executePermission: true,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: null,
  accessedAt: date,
  createdAt: date,
  updatedAt: date,
};

const documents: FileTreeNode = {
  name: "documents",
  type: "folder",
  readPermission: true,
  writePermission: true,
  executePermission: true,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: guess,
  accessedAt: date,
  createdAt: date,
  updatedAt: date,
};

const publics: FileTreeNode = {
  name: "public",
  type: "folder",
  readPermission: true,
  writePermission: true,
  executePermission: true,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: guess,
  accessedAt: date,
  createdAt: date,
  updatedAt: date,
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
  accessedAt: date,
  createdAt: date,
  updatedAt: date,
};

const readmd: FileTreeNode = {
  name: "readme.md",
  type: "file",
  readPermission: true,
  writePermission: false,
  executePermission: false,
  id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
  children: [],
  parent: author,
  content: content,
  accessedAt: date,
  createdAt: date,
  updatedAt: date,
};

home.children.push(author);
author.children.push(readmd);
guess.children.push(documents, publics);
root.children.push(home);

const FileTreeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [homeFolder, setHomeFolder] = useLocalStorage<FileTreeNode>(
    "home",
    guess,
  );

  // const [fileTree] = React.useState<FileTreeNode>(root);

  const addFile = React.useCallback(
    (parentNode: FileTreeNode, filename: string) => {
      const newFile: FileTreeNode = {
        id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
        name: filename,
        type: "file",
        readPermission: true,
        writePermission: true,
        executePermission: false,
        children: [],
        parent: parentNode,
        content: "",
        accessedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      parentNode.children.push(newFile);
      console.log(Object.is(parentNode, homeFolder));

      const newHomeFolder = { ...homeFolder, parent: null };
      setHomeFolder(newHomeFolder);
    },
    [homeFolder, setHomeFolder],
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
    return homeFolder;
  }, [homeFolder]);

  const getRootFolder = React.useCallback(() => {
    return root;
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
      getRootFolder,
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
    getRootFolder,
  ]);

  React.useEffect(() => {
    const index = home.children.findIndex((child) => child.name === "guess");

    if (index !== -1) {
      home.children.splice(index, 1);
    }

    home.children.push(homeFolder);
    homeFolder.parent = home;
  }, [homeFolder]);

  return (
    <FileTreeContext.Provider value={contextValue}>
      {children}
    </FileTreeContext.Provider>
  );
};

export default FileTreeProvider;
