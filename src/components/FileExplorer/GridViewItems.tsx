import * as React from "react";
import clsx from "classnames";
import { type DSCallbackObject, type DSInputElement } from "dragselect";

import useWindow from "@components/Window/useWindow";
import { type INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import GridViewItem from "./GridViewItem";

type GridViewProps = {
  nodes: INode[];
};

const GridViewItems: React.FC<GridViewProps> = ({ nodes }) => {
  const { getId } = useWindow();
  const ds = useDragSelect();

  const [area, setArea] = React.useState(0);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [, setItemCount] = React.useState(0);

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
      className="flex flex-col justify-between m-0 h-full"
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
          return <GridViewItem key={node.id} node={node} />;
        })}
      </div>
    </div>
  );
};

export default GridViewItems;
