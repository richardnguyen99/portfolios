import { type IDirectory, FileType } from "@util/fs/type";

const _walkNode = (currentNode: IDirectory, pathList: string[]): IDirectory => {
  let currDir = currentNode;

  if (pathList.length === 0) {
    return currDir;
  }

  for (const path of pathList) {
    if (path === ".") {
      continue;
    }

    if (path === "..") {
      if (!currDir.parent) {
        continue;
      }

      if (!currDir.parent.readPermission) {
        throw new Error(`'${currDir.parent.name}': Permission denied`);
      }

      currDir = currDir.parent as unknown as IDirectory;
      continue;
    }

    const index = currDir.children.findIndex((child) => child.name === path);

    if (index === -1) {
      throw new Error(`'${path}': No such file or directory`);
    }

    const child = currDir.children[index];

    if (!child.readPermission) {
      throw new Error(`'${path}': Permission denied`);
    }

    if (child.type !== FileType.Directory) {
      throw new Error(`'${path}': Not a directory`);
    }

    currDir = child as unknown as IDirectory;
  }

  return currDir;
};

export default _walkNode;
