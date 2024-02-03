import { type List as IList, type ListNode } from "./type";

class List<T> implements IList<T> {
  private _head: ListNode<T>;
  private _tail: ListNode<T> | null;
  private _size: number;

  constructor() {
    this._head = {
      value: undefined as T,
      next: null,
      prev: null,
    };

    this._tail = null;
    this._size = 0;
  }

  front(): T {
    if (this._head.next === null) throw new Error("No front node");

    return this._head.next.value;
  }

  back(): T {
    if (this._tail === null) throw new Error("No back node");

    return this._tail.value;
  }

  size(): number {
    return this._size;
  }

  pushFront(value: T): void {
    const newNode = {
      value,
      next: this._head.next,
      prev: this._head,
    };

    const oldNode = this._head.next;

    if (oldNode === null) {
      this._tail = newNode;
    } else {
      oldNode.prev = newNode;
    }

    this._head.next = newNode;
  }

  pushBack(value: T): void {
    const newNode = {
      value,
      next: null,
      prev: this._tail,
    };

    const oldNode = this._tail;

    if (oldNode === null) {
      this._head.next = newNode;
    } else {
      oldNode.next = newNode;
    }

    this._tail = newNode;
  }

  popFront(): T | null {
    const node = this._head.next;

    if (node === null) {
      return null;
    }

    this._head.next = node.next;

    if (node.next === null) {
      this._tail = null;
    } else {
      node.next.prev = this._head;
    }

    return node.value;
  }

  popBack(): T | null {
    const node = this._tail;

    if (node === null) {
      return null;
    }

    this._tail = node.prev;

    if (node.prev === null) {
      this._head.next = null;
    } else {
      node.prev.next = null;
    }

    return node.value;
  }

  insertAt(insertNode: ListNode<T>, value: T): void {
    const newNode = {
      value,
      next: insertNode,
      prev: insertNode.prev,
    };

    insertNode.prev = newNode;

    if (newNode.prev === null) {
      this._head.next = newNode;
    } else {
      newNode.prev.next = newNode;
    }
  }

  removeAt(removeNode: ListNode<T>): T | null {
    if (removeNode.prev === null) {
      this._head.next = removeNode.next;
    } else {
      removeNode.prev.next = removeNode.next;
    }

    if (removeNode.next === null) {
      this._tail = removeNode.prev;
    } else {
      removeNode.next.prev = removeNode.prev;
    }

    return removeNode.value;
  }

  dropFrom(pred: (arg0: T) => boolean): void {
    let node = this._head.next;

    while (node !== null) {
      if (pred(node.value)) {
        break;
      }

      node = node.next;
    }

    if (node === null) {
      throw new Error("No such node");
    }

    node.next = null;
    this._tail = node;
  }

  dropTo(pred: (arg0: T) => boolean): void {
    let node = this._head.next;

    while (node !== null) {
      if (pred(node.value)) {
        break;
      }

      node = node.next;
    }

    if (node === null) {
      throw new Error("No such node");
    }

    this._head.next = node;
    node.prev = this._head;
  }

  search(pred: (arg0: T) => boolean): ListNode<T> | null {
    let node = this._head.next;

    while (node !== null) {
      if (pred(node.value)) {
        return node;
      }

      node = node.next;
    }

    return null;
  }
}

export default List;
