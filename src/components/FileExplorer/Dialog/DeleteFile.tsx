import * as React from "react";
import clsx from "classnames";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { FileType, IDirectory, INode } from "@util/fs/type";
import useSystemCall from "@contexts/SystemCall/useSystemCall";
import useFileExplorer from "../hook";

export type DeleteFileModalProps = AlertDialog.AlertDialogContentProps & {
  onCanceled?: () => void;
  onSaved?: () => void;
  node?: INode;
};

const DeleteFileDialogRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  DeleteFileModalProps
> = (props, ref) => {
  const { onCanceled, onSaved, node, ...rest } = props;

  if (node === undefined) {
    throw new Error("node is required");
  }

  const { removeINode } = useSystemCall();
  const { currDir } = useFileExplorer();

  const [error, setError] = React.useState<string | null>(null);

  const handleDeleteClick = React.useCallback(() => {
    try {
      removeINode(currDir as IDirectory, node);
    } catch (err) {
      setError((err as Error).message);
      return;
    }

    if (onSaved) {
      onSaved();
    }
  }, [currDir, node, onSaved, removeINode]);

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
      )}
    >
      <AlertDialog.Title className="text-lg font-extrabold mb-4 px-4">
        Delete file?
      </AlertDialog.Title>
      <AlertDialog.Description className="text-base mb-6 px-4">
        This action is irreversible.{" "}
        {node.type === FileType.Directory && "All the content will be lost. "}
        Make sure this is not an accident.
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
          onClick={handleDeleteClick}
          className={clsx(
            "w-1/2 py-2",
            "rounded-br-lg",
            "font-bold text-red-500 dark:text-red-400",
            "hover:bg-red-50 dark:hover:bg-red-900/30",
            "active:text-red-600 dark:active:text-red-500",
            "active:bg-red-100 dark:active:bg-red-900/50",
            "focus:outline-none focus:ring-0",
          )}
        >
          <button className="btn btn-red">Delete</button>
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  );
};

const DeleteFileDialogModal = React.forwardRef(DeleteFileDialogRenderer);
DeleteFileDialogModal.displayName = "DeleteFileDialog";

export default DeleteFileDialogModal;
