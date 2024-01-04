import * as React from "react";
import clsx from "classnames";

import { MenuBar, Window } from "@components";

const Screen: React.FC = () => {
  return (
    <div
      className={clsx(
        "relative flex flex-col overflow-hidden",
        "bg-gray-900",
        "w-screen h-screen",
      )}
    >
      <MenuBar />
      <div id="window-container" className="relative">
        <Window title="something" />
        <Window title="something 1" />
      </div>
    </div>
  );
};

export default Screen;
