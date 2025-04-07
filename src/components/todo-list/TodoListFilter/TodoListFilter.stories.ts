import type { Meta, StoryObj } from '@storybook/html';

import { TodoListFilter, TodoListFilterProps } from './TodoListFilter';

const meta = {
  title: 'TodoListApp/TodoListFilter',
  render: (args) => {
    const wrapper = document.createElement('div');
    const component = new TodoListFilter(wrapper, args);
    component.render();
    return wrapper;
  },
  argTypes: {},
  args: {
    activeFilterType: 'all',
    completedItemCount: 0,
    incompleteItemCount: 0,
    onClear: () => {},
    onFilter: () => {},
  },
} satisfies Meta<TodoListFilterProps>;

export default meta;
type Story = StoryObj<unknown>;

export const Default: Story = {
  args: {},
};
