import { IDirectory, INode } from "@util/fs/type";

const _removeNode = (parentNode: IDirectory, node: INode): void => {
  const index = parentNode.children.findIndex((child) => child.id === node.id);

  if (index === -1) {
    throw new Error(`No such file or directory`);
  }

  if (!parentNode.writePermission) {
    throw new Error("Permission denied");
  }

  parentNode.children.splice(index, 1);
};

export default _removeNode;
