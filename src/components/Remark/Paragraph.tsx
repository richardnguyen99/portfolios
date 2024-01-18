import * as React from "react";

import { RemarkParagraphProps } from "./type";

const RemarkParagraph: React.FC<RemarkParagraphProps> = ({
  children,
  ...rest
}) => {
  return (
    <p {...rest} className="mb-4">
      {children}
    </p>
  );
};

export default RemarkParagraph;
