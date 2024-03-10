import * as React from "react";
import clsx from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";

import IconBtn from "./IconBtn";
import useFileExplorer from "./hook";
import useFileTree from "@contexts/FileTree/useFileTree";
import { FileType, INode, type IDirectory } from "@util/fs/type";
import useSystemCall from "@contexts/SystemCall/useSystemCall";
import { FEDirectoryType, FETabReducerActionType } from "./type";

const AddressBtn: React.FC<
  React.PropsWithChildren<
    { node: INode; nodeIdx: number } & React.HTMLAttributes<HTMLButtonElement>
  >
> = ({ node, nodeIdx, ...rest }) => {
  const { currentTab, tabState, dispatchTabState } = useFileExplorer();
  const { searchNodeFromRoot } = useSystemCall();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      const historyState = currentTab.historyState;
      if (nodeIdx < 0 || nodeIdx >= historyState.history.length - 1) {
        return;
      }

      const currTab = historyState.history[nodeIdx];
      const newNode = searchNodeFromRoot(currTab.id);

      if (newNode) {
        dispatchTabState({
          type: FETabReducerActionType.SET_CURR_DIR,
          payload: {
            tab: tabState.currentTabIdx,
            currDir: newNode,
            historyAction: {
              type: "manual",
              payload: {
                index: nodeIdx,
                history: [...historyState.history.slice(0, nodeIdx + 1)],
              },
            },
          },
        });
      }
    },
    [
      currentTab.historyState,
      dispatchTabState,
      nodeIdx,
      searchNodeFromRoot,
      tabState.currentTabIdx,
    ],
  );

  return (
    <button
      {...rest}
      onClick={handleClick}
      className={clsx(
        "flex items-center gap-1",
        "rounded-md",
        "px-1 py-0.5",
        "hover:bg-gray-400/40 dark:hover:bg-gray-600/40",
        "active:bg-gray-400/60 dark:active:bg-gray-600/60",
      )}
    >
      {node.name}
    </button>
  );
};

const AddressBar: React.FC = () => {
  const { home } = useFileTree();
  const { currentTab, tabState, dispatchTabState } = useFileExplorer();
  const { searchNodeFromRoot } = useSystemCall();

  const addressList = React.useMemo(() => {
    const pathList = [];
    let currentDir = tabState.tabs[tabState.currentTabIdx].currDir as INode;

    while (currentDir && currentDir.id !== home.id) {
      pathList.push(currentDir);
      currentDir = currentDir.parent as unknown as IDirectory;
    }

    pathList.push(home);

    return pathList.reverse();
  }, [home, tabState.currentTabIdx, tabState.tabs]);

  const handlePreviousClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      const historyState = currentTab.historyState;

      if (historyState.index <= 0) {
        return;
      }

      const currTab = historyState.history[historyState.index - 1];
      const newNode = searchNodeFromRoot(currTab.id);

      if (newNode) {
        dispatchTabState({
          type: FETabReducerActionType.UPDATE_BACKWARD_FILE,
          payload: {
            tab: tabState.currentTabIdx,
            newDir: newNode as IDirectory,
          },
        });
      } else {
        if (currTab.name !== "Recent") {
          throw new Error(
            `Invalid history state(ID: ${currTab.id}, Name: ${currTab.name})`,
          );
        }

        dispatchTabState({
          type: FETabReducerActionType.UPDATE_BACKWARD_RECENT,
          payload: {
            tab: tabState.currentTabIdx,
            newDir: {
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
            } as IDirectory,
          },
        });
      }
    },
    [
      currentTab.historyState,
      dispatchTabState,
      searchNodeFromRoot,
      tabState.currentTabIdx,
    ],
  );

  const handleNextClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      const historyState = currentTab.historyState;

      if (historyState.index >= historyState.history.length - 1) {
        return;
      }

      const currTab = historyState.history[historyState.index + 1];
      const newNode = searchNodeFromRoot(currTab.id);

      if (newNode) {
        dispatchTabState({
          type: FETabReducerActionType.UPDATE_FORWARD_FILE,
          payload: {
            tab: tabState.currentTabIdx,
            newDir: newNode as IDirectory,
          },
        });
      } else {
        if (currTab.name === "Recent") {
          dispatchTabState({
            type: FETabReducerActionType.UPDATE_FORWARD_RECENT,
            payload: {
              tab: tabState.currentTabIdx,
              newDir: {
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
              } as IDirectory,
            },
          });
        }
      }
    },
    [
      currentTab.historyState,
      dispatchTabState,
      searchNodeFromRoot,
      tabState.currentTabIdx,
    ],
  );

  React.useEffect(() => {
    const historyState = currentTab.historyState;

    if (typeof historyState === "undefined") return;
    if (historyState.history.length <= 0) return;
  }, [currentTab.historyState]);

  return (
    <div
      id="fe-address-bar"
      className={clsx(
        "flex items-center w-full p-2 gap-3",
        "border-b border-gray-300 dark:border-gray-700",
        "select-none",
      )}
    >
      <div id="fe-history" className="flex flex-[0_0_auto] gap-3 items-center">
        <IconBtn
          aria-disabled={currentTab.historyState.index <= 0}
          onClick={handlePreviousClick}
        >
          <ChevronLeftIcon />
          <p>Backward</p>
        </IconBtn>
        <IconBtn
          aria-disabled={
            currentTab.historyState.index >=
            currentTab.historyState.history.length - 1
          }
          onClick={handleNextClick}
        >
          <ChevronRightIcon />
          <p>Forward</p>
        </IconBtn>
      </div>
      <div
        className={clsx(
          "flex-[0_0_auto] flex-grow flex-shrink overflow-hidden",
          "flex relative items-center gap-3 group",
          "border border-gray-300 dark:border-gray-700",
          "rounded-md",
          "h-8 p-2 text-sm",
          "bg-[rgba(219,223,229,1)] dark:bg-[rgba(45,55,71,1)]",
          {
            "hover:bg-gray-300 dark:hover:bg-gray-700":
              !tabState.tabs[tabState.currentTabIdx].dragging,
          },
        )}
      >
        {tabState.tabs[tabState.currentTabIdx].directoryType ===
        FEDirectoryType.Recent ? (
          <AddressBtn
            node={
              {
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
              } as IDirectory
            }
            nodeIdx={-1}
          />
        ) : (
          addressList.map((address, i) => (
            <div key={i} className="flex items-center gap-3">
              <AddressBtn key={i} nodeIdx={i} node={address} />
              <p key={`p-${i}`}>/</p>
            </div>
          ))
        )}
        <div
          className={clsx(
            "absolute w-10 h-full right-0",
            "bg-gradient-to-r to-50%",
            "from-[rgba(219,223,229,0)] to-[rgba(219,223,229,1)]",
            "dark:from-[rgba(45,55,71,0)] dark:to-[rgba(45,55,71,1)]",
            "group-hover:to-0% group-hover:to-transparent",
          )}
        />
      </div>
      <div className="flex-[0_0_192px]">
        <div className="w-full">
          <input
            type="text"
            placeholder="Search"
            className={clsx(
              "w-full",
              "h-8",
              "rounded-md",
              "p-2",
              "text-sm",
              "bg-[rgba(219,223,229,1)] dark:bg-[rgba(45,55,71,1)]",
              "border border-transparent",
              "focus:outline-none focus:ring-2",
              "dark:focus:ring-gray-500",
              "placeholder-gray-500 dark:placeholder-gray-400",
              {
                "cursor-default": currentTab.dragging,
                "hover:bg-gray-300 dark:hover:bg-gray-700":
                  !currentTab.dragging,
                "hover:border-gray-400/50 dark:hover:border-gray-600":
                  !currentTab.dragging,
              },
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressBar;
