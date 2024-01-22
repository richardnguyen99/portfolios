import * as React from "react";

import { type INode } from "@util/fs/type";

const checkIfFileTreeNode = (value: unknown): value is INode => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "type" in value &&
    "children" in value &&
    "parent" in value
  );
};

const fileTreeReplacer = () => {
  return function (key: string, value: unknown) {
    // `parent` is stored as a reference to the actual node, which caused a
    // circular reference. Only store the string `nodeId` to avoid this, and let
    // the reviver function handle the rest.
    if (key === "parent" && value !== null) {
      return (value as INode).id;
    }

    return value;
  };
};

const fileTreeReviver = () => {
  const map = new Map();

  return function (this: INode, key: string, value: unknown) {
    if (key === "id" && value !== null) {
      map.set(value as string, this as INode);

      return value;
    }

    if (key === "parent" && value !== null) {
      const parent = map.get(value);

      if (parent) {
        return parent;
      }

      return value;
    }

    return value;
  };
};

const dispatchStorageEvent = (key: string, value: string) => {
  window.dispatchEvent(
    new StorageEvent("storage", {
      key,
      newValue: value,
    }),
  );
};

const setLocalStorageItem = <T>(key: string, value: T) => {
  const replacer = checkIfFileTreeNode(value) ? fileTreeReplacer() : undefined;

  const stringifiedValue = JSON.stringify(value, replacer);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const getLocalStorageItem = (key: string): string | null => {
  const value = window.localStorage.getItem(key);

  return value;
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, "");
};

const onStorageChange = (callback: EventListenerOrEventListenerObject) => {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
};

const getServerSnapshot = () => {
  throw new Error("useLocalStorage is a client-only hook");
};

const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
): [T, (prevState: T | ((prevState: T) => T)) => void, () => void] => {
  const getSnapShot = () => window.localStorage.getItem(key);

  const store = React.useSyncExternalStore(
    onStorageChange,
    getSnapShot,
    getServerSnapshot,
  );

  const setValue = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const reviver = checkIfFileTreeNode(initialValue)
          ? fileTreeReviver()
          : undefined;

        const nextState =
          typeof value === "function"
            ? (value as (prev: T) => T)(JSON.parse(store!, reviver))
            : value;

        setLocalStorageItem(key, nextState);
      } catch (error) {
        console.error(error);
      }
    },
    [initialValue, key, store],
  );

  const removeValue = React.useCallback(() => {
    try {
      removeLocalStorageItem(key);
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  React.useEffect(() => {
    // set a default value if none exists in localStorage
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  const parsedStore = React.useMemo(() => {
    if (store === null) {
      return initialValue;
    }

    try {
      const reviver = checkIfFileTreeNode(initialValue)
        ? fileTreeReviver()
        : undefined;

      const value = JSON.parse(store, reviver);

      return value;
    } catch (error) {
      console.error(error);

      return initialValue;
    }
  }, [initialValue, store]);

  return [parsedStore, setValue, removeValue];
};

export default useLocalStorage;
