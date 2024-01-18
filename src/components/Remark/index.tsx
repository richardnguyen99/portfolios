import * as React from "react";
import { useRemark } from "react-remark";

import type { RemarkProps } from "./type";

const Remark: React.FC<RemarkProps> = ({ rawContent }) => {
  const [renderedContent, setRenderedContent] = useRemark();

  React.useEffect(() => {
    setRenderedContent(rawContent);
  }, [rawContent, setRenderedContent]);

  return renderedContent;
};

export default Remark;
