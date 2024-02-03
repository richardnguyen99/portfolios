export interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
  prev: ListNode<T> | null;
}

export interface List<T> {
  front: () => T | null;
  back: () => T | null;

  size: () => number;

  pushFront: (value: T) => void;
  pushBack: (value: T) => void;
  popFront: () => T | null;
  popBack: () => T | null;
  insertAt: (insertNode: ListNode<T>, value: T) => void;
  removeAt: (removeNode: ListNode<T>) => T | null;
  dropFrom: (pred: (arg0: T) => boolean) => void;
  dropTo: (pred: (arg0: T) => boolean) => void;
  search: (pred: (arg0: T) => boolean) => ListNode<T> | null;
}
