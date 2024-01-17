import * as React from "react";

export type WindowPosition = { x: number; y: number };
export type WindowSize = { width: number; height: number };

export type SetWindowSizeParams =
  | WindowSize
  | ((size: WindowSize) => WindowSize);

export type SetPositionParams =
  | WindowPosition
  | ((position: WindowPosition) => WindowPosition);

export type SetTitleParams = string | ((title: string) => string);

export type WindowContextType = {
  getId: () => string;
  getActiveState: () => boolean;
  getFullScreenState: () => boolean;
  getTitle: () => string;
  getSize: () => WindowSize;
  getPosition: () => WindowPosition;

  setSize: (value: SetWindowSizeParams) => void;
  setPosition: (value: SetPositionParams) => void;
  setTitle: (value: SetTitleParams) => void;
};

export type WindowProviderProps = {
  id: string;

  /**
   * Whether the window is active or not. An active tab will be rendered on top
   * of other tabs, have more vibrant color and listen to user interactions.
   *
   * @default true
   */
  active: boolean;

  /**
   * The title of the window briefly descibing its content.
   */
  title: string;

  /**
   * Whether the current window is maximized or not.
   *
   * @default false
   */
  fullscreen?: boolean;

  /**
   * The initial size of the window. If not provided, the window will be given
   * with its own default size.
   *
   * @default undefined
   * @default { width: 384, height: 384 }
   */
  initialSize?: WindowSize;

  /**
   * The initial position of the window. If not provided, the window will be
   * given with its own default position.
   *
   * @default undefined
   * @default { x: 40, y: 40 }
   */
  initialPosition?: WindowPosition;

  /**
   * The children components to be rendered inside the window. All applications
   * should inherit from the window component and render their own content as
   * children.
   */
  children: React.ReactNode;
};
