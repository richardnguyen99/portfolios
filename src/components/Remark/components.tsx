import type { createElement } from "react";
import type { ComponentOptions } from "rehype-react";

import RemarkParagraph from "./Paragraph";
import RemarkHeading1 from "./Heading1";
import RemarkHeading2 from "./Heading2";
import RemarkHeading3 from "./Heading3";
import type { RemarkParagraphProps, RemarkHeadingProps } from "./type";

const remarkComponents: ComponentOptions<typeof createElement>["components"] = {
  p: (props: RemarkParagraphProps) => <RemarkParagraph {...props} />,
  h1: (props: RemarkHeadingProps) => <RemarkHeading1 {...props} />,
  h2: (props: RemarkHeadingProps) => <RemarkHeading2 {...props} />,
  h3: (props: RemarkHeadingProps) => <RemarkHeading3 {...props} />,
  h4: (props: RemarkHeadingProps) => <RemarkHeading3 {...props} />,
  h5: (props: RemarkHeadingProps) => <RemarkHeading3 {...props} />,
  h6: (props: RemarkHeadingProps) => <RemarkHeading3 {...props} />,
};

export default remarkComponents;
