import * as React from "react";

import { Window } from "@components";
import TerminalProvider from "./Provider";
import { TerminalProps } from "./type";
import useTerminal from "./useTerminal";
import Caret from "./Caret";
import useModal from "@contexts/Modal/useModal";

type Props = TerminalProps & React.HTMLAttributes<HTMLDivElement>;
type InternalProps = Pick<TerminalProps, "active">;

const InternalTerminal: React.FC<InternalProps> = ({ active }) => {
  const { displayPrompt, getWindowId } = useTerminal();
  const { closeModal, addModal } = useModal();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);

  const [caretKey, setCaretKey] = React.useState(0);
  const [text, setText] = React.useState("");
  const [pos, setPos] = React.useState(0);

  const handleInputChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (!active) return;

      setText(evt.target.value === " " ? "&nbsp;" : evt.target.value);
      setPos(Number(inputRef.current?.selectionStart));
      setCaretKey(crypto.getRandomValues(new Uint32Array(1))[0]);
    },
    [active],
  );

  const handleSelect = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    if (!active) return;
    // eslint-disable-next-line no-param-reassign
    evt.target.selectionStart = evt.target.selectionEnd;
  };

  const handleKeyPress = React.useCallback(
    (e: KeyboardEvent): void => {
      if (!active) return;

      if (e.key === "Enter") {
        //onKeyEnter();
        setText("");
      }
    },
    [setText, active],
  );

  const handleKeyDown = React.useCallback(
    (evt: KeyboardEvent) => {
      if (!active) return;

      if (evt.ctrlKey && evt.altKey && evt.key === "w") {
        evt.preventDefault();
        evt.stopPropagation();

        closeModal(getWindowId());
        return;
      }

      if (evt.ctrlKey && evt.altKey && evt.key === "t") {
        const id = crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0);
        console.log("New Terminal", id);

        addModal({
          id,
          title: "Terminal",
          type: "terminal",
          active: true,

          isFullScreen: false,
          isFullScreenAllowed: true,
        });
      }

      if (evt.ctrlKey && evt.altKey && evt.key === "c") {
        setText("");
      }

      setPos(Number(inputRef.current?.selectionStart));
      setCaretKey(crypto.getRandomValues(new Uint32Array(1))[0]);
    },
    [active, addModal, closeModal, getWindowId],
  );

  const handleKeyUp = React.useCallback(() => {
    setPos(Number(inputRef.current?.selectionStart));
    setCaretKey(crypto.getRandomValues(new Uint32Array(1))[0]);
  }, []);

  React.useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => inputRef.current?.focus(), 1);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("keypress", handleKeyPress);

    return (): void => {
      clearInterval(interval);

      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress, handleKeyDown, active, handleKeyUp]);

  return (
    <>
      <div className="break-words">
        <span>{displayPrompt()}</span>
        <span id="text" ref={textRef}>
          {text.slice(0, pos)}
          <Caret key={caretKey} active={active}>
            {text[pos]}
          </Caret>
          {text.slice(pos + 1, text.length)}
        </span>
      </div>

      <input
        ref={inputRef}
        type="text"
        autoFocus={active}
        onChange={handleInputChange}
        onSelect={handleSelect}
        className="bg-transparent w-full outline-none text-transparent select-none cursor-default selection:bg-transparent"
        value={text}
      />
    </>
  );
};

const Terminal: React.FC<Props> = ({
  active,
  title,
  fullscreen,
  id,
  ...rest
}) => {
  return (
    <Window
      id={id}
      active={active}
      title={title}
      fullscreen={fullscreen}
      {...rest}
    >
      <TerminalProvider id={id || ""}>
        <InternalTerminal active={active} {...rest} />
      </TerminalProvider>
    </Window>
  );
};

export default Terminal;
