import * as React from "react";
import clsx from "classnames";

import { INode } from "@util/fs/type";

const Folder = () => (
  <svg
    className="w-16 h-16"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <linearGradient
      id="a"
      gradientTransform="matrix(0.45451 0 0 0.455522 -1210.292114 616.172607)"
      gradientUnits="userSpaceOnUse"
      x1="2689.251953"
      x2="2918.069824"
      y1="-1106.802979"
      y2="-1106.802979"
    >
      <stop offset="0" stopColor="#62a0ea" />
      <stop offset="0.0576991" stopColor="#afd4ff" />
      <stop offset="0.122204" stopColor="#62a0ea" />
      <stop offset="0.873306" stopColor="#62a0ea" />
      <stop offset="0.955997" stopColor="#c0d5ea" />
      <stop offset="1" stopColor="#62a0ea" />
    </linearGradient>
    <path
      d="m 21.976562 12 c -5.527343 0 -9.976562 4.460938 -9.976562 10 v 86.03125 c 0 5.542969 4.449219 10 9.976562 10 h 84.042969 c 5.53125 0 9.980469 -4.457031 9.980469 -10 v -72.085938 c 0 -6.628906 -5.359375 -12 -11.972656 -12 h -46.027344 c -2.453125 0 -4.695312 -1.386718 -5.796875 -3.582031 l -1.503906 -2.992187 c -1.65625 -3.292969 -5.019531 -5.371094 -8.699219 -5.371094 z m 0 0"
      fill="#438de6"
    />
    <path
      d="m 65.976562 36 c -2.746093 0 -5.226562 1.101562 -7.027343 2.890625 c -2.273438 2.253906 -5.382813 5.109375 -8.632813 5.109375 h -28.339844 c -5.527343 0 -9.976562 4.460938 -9.976562 10 v 54.03125 c 0 5.542969 4.449219 10 9.976562 10 h 84.042969 c 5.53125 0 9.980469 -4.457031 9.980469 -10 v -62.03125 c 0 -5.539062 -4.449219 -10 -9.980469 -10 z m 0 0"
      fill="url(#a)"
    />
    <path
      d="m 65.976562 32 c -2.746093 0 -5.226562 1.101562 -7.027343 2.890625 c -2.273438 2.253906 -5.382813 5.109375 -8.632813 5.109375 h -28.339844 c -5.527343 0 -9.976562 4.460938 -9.976562 10 v 55.976562 c 0 5.539063 4.449219 10 9.976562 10 h 84.042969 c 5.53125 0 9.980469 -4.460937 9.980469 -10 v -63.976562 c 0 -5.539062 -4.449219 -10 -9.980469 -10 z m 0 0"
      fill="#a4caee"
    />
  </svg>
);

type GridViewProps = {
  nodes: INode[];
};

const GridView: React.FC<GridViewProps> = ({ nodes }) => {
  const handleContextMenu = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();

      console.log(e);
    },
    [],
  );

  return (
    <div
      id="fe-fs"
      className="w-full flex flex-col justify-between"
      contextMenu="file-explorer"
      onContextMenu={handleContextMenu}
    >
      <div
        className={clsx(
          "grid grid-cols-[repeat(auto-fill,_minmax(96px,_0fr))]",
          "[grid-gap:_1.5rem]",
          "w-full p-4",
        )}
      >
        {nodes.map((node) => {
          return (
            <div
              key={node.name}
              className={clsx(
                "flex flex-col items-center",
                "rounded-md p-2",
                "hover:bg-gray-600/40",
              )}
            >
              <Folder />
              <span className="line-clamp-2 text-center [overflow-wrap:_anywhere] text-overflow">
                {node.name}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex relative">
        <div
          className={clsx(
            "relative ml-auto",
            "p-1 rounded-tl-lg text-xs",
            "border-t border-l",
            "border-gray-400/45 dark:border-gray-600",
            "bg-gray-300/45 dark:bg-gray-700",
          )}
        >
          Hello, World
        </div>
      </div>
    </div>
  );
};

export default GridView;
