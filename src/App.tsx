import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Screen } from "@components";

import "./index.css";

const App: React.FC = () => {
  const newTerminalHotKey = "ctrl+alt+t";
  const aboutHotKey = "ctrl+alt+a";
  const preferenceHotKey = "ctrl+alt+p";

  useHotkeys(newTerminalHotKey, () => {
    console.log("New Terminal");
  });

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
