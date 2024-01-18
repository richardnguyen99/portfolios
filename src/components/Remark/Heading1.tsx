import * as React from "react";

import { RemarkHeadingProps } from "./type";

const RemarkHeading1: React.FC<RemarkHeadingProps> = ({
  children,
  ...rest
}) => {
  return (
    <h1 {...rest} className="mb-7 text-3xl font-extrabold">
      {children}
    </h1>
  );
};

export default RemarkHeading1;
