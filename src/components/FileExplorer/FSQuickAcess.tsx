import * as React from "react";
import clsx from "classnames";
import {
  ClockIcon,
  FileIcon,
  HomeIcon,
  MoveToBottomIcon,
  StarIcon,
} from "@primer/octicons-react";
import {
  ComputerDesktopIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
} from "@heroicons/react/16/solid";

import useFileTree from "@contexts/FileTree/useFileTree";
import useFileExplorer from "./hook";
import { FileType, IDirectory } from "@util/fs/type";
import { FEDirectoryType } from "./type";

interface QuickAccessFolders {
  [key: string]: IDirectory;
}

const QuickAccessFolderNames = [
  "Documents",
  "Downloads",
  "Music",
  "Videos",
  "Desktop",
];

const FSQuickAccessItem: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children, onClick, ...rest }) => {
  return (
    <div
      {...rest}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2",
        "text-base font-bold",
        "px-2 py-1 rounded-md",
        "hover:bg-gray-200 dark:hover:bg-gray-600",
        "active:bg-gray-300/40 dark:active:bg-gray-600/60",
        "transition-colors duration-50 ease-in-out",
      )}
    >
      {children}
    </div>
  );
};

const FSQuickAccessSubItem: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children, onClick, ...rest }) => {
  return (
    <div
      {...rest}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1",
        "text-sm",
        "px-1 py-1 rounded-md",
        "hover:bg-gray-200 dark:hover:bg-gray-600",
        "active:bg-gray-300/40 dark:active:bg-gray-600/60",
        "transition-colors duration-50 ease-in-out",
      )}
    >
      {children}
    </div>
  );
};

const FSQuickAccess: React.FC = () => {
  const { home } = useFileTree();
  const { currDir, setCurrDir, dispatchHistoryState, setDirectoryType } =
    useFileExplorer();

  const quickAccessFolders = React.useMemo(() => {
    const children = (home as IDirectory).children;
    const obj: QuickAccessFolders = {};

    children.forEach((child) => {
      if (child.type === FileType.Directory) {
        if (!QuickAccessFolderNames.includes(child.name)) {
          return;
        }

        obj[child.name] = child as IDirectory;
      }
    });

    return obj;
  }, [home]);

  const handleHomeClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      if (currDir.id === home.id) return;

      dispatchHistoryState({
        type: "push",
        payload: {
          id: home.id,
          name: home.name,
          parentId: home.parent?.id ?? "",
        },
      });

      setCurrDir(home);
      setDirectoryType(FEDirectoryType.File);
    },
    [currDir.id, dispatchHistoryState, home, setCurrDir, setDirectoryType],
  );

  const handleTabClick = React.useCallback(
    (dirName: string) => {
      return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        const dir = quickAccessFolders[dirName];

        if (dirName === currDir.name) return;

        if (!dir) return;

        dispatchHistoryState({
          type: "push",
          payload: {
            id: dir.id,
            name: dir.name,
            parentId: dir.parent?.id ?? "",
          },
        });

        setCurrDir(dir);
        setDirectoryType(FEDirectoryType.File);
      };
    },
    [
      currDir.name,
      dispatchHistoryState,
      quickAccessFolders,
      setCurrDir,
      setDirectoryType,
    ],
  );

  const handleRecentClick = React.useCallback(() => {
    console.log("Recent Clicked");

    if (currDir.name === "Recent") return;

    setDirectoryType(FEDirectoryType.Recent);
    setCurrDir({
      id: "recent",
      name: "Recent",
      type: FileType.Directory,
      children: [],
      parent: null,
      owner: "richard",
      readPermission: true,
      writePermission: true,
      executePermission: true,
      lastAccessed: new Date(),
      lastChanged: new Date(),
      lastCreated: new Date(),
      lastModified: new Date(),
    } as IDirectory);

    dispatchHistoryState({
      type: "push",
      payload: {
        id: "recent",
        name: "Recent",
        parentId: "",
      },
    });
  }, [currDir.name, dispatchHistoryState, setCurrDir, setDirectoryType]);

  return (
    <div
      id="fe-fs-quick-access"
      className={clsx(
        "flex-grow-0 flex-shrink-0 basis-48 p-3",
        "flex flex-col",
        "bg-gray-100/40 dark:bg-gray-700/60",
        "h-full overflow-y-scroll overflow-x-hidden",
        "select-none",
      )}
    >
      <h1 className="text-lg font-extrabold">Quick Access</h1>
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex flex-col gap-1">
          <FSQuickAccessItem onClick={handleRecentClick}>
            <>
              <ClockIcon />
              <span>Recent</span>
            </>
          </FSQuickAccessItem>
          <FSQuickAccessItem>
            <>
              <StarIcon />
              <span>Starred</span>
            </>
          </FSQuickAccessItem>
          <FSQuickAccessItem onClick={handleHomeClick}>
            <>
              <HomeIcon />
              <span>Home</span>
            </>
          </FSQuickAccessItem>
          <div className="flex flex-col gap-2 ml-[26px] mt-1">
            <FSQuickAccessSubItem onClick={handleTabClick("Documents")}>
              <>
                <FileIcon />
                <span>Documents</span>
              </>
            </FSQuickAccessSubItem>
            <FSQuickAccessSubItem onClick={handleTabClick("Downloads")}>
              <>
                <MoveToBottomIcon />
                <span>Downloads</span>
              </>
            </FSQuickAccessSubItem>
            <FSQuickAccessSubItem onClick={handleTabClick("Music")}>
              <>
                <MusicalNoteIcon className="w-4 h-4" />
                <span>Music</span>
              </>
            </FSQuickAccessSubItem>
            <FSQuickAccessSubItem onClick={handleTabClick("Videos")}>
              <>
                <VideoCameraIcon className="w-4 h-4" />
                <span>Videos</span>
              </>
            </FSQuickAccessSubItem>
            <FSQuickAccessSubItem onClick={handleTabClick("Desktop")}>
              <>
                <ComputerDesktopIcon className="w-4 h-4" />
                <span>Desktop</span>
              </>
            </FSQuickAccessSubItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FSQuickAccess;
