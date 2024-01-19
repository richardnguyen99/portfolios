import type { createElement } from "react";
import type { ComponentOptions } from "rehype-react";

import RemarkParagraph from "./Paragraph";
import RemarkCode from "./Code";
import RemarkPre from "./RemarkPre";
import RemarkHeading1 from "./Heading1";
import RemarkHeading2 from "./Heading2";
import RemarkHeading3 from "./Heading3";
import type {
  RemarkParagraphProps,
  RemarkHeadingProps,
  RemarkCodeProps,
  RemarkPreProps,
} from "./type";

const remarkComponents: ComponentOptions<typeof createElement>["components"] = {
  p: (props: RemarkParagraphProps) => <RemarkParagraph {...props} />,
  h1: (props: RemarkHeadingProps) => <RemarkHeading1 {...props} />,
  h2: (props: RemarkHeadingProps) => <RemarkHeading2 {...props} />,
  h3: (props: RemarkHeadingProps) => <RemarkHeading3 {...props} />,
  h4: (props: RemarkHeadingProps) => <RemarkHeading3 {...props} />,
  h5: (props: RemarkHeadingProps) => <RemarkHeading3 {...props} />,
  h6: (props: RemarkHeadingProps) => <RemarkHeading3 {...props} />,
  code: (props: RemarkCodeProps) => {
    if (props.className?.includes("language-")) {
      return <code {...props} />;
    }

    return <RemarkCode {...props} />;
  },
  pre: (props: RemarkPreProps) => <RemarkPre {...props} />,
};

export default remarkComponents;
