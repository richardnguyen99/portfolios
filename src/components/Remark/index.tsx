import * as React from "react";
import { useRemark } from "react-remark";

import { RemarkProps } from "./type";
import useWindow from "@components/Window/useWindow";

type Props = RemarkProps & React.HTMLAttributes<HTMLDivElement>;

const Remark: React.FC<Props> = ({ rawContent, ...rest }) => {
  const { setTitle } = useWindow();
  const [renderedContent, setRenderedContent] = useRemark();

  React.useEffect(() => {
    setTitle((prev) => `Remark - ${prev}`);
    setRenderedContent(rawContent);
  }, [rawContent, setRenderedContent, setTitle]);

  return <div {...rest}>{renderedContent}</div>;
};

export default Remark;
