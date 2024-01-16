import * as React from "react";
import clsx from "classnames";

const Caret: React.FC<{
  children?: string;
  active: boolean;
}> = ({ active, children }) => {
  const [blinked, setBlinked] = React.useState(false);

  const caretWithChar =
    typeof children === "undefined" ? (
      <span
        x-data-caret={blinked.toString()}
        className={clsx("inline h-max", {
          "dark:text-slate-800 dark:bg-slate-800": blinked,
          "dark:text-slate-100 dark:bg-slate-100": !blinked,
          "text-gray-200 bg-slate-200": blinked,
          "text-slate-800 bg-slate-800": !blinked,
        })}
      >
        C
      </span>
    ) : (
      <span
        x-data-caret={blinked.toString()}
        className={clsx("inline h-max", {
          "dark:text-slate-100 dark:bg-slate-800": blinked,
          "dark:text-slate-800 dark:bg-slate-100": !blinked,
          "text-slate-800 bg-slate-200": blinked,
          "text-slate-200 bg-slate-800": !blinked,
        })}
      >
        {children}
      </span>
    );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBlinked(!blinked);
    }, 550);

    return (): void => {
      clearInterval(interval);
    };
  });

  return active ? caretWithChar : children;
};

export default Caret;
