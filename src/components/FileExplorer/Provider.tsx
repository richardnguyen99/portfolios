import * as React from "react";

import FileExplorerContext from "./Context";
import {
  FETabReducerActionType,
  FileExplorerContextType,
  type FileExplorerProviderProps,
} from "./type";
import useFileTree from "@contexts/FileTree/useFileTree";
import useTabState from "./hooks/useTabState";

const FileExplorerProvider: React.FC<FileExplorerProviderProps> = ({
  children,
  initialDirectory,
}) => {
  const { home } = useFileTree();

  const [tabState, dispatchTabState] = useTabState(initialDirectory);
  const [dialog, setDialog] = React.useState<FileExplorerContextType["dialog"]>(
    {
      open: false,
      dialog: null,
      props: null,
    },
  );

  const currentTab = React.useMemo(() => {
    return tabState.tabs[tabState.currentTabIdx];
  }, [tabState.currentTabIdx, tabState.tabs]);

  const contextValue = React.useMemo<FileExplorerContextType>(() => {
    return {
      dialog,
      tabState,
      currentTab,

      setDialog,
      dispatchTabState,
    };
  }, [currentTab, dialog, dispatchTabState, tabState]);

  // React.useEffect(() => {
  // const newNode = updateNode(home, currDir as IDirectory);

  // if (!newNode) {
  // setCurrDir((prev) => ({ ...prev }));

  // return;
  // }

  // setCurrDir(newNode as INode);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [home, updateNode]);

  React.useEffect(() => {
    dispatchTabState({
      type: FETabReducerActionType.UPDATE_TABS_HOME,
      payload: {
        newHome: home,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  // React.useEffect(() => {
  // if (!currDir) {
  // const prevTab = historyState.history[historyState.index - 1];
  // const newNode = searchNodeFromRoot(prevTab.id);

  // if (newNode) {
  // setCurrDir(newNode);
  // dispatchHistoryState({
  // type: "pop",
  // });
  // }
  // }

  // setDragging(false);
  // }, [currDir, dispatchHistoryState, historyState, searchNodeFromRoot]);

  if (!currentTab.currDir) return null;

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export default FileExplorerProvider;
