import * as React from "react";
import clsx from "classnames";

import ActionBtn from "./ActionBtn";
import useModal from "@contexts/Modal/useModal";

export type TitleBarProps = {
  title: string;
  windowId: string;
  active: boolean;

  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
};

type Props = React.HTMLAttributes<HTMLDivElement> & TitleBarProps;

const TitleBar = React.forwardRef<HTMLDivElement, Props>(
  ({ active, title, windowId, ...rest }, ref) => {
    const { closeModal, toggleFullScreen } = useModal();

    const handleClose = React.useCallback(() => {
      closeModal(windowId);
    }, [closeModal, windowId]);

    const handleMaximize = React.useCallback(() => {
      toggleFullScreen(windowId);
    }, [toggleFullScreen, windowId]);

    return (
      <div
        {...rest}
        ref={ref}
        onDoubleClick={handleMaximize}
        className={clsx(
          "window-title-bar", // for Rnd only
          "flex items-center justify-between",
          "px-2 py-1",
          "border-b border-gray-700",
          "rounded-t-lg",
          "select-none",
          {
            "bg-gray-900/20 text-slate-400": !active,
            "bg-gray-900/60 text-slate-100": active,
          },
        )}
      >
        <div className="flex gap-2 font-bold">
          <div>{title}</div>
        </div>
        <div className="flex items-center gap-2">
          <ActionBtn
            active={active}
            variant="maximize"
            onClick={handleMaximize}
          />
          <ActionBtn active={active} variant="minimize" />
          <ActionBtn active={active} variant="close" onClick={handleClose} />
        </div>
      </div>
    );
  },
);
TitleBar.displayName = "TitleBar";

export default TitleBar;
