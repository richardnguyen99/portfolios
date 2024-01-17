import * as React from "react";

import { WindowContextType, WindowProviderProps } from "./type";
import WindowContext from "./Context";
import RnDWindow from "./RndWindow";

const DEFAULT_X = 48;
const DEFAULT_Y = 48;
const DEFAULT_WIDTH = 384;
const DEFAULT_HEIGHT = 384;

type Props = React.PropsWithChildren<WindowProviderProps> &
  React.HTMLAttributes<HTMLDivElement>;

const WindowProvider: React.FC<Props> = ({
  active,
  title: initialTitle,
  id = "",
  fullscreen = false,
  initialSize = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  initialPosition = {
    x: DEFAULT_X,
    y: DEFAULT_Y,
  },
  children,
  ...rest
}) => {
  const [title, setTitle] = React.useState(initialTitle);

  const [pos, setPos] = React.useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [size, setSize] = React.useState({
    width: initialSize.width,
    height: initialSize.height,
  });

  const getTitle: WindowContextType["getTitle"] = React.useCallback(() => {
    return title;
  }, [title]);

  const getPosition: WindowContextType["getPosition"] =
    React.useCallback(() => {
      return { x: pos.x, y: pos.y };
    }, [pos]);

  const getSize: WindowContextType["getSize"] = React.useCallback(() => {
    return { width: size.width, height: size.height };
  }, [size]);

  const getActiveState: WindowContextType["getActiveState"] =
    React.useCallback(() => {
      return active;
    }, [active]);

  const getFullScreenState: WindowContextType["getFullScreenState"] =
    React.useCallback(() => {
      return fullscreen;
    }, [fullscreen]);

  const contextValue = React.useMemo<WindowContextType>(
    () => ({
      getActiveState,
      getFullScreenState,
      getTitle,
      getPosition,
      getSize,
      setPosition: setPos,
      setSize,
      setTitle,
    }),
    [getActiveState, getFullScreenState, getPosition, getSize, getTitle],
  );

  return (
    <WindowContext.Provider value={contextValue}>
      <RnDWindow id={id} {...rest}>
        {children}
      </RnDWindow>
    </WindowContext.Provider>
  );
};

export default WindowProvider;
