import * as React from "react";
import { type DSCallbackObject, type DSInputElement } from "dragselect";

import useWindow from "@components/Window/useWindow";
import { type INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import GridView from "./GridView";
import useFileExplorer from "./hook";
import { FEViewType } from "./type";
import ListView from "./ListView";

type FSViewProps = {
  nodes: INode[];
};

const FSViewItems: React.FC<FSViewProps> = ({ nodes }) => {
  const { getId } = useWindow();
  const { viewType, setDragging } = useFileExplorer();
  const { ds } = useDragSelect();

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

    // This selector area is the actual DOM element that DragSelect creates and
    // uses to render the selector component.
    const selectorArea = document.querySelector(
      ".ds-selector-area",
    ) as HTMLElement;

    if (!containerRefCurrent || !windowContainer || !selectorArea) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;

      const fsContentRect = entries[0].target.getBoundingClientRect();

      selectorArea.style.width = `${fsContentRect.width}px`;
      selectorArea.style.height = `${fsContentRect.height}px`;
      selectorArea.style.top = `${fsContentRect.top}px`;
      selectorArea.style.left = `${fsContentRect.left}px`;
    });

    const mutationObserver = new MutationObserver((entries) => {
      if (!entries[0]) return;

      const fsContent = windowContainer?.querySelector(
        "#fe-fs-content > span > div:first-child",
      );

      if (!fsContent) return;

      const fsContentRect = fsContent.getBoundingClientRect();

      selectorArea.style.width = `${fsContentRect.width}px`;
      selectorArea.style.height = `${fsContentRect.height}px`;
      selectorArea.style.top = `${fsContentRect.y}px`;
      selectorArea.style.left = `${fsContentRect.x}px`;
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
      area: containerRef.current!,
      draggability: false,
      selectableClass: "selectable",
      selectorClass: "selector",
      selectedClass: "selected",
    });

    console.log(ds);

    const dsCallback = ({
      items,
      isDragging,
      dropTarget,
    }: DSCallbackObject<DSInputElement>) => {
      setDragging(false);
      if (!isDragging || !dropTarget || !items) return;
    };

    ds.subscribe("DS:start", () => setDragging(true));

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
  }, [containerRef, ds, setDragging]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col justify-between m-0 h-full"
    >
      {viewType === FEViewType.Grid ? (
        <GridView nodes={nodes} />
      ) : (
        <ListView nodes={nodes} />
      )}
    </div>
  );
};

export default FSViewItems;
