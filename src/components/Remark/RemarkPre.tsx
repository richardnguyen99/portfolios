import * as React from "react";
import clsx from "classnames";

import { RemarkPreProps } from "./type";

const RemarkPre: React.FC<RemarkPreProps> = ({ children, ...rest }) => {
  return (
    <pre
      {...rest}
      className={clsx(
        "rounded-lg text-sm border",
        "mb-6",
        "px-6 py-4",
        "whitespace-break-spaces",
        "dark:border-slate-600 border-slate-400",
        "dark:bg-slate-900 bg-gray-200",
      )}
    >
      {children}
    </pre>
  );
};

export default RemarkPre;
