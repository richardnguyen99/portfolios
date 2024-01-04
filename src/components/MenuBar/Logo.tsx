import * as React from "react";
import clsx from "classnames";
import { Menu, Transition } from "@headlessui/react";

import IconHolder from "./IconHolder";
import { HotKey } from "@components";
import useModal from "@contexts/Modal/useModal";

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

type LogoItemProps<T extends HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  active: boolean;
  children: React.ReactNode | React.ReactNode[];

  // Allow forwardRef to be generic
} & React.AllHTMLAttributes<T>;

const LogoItemComponent = <T extends HTMLElement>(
  props: LogoItemProps<T>,
  ref: React.ForwardedRef<T>,
): JSX.Element => {
  const { children, active, as: Component = "button", ...rest } = props;

  return (
    <Component
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
    </Component>
  );
};

const ForwardedLogoItem = React.forwardRef(LogoItemComponent);

const Logo: React.FC = () => {
  const { addModal } = useModal();

  const handleNewTerminalClick = React.useCallback(() => {
    const id = crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0);

    addModal({
      id,
      title: "Terminal",
      type: "terminal",
      acitve: true,
    });
  }, [addModal]);

  return (
    <div className="flex">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button as={IconHolder}>
            <LogoIcon />
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
              "absolute w-72 left-0",
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
                  <ForwardedLogoItem
                    active={active}
                    onClick={handleNewTerminalClick}
                  >
                    <span>New Terminal</span>
                    <HotKey.NewTerminal />
                  </ForwardedLogoItem>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <ForwardedLogoItem active={active}>
                    <span>About</span>
                    <HotKey.About />
                  </ForwardedLogoItem>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <ForwardedLogoItem active={active}>
                    <span>Preferences</span>
                    <HotKey.Preference />
                  </ForwardedLogoItem>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <ForwardedLogoItem
                    as="a"
                    active={active}
                    href="mailto:richard@richardhnguyen.com"
                  >
                    Hire Me!
                  </ForwardedLogoItem>
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
