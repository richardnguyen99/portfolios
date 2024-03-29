import * as React from "react";
import clsx from "classnames";

import useDragSelect from "./DragSelect/hook";
import useFileExplorer from "./hook";
import { FileType, IDirectory, IFile } from "@util/fs/type";
import { FEDirectoryType } from "./type";
import useRecentFiles from "@contexts/RecentFiles/hook";
import useSystemCall from "@contexts/SystemCall/useSystemCall";

const FSFooter: React.FC = () => {
  const { ds } = useDragSelect();
  const { recentFiles } = useRecentFiles();
  const { searchNodeWithPath } = useSystemCall();
  const { currDir, directoryType, selectedNodes } = useFileExplorer();

  const [text, setText] = React.useState("");

  const findNode = React.useCallback(
    (itemId: string) => {
      if (directoryType === FEDirectoryType.Recent) {
        const nodeMetadata = recentFiles.find((file) => file.id === itemId);

        if (!nodeMetadata) return undefined;

        return searchNodeWithPath(null, nodeMetadata.path);
      }

      return (currDir as IDirectory).children.find((n) => n.id === itemId);
    },
    [currDir, directoryType, recentFiles, searchNodeWithPath],
  );

  React.useEffect(() => {
    if (!ds) return;

    setText("");

    if (!selectedNodes.length) setText("");
    else {
      let numDirs = 0;
      let subItems = 0;
      let numFiles = 0;
      let totalSize = 0;

      selectedNodes.forEach((node) => {
        if (node.type === FileType.Directory) {
          numDirs++;
          subItems += (node as IDirectory).children.length;
        } else {
          totalSize += (node as IFile).size;
          numFiles++;
        }
      });

      let constructedText = "";

      if (numDirs) {
        constructedText += `${numDirs} folder${
          numDirs > 1 ? "s" : ""
        } selected (containing ${subItems} item${
          subItems > 1 ? "s" : ""
        } totally)`;
      }

      if (numFiles) {
        if (constructedText) constructedText += ", ";
        constructedText += `${numFiles} file${
          numFiles > 1 ? "s" : ""
        } selected (totally ${totalSize} bytes)`;
      }

      setText(constructedText);
    }

    ds.subscribe("DS:start", () => {
      setText("");
    });

    return () => {
      ds.unsubscribe("DS:start");
    };
  }, [currDir, ds, findNode, selectedNodes]);

  return (
    <div className="flex fixed bottom-0 right-0 z-10">
      {text && (
        <div
          className={clsx(
            "relative ml-auto",
            "p-1 rounded-tl-lg text-xs",
            "border-t border-l",
            "select-none",
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
