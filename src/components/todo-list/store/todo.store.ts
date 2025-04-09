import Store from '~/modules/core/store';
import { createUUID } from '~/modules/uuid';
import { arrayMove } from '~/modules/array';

import { FilterType } from '../constants/filter-type';
import { TodoItemInterface } from '../models/todo-item.model';

interface TodoStoreState {
  items: TodoItemInterface[];
  filterType: FilterType;
}

class TodoStore extends Store<TodoStoreState> {
  get completedItems() {
    return this.state.items.filter((item) => item.isCompleted);
  }

  get incompleteItems() {
    return this.state.items.filter((item) => !item.isCompleted);
  }

  constructor() {
    super();
    this.state = {
      items: [],
      filterType: 'all',
    };
  }

  getFilteredItems = () => {
    if (this.state.filterType === 'active') {
      return this.incompleteItems;
    }
    if (this.state.filterType === 'completed') {
      return this.completedItems;
    }
    return this.state.items;
  };

  addItem = (item: Pick<TodoStoreState['items'][number], 'content'>) => {
    this.set({
      items: [
        {
          id: createUUID(),
          content: item.content,
          isCompleted: false,
        },
      ].concat(this.state.items),
    });
  };

  complete = (id: string) => {
    const item = this.state.items.find((_item) => _item.id === id);

    if (!item) {
      return;
    }

    const filteredItems = this.state.items.filter((_item) => _item.id !== id);

    if (item.isCompleted) {
      this.set({
        items: [{ ...item, isCompleted: false }, ...filteredItems],
      });
      return;
    }

    this.set({
      items: [...filteredItems, { ...item, isCompleted: true }],
    });
  };

  sortItemsByIsCompleted = (items: TodoItemInterface[]) => {
    return [...items].sort((a, b) => (a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1));
  };

  changeItemsOrder = (startId: string, endId: string) => {
    const startIndex = this.state.items.findIndex((item) => item.id === startId);
    const endIndex = this.state.items.findIndex((item) => item.id === endId);

    if (startIndex === -1 || endIndex === -1) {
      return;
    }

    this.set({
      items: this.sortItemsByIsCompleted(arrayMove(this.state.items, startIndex, endIndex)),
    });
  };

  clearCompletedItems = () => {
    this.set({ items: this.incompleteItems });
  };
}

export const todoStore = new TodoStore();
