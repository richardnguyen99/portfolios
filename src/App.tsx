import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";

// import { FileExplorer, Screen, Terminal } from "@components";
import useModal from "@contexts/Modal/useModal";

const FileExplorer = React.lazy(() => import("@components/FileExplorer"));
const Screen = React.lazy(() => import("@components/Screen"));
const Terminal = React.lazy(() => import("@components/Terminal"));

import "./index.css";

const App: React.FC = () => {
  const newTerminalHotKey = "ctrl+alt+t";
  const newFileExplorerHotkey = "ctrl+alt+f";
  const aboutHotKey = "ctrl+alt+a";
  const preferenceHotKey = "ctrl+alt+p";

  const { addModal } = useModal();

  useHotkeys(
    newTerminalHotKey,
    () => {
      const id = crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0);

      addModal({
        id,
        title: "Terminal",
        type: "terminal",
        active: true,

        isFullScreen: false,
        isFullScreenAllowed: true,
        component: Terminal,
        componentProps: {},
      });
    },
    {
      document,
    },
  );

  useHotkeys(
    newFileExplorerHotkey,
    () => {
      const id = crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0);

      addModal({
        id,
        title: "File Explorer",
        type: "explorer",
        active: true,

        initialSize: {
          width: 800,
          height: 680,
        },

        initialPosition: {
          x: 64,
          y: 64,
        },

        minimumSize: {
          width: 680,
          height: 400,
        },

        isFullScreen: false,
        isFullScreenAllowed: true,
        component: FileExplorer,
        componentProps: {},
      });
    },
    {
      document,
    },
  );

  useHotkeys(aboutHotKey, () => {
    console.log("About");
  });

  useHotkeys(preferenceHotKey, () => {
    console.log("Preference");
  });

  return (
    <>
      <Screen />
    </>
  );
};

export default App;
