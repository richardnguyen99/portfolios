import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Screen, Terminal } from "@components";
import useModal from "@contexts/Modal/useModal";

import "./index.css";

const App: React.FC = () => {
  const newTerminalHotKey = "ctrl+alt+t";
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
