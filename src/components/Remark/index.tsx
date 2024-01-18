import * as React from "react";
import { useRemark } from "react-remark";

import { RemarkProps } from "./type";
import useWindow from "@components/Window/useWindow";
import remarkComponents from "./components";

type Props = RemarkProps & React.HTMLAttributes<HTMLDivElement>;

const Remark: React.FC<Props> = ({ rawContent, ...rest }) => {
  const { setTitle } = useWindow();
  const [renderedContent, setRenderedContent] = useRemark({
    rehypeReactOptions: {
      components: remarkComponents,
    },
  });

  React.useEffect(() => {
    setTitle((prev) => `Remark - ${prev}`);
    setRenderedContent(rawContent);
  }, [rawContent, setRenderedContent, setTitle]);

  return (
    <div {...rest} className="remark m-6 font-sans text-base">
      {renderedContent}
    </div>
  );
};

export default Remark;
