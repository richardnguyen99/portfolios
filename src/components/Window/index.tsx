import * as React from "react";

import type { WindowProviderProps } from "./type";
import WindowProvider from "./Provider";

const Window: React.FC<WindowProviderProps> = ({
  children,
  active,
  title,
  fullscreen,
  initialPosition,
  initialSize,
  minimumSize,
  id,
}) => {
  return (
    <WindowProvider
      id={id}
      active={active}
      title={title}
      initialPosition={initialPosition}
      initialSize={initialSize}
      fullscreen={fullscreen}
      minimumSize={minimumSize}
    >
      {children}
    </WindowProvider>
  );
};

export default Window;
