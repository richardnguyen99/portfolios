import * as React from "react";
import clsx from "classnames";

export interface ItemHolderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

type Props = React.HTMLAttributes<HTMLElement> & ItemHolderProps;

const ItemHolder: React.FC<Props> = ({
  children,
  onClick,
  as: Component = "button",
  ...rest
}) => {
  const handleCallback = (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Component
      {...rest}
      onClick={handleCallback}
      className={clsx(
        "relative",
        "px-3 py-2",
        "hover:bg-sky-400",
        "dark:hover:bg-sky-500",
      )}
    >
      {children}
    </Component>
  );
};

export default ItemHolder;
