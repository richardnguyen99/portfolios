import * as React from "react";
import clsx from "classnames";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { type DSCallbackObject, type DSInputElement } from "dragselect";

import { INode } from "@util/fs/type";
import DragSelect from "./DragSelect";
import useDragSelect from "./DragSelect/hook";
import useWindow from "@components/Window/useWindow";

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

const GridViewItems: React.FC<GridViewProps> = ({ nodes }) => {
  const { getId } = useWindow();
  const ds = useDragSelect();

  const [area, setArea] = React.useState(0);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [itemCount, setItemCount] = React.useState(0);

  // This useEffect is used to update the dimension and position of the
  // selector area. DragSelect uses an actual DOM element, which is done
  // through `containerRef.current`. to calculate the position of the selector
  // area. However, React won't update the actual DOM element.
  React.useEffect(() => {
    const containerRefCurrent = containerRef.current;
    const windowContainer = document.querySelector(
      `[x-data-window-id="${getId()}"]`,
    );

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;

      console.log(entries[0].contentRect);

      setArea(entries[0].contentRect.width * entries[0].contentRect.height);
      setPos({
        x: entries[0].contentRect.width,
        y: entries[0].contentRect.height,
      });
    });

    const mutationObserver = new MutationObserver((entries) => {
      if (!entries[0]) return;

      const fsContent = windowContainer?.querySelector("#fe-fs-content > span");

      if (!fsContent) return;

      const fsContentRect = fsContent.getBoundingClientRect();

      setArea(fsContentRect.width * fsContentRect.height);
      setPos({
        x: fsContentRect.x,
        y: fsContentRect.y,
      });
    });

    if (containerRefCurrent) {
      resizeObserver.observe(containerRefCurrent);
      mutationObserver.observe(windowContainer as Node, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (containerRefCurrent) {
        resizeObserver.unobserve(containerRefCurrent);
        mutationObserver.disconnect();
      }
    };
  }, [getId]);

  React.useEffect(() => {
    if (!containerRef.current || !ds) return;

    ds.setSettings({
      area: containerRef.current,
      selectedClass: "selected",
      selectableClass: "selectable",
      dropZoneReadyClass: "drop-zone-ready",
    });

    const dsCallback = ({
      items,
      isDragging,
      dropTarget,
    }: DSCallbackObject<DSInputElement>) => {
      if (!isDragging || !dropTarget || !items) return;
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds.subscribe("DS:end", dsCallback);

    const add = ({ value = 1 }) => setItemCount((prev) => prev + value);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds.subscribe("__add", add);

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ds.unsubscribe("DS:end", dsCallback);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ds.unsubscribe("__add", add);
    };
  }, [ds, containerRef, area, pos]);

  return (
    <div
      ref={containerRef}
      className="flex-grow flex-shrink-0 flex flex-col justify-between m-0"
    >
      <div
        className={clsx(
          "grid grid-cols-[repeat(auto-fill,_minmax(96px,_0fr))]",
          "[grid-gap:_1.5rem]",
          "window-scrollbar",
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

const GridView: React.FC<GridViewProps> = ({ nodes }) => {
  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger className="flex flex-col w-full justify-between select-none">
        <DragSelect.Provider settings={{ selectedClass: "selector" }}>
          <GridViewItems nodes={nodes} />
        </DragSelect.Provider>
      </ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Content
        className={clsx(
          "flex flex-col gap-1",
          "min-w-[18rem]",
          "p-2 rounded-md",
          "font-extrabold",
          "bg-gray-300 dark:bg-gray-700",
          "border border-gray-400 dark:border-gray-600",
          "shadow-lg",
          "shadow-gray-400 dark:shadow-gray-900",
        )}
      >
        <ContextMenuPrimitive.Item
          className={clsx(
            "flex items-center",
            "px-3 py-2 rounded-md",
            "hover:bg-gray-400 dark:hover:bg-gray-600",
            "outline-none focus:outline-none border-none",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4"></div>
            <div>New Folder</div>
          </div>
          <div className="ml-auto font-mono font-light text-xs">something</div>
        </ContextMenuPrimitive.Item>
        <ContextMenuPrimitive.Item
          className={clsx(
            "flex items-center",
            "px-3 py-2 rounded-md",
            "hover:bg-gray-400 dark:hover:bg-gray-600",
            "outline-none focus:outline-none border-none",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4"></div>
            <div>New File</div>
          </div>
          <div className="ml-auto font-mono font-light text-xs">something</div>
        </ContextMenuPrimitive.Item>
        <ContextMenuPrimitive.Item
          className={clsx(
            "flex items-center",
            "px-3 py-2 rounded-md",
            "hover:bg-gray-400 dark:hover:bg-gray-600",
            "outline-none focus:outline-none border-none",
          )}
        >
          <div className="flex items-center gap-2">
            <CheckBadgeIcon className="w-4 h-4" />
            <div>Open</div>
          </div>
          <div className="ml-auto font-mono font-light text-xs">something</div>
        </ContextMenuPrimitive.Item>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Root>
  );
};

export default GridView;
