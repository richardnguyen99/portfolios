import * as React from "react";
import * as MonacoEditor from "@monaco-editor/react";
import twColors from "tailwindcss/colors";
import { editor as EditorAPI } from "monaco-editor/esm/vs/editor/editor.api";

import { Window } from "@components";
import useLocalStorage from "@hooks/useLocalStorage";
import type { EditorProps } from "./type";
import useTheme from "@contexts/Theme/useTheme";
import parseLanguageId from "./parseLanguageId";

type Props = EditorProps & React.HTMLAttributes<HTMLDivElement>;

const Editor: React.FC<Props> = ({
  active,
  title: initialTitle,
  fullscreen,
  id,
  initialText = "",
  file,
  readOnly = false,
  ...rest
}) => {
  const [text, setText] = useLocalStorage<string>(`file-${id}`, initialText);
  const { theme } = useTheme();
  const editorRef = React.useRef<EditorAPI.IStandaloneCodeEditor | null>(null);

  const [title, setTitle] = React.useState(initialTitle);
  const [, setSaved] = React.useState(true);

  const getLanguageId = React.useCallback(() => {
    return parseLanguageId(title);
  }, [title]);

  const getTitle = React.useCallback(() => {
    const defaultFileName = title ?? "Editor";

    if (file?.writePermission === false) {
      return `${title} (read-only)`;
    }

    return defaultFileName;
  }, [file, title]);

  React.useEffect(() => {
    if (file) {
      file.accessedAt = new Date();
    }
  }, [file]);

  React.useEffect(() => {}, [theme]);

  return (
    <Window
      id={id}
      active={active}
      title={getTitle()}
      fullscreen={fullscreen}
      initialSize={{ width: 1024, height: 768 }}
      initialPosition={{ x: 80, y: 80 }}
      {...rest}
    >
      <MonacoEditor.Editor
        key={`editor-${id}-${theme}`}
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
          fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
        }}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("my-theme", {
            base: theme === "dark" ? "vs-dark" : "vs",
            colors: {
              "editor.background":
                theme === "dark" ? twColors.gray[800] : twColors.gray[100],
              "editorSuggestWidget.background":
                theme === "dark" ? twColors.gray[800] : twColors.gray[100],
              "editorSuggestWidget.border":
                theme === "dark" ? twColors.gray[600] : twColors.gray[300],
              "editorSuggestWidget.selectedBackground":
                theme === "dark" ? twColors.sky[700] : twColors.sky[200],
              "list.hoverBackground":
                theme === "dark" ? "#0284c75f" : "#bae6fd", // twColors.sky[700] with 37% opacity,
              "quickInput.background":
                theme === "dark" ? twColors.gray[800] : twColors.gray[100],
              "input.background":
                theme === "dark" ? twColors.gray[700] : twColors.gray[200],
              "editor.lineHighlightBackground":
                theme === "dark" ? twColors.gray[700] : twColors.gray[200],
              "editor.lineHighlightBorder":
                theme === "dark" ? twColors.gray[700] : twColors.gray[200],
              "editorCursor.foreground":
                theme === "dark" ? twColors.gray[100] : twColors.gray[900],
              "editor.selectionBackground":
                theme === "dark" ? twColors.gray[600] : twColors.gray[300],
              "editorLineNumber.foreground":
                theme === "dark" ? twColors.gray[400] : twColors.gray[600],
              "editorLineNumber.dimmedForeground":
                theme === "dark" ? twColors.gray[600] : twColors.gray[400],
              "scrollbar.shadow":
                theme === "dark" ? twColors.gray[800] : twColors.gray[200],
              "scrollbarSlider.background":
                theme === "dark" ? twColors.gray[700] : twColors.gray[200],
              "scrollbarSlider.hoverBackground":
                theme === "dark" ? twColors.gray[600] : twColors.gray[300],
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
              setTitle((prev) => `${prev} (unsaved)`);
            }

            return false;
          });
          // setText((prev: string) => _value ?? prev);
        }}
        onMount={(editor, monaco) => {
          const model = editor.getModel();

          model?.setEOL(monaco.editor.EndOfLineSequence.LF);

          monaco.editor.setTheme("my-theme");
          monaco.editor.setModelLanguage(model!, getLanguageId());

          editor.updateOptions({
            readOnly: file?.writePermission === false || readOnly,
          });

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
                file.updatedAt = new Date();

                setText(model?.getValue() ?? "");
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
