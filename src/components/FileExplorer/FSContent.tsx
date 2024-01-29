import * as React from "react";
import clsx from "classnames";

import { INode } from "@util/fs/type";
import GridView from "./GridView";

const MockFS: INode[] = [
  {
    id: "1",
    name: "Documents",
    type: 1,
    executePermission: true,
    readPermission: true,
    writePermission: true,
    parent: null,

    lastAccessed: new Date(),
    lastModified: new Date(),
    lastChanged: new Date(),
    lastCreated: new Date(),
    owner: "richard",
  },
  {
    id: "2",
    name: "Videos",
    type: 1,
    executePermission: true,
    readPermission: true,
    writePermission: true,
    parent: null,

    lastAccessed: new Date(),
    lastModified: new Date(),
    lastChanged: new Date(),
    lastCreated: new Date(),
    owner: "richard",
  },
  {
    id: "3",
    name: "Pictures",
    type: 1,
    executePermission: true,
    readPermission: true,
    writePermission: true,
    parent: null,

    lastAccessed: new Date(),
    lastModified: new Date(),
    lastChanged: new Date(),
    lastCreated: new Date(),
    owner: "richard",
  },
  {
    id: "4",
    name: "Desktop",
    type: 1,
    executePermission: true,
    readPermission: true,
    writePermission: true,
    parent: null,

    lastAccessed: new Date(),
    lastModified: new Date(),
    lastChanged: new Date(),
    lastCreated: new Date(),
    owner: "richard",
  },
  {
    id: "5",
    name: "Downloads",
    type: 1,
    executePermission: true,
    readPermission: true,
    writePermission: true,
    parent: null,

    lastAccessed: new Date(),
    lastModified: new Date(),
    lastChanged: new Date(),
    lastCreated: new Date(),
    owner: "richard",
  },
];

const FSContent: React.FC = () => {
  return (
    <div
      id="fe-fs-content"
      className={clsx("flex flex-grow", "h-[calc(100%_-_100px)]")}
    >
      <div
        id="fe-fs-quick-access"
        className={clsx(
          "flex-grow-0 flex-shrink-0 basis-48 p-3",
          "flex flex-col",
          "bg-gray-200 dark:bg-gray-700/60",
          "h-full overflow-y-scroll",
          "select-none",
        )}
      >
        <h1 className="text-lg font-extrabold">Quick Access</h1>
        <div className="flex flex-col gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold">Recent</h2>
            <h2 className="text-base font-bold">Starred</h2>
            <h2 className="text-base font-bold">Home</h2>
            <div className="flex flex-col gap-1 ml-3">
              <h3 className="text-sm">Documents</h3>
              <h3 className="text-sm">Downloads</h3>
              <h3 className="text-sm">Music</h3>
              <h3 className="text-sm">Pictures</h3>
              <h3 className="text-sm">Videos</h3>
            </div>
          </div>
        </div>
      </div>
      <GridView nodes={MockFS} />
    </div>
  );
};

export default FSContent;
