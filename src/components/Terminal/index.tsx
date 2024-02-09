import * as React from "react";
import clsx from "classnames";

import useModal from "@contexts/Modal/useModal";
import useWindow from "@components/Window/useWindow";
import TerminalProvider from "./Provider";
import useTerminal from "./useTerminal";
import Caret from "./Caret";
import { TerminalProps } from "./type";

const InternalTerminal: React.FC = () => {
  const { getActiveState } = useWindow();
  const { displayPrompt, getWindowId, execute, renderBuffer } = useTerminal();
  const { closeModal, addModal } = useModal();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);

  const [caretKey, setCaretKey] = React.useState(0);
  const [text, setText] = React.useState("");
  const [pos, setPos] = React.useState(0);

  const active = React.useMemo(() => getActiveState(), [getActiveState]);

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
    async (e: KeyboardEvent): Promise<void> => {
      if (!active) return;

      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        const cmd = text.trim();

        await execute(cmd);

        setText((_prev) => "");
      }
    },
    [active, text, execute],
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

        addModal({
          id,
          title: "Terminal",
          type: "terminal",
          active: true,

          isFullScreen: false,
          isFullScreenAllowed: true,
          component: Terminal,
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

  const renderedBuffer = React.useMemo(() => renderBuffer(), [renderBuffer]);

  React.useEffect(() => {
    if (!active) return;

    if (inputRef.current) {
      inputRef.current.scrollIntoView();
    }
  }, [active, renderedBuffer]);

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
    <div
      className={clsx("window-scrollbar h-full relative ", {
        "select-text": active,
        "select-none": !active,
      })}
    >
      <div className={clsx("break-words whitespace-pre-wrap")}>
        {renderedBuffer}
        <div>
          <span>{displayPrompt()}</span>
          <span id="text" ref={textRef}>
            {text.slice(0, pos)}
            <Caret key={caretKey} active={active}>
              {text[pos]}
            </Caret>
            {text.slice(pos + 1, text.length)}
          </span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="text"
        autoFocus={active}
        onChange={handleInputChange}
        onSelect={handleSelect}
        className="bg-transparent w-full outline-none text-transparent select-none cursor-default selection:bg-transparent h-0"
        value={text}
      />
    </div>
  );
};

const Terminal: React.FC<TerminalProps> = ({ initialDir }) => {
  return (
    <TerminalProvider initialDir={initialDir}>
      <InternalTerminal />
    </TerminalProvider>
  );
};

export default Terminal;
