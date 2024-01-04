import * as React from "react";
import clsx from "classnames";
import { Rnd } from "react-rnd";

import TitleBar from "./TitleBar";
import useModal from "@contexts/Modal/useModal";

export type WindowProps = {
  active: boolean;
  title: string;
  children?: React.ReactNode;
};

type Props = React.HTMLAttributes<HTMLDivElement> & WindowProps;

const INITIAL_X = 48;
const INITIAL_Y = 48;
const INITIAL_WIDTH = 384;
const INITIAL_HEIGHT = 384;

const Window: React.FC<Props> = ({ active, title, id = "" }) => {
  const { selectModal } = useModal();

  const handleSelect = React.useCallback(() => {
    selectModal(id);
  }, [id, selectModal]);

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
      bounds="body"
      dragHandleClassName="window-title-bar"
      cancel=".action-btn"
      enableUserSelectHack={false}
      style={{ display: "flex" }}
      minWidth={INITIAL_WIDTH}
      minHeight={INITIAL_HEIGHT}
      onMouseDown={handleSelect}
      className={clsx(
        "absolute flex flex-col top-[var(--window-y)] left-[var(--window-x)]",
        "rounded-lg w-[var(--window-width)] h-[var(--window-height)]",
        "overflow-hidden",
        "border border-gray-700",
        "cursor-[var(--window-cursor)]",
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas qui
        minima voluptatem amet totam aspernatur, nam dignissimos dicta officiis
        explicabo eaque, deleniti commodi perspiciatis eius doloribus!
        Laboriosam aliquam animi mollitia! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Voluptas qui minima voluptatem amet totam
        aspernatur, nam dignissimos dicta officiis explicabo eaque, deleniti
        commodi perspiciatis eius doloribus! Laboriosam aliquam animi mollitia!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas qui
        minima voluptatem amet totam aspernatur, nam dignissimos dicta officiis
        explicabo eaque, deleniti commodi perspiciatis eius doloribus!
        Laboriosam aliquam animi mollitia! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Voluptas qui minima voluptatem amet totam
        aspernatur, nam dignissimos dicta officiis explicabo eaque, deleniti
        commodi perspiciatis eius doloribus! Laboriosam aliquam animi mollitia!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas qui
        minima voluptatem amet totam aspernatur, nam dignissimos dicta officiis
        explicabo eaque, deleniti commodi perspiciatis eius doloribus!
        Laboriosam aliquam animi mollitia! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Voluptas qui minima voluptatem amet totam
        aspernatur, nam dignissimos dicta officiis explicabo eaque, deleniti
        commodi perspiciatis eius doloribus! Laboriosam aliquam animi mollitia!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas qui
        minima voluptatem amet totam aspernatur, nam dignissimos dicta officiis
        explicabo eaque, deleniti commodi perspiciatis eius doloribus!
        Laboriosam aliquam animi mollitia!
      </div>
    </Rnd>
  );
};

export default Window;
