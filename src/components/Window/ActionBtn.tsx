import * as React from "react";
import clsx from "classnames";

export type ActionBtnProps = {
  variant: "close" | "minimize" | "maximize";
};

type Props = React.HTMLAttributes<HTMLButtonElement> & ActionBtnProps;

const ActionBtn: React.FC<Props> = ({ variant, onClick, ...rest }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx("action-btn relative w-3 h-3 rounded-full", {
        "bg-green-500": variant === "maximize",
        "bg-yellow-500": variant === "minimize",
        "bg-red-500": variant === "close",
      })}
      {...rest}
    ></button>
  );
};

export default ActionBtn;
