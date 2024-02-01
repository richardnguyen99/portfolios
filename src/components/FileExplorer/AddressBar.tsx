import * as React from "react";
import clsx from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";

import IconBtn from "./IconBtn";
import useFileExplorer from "./hook";
import useFileTree from "@contexts/FileTree/useFileTree";
import { type IDirectory } from "@util/fs/type";

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
  const { dragging, currDir } = useFileExplorer();

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
        <IconBtn>
          <ChevronLeftIcon />
        </IconBtn>
        <IconBtn>
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
