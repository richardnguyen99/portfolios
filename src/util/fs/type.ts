export enum NodeType {
  File,
  Directory,
  Symlink,
}

export interface INodeMetadata {
  id: string;
  name: string;
  parent: INode | null;
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

export interface INode {
  getId: () => string;
  getName: () => string;
  getParent: () => INode | null;
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
  modify: (data: never) => void;
}
