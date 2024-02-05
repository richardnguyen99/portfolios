import * as React from "react";
import clsx from "classnames";

import useDragSelect from "./DragSelect/hook";
import useFileExplorer from "./hook";
import { FileType, IDirectory, IFile } from "@util/fs/type";

const FSFooter: React.FC = () => {
  const { ds } = useDragSelect();
  const { currDir } = useFileExplorer();

  const [text, setText] = React.useState("");

  React.useEffect(() => {
    if (!ds) return;

    ds.subscribe("DS:end", (e) => {
      const items = e.items as HTMLDivElement[];

      if (!items.length) return setText("");

      let numDirs = 0;
      let subItems = 0;
      let numFiles = 0;
      let totalSize = 0;

      for (const item of items) {
        const itemId = item.attributes.getNamedItem("data-node-id")?.value;

        if (!itemId) continue;

        const node = (currDir as IDirectory).children.find(
          (n) => n.id === itemId,
        );

        if (!node) continue;

        if (node.type === FileType.Directory) {
          numDirs++;
          subItems += (node as IDirectory).children.length;
        } else {
          const file = localStorage.getItem(`file-${node.id}`)!;
          totalSize += file.length;
          numFiles++;
        }
      }

      setText(
        `\
${numDirs} folders selected (containing ${subItems} items totally), \
${numFiles} files selected (totally ${totalSize} bytes)`,
      );
    });

    ds.subscribe("DS:start", () => {
      setText("");
    });

    return () => {
      ds.unsubscribe("DS:end");
      ds.unsubscribe("DS:start");
    };
  }, [currDir, ds]);

  return (
    <div className="flex fixed bottom-0 right-0">
      {text && (
        <div
          className={clsx(
            "relative ml-auto",
            "p-1 rounded-tl-lg text-xs",
            "border-t border-l",
            "border-gray-400/45 dark:border-gray-600",
            "bg-gray-300/45 dark:bg-gray-700",
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default FSFooter;
