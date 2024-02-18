import React from "react";
import ReactDOM from "react-dom/client";
import { HotkeysProvider } from "react-hotkeys-hook";

import App from "./App.tsx";
import { Modal, FileTree, Theme, SystemCall, RecentFiles } from "@contexts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FileTree.Provider>
      <RecentFiles.Provider>
        <SystemCall.Provider>
          <Theme.Provider>
            <Modal.Provider>
              <HotkeysProvider>
                <App />
              </HotkeysProvider>
            </Modal.Provider>
          </Theme.Provider>
        </SystemCall.Provider>
      </RecentFiles.Provider>
    </FileTree.Provider>
  </React.StrictMode>,
);
