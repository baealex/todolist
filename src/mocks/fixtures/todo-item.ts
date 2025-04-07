import { TodoItemInterface } from '~/components/todo-list/models/todo-item.model';
import { createUUID } from '~/modules/uuid';

const todoItem: TodoItemInterface = {
  id: '1',
  content: 'Todo 1',
  isCompleted: false,
};

export const createTodoItem = (defaultTodoItem: Partial<TodoItemInterface> = {}) => {
  return {
    ...todoItem,
    ...defaultTodoItem,
    id: createUUID(),
  };
};
