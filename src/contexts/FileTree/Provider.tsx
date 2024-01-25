import * as React from "react";

import type { FileTreeContextType } from "./type";
import FileTreeContext from "./Context";
import useLocalStorage from "@hooks/useLocalStorage";
import type { IFile, IDirectory } from "@util/fs/type";
import { FileType } from "@util/fs/type";
import { generateDirectoryId, generateFileId } from "@util/fs/id";

import content from "../../assets/README.md?raw";

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

author.children.push(readmd);
guess.children.push(documents, publics);
home.children.push(author);
root.children.push(home);

const FileTreeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [homeFolder, setHomeFolder] = useLocalStorage<IDirectory>(
    "home",
    guess,
  );

  const getRootFolder = React.useCallback(() => {
    return root;
  }, []);

  const getHomeFolder = React.useCallback(() => {
    return homeFolder;
  }, [homeFolder]);

  const contextValue = React.useMemo<FileTreeContextType>(
    () => ({
      home: homeFolder,
      getRootFolder,
      getHomeFolder,
      setHomeFolder,
    }),
    [getHomeFolder, getRootFolder, homeFolder, setHomeFolder],
  );

  // Side effect to update the home folder when the home folder is changed
  React.useEffect(() => {
    if (homeFolder.parent === null) {
      console.log("Updating home folder");

      homeFolder.parent = home;
      home.children.push(homeFolder);
    }
  }, [homeFolder]);

  return (
    <FileTreeContext.Provider value={contextValue}>
      {children}
    </FileTreeContext.Provider>
  );
};

export default FileTreeProvider;
