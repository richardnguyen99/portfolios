import * as React from "react";
import clsx from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";

import IconBtn from "./IconBtn";

const AddressBar: React.FC = () => {
  return (
    <div
      id="fe-address-bar"
      className={clsx(
        "flex items-center",
        "border-b border-gray-300 dark:border-gray-700",
      )}
    >
      <div id="fe-history" className="flex gap-3 p-2 items-center">
        <IconBtn>
          <ChevronLeftIcon />
        </IconBtn>
        <IconBtn>
          <ChevronRightIcon />
        </IconBtn>
      </div>
      <div>Address</div>
      <div>Search</div>
    </div>
  );
};

export default AddressBar;
