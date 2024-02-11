import { FileType, IDirectory, IFile, INode, INodeOption } from "@util/fs/type";

const _updateNode = (currNode: INode, option: INodeOption): void => {
  console.log("_updateNode", option);
  const parentNode = currNode.parent as IDirectory;

  if (!parentNode.writePermission) {
    throw new Error(`'${parentNode.name}': Permission denied`);
  }

  if (!currNode.writePermission) {
    throw new Error(`'${currNode.name}': Permission denied`);
  }

  if (option.name) {
    if (option.name.length <= 0) {
      throw new Error(`'${option.name}': Invalid name`);
    }

    if (option.name === "." || option.name === "..") {
      throw new Error(`'${option.name}': Invalid name`);
    }

    const index = parentNode.children.findIndex(
      (child) => child.name === option.name,
    );

    if (index !== -1) {
      throw new Error(`'${option.name}': File or directory already exists`);
    }

    if (option.name.length > 255) {
      throw new Error(`'${option.name}': File or directory name too long`);
    }

    parentNode.lastModified = new Date();

    currNode.name = option.name;
  }

  if (option.size) {
    if (currNode.type !== FileType.File) {
      throw new Error(`'${currNode.name}': Not a file`);
    }

    if (option.size < 0) {
      throw new Error(`'${currNode.name}': Invalid size`);
    }

    (currNode as IFile).size = option.size;
    currNode.lastModified = new Date();
  }

  if (option.lastModified) {
    if (option.lastModified < new Date(0)) {
      throw new Error(`'${currNode.name}': Invalid date`);
    }

    console.log("lastModified", option.lastModified);
    currNode.lastModified = option.lastModified;
  }

  if (option.lastAccessed) {
    if (option.lastAccessed < new Date(0)) {
      throw new Error(`'${currNode.name}': Invalid date`);
    }

    console.log("lastAccessed", option.lastAccessed);
    currNode.lastAccessed = option.lastAccessed;
  }
};

export default _updateNode;
