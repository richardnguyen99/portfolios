import PFile from "./File";
import {
  IDirectory,
  IDirectoryMetadata,
  INode,
  INodeMetadata,
  NodeType,
} from "./type";

class Directory implements IDirectory {
  private id: string;
  private name: string;
  private parent: IDirectoryMetadata | null;
  private size: number;
  private owner: string;

  private readPermission: boolean;
  private writePermission: boolean;
  private executePermission: boolean;

  private lastAccessed: Date;
  private lastModified: Date;
  private lastChanged: Date;
  private birth: Date;

  private children: INode[];

  constructor(metadata: Partial<IDirectoryMetadata>) {
    this.id = metadata.id ?? crypto.randomUUID();
    this.name = metadata.name ?? "untitled";
    this.parent = metadata.parent ?? null;
    this.owner = metadata.owner ?? "root";

    this.readPermission = metadata.readPermission ?? true;
    this.writePermission = metadata.writePermission ?? false;
    this.executePermission = metadata.executePermission ?? false;

    this.lastAccessed = new Date();
    this.lastModified = new Date();
    this.lastChanged = new Date();
    this.birth = new Date();

    this.children = [];
    this.size = 0;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getParent(): IDirectoryMetadata | null {
    return this.parent;
  }

  public getType(): NodeType {
    return NodeType.Directory;
  }

  public getSize(): number {
    return this.size;
  }

  public getOwner(): string {
    return this.owner;
  }

  public isReadable(): boolean {
    return this.readPermission;
  }

  public isWritable(): boolean {
    return this.writePermission;
  }

  public isExecutable(): boolean {
    return this.executePermission;
  }

  public getLastAccessed(): Date {
    return this.lastAccessed;
  }

  public getLastModified(): Date {
    return this.lastModified;
  }

  public getLastChanged(): Date {
    return this.lastChanged;
  }

  public getBirth(): Date {
    return this.birth;
  }

  public read(): INode[] {
    this.lastAccessed = new Date();

    return this.children;
  }

  public write(data: INodeMetadata): void {
    this.lastAccessed = new Date();
    this.lastModified = new Date();

    if (data.type === NodeType.File) {
      this.children.push(new PFile(data));
    } else if (data.type === NodeType.Directory) {
      this.children.push(new Directory(data));
    }
  }

  public modify(metadata: Partial<IDirectoryMetadata>): void {
    if (metadata.name) {
      this.name = metadata.name;
    }

    if (metadata.parent) {
      this.parent = metadata.parent;
    }

    this.lastAccessed = new Date();
    this.lastModified = new Date();
  }
}

export default Directory;
