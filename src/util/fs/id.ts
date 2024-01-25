import { INode } from "./type";

export const generateDirectoryId = (
  name: string,
  parent?: INode,
): Promise<string> => {
  const DIR_MAGIC_NUM: number = 0xfffffff;

  return crypto.subtle
    .digest(
      "SHA-256",
      new TextEncoder().encode(
        name + crypto.getRandomValues(new Uint32Array(1))[0] + DIR_MAGIC_NUM,
      ),
    )
    .then((hash) => {
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    })
    .catch((err) => {
      throw err;
    });
};

export const generateFileId = (
  content: string,
  fileName: string,
  parentNode: INode,
): Promise<string> => {
  const FILE_MAGIC_NUM: number = 0x7fffffff;

  return crypto.subtle
    .digest(
      "SHA-256",
      new TextEncoder().encode(
        content +
          crypto.getRandomValues(new Uint32Array(1))[0] +
          FILE_MAGIC_NUM,
      ),
    )
    .then((hash) => {
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    })
    .catch((err) => {
      throw err;
    });
};
