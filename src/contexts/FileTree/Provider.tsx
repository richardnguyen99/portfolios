import * as React from "react";

import type { FileTreeNode, FileTreeContextType } from "./type";
import FileTreeContext from "./Context";

import content from "../../assets/README.md?raw";
import useLocalStorage from "@hooks/useLocalStorage";
import type { INode, IFile, IDirectory } from "@util/fs/type";
import { FileType } from "@util/fs/type";
import { generateDirectoryId, generateFileId } from "@util/fs/id";

const date = new Date("2024-01-01T00:00:00.000Z");

const root: IDirectory = {
  id: await generateDirectoryId("root"),
  name: "root",
  type: FileType.Directory,
  children: [],
  parent: null,
  owner: "richard",

  writePermission: false,
  executePermission: false,
  readPermission: true,

  lastAccessed: date,
  lastChanged: date,
  lastCreated: date,
  lastModified: date,
};

const home: IDirectory = {
  id: await generateDirectoryId("home", root),
  name: "home",
  type: FileType.Directory,
  children: [],
  parent: root,
  owner: "richard",

  readPermission: true,
  writePermission: false,
  executePermission: false,

  lastAccessed: date,
  lastChanged: date,
  lastCreated: date,
  lastModified: date,
};

const guess: IDirectory = {
  id: await generateDirectoryId("guess", home),
  name: "guess",
  type: FileType.Directory,
  children: [],
  parent: null,
  owner: "guess",

  readPermission: true,
  writePermission: true,
  executePermission: true,

  lastAccessed: date,
  lastChanged: date,
  lastCreated: date,
  lastModified: date,
};

const documents: IDirectory = {
  id: await generateDirectoryId("documents", guess),
  name: "documents",
  type: FileType.Directory,
  children: [],
  parent: guess,
  owner: "guess",

  readPermission: true,
  writePermission: true,
  executePermission: true,

  lastAccessed: date,
  lastChanged: date,
  lastCreated: date,
  lastModified: date,
};

const publics: IDirectory = {
  id: await generateDirectoryId("public", guess),
  name: "public",
  type: FileType.Directory,
  children: [],
  parent: guess,
  owner: "guess",

  readPermission: true,
  writePermission: true,
  executePermission: true,

  lastAccessed: date,
  lastChanged: date,
  lastCreated: date,
  lastModified: date,
};

const author: IDirectory = {
  id: await generateDirectoryId("richard", home),
  name: "richard",
  type: FileType.Directory,
  children: [],
  parent: home,
  owner: "richard",

  readPermission: true,
  writePermission: false,
  executePermission: false,

  lastAccessed: date,
  lastChanged: date,
  lastCreated: date,
  lastModified: date,
};

const readmd: IFile = {
  id: await generateFileId(content, "readme.md", author),
  name: "readme.md",
  type: FileType.File,
  content: content,
  size: content.length,
  parent: author,
  owner: "richard",

  readPermission: true,
  writePermission: false,
  executePermission: false,

  lastAccessed: date,
  lastChanged: date,
  lastCreated: date,
  lastModified: date,
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
