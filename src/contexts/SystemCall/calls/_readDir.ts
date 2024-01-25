import { type INode, type IDirectory } from "@util/fs/type";

const _readDir = (fileNode: IDirectory): INode[] => {
  const { children } = fileNode;

  return children;
};

export default _readDir;
