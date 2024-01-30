import * as React from "react";
import DragSelect, { type DSInputElement } from "dragselect";

import { type DragSelectProviderProps } from "./type";
import DragSelectContext from "./Context";

const DragSelectProvider: React.FC<DragSelectProviderProps> = ({
  children,
  settings = {},
}) => {
  const [ds, setDS] = React.useState<DragSelect<DSInputElement>>();

  React.useEffect(() => {
    setDS((prev) => {
      if (prev) return prev;

      return new DragSelect({});
    });

    return () => {
      if (ds) {
        ds.stop();
        setDS(undefined);
      }
    };
  }, [ds]);

  React.useEffect(() => {
    if (!ds) return;

    ds.setSettings(settings);
  }, [ds, settings]);

  return (
    <DragSelectContext.Provider value={ds}>
      {children}
    </DragSelectContext.Provider>
  );
};

export default DragSelectProvider;
