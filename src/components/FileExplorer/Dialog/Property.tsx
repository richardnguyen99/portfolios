import * as React from "react";
import clsx from "classnames";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FileType, INode } from "@util/fs/type";
import { StarIcon, XCircleFillIcon } from "@primer/octicons-react";
import Folder from "@components/Icon/Folder";
import PlainText from "@components/Icon/PlainText";

export type PropertyDialogProps = AlertDialog.AlertDialogContentProps & {
  onClose?: () => void;
  node?: INode;
};

const PropertyDialogRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  PropertyDialogProps
> = (props, ref) => {
  const { onClose, node, ...rest } = props;

  if (!node) {
    throw new Error("node is required");
  }

  const getContent = React.useCallback((node: INode) => {
    if (node.type === FileType.Directory) {
      return "Folder";
    }

    return "Plain Text";
  }, []);

  return (
    <AlertDialog.Content
      {...rest}
      ref={ref}
      forceMount
      className={clsx(
        "fixed top-1/2 left-1/2 w-96",
        "transform -translate-x-1/2 -translate-y-1/2",
        "rounded-lg z-[1000]",
        "bg-white dark:bg-gray-800",
        "border border-gray-300 dark:border-gray-700",
        "shadow-lg shadow-gray-600 dark:shadow-gray-900",
        "focus:outline-none",
      )}
    >
      <AlertDialog.Title className="text-lg font-bold text-center flex items-center">
        <div className="w-12 h-12 flex items-center justify-center">
          <button
            onClick={onClose}
            className={clsx(
              "flex items-center justify-center",
              "p-2 rounded-md",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
            )}
          >
            <StarIcon />
          </button>
        </div>
        <div className="flex-1">Properties</div>
        <div className="w-12 h-12 flex items-center justify-center">
          <button
            onClick={onClose}
            className={clsx(
              "flex items-center justify-center",
              "p-2 rounded-md",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
            )}
          >
            <XCircleFillIcon />
          </button>
        </div>
      </AlertDialog.Title>
      <AlertDialog.Description asChild>
        <div className={clsx("flex flex-col items-center", "px-2 pb-2")}>
          <div
            className={clsx(
              "flex items-center justify-center",
              "w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-md mb-4",
            )}
          >
            {node.type === FileType.Directory ? <Folder /> : <PlainText />}
          </div>
          <div className="text-lg font-bold">{node.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {getContent(node)}
          </div>
        </div>
      </AlertDialog.Description>
    </AlertDialog.Content>
  );
};

const PropertyDialog = React.forwardRef(PropertyDialogRenderer);
PropertyDialog.displayName = "PropertyDialog";

export default PropertyDialog;
