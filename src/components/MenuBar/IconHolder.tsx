import * as React from "react";
import clsx from "classnames";

export interface ItemHolderProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

type Props = React.HTMLAttributes<HTMLDivElement> & ItemHolderProps;

const IconHolder = React.forwardRef<HTMLDivElement, Props>(
  ({ children, onClick, ...rest }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        {...rest}
        onClick={handleClick}
        className={clsx("relative", "px-2 py-2", "hover:bg-sky-500")}
      >
        {children}
      </div>
    );
  },
);

export default IconHolder;
