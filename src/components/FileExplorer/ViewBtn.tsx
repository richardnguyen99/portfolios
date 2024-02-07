import * as React from "react";
import { TableIcon, ThreeBarsIcon } from "@primer/octicons-react";

import FlexBtn from "./FlexBtn";
import useFileExplorer from "./hook";
import { FEViewType } from "./type";

const ViewBtn: React.FC = () => {
  const { viewType, setViewType } = useFileExplorer();

  const handleClick = React.useCallback(() => {
    setViewType((prev) => {
      if (prev === FEViewType.List) return FEViewType.Grid;

      return FEViewType.List;
    });
  }, [setViewType]);

  return (
    <FlexBtn onClick={handleClick}>
      {viewType === FEViewType.List ? (
        <>
          <TableIcon />
          View Grid
        </>
      ) : (
        <>
          <ThreeBarsIcon />
          View List
        </>
      )}
    </FlexBtn>
  );
};

export default ViewBtn;
