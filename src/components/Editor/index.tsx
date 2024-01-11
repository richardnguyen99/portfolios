import * as React from "react";
import * as MonacoEditor from "@monaco-editor/react";
import twColors from "tailwindcss/colors";
import { editor as EditorAPI } from "monaco-editor/esm/vs/editor/editor.api";

import { Window } from "@components";
import type { EditorProps } from "./type";

type Props = EditorProps & React.HTMLAttributes<HTMLDivElement>;

const Editor: React.FC<Props> = ({
  active,
  title: initialTitle,
  fullscreen,
  id,
  initialText = "",
  file,
  ...rest
}) => {
  const editorRef = React.useRef<EditorAPI.IStandaloneCodeEditor | null>(null);

  const [title, setTitle] = React.useState(initialTitle);
  const [, setSaved] = React.useState(true);
  const [text, setText] = React.useState(initialText);

  const getLanguageId = React.useCallback(() => {
    const extension = title.split(".").pop() ?? "";

    if (extension === "md") {
      return "markdown";
    }

    if (extension === "js") {
      return "javascript";
    }

    if (extension === "ts") {
      return "typescript";
    }

    return "plaintext";
  }, [title]);

  return (
    <Window
      id={id}
      active={active}
      title={title}
      fullscreen={fullscreen}
      initialSize={{ width: 1024, height: 768 }}
      initialPosition={{ x: 80, y: 80 }}
      {...rest}
    >
      <MonacoEditor.Editor
        loading={null}
        width="100%"
        height="100%"
        defaultLanguage="plaintext"
        defaultValue={initialText}
        options={{
          "semanticHighlighting.enabled": true,
          bracketPairColorization: {
            enabled: true,
            independentColorPoolPerBracketType: true,
          },
          minimap: {
            enabled: false,
          },
          guides: {
            indentation: true,
            bracketPairsHorizontal: "active",
            highlightActiveIndentation: true,
            bracketPairs: true,
            highlightActiveBracketPair: true,
          },
          renderFinalNewline: "dimmed",
          rulers: [80],
          wordWrapColumn: 80,
          wordWrap: "wordWrapColumn",
        }}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("my-theme", {
            base: "vs-dark",
            colors: {
              "editor.background": twColors.gray[800],
              "editorSuggestWidget.background": twColors.gray[800],
              "editorSuggestWidget.border": twColors.gray[600],
              "editorSuggestWidget.selectedBackground": twColors.sky[700],
              "list.hoverBackground": "#0284c75f", // twColors.sky[700] with 37% opacity,
              "editor.lineHighlightBackground": "#374151",
              "editor.lineHighlightBorder": "#374151",
              "editorCursor.foreground": "#f1f5f9",
              "editor.selectionBackground": "#4b5563ff",
              "editorLineNumber.foreground": "#9ca3af",
              "editorLineNumber.dimmedForeground": "#4b5563",
            },
            inherit: true,
            rules: [
              { token: "comment", foreground: "ffa500", fontStyle: "italic" },
              { token: "comment.js", foreground: "008800", fontStyle: "bold" },
              { token: "comment.css", foreground: "0000ff" }, // will inherit fontStyle from `comment` above
              { token: "comment.scss", foreground: "0000ff" }, // will inherit fontStyle from `comment` above
            ],
          });
        }}
        value={text}
        saveViewState={true}
        onChange={(_value, _event) => {
          setSaved((prev) => {
            if (prev === true) {
              setTitle((prev) => `${prev} *`);
            }

            return false;
          });
          setText((prev) => _value ?? prev);
        }}
        onMount={(editor, monaco) => {
          const model = editor.getModel();

          model?.setEOL(monaco.editor.EndOfLineSequence.LF);

          monaco.editor.setTheme("my-theme");
          monaco.editor.setModelLanguage(model!, getLanguageId());

          editor.onKeyDown((e) => {
            if (e.keyCode === monaco.KeyCode.KeyS && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              e.stopPropagation();

              // Insert a final new line if the last line is not empty
              const lastLine = model?.getLineCount() ?? 0;
              const lastColumn = model?.getLineMaxColumn(lastLine) ?? 0;
              const lastLineText = model?.getLineContent(lastLine) ?? "";

              if (lastLineText.length !== 0) {
                model?.applyEdits([
                  {
                    range: new monaco.Range(
                      lastLine,
                      lastColumn,
                      lastLine,
                      lastColumn,
                    ),
                    text: "\n",
                  },
                ]);
              }

              // Save the file
              if (file) {
                file.content = model?.getValue() ?? "";
              }

              setSaved(true);
              setTitle(initialTitle);
            }
          });

          editorRef.current = editor;
        }}
      />
    </Window>
  );
};

export default Editor;
