export enum FileType {
  File,
  Directory,
  Link,
}

export interface INode {
  id: string;
  name: string;
  type: FileType;
  parent: INode | null;

  owner: string;
  lastAccessed: Date;
  lastModified: Date;
  lastChanged: Date;
  lastCreated: Date;

  readPermission: boolean;
  writePermission: boolean;
  executePermission: boolean;
}

export interface IFile extends INode {
  type: FileType.File;
  content: string;
  size: number;
}

export interface IDirectory extends INode {
  type: FileType.Directory;
  children: INode[];
}

export interface ILink extends INode {
  type: FileType.Link;
  target: string;
}

export type INodeOption = Partial<{
  name: string;
  type: FileType;
  parent: INode | null;

  owner: string;
  lastAccessed: Date;
  lastModified: Date;
  lastChanged: Date;
  lastCreated: Date;

  readPermission: boolean;
  writePermission: boolean;
  executePermission: boolean;

  children: INode[];
  content: string;
  size: number;
}>;
