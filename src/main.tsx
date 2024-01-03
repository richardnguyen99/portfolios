import * as React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { HotkeysProvider } from "react-hotkeys-hook";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HotkeysProvider>
      <App />
    </HotkeysProvider>
  </React.StrictMode>,
);
