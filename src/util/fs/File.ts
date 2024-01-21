import type { INode, INodeMetadata, NodeType } from "./type";

class File implements INode {
  private id: string;
  private name: string;
  private parent: INode | null;
  private type: NodeType;
  private size: number;
  private owner: string;

  private readPermission: boolean;
  private writePermission: boolean;
  private executePermission: boolean;

  private lastAccessed: Date;
  private lastModified: Date;
  private lastChanged: Date;
  private birth: Date;

  private content: string;

  constructor(metadata: Partial<INodeMetadata>, data?: string) {
    this.id = metadata.id ?? crypto.randomUUID();
    this.name = metadata.name ?? "untitled";
    this.parent = metadata.parent ?? null;
    this.type = 2;
    this.owner = metadata.owner ?? "root";

    this.readPermission = metadata.readPermission ?? true;
    this.writePermission = metadata.writePermission ?? false;
    this.executePermission = metadata.executePermission ?? false;

    this.lastAccessed = new Date();
    this.lastModified = new Date();
    this.lastChanged = new Date();
    this.birth = new Date();

    this.content = data ?? "";
    this.size = data ? data.length : 0;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getParent(): INode | null {
    return this.parent;
  }

  public getType(): NodeType {
    return this.type;
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

  public read(): string {
    this.lastAccessed = new Date();

    return this.content;
  }

  public write(data: string): void {
    this.lastAccessed = new Date();
    this.lastModified = new Date();

    this.content = data;
    this.size = data.length;
  }

  public modify(metadata: Partial<INodeMetadata>): void {
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

export default File;
