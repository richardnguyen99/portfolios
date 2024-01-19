import * as React from "react";
import clsx from "classnames";

import { RemarkCodeProps } from "./type";

const RemarkCode: React.FC<RemarkCodeProps> = ({ children, ...rest }) => {
  return (
    <code
      {...rest}
      className={clsx(
        "rounded-lg text-sm border",
        "px-2 py-1",
        "dark:border-slate-600 border-slate-400",
        "dark:bg-slate-900 bg-gray-200",
      )}
    >
      {children}
    </code>
  );
};

export default RemarkCode;
