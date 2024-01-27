import * as React from "react";
import clsx from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";

import IconBtn from "./IconBtn";

const AddressBar: React.FC = () => {
  return (
    <div
      id="fe-address-bar"
      className={clsx(
        "flex items-center w-full p-2 gap-3",
        "border-b border-gray-300 dark:border-gray-700",
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
          "hover:bg-gray-300 dark:hover:bg-gray-700",
        )}
      >
        <h1>Home</h1>
        <h1>/</h1>
        <h1>Home</h1>
        <h1>/</h1>
        <h1>Home</h1>
        <h1>/</h1>
        <h1>Home</h1>
        <h1>/</h1>
        <h1>Home</h1>
        <h1>/</h1>
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
              "hover:bg-gray-300 dark:hover:bg-gray-700",
              "border border-transparent",
              "hover:border-gray-400/50 dark:hover:border-gray-600",
              "focus:outline-none focus:ring-2",
              "dark:focus:ring-gray-500",
              "placeholder-gray-500 dark:placeholder-gray-400",
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressBar;
