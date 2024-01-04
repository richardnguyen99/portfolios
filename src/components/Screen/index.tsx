import * as React from "react";
import clsx from "classnames";

import { MenuBar } from "@components";
import useModal from "@contexts/Modal/useModal";

const Screen: React.FC = () => {
  const { renderModals } = useModal();

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
        {renderModals()}
      </div>
    </div>
  );
};

export default Screen;
