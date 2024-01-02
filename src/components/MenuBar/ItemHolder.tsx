import * as React from "react";
import clsx from "classnames";

export interface ItemHolderProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

type Props = React.HTMLAttributes<HTMLButtonElement> & ItemHolderProps;

const ItemHolder: React.FC<Props> = ({ children, onClick, ...rest }) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={clsx("relative", "px-3 py-2", "hover:bg-sky-500")}
    >
      {children}
    </button>
  );
};

export default ItemHolder;
