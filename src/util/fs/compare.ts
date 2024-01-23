import { FileType, type IFile, type IDirectory } from "@util/fs/type";

export const compareFiles = (file1: IFile, file2: IFile): boolean => {
  return (
    file1.name === file2.name &&
    file1.type === FileType.File &&
    file2.type === FileType.File &&
    file1.parent === file2.parent &&
    file1.id === file2.id
  );
};

export const compareDirectories = (
  dir1: IDirectory,
  dir2: IDirectory,
): boolean => {
  return (
    dir1.name === dir2.name &&
    dir1.type === FileType.Directory &&
    dir2.type === FileType.Directory &&
    dir1.parent === dir2.parent &&
    dir1.id === dir2.id
  );
};
