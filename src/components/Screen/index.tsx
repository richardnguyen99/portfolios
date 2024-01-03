import * as React from "react";
import clsx from "classnames";

import { MenuBar, Window } from "@components";

const Screen: React.FC = () => {
  return (
    <div
      className={clsx(
        "relative flex flex-col overflow-hidden",
        "bg-gray-700",
        "w-screen h-screen",
      )}
    >
      <MenuBar />
      <div id="window-container">
        <Window title="something" />
      </div>
    </div>
  );
};

export default Screen;
