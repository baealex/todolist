import { screen } from '@testing-library/dom';
import { TodoListApp, TodoListAppProps } from './TodoListApp';
import userEvent from '@testing-library/user-event';
import { todoStore } from '../store/todo.store';

const renderTodoListApp = (overrideProps?: Partial<TodoListAppProps>) => {
  const props: TodoListAppProps = {
    el: document.body,
    useDnd: false,
    ...overrideProps,
  };
  const component = new TodoListApp(props);
  component.render();
  return component;
};

describe('TodoListApp', () => {
  beforeEach(() => {
    todoStore.set({
      filterType: 'all',
      items: [],
    });
  });

  it('adds an item', async () => {
    renderTodoListApp();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test{enter}');

    expect(todoStore.state.items).toHaveLength(1);
  });

  it('completes an item', async () => {
    renderTodoListApp();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test{enter}');
    const checkbox = screen.getByText('test');
    await userEvent.click(checkbox);

    expect(todoStore.state.items[0].isCompleted).toBeTruthy();
  });

  it('filters items', async () => {
    renderTodoListApp();

    const filter = screen.getByText('Active');
    await userEvent.click(filter);

    expect(todoStore.state.filterType).toBe('active');
  });

  it('clears completed items', async () => {
    renderTodoListApp();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test{enter}');
    const checkbox = screen.getByText('test');
    await userEvent.click(checkbox);
    const clearButton = screen.getByText('Clear completed (1)');
    await userEvent.click(clearButton);

    expect(todoStore.state.items).toHaveLength(0);
  });
});
