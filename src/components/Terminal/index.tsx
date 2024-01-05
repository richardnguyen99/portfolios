import * as React from "react";

import { Window } from "@components";
import TerminalProvider from "./Provider";
import { TerminalProps } from "./type";
import useTerminal from "./useTerminal";

type Props = TerminalProps & React.HTMLAttributes<HTMLDivElement>;

const InternalTerminal: React.FC<Props> = ({
  active,
  title,
  fullscreen,
  ...rest
}) => {
  const { displayPrompt } = useTerminal();

  return (
    <Window active={active} title={title} fullscreen={fullscreen} {...rest}>
      <div>{displayPrompt()}</div>
    </Window>
  );
};

const Terminal: React.FC<Props> = ({ active, title, fullscreen, ...rest }) => {
  return (
    <TerminalProvider>
      <InternalTerminal
        active={active}
        title={title}
        fullscreen={fullscreen}
        {...rest}
      />
    </TerminalProvider>
  );
};

export default Terminal;
