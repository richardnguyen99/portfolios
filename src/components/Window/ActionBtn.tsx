import * as React from "react";
import clsx from "classnames";

export type ActionBtnProps = {
  active?: boolean;
  variant: "close" | "minimize" | "maximize";
};

type Props = React.HTMLAttributes<HTMLButtonElement> & ActionBtnProps;

const ActionBtn: React.FC<Props> = ({
  active = true,
  variant,
  onClick,
  ...rest
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx("action-btn relative w-3 h-3 rounded-full", {
        "bg-green-500": active && variant === "maximize",
        "bg-yellow-500": active && variant === "minimize",
        "bg-red-500": active && variant === "close",
        "bg-green-100": !active && variant === "maximize",
        "bg-yellow-100": !active && variant === "minimize",
        "bg-red-100": !active && variant === "close",
      })}
      {...rest}
    ></button>
  );
};

export default ActionBtn;
