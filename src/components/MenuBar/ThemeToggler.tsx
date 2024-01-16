import * as React from "react";
import clsx from "classnames";
import { Menu, Transition } from "@headlessui/react";

import IconHolder from "./IconHolder";
import useTheme from "@contexts/Theme/useTheme";

const SunIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
};

const MoonIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
};

type ThemeItemProps = {
  active: boolean;
  children: React.ReactNode | React.ReactNode[];
} & React.HTMLAttributes<HTMLButtonElement>;

const ThemeItemComponent = (
  props: ThemeItemProps,
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
          "bg-gray-800 text-gray-100": active,
          "text-gray-100": active,
        },
      )}
      {...rest}
    >
      {children}
    </button>
  );
  1;
};

const ForwardedThemeItem = React.forwardRef(ThemeItemComponent);

const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button as={IconHolder}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
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
              "absolute w-52 right-0",
              "mt-2",
              "text-sm",
              "divide-y divide-gray-100",
              "bg-gray-900 shadow-lg",
              "ring-1 ring-black/5 focus:outline-none",
              "z-[9999]",
            )}
          >
            <div className="">
              <Menu.Item>
                {({ active }) => (
                  <ForwardedThemeItem
                    active={active}
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <p>Set theme</p>
                    <p>{theme === "dark" ? "Dark" : "Light"}</p>
                  </ForwardedThemeItem>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default ThemeToggler;
