import type { Meta, StoryObj } from '@storybook/html';

import { TodoListApp, TodoListAppProps } from './TodoListApp';

const meta = {
  title: 'TodoListApp/TodoListApp',
  render: (args) => {
    const wrapper = document.createElement('div');
    const component = new TodoListApp({
      el: wrapper,
      ...args,
    });
    component.render();
    return wrapper;
  },
  argTypes: {},
  args: {},
} satisfies Meta<Partial<TodoListAppProps>>;

export default meta;
type Story = StoryObj<TodoListAppProps>;

export const noUseDragAndDrop: Story = {
  args: {},
};

export const useDragAndDrop: Story = {
  args: {
    useDnd: true,
  },
};
