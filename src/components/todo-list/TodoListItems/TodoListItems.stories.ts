import type { Meta, StoryObj } from '@storybook/html';

import { TodoListItems, TodoListItemsProps } from './TodoListItems';
import { createTodoItem } from '~/mocks/fixtures/todo-item';

const meta = {
  title: 'TodoListApp/TodoListItems',
  render: (args) => {
    const wrapper = document.createElement('div');
    const component = new TodoListItems(wrapper, {
      ...args,
    });
    component.render();
    return wrapper;
  },
  argTypes: {},
  args: {
    items: [],
    onComplete: () => {},
  },
} satisfies Meta<TodoListItemsProps>;

export default meta;

type Story = StoryObj<TodoListItemsProps>;

export const NoTodoItems: Story = {
  args: {},
};

export const TodoListWithItems: Story = {
  args: {
    items: [
      createTodoItem({
        content: 'Item 1',
      }),
      createTodoItem({
        content: 'Item 2',
      }),
    ],
  },
};

export const TodoListWithCheckedItems: Story = {
  args: {
    items: [
      createTodoItem({
        content: 'Item 1',
        isCompleted: true,
      }),
      createTodoItem({
        content: 'Item 2',
        isCompleted: true,
      }),
    ],
  },
};

export const TodoListWithDragAndDrop: Story = {
  args: {
    items: [
      createTodoItem({
        content: 'Item 1',
      }),
      createTodoItem({
        content: 'Item 2',
      }),
    ],
    dndFeature: {
      onDrop: () => {},
    },
  },
};
