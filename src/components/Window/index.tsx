import * as React from "react";
import clsx from "classnames";

import TitleBar from "./TitleBar";

export type WindowProps = {
  title: string;
  children?: React.ReactNode;
};

type Props = React.HTMLAttributes<HTMLDivElement> & WindowProps;

const Window: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <div
      {...rest}
      className={clsx(
        "absolute top-12 left-12",
        "rounded-lg w-96 h-96",
        "overflow-hidden",
        "bg-slate-900",
        "shadow-[0_22px_70px_4px_rgba(0,_0,_0,_0.56)]",
        "border border-gray-700",
      )}
    >
      <TitleBar />
      <div
        id="window-content"
        className={clsx(
          "window-scrollbar",
          "text-slate-100 font-mono text-sm",
          "relative w-full h-full",
          "pr-1",
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
    </div>
  );
};

export default Window;
