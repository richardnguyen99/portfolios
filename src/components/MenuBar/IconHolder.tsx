import * as React from "react";
import clsx from "classnames";

export interface ItemHolderProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type Props = React.HTMLAttributes<HTMLButtonElement> & ItemHolderProps;

const IconHolder: React.FC<Props> = ({ children, onClick, ...rest }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...rest}
      onClick={handleClick}
      className={clsx("relative", "px-2 py-2", "hover:bg-sky-500")}
    >
      {children}
    </button>
  );
};

export default IconHolder;
