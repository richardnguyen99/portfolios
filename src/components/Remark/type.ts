import * as React from "react";

export type RemarkProps = {
  rawContent: string;
};

export type RemarkHeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  React.PropsWithChildren;

export type RemarkParagraphProps = React.HTMLAttributes<HTMLParagraphElement> &
  React.PropsWithChildren;

export type RemarkCodeProps = React.HTMLAttributes<HTMLElement> &
  React.PropsWithChildren;

export type RemarkPreProps = React.HTMLAttributes<HTMLPreElement> &
  React.PropsWithChildren;
