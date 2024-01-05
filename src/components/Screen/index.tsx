import * as React from "react";
import clsx from "classnames";

import { MenuBar } from "@components";
import useModal from "@contexts/Modal/useModal";

const Screen: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { renderModals, deselectAllModals } = useModal();

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (
        e.target instanceof Element &&
        e.target.getAttribute("id") === "window-container"
      ) {
        deselectAllModals();
      }
    },
    [deselectAllModals],
  );

  return (
    <div
      ref={ref}
      id="screen"
      onMouseDown={handleMouseDown}
      className={clsx(
        "relative flex flex-col overflow-hidden",
        "bg-gray-900",
        "w-screen h-screen",
      )}
    >
      <MenuBar />
      <div id="window-container" className="relative h-full">
        {renderModals()}
      </div>
    </div>
  );
};

export default Screen;
