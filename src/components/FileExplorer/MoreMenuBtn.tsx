import * as React from "react";
import clsx from "classnames";
import { Menu, Transition } from "@headlessui/react";
import { ThreeBarsIcon } from "@primer/octicons-react";

import IconBtn from "./IconBtn";
import useFileExplorer from "./hook";

type MoreMenuItemProps = {
  active: boolean;
  children: React.ReactNode | React.ReactNode[];
} & React.HTMLAttributes<HTMLButtonElement>;

const MoreMenuItemComponent = (
  props: MoreMenuItemProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): JSX.Element => {
  const { children, active, ...rest } = props;

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={clsx(
        "w-full flex items-center justify-between",
        "first:rounded-t-md last:rounded-b-md",
        "px-4 py-2 text-sm",
        {
          "dark:bg-gray-700/50 dark:text-gray-100": active,
          "bg-gray-300/50 text-gray-900": active,
          "text-gray-100": active,
        },
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

const ForwardedMoreMenuItem = React.forwardRef(MoreMenuItemComponent);

const MoreMenuBtn: React.FC = () => {
  const { doesShowHidden, setShowHidden } = useFileExplorer();

  const handleSetHiddenClick = React.useCallback(() => {
    setShowHidden((prev) => !prev);
  }, [setShowHidden]);

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button as={IconBtn}>
            <ThreeBarsIcon />
          </Menu.Button>
        </div>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 -translate-y-2"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 translate-y-2"
        >
          <Menu.Items
            className={clsx(
              "rounded-md border",
              "absolute w-52 right-0",
              "mt-2",
              "text-sm",
              "divide-y",
              "shadow-lg",
              "ring-1 focus:outline-none",
              "dark:bg-gray-800 dark:ring-black/5",
              "dark:border-gray-700 dark:divide-gray-100",
              "bg-gray-200 ring-gray-300/5",
              "border-gray-300 divide-gray-700",
              "shadow-lg shadow-gray-400 dark:shadow-gray-900",

              "z-[9999]",
            )}
          >
            <div className="">
              <Menu.Item>
                {({ active }) => (
                  <ForwardedMoreMenuItem
                    active={active}
                    onClick={handleSetHiddenClick}
                  >
                    {doesShowHidden ? "Hide" : "Show"} hidden folders
                  </ForwardedMoreMenuItem>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <ForwardedMoreMenuItem
                    active={active}
                    onClick={() => {
                      console.log("open terminal");
                    }}
                  >
                    Open Terminal
                  </ForwardedMoreMenuItem>
                )}
              </Menu.Item>
              <hr className="border-gray-300 dark:border-gray-700" />
              <Menu.Item>
                {({ active }) => (
                  <ForwardedMoreMenuItem
                    active={active}
                    onClick={() => {
                      console.log("show properties");
                    }}
                  >
                    Properties
                  </ForwardedMoreMenuItem>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default MoreMenuBtn;
