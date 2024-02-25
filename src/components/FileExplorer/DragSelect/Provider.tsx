import * as React from "react";
import DragSelect, { type DSInputElement } from "dragselect";

import { type DragSelectProviderProps } from "./type";
import DragSelectContext from "./Context";
import useFileExplorer from "../hook";

const DragSelectProvider: React.FC<DragSelectProviderProps> = ({
  children,
  initialSettings = {},
}) => {
  const { currDir } = useFileExplorer();

  const [ds, setDS] = React.useState<DragSelect<DSInputElement>>();
  const [settings, setSettings] = React.useState({ id: 0, ...initialSettings });

  React.useEffect(() => {
    setDS((prev) => {
      if (prev) {
        return prev;
      }

      return new DragSelect({});
    });

    return () => {
      if (ds) {
        ds.stop();
        setDS(undefined);
      }
    };
  }, [ds]);

  React.useLayoutEffect(() => {
    if (!ds) return;

    ds.setSettings(settings);
  }, [ds, settings]);

  const contextValue = React.useMemo(
    () => ({
      ds,
      setSettings,
    }),
    [ds],
  );

  React.useEffect(() => {
    if (!ds) return;

    ds.SelectedSet.clear();
  }, [currDir, ds]);

  return (
    <DragSelectContext.Provider value={contextValue}>
      {children}
    </DragSelectContext.Provider>
  );
};

export default DragSelectProvider;
