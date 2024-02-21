import * as React from "react";
import { type DSCallbackObject, type DSInputElement } from "dragselect";

import useWindow from "@components/Window/useWindow";
import { IDirectory, INode } from "@util/fs/type";
import useDragSelect from "./DragSelect/hook";
import GridView from "./GridView";
import useFileExplorer from "./hook";
import { FEDirectoryType, FEViewType } from "./type";
import ListView from "./ListView";
import useRecentFiles from "@contexts/RecentFiles/hook";
import useSystemCall from "@contexts/SystemCall/useSystemCall";

const FSViewItems: React.FC = () => {
  const { getId } = useWindow();
  const { currDir, viewType, directoryType, setDragging, doesShowHidden } =
    useFileExplorer();
  const { ds } = useDragSelect();
  const { searchNodeWithPath } = useSystemCall();
  const { recentFiles } = useRecentFiles();

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [, setItemCount] = React.useState(0);

  const nodes = React.useMemo(() => {
    console.log("nodes updated");

    if (directoryType === FEDirectoryType.Recent) {
      const recentNodes = recentFiles.map((recentFile) => {
        const node = searchNodeWithPath(null, recentFile.path);

        if (!node) return null;

        return node;
      });

      return recentNodes.filter((node) => node !== null) as INode[];
    }

    return (currDir as IDirectory).children;
  }, [currDir, directoryType, recentFiles, searchNodeWithPath]);

  const filterNodes = React.useMemo(() => {
    console.log("filterNodes updated");

    return nodes.filter((node) => {
      if (node.name.startsWith(".") && !doesShowHidden) return false;

      return true;
    });
  }, [doesShowHidden, nodes]);

  // This useEffect is used to update the dimension and position of the
  // selector area. DragSelect uses an actual DOM element, which is done
  // through `containerRef.current`. to calculate the position of the selector
  // area. However, React won't update the actual DOM element.
  React.useEffect(() => {
    const containerRefCurrent = containerRef.current;
    const windowContainer = document.querySelector(
      `[x-data-window-id="${getId()}"]`,
    ) as HTMLElement;

    // This selector area is the actual DOM element that DragSelect creates and
    // uses to render the selector component.
    const selectorArea = document.querySelector(
      ".ds-selector-area",
    ) as HTMLElement;

    if (!containerRefCurrent || !windowContainer || !selectorArea || !ds)
      return;

    const mutationObserver = new MutationObserver((entries) => {
      if (!entries[0]) return;

      const fsContent = windowContainer.querySelector(
        "#fe-fs-content > span > div:first-child",
      );

      if (!fsContent) return;

      console.log("DS area updated on mutation");
      ds.setSettings({
        area: containerRef.current!,
        draggability: false,
        selectableClass: "selectable",
        selectorClass: "selector",
        selectedClass: "selected",
      });
    });

    if (containerRefCurrent) {
      mutationObserver.observe(windowContainer as Node, {
        attributes: true,
      });
    }

    return () => {
      if (containerRefCurrent) {
        mutationObserver.disconnect();
      }
    };
  }, [ds, containerRef, getId]);

  React.useEffect(() => {
    if (!containerRef.current || !ds) return;

    ds.setSettings({
      area: containerRef.current!,
      draggability: false,
      selectableClass: "selectable",
      selectorClass: "selector",
      selectedClass: "selected",
    });

    console.log("DS settings updated");

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
  }, [containerRef, ds, setDragging, viewType]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col justify-between m-0 h-full"
    >
      {viewType === FEViewType.Grid ? (
        <GridView nodes={filterNodes} />
      ) : (
        <ListView key={directoryType} nodes={filterNodes} />
      )}
    </div>
  );
};

export default FSViewItems;
