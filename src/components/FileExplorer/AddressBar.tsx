import * as React from "react";
import clsx from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";

import IconBtn from "./IconBtn";
import useFileExplorer from "./hook";
import useFileTree from "@contexts/FileTree/useFileTree";
import { type IDirectory } from "@util/fs/type";
import useSystemCall from "@contexts/SystemCall/useSystemCall";

const AddressBtn: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
> = ({ children, ...rest }) => (
  <button
    {...rest}
    className={clsx(
      "flex items-center gap-1",
      "rounded-md",
      "px-1 py-0.5",
      "hover:bg-gray-400/40 dark:hover:bg-gray-600/40",
      "active:bg-gray-400/60 dark:active:bg-gray-600/60",
    )}
  >
    {children}
  </button>
);

const AddressBar: React.FC = () => {
  const { home } = useFileTree();
  const { dragging, currDir, historyState, setCurrDir, dispatchHistoryState } =
    useFileExplorer();
  const { searchNodeFromRoot } = useSystemCall();

  const addressList = React.useMemo(() => {
    const pathList = [];
    let currentDir = currDir;
    console.log("is currentDir home? ", Object.is(currentDir, home));

    while (currentDir && currentDir.id !== home.id) {
      pathList.push(currentDir);
      currentDir = currentDir.parent as unknown as IDirectory;
    }

    pathList.push(home);

    return pathList.reverse();
  }, [currDir, home]);

  const handlePreviousClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      console.log("previous clicked");

      if (historyState.index <= 0) {
        return;
      }

      const currTab = historyState.history[historyState.index - 1];
      const newNode = searchNodeFromRoot(currTab.id);

      if (newNode) {
        setCurrDir(newNode);
        dispatchHistoryState({
          type: "previous",
        });
      }
    },
    [
      dispatchHistoryState,
      historyState.history,
      historyState.index,
      searchNodeFromRoot,
      setCurrDir,
    ],
  );

  const handleNextClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      console.log("next clicked");

      if (historyState.index >= historyState.history.length - 1) {
        return;
      }

      const currTab = historyState.history[historyState.index + 1];
      const newNode = searchNodeFromRoot(currTab.id);

      if (newNode) {
        setCurrDir(newNode);
        dispatchHistoryState({
          type: "next",
        });
      }
    },
    [dispatchHistoryState, historyState, searchNodeFromRoot, setCurrDir],
  );

  React.useEffect(() => {
    if (typeof historyState === "undefined") return;
    if (historyState.history.length <= 0) return;

    console.log(historyState.history);
  }, [historyState]);

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
          aria-disabled={historyState.index <= 0}
          onClick={handlePreviousClick}
        >
          <ChevronLeftIcon />
        </IconBtn>
        <IconBtn
          aria-disabled={historyState.index >= historyState.history.length - 1}
          onClick={handleNextClick}
        >
          <ChevronRightIcon />
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
            "hover:bg-gray-300 dark:hover:bg-gray-700": !dragging,
          },
        )}
      >
        {addressList.map((address, i) => (
          <div key={i} className="flex items-center gap-3">
            <AddressBtn key={i}>{address.name}</AddressBtn>
            <p key={`p-${i}`}>/</p>
          </div>
        ))}
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
                "cursor-default": dragging,
                "hover:bg-gray-300 dark:hover:bg-gray-700": !dragging,
                "hover:border-gray-400/50 dark:hover:border-gray-600":
                  !dragging,
              },
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressBar;
