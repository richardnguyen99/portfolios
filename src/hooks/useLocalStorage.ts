import * as React from "react";

const dispatchStorageEvent = (key: string, value: string) => {
  window.dispatchEvent(
    new StorageEvent("storage", {
      key,
      newValue: value,
    }),
  );
};

const setLocalStorageItem = <T>(key: string, value: T) => {
  const stringifiedValue = JSON.stringify(value);
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
        const nextState =
          typeof value === "function"
            ? (value as (prev: T) => T)(JSON.parse(store!))
            : value;

        setLocalStorageItem(key, nextState);
      } catch (error) {
        console.error(error);
      }
    },
    [key, store],
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

  return [JSON.parse(store!), setValue, removeValue];
};

export default useLocalStorage;
