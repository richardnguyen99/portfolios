import * as React from "react";

import { Window } from "@components";
import TerminalProvider from "./Provider";
import { TerminalProps } from "./type";
import useTerminal from "./useTerminal";
import Caret from "./Caret";

type Props = TerminalProps & React.HTMLAttributes<HTMLDivElement>;

const InternalTerminal: React.FC<Props> = ({
  active,
  title,
  fullscreen,
  ...rest
}) => {
  const { displayPrompt } = useTerminal();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [caretKey, setCaretKey] = React.useState(0);

  const [text, setText] = React.useState("");
  const [pos, setPos] = React.useState(0);

  const handleInputChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setText(evt.target.value === " " ? "&nbsp;" : evt.target.value);
      setPos(Number(inputRef.current?.selectionStart));
      setCaretKey(crypto.getRandomValues(new Uint32Array(1))[0]);
    },
    [],
  );

  const handleSelect = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    // eslint-disable-next-line no-param-reassign
    evt.target.selectionStart = evt.target.selectionEnd;
  };

  const handleKeyPress = React.useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === "Enter") {
        //onKeyEnter();
        setText("");
      }
    },
    [setText],
  );

  React.useEffect(() => {
    const keyArrowEvents = ["keyup", "keydown"];
    const interval = setInterval(() => inputRef.current?.focus(), 500);

    keyArrowEvents.map((evt) =>
      document.addEventListener(evt, () => {
        setPos(Number(inputRef.current?.selectionStart));
        setCaretKey(crypto.getRandomValues(new Uint32Array(1))[0]);
      }),
    );

    document.addEventListener("keypress", handleKeyPress);

    return (): void => {
      clearInterval(interval);

      keyArrowEvents.map((evt) =>
        document.removeEventListener(evt, () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          setPos(Number(inputRef.current?.selectionStart));
          setCaretKey(crypto.getRandomValues(new Uint32Array(1))[0]);
        }),
      );

      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Window active={active} title={title} fullscreen={fullscreen} {...rest}>
      <div className="break-words">
        <span>{displayPrompt()}</span>
        {text.slice(0, pos)}
        <Caret key={caretKey} active={active}>
          {text[pos]}
        </Caret>
        {text.slice(pos + 1, text.length)}
      </div>

      <input
        ref={inputRef}
        type="text"
        autoFocus
        onChange={handleInputChange}
        onSelect={handleSelect}
        className="bg-transparent w-full outline-none text-transparent"
        value={text}
      />
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
