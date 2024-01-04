import * as React from "react";
import ReactDOM from "react-dom/client";
import { HotkeysProvider } from "react-hotkeys-hook";

import App from "./App.tsx";
import { Modal } from "@contexts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Modal.Provider>
      <HotkeysProvider>
        <App />
      </HotkeysProvider>
    </Modal.Provider>
  </React.StrictMode>,
);
