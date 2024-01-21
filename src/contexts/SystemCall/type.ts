import * as React from "react";

export type SystemCallContextType = {
  readDir: () => void;
};

export type SystemCallProviderProps = {
  children: React.ReactNode;
};
