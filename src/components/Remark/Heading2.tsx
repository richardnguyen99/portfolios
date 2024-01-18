import * as React from "react";

import { RemarkHeadingProps } from "./type";

const RemarkHeading2: React.FC<RemarkHeadingProps> = ({
  children,
  ...rest
}) => {
  return (
    <h2 {...rest} className="mb-6 text-2xl font-bold">
      {children}
    </h2>
  );
};

export default RemarkHeading2;
