import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Screen } from "@components";

import "./index.css";

const App: React.FC = () => {
  const isMacOS = navigator.platform.toLowerCase().includes("MAC");

  const hotKey = isMacOS ? "cmd+alt+t" : "ctrl+alt+t";

  useHotkeys(hotKey, () => {
    console.log("New Terminal");
  });

  return (
    <>
      <Screen />
    </>
  );
};

export default App;
