import * as React from "react";
import clsx from "classnames";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

type Props = AlertDialog.AlertDialogContentProps & {
  onCanceled?: () => void;
  onSaved?: () => void;
};

const AddNewFileDialogRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = (props, ref) => {
  const { onCanceled, onSaved, ...rest } = props;

  return (
    <AlertDialog.Content
      {...rest}
      ref={ref}
      forceMount
      className={clsx(
        "fixed top-1/2 left-1/2 w-96",
        "transform -translate-x-1/2 -translate-y-1/2",
        "rounded-md p-4 z-[1000]",
        "bg-white dark:bg-gray-800",
      )}
    >
      <AlertDialog.Description className="mb-4">
        Are you sure you want to delete this folder?
      </AlertDialog.Description>
      <div>
        <AlertDialog.Cancel asChild onClick={onCanceled}>
          <button className="btn">Cancel</button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild onClick={onSaved}>
          <button className="btn btn-red">Delete</button>
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  );
};

const AddNewFileDialog = React.forwardRef(AddNewFileDialogRenderer);
AddNewFileDialog.displayName = "AddNewFileDialog";

export default AddNewFileDialog;
