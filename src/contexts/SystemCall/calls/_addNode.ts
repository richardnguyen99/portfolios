import { IDirectory, INode } from "@util/fs/type";

const _addNode = (parentNode: IDirectory, newNode: INode): void => {
  if (!parentNode.writePermission) {
    throw new Error(`'${newNode.name}': Permission denied`);
  }

  const index = parentNode.children.findIndex(
    (child) => child.name === newNode.name,
  );

  if (index !== -1) {
    throw new Error(`'${newNode.name}': File or directory already exists`);
  }

  if (newNode.name.length > 255) {
    throw new Error(`'${newNode.name}': File or directory name too long`);
  }

  parentNode.children.push(newNode);
  parentNode.lastModified = new Date();
};

export default _addNode;
