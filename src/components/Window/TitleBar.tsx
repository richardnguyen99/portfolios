import * as React from "react";
import clsx from "classnames";

import ActionBtn from "./ActionBtn";
import useModal from "@contexts/Modal/useModal";

export type TitleBarProps = {
  title: string;
  windowId: string;

  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
};

type Props = React.HTMLAttributes<HTMLDivElement> & TitleBarProps;

const TitleBar = React.forwardRef<HTMLDivElement, Props>(
  ({ title, windowId, ...rest }, ref) => {
    const { closeModal } = useModal();

    const handleClose = React.useCallback(() => {
      closeModal(windowId);
    }, [closeModal, windowId]);

    return (
      <div
        {...rest}
        ref={ref}
        className={clsx(
          "window-title-bar", // for Rnd only
          "flex items-center justify-between",
          "px-2 py-1",
          "bg-gray-900/60",
          "border-b border-gray-700",
          "rounded-t-lg",
          "text-slate-100",
          "select-none",
        )}
      >
        <div className="flex gap-2 font-bold">
          <div>{title}</div>
        </div>
        <div className="flex items-center gap-2">
          <ActionBtn variant="maximize" />
          <ActionBtn variant="minimize" />
          <ActionBtn variant="close" onClick={handleClose} />
        </div>
      </div>
    );
  },
);
TitleBar.displayName = "TitleBar";

export default TitleBar;
