import * as React from "react";
import clsx from "classnames";

const MenuBar: React.FC = () => {
  return (
    <div
      id="menu-bar"
      className={clsx(
        "relative",
        "bg-gray-900",
        "text-gray-100",
        "font-bold",
        "overflow-hidden",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "h-6",
      )}
    >
      Hello
    </div>
  );
};

export default MenuBar;
