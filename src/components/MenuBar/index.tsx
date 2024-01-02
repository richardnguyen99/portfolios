import * as React from "react";
import clsx from "classnames";
import ItemHolder from "./ItemHolder";
import Clock from "./Clock";

const MenuBar: React.FC = () => {
  return (
    <div
      id="menu-bar"
      className={clsx(
        "relative overflow-hidden",
        "flex items-center justify-between",
        "bg-gray-900 text-gray-100",
        "font-bold",
        "h-8 px-4",
      )}
    >
      <div className="flex items-center">
        <ItemHolder onClick={() => {}}>
          <span>File</span>
        </ItemHolder>
        <ItemHolder onClick={() => {}}>
          <span>File</span>
        </ItemHolder>
        <ItemHolder onClick={() => {}}>
          <span>File</span>
        </ItemHolder>
      </div>
      <div className="flex items-center">
        <ItemHolder onClick={() => {}}>
          <span>GitHub</span>
        </ItemHolder>
        <ItemHolder onClick={() => {}}>
          <Clock />
        </ItemHolder>
      </div>
    </div>
  );
};

export default MenuBar;
