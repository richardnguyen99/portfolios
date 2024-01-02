import * as React from "react";
import clsx from "classnames";
import { Menu, Transition } from "@headlessui/react";

import IconHolder from "./IconHolder";

const LogoIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LogoItemProps = {
  active: boolean;
  children: React.ReactNode;
};

const LogoItem = React.forwardRef<HTMLButtonElement, LogoItemProps>(
  ({ children, active, ...rest }, ref) => {
    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        className={clsx(
          "w-full flex items-center justify-between",
          "px-4 py-2 text-sm",
          "first-of-type:rounded-t-md",
          "last-of-type:rounded-b-md",
          {
            "bg-gray-800 text-gray-100": active,
            "text-gray-100": active,
          },
        )}
        {...rest}
      >
        <span>{children}</span>
      </button>
    );
  },
);

const Logo: React.FC = () => {
  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button>
            <IconHolder>
              <LogoIcon />
            </IconHolder>
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
              "rounded-md border border-gray-700",
              "absolute w-56 left-0",
              "mt-2",
              "divide-y divide-gray-100",
              "bg-gray-900 shadow-lg",
              "ring-1 ring-black/5 focus:outline-none",
            )}
          >
            <div className="">
              <Menu.Item>
                {({ active }) => (
                  <LogoItem active={active}>New Terminal</LogoItem>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => <LogoItem active={active}>About</LogoItem>}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <LogoItem active={active}>Preferences</LogoItem>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Logo;
