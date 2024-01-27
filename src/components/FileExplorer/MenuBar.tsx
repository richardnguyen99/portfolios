import * as React from "react";
import clsx from "classnames";

import FlexBtn from "./FlexBtn";
import {
  FileAddedIcon,
  FileDirectorySymlinkIcon,
  SortDescIcon,
  TableIcon,
  ThreeBarsIcon,
} from "@primer/octicons-react";
import IconBtn from "./IconBtn";

const MenuBar: React.FC = () => {
  return (
    <div
      id="fe-menu-bar"
      className={clsx(
        "relative flex items-center",
        "p-2 z-0",
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
        <FlexBtn>
          <>
            <TableIcon />
            View Grid
          </>
        </FlexBtn>
      </div>
      <div className="flex-[0_0_auto] bg-gray relative z-[2]">
        <IconBtn>
          <ThreeBarsIcon />
        </IconBtn>
      </div>
      <div
        className={clsx(
          "absolute right-0 z-[1]",
          "w-20 h-full",
          "bg-gradient-to-r to-40%",
          "from-gray-300 to-gray-400",
          "from-gray-200/0 to-gray-200/100",
          "dark:from-gray-800/0 dark:to-gray-800/100",
        )}
      />
    </div>
  );
};

export default MenuBar;
