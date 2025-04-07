import type { Meta, StoryObj } from '@storybook/html';

import { TodoListInput, TodoListInputProps } from './TodoListInput';

const meta = {
  title: 'TodoListApp/TodoListInput',
  render: (args) => {
    const wrapper = document.createElement('div');
    const component = new TodoListInput(wrapper, args);
    component.render();
    return wrapper;
  },
  argTypes: {},
  args: {
    onSubmit: () => {},
  },
} satisfies Meta<TodoListInputProps>;

export default meta;
type Story = StoryObj<unknown>;

export const Default: Story = {
  args: {},
};
