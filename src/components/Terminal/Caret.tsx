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
        className={clsx("inline h-max", "text-slate-100 bg-slate-100", {
          "text-slate-800 bg-slate-800": blinked,
          "text-slate-100 bg-slate-100": !blinked,
        })}
      >
        C
      </span>
    ) : (
      <span
        x-data-caret={blinked.toString()}
        className={clsx("inline h-max", "text-slate-700 bg-slate-100", {
          "text-slate-100 bg-slate-800": blinked,
          "text-slate-800 bg-slate-100": !blinked,
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

  return active && caretWithChar;
};

export default Caret;
