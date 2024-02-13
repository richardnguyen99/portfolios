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

  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setName(e.target.value);
    },
    [],
  );

  const handleSaveClick = React.useCallback(() => {
    console.log("Save clicked");

    addFile(currDir as IDirectory, name);

    if (onSaved) {
      onSaved();
    }
  }, [addFile, currDir, name, onSaved]);

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
        "shadow-lg shadow-gray-600 dark:shadow-gray-800",
        "focus:outline-none",
      )}
    >
      <AlertDialog.Title className="text-lg font-extrabold mb-4 px-4">
        New File
      </AlertDialog.Title>
      <AlertDialog.Description className="text-base mb-6 px-4">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className={clsx(
            "w-full px-2 py-1",
            "rounded-md",
            "bg-slate-100/30 dark:bg-gray-700/30",
            "hover:bg-slate-100/50 dark:hover:bg-gray-700/50",
            "hover:bg-slate-100/100 dark:focus:bg-gray-700/75",
            "border border-gray-300 dark:border-gray-700",
            "focus:outline-none focus:ring-0",
          )}
          placeholder="Enter file name"
        />
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
          className={clsx(
            "w-1/2 py-2",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "rounded-br-lg",
            "font-bold text-green-500 dark:text-green-400",
            "hover:bg-green-100 dark:hover:bg-green-900/30",
            "active:text-green-600 dark:active:text-green-500",
            "active:bg-green-100 dark:active:bg-green-900/50",
            "focus:outline-none focus:ring-0",
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
