import * as React from "react";
import clsx from "classnames";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import useSystemCall from "@contexts/SystemCall/useSystemCall";
import { IDirectory } from "@util/fs/type";
import useFileExplorer from "../hook";

export type AddNewFileModalProps = AlertDialog.AlertDialogContentProps & {
  onCanceled?: () => void;
  onSaved?: () => void;
  initialName?: string;
};

const AddNewFileDialogRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  AddNewFileModalProps
> = (props, ref) => {
  const { onCanceled, onSaved, initialName = "", ...rest } = props;

  const { addFile } = useSystemCall();
  const { currDir } = useFileExplorer();

  const [name, setName] = React.useState(initialName);
  const [error, setError] = React.useState<string | null>(null);

  const nameList = React.useMemo(() => {
    return (currDir as IDirectory).children.map((child) => child.name);
  }, [currDir]);

  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [],
  );

  const handleSaveClick = React.useCallback(async () => {
    try {
      await addFile(currDir as IDirectory, name);
    } catch (err) {
      setError((err as Error).message);
      return;
    }

    if (onSaved) {
      onSaved();
    }
  }, [addFile, currDir, name, onSaved]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSaveClick();
      }
    },
    [handleSaveClick],
  );

  React.useEffect(() => {
    if (nameList.includes(name)) {
      setError("File already exists");
    } else if (name === "") {
      setError("File name cannot be empty");
    } else {
      setError(null);
    }

    return () => {
      setError(null);
    };
  }, [name, nameList]);

  return (
    <AlertDialog.Content
      {...rest}
      ref={ref}
      forceMount
      className={clsx(
        "fixed top-1/2 left-1/2 w-[32rem]",
        "transform -translate-x-1/2 -translate-y-1/2",
        "rounded-lg pt-4 z-[1000]",
        "bg-white dark:bg-gray-800",
        "border border-gray-300 dark:border-gray-700",
        "shadow-lg shadow-gray-600 dark:shadow-gray-900",
        "focus:outline-none",
      )}
    >
      <AlertDialog.Title className="text-lg font-extrabold mb-4 px-4">
        New File
      </AlertDialog.Title>
      <AlertDialog.Description asChild>
        <div className="w-full px-4 mb-2">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            autoFocus
            className={clsx(
              "w-full px-2 py-1",
              "rounded-md focus:ring-1 border",
              "bg-slate-100/30 dark:bg-gray-700/30",
              "hover:bg-slate-100/50 dark:hover:bg-gray-700/50",
              "hover:bg-slate-100/100 dark:focus:bg-gray-700/75",
              "border-gray-300 dark:border-gray-700",
              "hover:border-gray-400/50 dark:border-gray-600/50",
              "focus:outline-none focus:ring-gray-500 dark:focus:ring-gray-400",
            )}
            placeholder="Enter file name"
          />
        </div>
      </AlertDialog.Description>
      <AlertDialog.Description className="text-sm text-red-500 dark:text-red-400 px-4 mb-2 h-5">
        {error}
      </AlertDialog.Description>
      <div className="flex items-center border-t border-gray-300 dark:border-gray-700">
        <AlertDialog.Cancel
          asChild
          onClick={onCanceled}
          className={clsx(
            "w-1/2",
            "border-r border-gray-300 dark:border-gray-700 py-2",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "active:bg-gray-200/40 dark:active:bg-gray-600/40",
            "rounded-bl-lg",
            "font-bold",
            "focus:outline-none focus:ring-0",
          )}
        >
          <button className="btn">Cancel</button>
        </AlertDialog.Cancel>
        <AlertDialog.Action
          asChild
          onClick={handleSaveClick}
          disabled={error !== null}
          className={clsx(
            "w-1/2 py-2",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "rounded-br-lg",
            "font-bold ",
            "hover:bg-green-100 dark:hover:bg-green-900/30",
            "active:text-green-600 dark:active:text-green-500",
            "active:bg-green-100 dark:active:bg-green-900/50",
            "focus:outline-none focus:ring-0",
            {
              "text-green-500 dark:text-green-400": !error,
              "active:text-green-600 dark:active:text-green-500": !error,
              "active:bg-green-100 dark:active:bg-green-900/50": !error,

              "text-green-300 dark:text-green-700": error,
              "active:text-green-300 dark:active:text-green-700": error,
              "active:bg-green-100/50 dark:active:bg-green-900/10": error,
              "cursor-not-allowed": error,
            },
          )}
        >
          <button className="btn btn-red">Create</button>
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  );
};

const AddNewFileDialogModal = React.forwardRef(AddNewFileDialogRenderer);
AddNewFileDialogModal.displayName = "AddNewFileDialog";

export default AddNewFileDialogModal;
