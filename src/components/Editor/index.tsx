import * as React from "react";
import * as MonacoEditor from "@monaco-editor/react";
import twColors from "tailwindcss/colors";
import { editor as EditorAPI } from "monaco-editor/esm/vs/editor/editor.api";

import type { EditorProps } from "./type";
import parseLanguageId from "./parseLanguageId";
import useLocalStorage from "@hooks/useLocalStorage";
import useTheme from "@contexts/Theme/useTheme";
import useWindow from "@components/Window/useWindow";
import useSystemCall from "@contexts/SystemCall/useSystemCall";

type Props = EditorProps & React.HTMLAttributes<HTMLDivElement>;

const Editor: React.FC<Props> = ({
  initialText = "",
  file,
  readOnly = false,
}) => {
  const { theme } = useTheme();
  const { getTitle, setTitle, getId } = useWindow();
  const { updateFile } = useSystemCall();
  const [text, setText] = useLocalStorage<string>(
    `file-${getId()}`,
    initialText,
  );

  const editorRef = React.useRef<EditorAPI.IStandaloneCodeEditor | null>(null);

  const [, setSaved] = React.useState(true);

  const title = React.useMemo(() => getTitle(), [getTitle]);

  const getLanguageId = React.useCallback(() => {
    return parseLanguageId(title);
  }, [title]);

  const updateTitle = React.useCallback(() => {
    const defaultFileName = title ?? "Editor";

    if (file?.writePermission === false || readOnly) {
      return `${title} (read-only)`;
    }

    return defaultFileName;
  }, [file?.writePermission, readOnly, title]);

  return (
    <MonacoEditor.Editor
      key={`editor-${getId()}-${theme}`}
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
            "list.hoverBackground": theme === "dark" ? "#0284c75f" : "#bae6fd", // twColors.sky[700] with 37% opacity,
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
              theme === "dark" ? "#37415180" : twColors.gray[200],
            "scrollbarSlider.hoverBackground":
              theme === "dark" ? "#374151bf" : twColors.gray[300],
            "scrollbarSlider.activeBackground":
              theme === "dark" ? "#374151ff" : twColors.gray[400],
          },
          inherit: true,
          rules: [],
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
              updateFile(file, {
                size: model?.getValue(0, true).length ?? 0,
                lastModified: new Date(),
              });

              setText(model?.getValue() ?? "");
            }

            setSaved(true);
            setTitle(updateTitle());
          }
        });

        editorRef.current = editor;
        setTitle(updateTitle());
      }}
    />
  );
};

export default Editor;
