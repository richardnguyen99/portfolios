import * as React from "react";

import { RemarkHeadingProps } from "./type";

const RemarkHeading3: React.FC<RemarkHeadingProps> = ({
  children,
  ...rest
}) => {
  return (
    <h3 {...rest} className="mb-5 text-xl font-semibold">
      {children}
    </h3>
  );
};

export default RemarkHeading3;
