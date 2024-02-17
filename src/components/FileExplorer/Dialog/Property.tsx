import * as React from "react";
import clsx from "classnames";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  StarIcon,
  TerminalIcon,
  XCircleFillIcon,
} from "@primer/octicons-react";

import { FileType, IDirectory, IFile, INode } from "@util/fs/type";
import Folder from "@components/Icon/Folder";
import PlainText from "@components/Icon/PlainText";
import { ModalProps } from "@contexts/Modal/type";
import Terminal from "@components/Terminal";
import useModal from "@contexts/Modal/useModal";
import formatBytesSigFig from "@util/formatBytesSigFig";

export type PropertyDialogProps = AlertDialog.AlertDialogContentProps & {
  onClose?: () => void;
  node?: INode;
};

type PropertyFieldProps = {
  label: string;
  value: string;
};

const PropertyField: React.FC<PropertyFieldProps> = ({ label, value }) => {
  return (
    <div
      className={clsx(
        "w-full p-2",
        "bg-gray-200/30 dark:bg-gray-600/30",
        "hover:bg-gray-200/50 dark:hover:bg-gray-600/50",
        "border-gray-300 dark:border-gray-600",
        "first:rounded-t-md last:rounded-b-md",
        "border [&:not(:first-child)]:border-t-0",
      )}
    >
      <h3 className="text-sm font-extrabold mb-1">{label}</h3>
      <div>{value}</div>
    </div>
  );
};

const PropertyDialogRenderer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  PropertyDialogProps
> = (props, ref) => {
  const { onClose, node, ...rest } = props;

  if (!node) {
    throw new Error("node is required");
  }

  const { addModal } = useModal();

  const getDirectoryContent = React.useCallback((node: IDirectory) => {
    let size = 0;
    let items = -1;

    if (node.children.length === 0) {
      return "Empty Folder";
    }

    const stack: INode[] = [node];

    while (stack.length) {
      const current = stack.pop();

      if (!current) {
        break;
      }

      items++;

      if (current.type === FileType.Directory) {
        const dir = current as IDirectory;
        for (const child of dir.children) {
          stack.push(child);
        }
      }

      if (current.type === FileType.File) {
        size += (current as IFile).size;
      }
    }

    const [fileSize, fileUnit] = formatBytesSigFig(size, 1);

    return `${items} item${
      items > 1 ? "s" : ""
    }, with total size ${fileSize} ${fileUnit}`;
  }, []);

  const getFileContent = React.useCallback((file: IFile) => {
    const [fileSize, fileUnit] = formatBytesSigFig(file.size, 1);

    return `${fileSize} ${fileUnit}`;
  }, []);

  const getContent = React.useCallback(
    (node: INode) => {
      if (node.type === FileType.Directory) {
        return getDirectoryContent(node as IDirectory);
      }

      return getFileContent(node as IFile);
    },
    [getDirectoryContent, getFileContent],
  );

  const getParentNodePath = React.useCallback((node: INode) => {
    const pathNameList = [];

    let parentDir = node.parent as unknown as IDirectory;

    while (parentDir.parent) {
      pathNameList.push(parentDir.name);
      parentDir = parentDir.parent as unknown as IDirectory;
    }

    return `/${pathNameList.reverse().join("/")}`;
  }, []);

  const handleOpenTerminalClick = React.useCallback(() => {
    const newTerminal: ModalProps = {
      id: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(0),
      title: node.name,
      active: true,
      isFullScreen: false,
      isFullScreenAllowed: true,
      type: "terminal",
      component: Terminal,
      componentProps: {
        initialDir: node,
      },
    };

    addModal(newTerminal);

    if (onClose) {
      onClose();
    }
  }, [addModal, node, onClose]);

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
        <div className={clsx("flex flex-col items-center gap-3", "px-4 pb-4")}>
          <div className="flex flex-col items-center">
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

          <div
            className={clsx(
              "relative flex w-full p-2",
              "bg-gray-200/30 dark:bg-gray-600/30",
              "hover:bg-gray-200/50 dark:hover:bg-gray-600/50",
              "rounded-md border",
              "border-gray-300 dark:border-gray-600",
            )}
          >
            <div className={clsx("flex-auto")}>
              <h3 className="text-sm font-extrabold mb-1">Parent Folder</h3>
              <div>{getParentNodePath(node)}</div>
            </div>
            <div className="w-12 flex items-center justify-center">
              <button onClick={handleOpenTerminalClick}>
                <TerminalIcon
                  className={clsx(
                    "rounded-md w-8 h-8 p-2",
                    "fill-black dark:fill-white",
                    "hover:bg-slate-200/50 dark:hover:bg-gray-600/50",
                    "active:bg-slate-200/50 dark:active:bg-gray-600/70",
                  )}
                />
              </button>
            </div>
          </div>

          <div className={clsx("flex flex-col just w-full", "")}>
            {node.type === FileType.File && (
              <PropertyField
                label="Last Accessed"
                value={node.lastAccessed.toLocaleString()}
              />
            )}
            <PropertyField
              label="Last Modified"
              value={node.lastModified.toLocaleString()}
            />
            <PropertyField
              label="Last Created"
              value={node.lastCreated.toLocaleString()}
            />
          </div>

          <div
            className={clsx(
              "relative flex w-full p-2",
              "bg-gray-200/30 dark:bg-gray-600/30",
              "hover:bg-gray-200/50 dark:hover:bg-gray-600/50",
              "rounded-md border",
              "border-gray-300 dark:border-gray-600",
            )}
          >
            <div className={clsx("flex-auto")}>
              <h3 className="text-sm font-extrabold mb-1">Permissions</h3>
              <div className="flex items-center gap-3">
                {node.readPermission && <code>Read</code>}
                {node.readPermission && node.writePermission && <code>/</code>}
                {node.writePermission && <code>Write</code>}
              </div>
            </div>
          </div>
        </div>
      </AlertDialog.Description>
    </AlertDialog.Content>
  );
};

const PropertyDialog = React.forwardRef(PropertyDialogRenderer);
PropertyDialog.displayName = "PropertyDialog";

export default PropertyDialog;
