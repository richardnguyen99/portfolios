import * as React from "react";
import clsx from "classnames";
import { Rnd } from "react-rnd";

import TitleBar from "./TitleBar";
import useModal from "@contexts/Modal/useModal";
import { useHotkeys } from "react-hotkeys-hook";

export type WindowProps = {
  active: boolean;
  title: string;
  fullscreen?: boolean;
  children?: React.ReactNode;
};

type Props = React.HTMLAttributes<HTMLDivElement> & WindowProps;

const INITIAL_X = 48;
const INITIAL_Y = 48;
const INITIAL_WIDTH = 384;
const INITIAL_HEIGHT = 384;

const Window: React.FC<Props> = ({
  active,
  title,
  id = "",
  fullscreen = false,
  children,
}) => {
  const { closeModal, selectModal } = useModal();

  const [pos, setPos] = React.useState({ x: INITIAL_X, y: INITIAL_Y });
  const [size, setSize] = React.useState({
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
  });

  const handleSelect = React.useCallback(() => {
    selectModal(id);
  }, [id, selectModal]);

  const handleClose = React.useCallback(() => {
    closeModal(id);
  }, [closeModal, id]);

  useHotkeys("ctrl+alt+w", () => {
    if (!active) return;

    handleClose();
  });

  return (
    <Rnd
      x-data-window-id={id}
      x-data-active-tab={active.toString()}
      default={{
        x: INITIAL_X,
        y: INITIAL_Y,
        width: INITIAL_WIDTH,
        height: INITIAL_HEIGHT,
      }}
      disableDragging={fullscreen || !active}
      enableResizing={{
        top: !fullscreen && active,
        right: !fullscreen && active,
        bottom: !fullscreen && active,
        left: !fullscreen && active,
        topRight: !fullscreen && active,
        bottomRight: !fullscreen && active,
        bottomLeft: !fullscreen && active,
        topLeft: !fullscreen && active,
      }}
      size={{
        width: fullscreen ? "100%" : size.width,
        height: fullscreen ? "100%" : size.height,
      }}
      position={{
        x: fullscreen ? 0 : pos.x,
        y: fullscreen ? 0 : pos.y,
      }}
      onDragStop={(_e, d) => {
        setPos({ x: d.x, y: d.y });
      }}
      onResize={(_e, _direction, ref, _delta, position) => {
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });

        setPos({ x: position.x, y: position.y });
      }}
      bounds="body"
      dragHandleClassName="window-title-bar"
      cancel=".action-btn"
      enableUserSelectHack={false}
      style={{ display: "flex" }}
      minWidth={INITIAL_WIDTH}
      minHeight={INITIAL_HEIGHT}
      onMouseDown={handleSelect}
      className={clsx(
        "absolute flex flex-col",
        "rounded-lg",
        "overflow-hidden",
        "border border-gray-700",
        {
          "bg-gray-800 text-slate-100": active,
          "bg-slate-800 text-slate-400": !active,
          "shadow-[0_22px_70px_4px_rgba(0,_0,_0,_0.56)]": active,
          "shadow-[0_22px_70px_4px_rgba(0,_0,_0,_0.16)]": !active,
        },
      )}
    >
      <TitleBar active={active} windowId={id} title={title} />
      <div
        id="window-content"
        className={clsx(
          "window-scrollbar",
          "font-mono text-sm",
          "relative w-full h-full",
          "pr-1",
          {
            "select-text": active,
            "select-none": !active,
          },
        )}
      >
        {children}
      </div>
    </Rnd>
  );
};

export default Window;
