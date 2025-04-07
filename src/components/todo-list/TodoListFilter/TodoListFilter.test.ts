import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';

import { TodoListFilter, TodoListFilterProps } from './TodoListFilter';

const renderTodoListFilter = (overrideProps?: Partial<TodoListFilterProps>) => {
  const props: TodoListFilterProps = {
    activeFilterType: 'all',
    completedItemCount: 0,
    incompleteItemCount: 0,
    onFilter: () => {},
    onClear: () => {},
    ...overrideProps,
  };
  const component = new TodoListFilter(document.body, props);
  component.render();
  return component;
};

describe('TodoListFilter', () => {
  it('shows incomplete items count.', () => {
    renderTodoListFilter({
      incompleteItemCount: 2,
    });

    expect(screen.getByText('2 items left')).toBeInTheDocument();
  });

  it('shows completed items count.', () => {
    renderTodoListFilter({
      completedItemCount: 2,
    });

    expect(screen.getByText('Clear completed (2)')).toBeInTheDocument();
  });

  it('can be filter items by active.', async () => {
    const mockFilter = jest.fn();
    renderTodoListFilter({
      onFilter: mockFilter,
    });

    await userEvent.click(screen.getByRole('button', { name: 'Active' }));

    expect(mockFilter).toHaveBeenCalledWith('active');
  });

  it('can be filter items by complete.', async () => {
    const mockFilter = jest.fn();
    renderTodoListFilter({
      onFilter: mockFilter,
    });

    await userEvent.click(screen.getByRole('button', { name: 'Completed' }));

    expect(mockFilter).toHaveBeenCalledWith('completed');
  });

  it('can be filter items restore to all.', async () => {
    const mockFilter = jest.fn();
    renderTodoListFilter({
      onFilter: mockFilter,
    });

    await userEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(mockFilter).toHaveBeenCalledWith('all');
  });

  it('can be clear completed items.', async () => {
    const mockClear = jest.fn();
    renderTodoListFilter({
      completedItemCount: 2,
      onClear: mockClear,
    });

    await userEvent.click(screen.getByText('Clear completed (2)'));

    expect(mockClear).toHaveBeenCalled();
  });
});
