import * as React from "react";
import clsx from "classnames";
import { FileDirectorySymlinkIcon, SortDescIcon } from "@primer/octicons-react";

import FlexBtn from "./FlexBtn";
import MoreMenuBtn from "./MoreMenuBtn";
import ViewBtn from "./ViewBtn";

const MenuBar: React.FC = () => {
  return (
    <div
      id="fe-menu-bar"
      className={clsx(
        "relative flex items-center",
        "p-2 z-[999]",
        "border-b border-gray-300 dark:border-gray-700",
      )}
    >
      <div
        className={clsx(
          "relative z-[1]",
          "flex items-center",
          "flex-[0_0_auto] flex-grow flex-shrink overflow-hidden",
          "gap-3",
        )}
      >
        <FlexBtn>
          <>
            <FileDirectorySymlinkIcon />
            New Directory
          </>
        </FlexBtn>
        <FlexBtn>
          <>
            <SortDescIcon />
            Sort Files
          </>
        </FlexBtn>
        <ViewBtn />
      </div>
      <div className="flex-[0_0_auto] bg-gray relative z-[2]">
        <MoreMenuBtn />
      </div>
      <div
        className={clsx(
          "absolute right-0 z-[1]",
          "w-20 h-full",
          "bg-gradient-to-r to-40%",
          "from-gray-200/0 to-gray-200/100",
          "dark:from-gray-800/0 dark:to-gray-800/100",
        )}
      />
    </div>
  );
};

export default MenuBar;
