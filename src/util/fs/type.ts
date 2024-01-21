export enum NodeType {
  File,
  Directory,
  Symlink,
}

export interface INodeMetadata {
  id: string;
  name: string;
  type: NodeType;
  size: number;
  owner: string;

  readPermission: boolean;
  writePermission: boolean;
  executePermission: boolean;

  lastAccessed: Date;
  lastModified: Date;
  lastChanged: Date;
  birth: Date;
}

export interface IDirectoryMetadata extends INodeMetadata {
  parent: IDirectoryMetadata | null;
  children: INode[];
}

export interface IFileMetadata extends INodeMetadata {
  parent: IDirectoryMetadata;
  content: string;
}

export interface INode {
  getId: () => string;
  getName: () => string;
  getParent: () => IDirectoryMetadata | null;
  getType: () => NodeType;
  getSize: () => number;
  getOwner: () => string;

  isReadable: () => boolean;
  isWritable: () => boolean;
  isExecutable: () => boolean;

  getLastAccessed: () => Date;
  getLastModified: () => Date;
  getLastChanged: () => Date;
  getBirth: () => Date;

  read: () => unknown;
  write: (data: never) => void;
  modify: (metadata: never) => void;
}

export interface IFile extends INode {
  read: () => string;
  write: (data: string) => void;
  modify: (metadata: Partial<INodeMetadata>) => void;
}

export interface IDirectory extends INode {
  read: () => INode[];
  write: (data: IFileMetadata | IDirectoryMetadata) => void;
  modify: (metadata: Partial<IDirectoryMetadata>) => void;
}
